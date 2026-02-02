// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // U JWT sistemu logout znači da frontend obriše token.
  // Backend može da ima dummy rutu radi konzistencije.
  return NextResponse.json({ message: "Logged out" }, { status: 200 });
}
