import { NextResponse } from "next/server"; 
import { db } from "@/db"; 
import { users } from "@/db/schema";
import bcrypt from "bcrypt";



export async function GET() {
  try {
    const data = await db.select().from(users);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
   

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, phone, role } = body;

    // Validacija obaveznih polja
    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Hash lozinke
    const hashedPassword = await bcrypt.hash(password, 10);

    // Normalizacija role na velika slova (USER, FREELANCER, COMPANY)
    const normalizedRole = role.toUpperCase();

    // Insert u bazu
    const newUser = await db.insert(users).values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone, // može biti null
      role: normalizedRole, 
      createdAt: new Date(),
    }).returning();

    return NextResponse.json(newUser[0], { status: 201 });
  } catch (err: any) {
    console.error("Error registering user:", err.message);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}

