import { db } from "@/db";
import { users } from "@/db/schema"; 
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Prijava korisnika
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Uspešna prijava korisnika
 *         headers:
 *           Set-Cookie:
 *             description: JWT token koji se čuva u HTTP-only cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Nisu poslata sva potrebna polja
 *       401:
 *         description: Pogrešan email ili lozinka
 *       500:
 *         description: Greška na serveru
 */


type Body = {
  email: string;
  password: string;
};

export async function POST(req: Request) {

  // 1. Parseiranje requesta – iz request-a izdvajamo email i password
  const { email, password } = (await req.json()) as Body;

  // 2. Validacija inputa – proveravamo da li su oba polja prisutna
  if (!email || !password) {
    return NextResponse.json(
      { error: "Niste popunili sva polja" },
      { status: 400 }
    );
  }

  // 3. Tražimo korisnika u bazi po email-u
  const [u] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!u) {
    return NextResponse.json(
      { error: "Pogesan email ili lozinka" },
      { status: 401 }
    );
  }

  // 4. Compare password
  const ok = await bcrypt.compare(password, u.password); 
  if (!ok) {
    return NextResponse.json(
      { error: "Pogesan email ili lozinka" },
      { status: 401 }
    );
  }

  // 5. Sign JWT – generišemo token sa novim claims
  const token = signAuthToken({
    sub: u.id.toString(), 
    email: u.email,
    role: u.role,       
    firstName: u.firstName, 
    lastName: u.lastName  
  });

  // 6. Postavljamo token u cookie
  const res = NextResponse.json({
    id: u.id,
    email: u.email,
    role: u.role,        
    firstName: u.firstName, 
    lastName: u.lastName
  });

  res.cookies.set(AUTH_COOKIE, token, cookieOpts());

  // 7. Vracamo JSON podatke
  return res;
}


/**
 * @swagger
 * components:
 *   schemas:
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *         role:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 */