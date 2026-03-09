import { db } from "@/db";
import { users, profiles } from "@/db/schema";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Body = {
  role: "USER" | "FREELANCER" | "COMPANY";
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;

  // profile podaci (samo za freelancer/company)
  city?: string;
  address?: string;
  description?: string;
  companyName?: string;
  image?: string | null; // Cloudinary URL
};

export async function POST(req: Request) {
  try {
  const body = (await req.json()) as Body;

  const {
    role,
    firstName,
    lastName,
    phone,
    email,
    password,
    city,
    address,
    description,
    companyName,
    image,
  } = body;

  // ZAJEDNIČKA POLJA
  if (!role || !firstName || !lastName || !phone || !email || !password) {
    return NextResponse.json(
      { error: "Popunite sva obavezna polja" },
      { status: 400 }
    );
  }

  // PROVERA PO ULOZI
  if (role === "FREELANCER") {
    if (!city || !address || !description || !image) {
      return NextResponse.json(
        { error: "Popunite sva polja za freelancer profil" },
        { status: 401 }
      );
    }
  }

  if (role === "COMPANY") {
    if (!companyName || !city || !address || !description || !image) {
      return NextResponse.json(
        { error: "Popunite sva polja za company profil" },
        { status: 402 }
      );
    }
  }

  // Provera da li korisnik postoji
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existing.length > 0) {
    return NextResponse.json(
      { error: "Korisnik sa istim emailom već postoji" },
      { status: 403 }
    );
  }

  // Hash lozinke
  const hashedPassword = await bcrypt.hash(password, 10);

  // Kreiranje USER zapisa
  const [newUser] = await db
    .insert(users)
    .values({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role,
    })
    .returning();

  // Ako je FREELANCER ili COMPANY - kreiraj profile
  if (role === "FREELANCER" || role === "COMPANY") {
    await db.insert(profiles).values({
      userId: newUser.id,
      city: city!,
      address: address!,
      description,
      image: image, // URL sa Cloudinary
      companyName: role === "COMPANY" ? companyName : null,
      firstName: role === "FREELANCER" ? firstName : null,
      lastName: role === "FREELANCER" ? lastName : null,
    });
  }

  // JWT token
  const token = signAuthToken({
    sub: newUser.id.toString(),
    email: newUser.email,
    role: newUser.role,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
  });

  const res = NextResponse.json({
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
    firstName: newUser.firstName,
    lastName: newUser.lastName,
  });

  res.cookies.set(AUTH_COOKIE, token, cookieOpts());

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
 * /api/auth/register:
 *   post:
 *     summary: Kreiranje korisničkog naloga i profila (Freelancer / Company)
 *     description: Kreira novog korisnika i, ako je uloga FREELANCER ili COMPANY, kreira profil.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *               - firstName
 *               - lastName
 *               - phone
 *               - email
 *               - password
 *             properties:
 *               role:
 *                 type: string
 *                 enum: ["USER", "FREELANCER", "COMPANY"]
 *                 example: "USER"
 *               firstName:
 *                 type: string
 *                 example: Marko
 *               lastName:
 *                 type: string
 *                 example: Marković
 *               phone:
 *                 type: string
 *                 example: "060123456"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: marko.markovic@mail.com
 *               password:
 *                 type: string
 *                 example: "Lozinka123!"
 *               city:
 *                 type: string
 *                 example: "Beograd"
 *               address:
 *                 type: string
 *                 example: "Bulevar Kralja Aleksandra 10"
 *               description:
 *                 type: string
 *                 example: "Iskusni web developer"
 *               companyName:
 *                 type: string
 *                 example: "Marko d.o.o."
 *               image:
 *                 type: string
 *                 nullable: true
 *                 example: "https://res.cloudinary.com/demo/image/upload/sample.jpg"
 *     responses:
 *       200:
 *         description: Uspešna registracija korisnika
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
 *                   format: email
 *                   example: marko.markovic@mail.com
 *                 role:
 *                   type: string
 *                   enum: ["USER", "FREELANCER", "COMPANY"]
 *                   example: "USER"
 *                 firstName:
 *                   type: string
 *                   example: Marko
 *                 lastName:
 *                   type: string
 *                   example: Marković
 *       400:
 *         description: Nedostaju obavezna polja
 *       401:
 *         description: Nedostaju podaci za freelancer profil
 *       402:
 *         description: Nedostaju podaci za company profil
 *       403:
 *         description: Korisnik sa istim emailom već postoji
 *       500:
 *         description: Greška na serveru
 */