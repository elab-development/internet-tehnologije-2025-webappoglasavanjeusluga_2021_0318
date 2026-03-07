import { db } from "@/db";
import { users, profiles } from "@/db/schema";
import { AUTH_COOKIE, cookieOpts, signAuthToken } from "@/lib/auth";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Kreiranje korisnickog Naloga (Korisnik/Samostalca/Preduzece) i Profila (Samostalac/Preduzece)
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: Uspešna registracija
 *         headers:
 *           Set-Cookie:
 *             description: JWT token koji se čuva u HTTP-only cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
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
}

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - role
 *         - firstName
 *         - lastName
 *         - phone
 *         - email
 *         - password
 *       properties:
 *         role:
 *           type: string
 *           enum:
 *             - USER
 *             - FREELANCER
 *             - COMPANY
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         city:
 *           type: string
 *         address:
 *           type: string
 *         description:
 *           type: string
 *         companyName:
 *           type: string
 *         image:
 *           type: string
 *           nullable: true
 *
 *
 *     RegisterResponse:
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