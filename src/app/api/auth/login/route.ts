import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const AUTH_COOKIE = "auth";

function cookieOpts() {
  return {
    httpOnly: true,              // cookie nije dostupan kroz JS
    sameSite: "lax" as const,    // zaštita od CSRF
    secure: process.env.NODE_ENV === "production", // samo preko HTTPS na produkciji
    path: "/",                   // dostupan na svim rutama
    maxAge: 60 * 60 * 2,         // 2h koliko traje token
  };
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Niste popunili sva polja" },
        { status: 400 }
      );
    }

    // pronađi korisnika po email-u
    const foundUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (foundUser.length === 0) {
      return NextResponse.json(
        { error: "Neispravan email ili lozinka" },
        { status: 401 }
      );
    }

    const user = foundUser[0];

    // proveri lozinku
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Neispravan email ili lozinka" },
        { status: 401 }
      );
    }

    // generiši JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({
      sub: String(user.id),
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2h")
      .sign(secret);

    // pripremi odgovor sa user podacima
    const res = NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // postavi cookie sa tokenom
    res.cookies.set(AUTH_COOKIE, token, cookieOpts());

    return res;
  } catch (error) {
    console.error("Dreska pri loginu:", error);
    return NextResponse.json({ error: "Neuspesno logovanje" }, { status: 500 });
  }
}
