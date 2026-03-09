// Forsiramo Node.js runtime jer koristimo biblioteke koje nisu kompatibilne sa Edge runtime-om
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";


export async function GET() {

  // 1. Uzimamo token iz cookie-ja
  const token = (await cookies()).get(AUTH_COOKIE)?.value;

  // Ako nema tokena korisnik nije ulogovan
  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {

    // 2. Verifikujemo token
    const claims = verifyAuthToken(token);

    // 3. Trazimo usera u bazi po id iz tokena
   const [u] = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        firstName: users.firstName,
        lastName: users.lastName,
        phone: users.phone,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, Number(claims.sub)));

    // 4. Vracamo korisnika ili null
    return NextResponse.json({
      user: u ?? null
    });

  } catch {

    // 5. Ako token nije validan
    return NextResponse.json(
      { user: null },
      { status: 401 }
    );

  }
}



/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Vraća podatke o trenutno ulogovanom korisniku
 *     description: Vraća podatke o korisniku na osnovu auth tokena iz cookie-ja.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Uspešno vraćen korisnik ili null ako korisnik nije ulogovan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   oneOf:
 *                     - type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         email:
 *                           type: string
 *                           format: email
 *                           example: marko.markovic@mail.com
 *                         role:
 *                           type: string
 *                           example: user
 *                         firstName:
 *                           type: string
 *                           example: Marko
 *                         lastName:
 *                           type: string
 *                           example: Marković
 *                         phone:
 *                           type: string
 *                           example: "060123456"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2026-03-09T12:00:00.000Z
 *                     - type: "null"
 *       401:
 *         description: Token nije validan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: "null"
 */