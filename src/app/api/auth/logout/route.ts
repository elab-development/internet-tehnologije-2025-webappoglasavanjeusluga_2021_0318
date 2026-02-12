// import { NextResponse } from "next/server";

// export async function POST() {
//   // U JWT sistemu logout znači da frontend obriše token.
  
//   //Dodati brisanje tokena iz cookie-a !!!!

//   return NextResponse.json({ message: "Izlogovani ste" }, { status: 200 });
// }

import { NextResponse } from "next/server";

const AUTH_COOKIE = "auth";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" }, { status: 200 });

  res.cookies.set(AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return res;
}