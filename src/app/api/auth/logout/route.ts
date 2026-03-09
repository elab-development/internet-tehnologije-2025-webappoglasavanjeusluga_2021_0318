import { AUTH_COOKIE } from "@/lib/auth";
import { NextResponse } from "next/server";


export async function POST() {
    try {
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
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Greška na serveru
 */




