// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/db";          
import { users } from "@/db/schema"; 

export async function POST(req: Request) {
  try {
    const { email, password, role, firstName, lastName, phone } = await req.json();

    if (!email || !password || !role || !firstName || !lastName) {
      return NextResponse.json({ error: "Niste popunili sva polja" }, { status: 400 });
    }

    // Heširanje lozinke
    const hashedPassword = await bcrypt.hash(password, 10);

    // Ubacivanje korisnika u bazu
    const newUser = await db.insert(users).values({
      email,
      password: hashedPassword, // koristi ime kolone iz šeme
      role,                     // USER, FREELANCER, COMPANY
      firstName,
      lastName,
      phone,
    }).returning();

    return NextResponse.json(
      { id: newUser[0].id, email: newUser[0].email, role: newUser[0].role },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Neuspešna registracija" }, { status: 500 });
  }
}
