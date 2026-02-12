import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { SignJWT } from "jose";

const AUTH_COOKIE = "auth";

function cookieOpts() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 2, // 2h
  };
}

export async function POST(req: Request) {
  try {
    const { email, password, role, firstName, lastName, phone } = await req.json();

    if (!email || !password || !role || !firstName || !lastName) {
      return NextResponse.json({ error: "Niste popunili sva polja" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db.insert(users).values({
      email,
      password: hashedPassword,
      role: role.toUpperCase(),
      firstName,
      lastName,
      phone,
      createdAt: new Date(),
    }).returning();

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const token = await new SignJWT({
      sub: String(newUser.id),
      email: newUser.email,
      role: newUser.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2h")
      .sign(secret);

    const res = NextResponse.json({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    }, { status: 201 });

    res.cookies.set(AUTH_COOKIE, token, cookieOpts());
    return res;
  } catch (error) {
    console.error("Neuspesna registracija:", error);
    return NextResponse.json({ error: "Neuspesna registracija" }, { status: 500 });
  }
}