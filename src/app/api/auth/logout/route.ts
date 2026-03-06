import { AUTH_COOKIE } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Odjava korisnika
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Uspešna odjava korisnika
 *         headers:
 *           Set-Cookie:
 *             description: Briše JWT token iz cookie-a
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LogoutResponse'
 *       500:
 *         description: Greška na serveru
 */

export async function POST() {
    const res = NextResponse.json({ ok: true })

    res.cookies.set(AUTH_COOKIE, "", {
        httpOnly: true,
        sameSite: "lax" as const,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 0,
        expires: new Date(0) // istekao 01.01.1970. browser ga sam brise
    })

    return res;
}

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     LogoutResponse:
 *       type: object
 *       properties:
 *         ok:
 *           type: boolean
 */


