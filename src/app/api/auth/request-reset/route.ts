import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // 1. Proveri da li korisnik postoji
    const foundUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (foundUser.length === 0) {
      // namerno ne otkrivamo da li email postoji (bezbednost)
      return NextResponse.json(
        { message: "If the email exists, reset instructions were sent." },
        { status: 200 }
      );
    }

    const user = foundUser[0];

    // 2. Generiši RESET token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    const resetToken = await new SignJWT({
      id: user.id,
      role: user.role,
      action: "reset",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("15m")
      .sign(secret);

    // 3. Simulacija slanja email-a
    return NextResponse.json(
      {
        message: "Reset token generated (email simulation)",
        resetToken, // 👈 ovo koristiš dalje
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Request reset failed:", err);
    return NextResponse.json(
      { error: "Failed to request password reset" },
      { status: 500 }
    );
  }
}
