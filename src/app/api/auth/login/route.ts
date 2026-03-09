import { db } from "@/db";
import { users } from "@/db/schema"; 
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";


type Body = {
  email: string;
  password: string;
};

export async function POST(req: Request) {
  try {
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

      
  } catch (err) {
      console.error(err);
      return NextResponse.json(
        { error: "Greška na serveru" },
        { status: 500 }
      );
    }
  }


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
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: korisnik@email.com
 *               password:
 *                 type: string
 *                 example: lozinka123
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
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: korisnik@email.com
 *                 role:
 *                   type: string
 *                   example: user
 *                 firstName:
 *                   type: string
 *                   example: Marko
 *                 lastName:
 *                   type: string
 *                   example: Marković
 *       400:
 *         description: Nisu poslata sva potrebna polja
 *       401:
 *         description: Pogrešan email ili lozinka
 *       500:
 *         description: Greška na serveru
 */


