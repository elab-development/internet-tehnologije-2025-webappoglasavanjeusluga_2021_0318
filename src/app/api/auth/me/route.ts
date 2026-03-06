// Forsiramo Node.js runtime jer koristimo biblioteke koje nisu kompatibilne sa Edge runtime-om
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Vraća podatke o trenutno ulogovanom korisniku
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Uspešno vraćen korisnik ili null
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeResponse'
 *       401:
 *         description: Nevalidan token
 */

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
 * components:
 *   schemas:
 *
 *     MeResponse:
 *       type: object
 *       properties:
 *         user:
 *           $ref: '#/components/schemas/User'
 */