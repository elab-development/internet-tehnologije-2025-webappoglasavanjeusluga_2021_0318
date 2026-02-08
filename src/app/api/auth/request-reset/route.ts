import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const foundUser = await db.select().from(users).where(eq(users.email, email));

    if (foundUser.length === 0) {
      return NextResponse.json(
        { message: "If the email exists, reset instructions were sent." },
        { status: 200 }
      );
    }

    const user = foundUser[0];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    const resetToken = await new SignJWT({
      id: user.id,
      role: user.role,
      action: "reset",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("15m")
      .sign(secret);

    return NextResponse.json(
      {
        message: "Reset token generated (email simulation)",
        resetToken,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Request reset failed:", err);
    return NextResponse.json({ error: "Failed to request password reset" }, { status: 500 });
  }
}
