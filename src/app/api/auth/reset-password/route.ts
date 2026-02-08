import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { jwtVerify, SignJWT } from "jose";
import bcrypt from "bcryptjs";

const AUTH_COOKIE = "auth";

function cookieOpts() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 2,
  };
}

interface AuthPayload {
  id: number;
  role: string;
  action?: string;
}

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Missing token or password" }, { status: 400 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });

    const typedPayload = payload as unknown as AuthPayload;

    if (typedPayload.action !== "reset") {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [updatedUser] = await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, Number(typedPayload.id)))
      .returning();

    // generiši novi login token i cookie
    const newToken = await new SignJWT({
      sub: String(updatedUser.id),
      email: updatedUser.email,
      role: updatedUser.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("2h")
      .sign(secret);

    const res = NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
    res.cookies.set(AUTH_COOKIE, newToken, cookieOpts());

    return res;
  } catch (err) {
    console.error("Reset password failed:", err);
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
