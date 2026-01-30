import { NextResponse } from "next/server"; 
import { db } from "@/db"; 
import { users } from "@/db/schema"; 
import { eq } from "drizzle-orm"; 
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const data = await db.select().from(users);

    // Izbaci password iz svih korisnika
    const safeData = data.map(({ password, ...rest }) => rest);

    return NextResponse.json(safeData);
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

// POST /api/users (registracija)
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

    // Izbacivanje password iz odgovora
    const { password: _, ...safeUser } = newUser[0];

    return NextResponse.json(safeUser, { status: 201 });
  } catch (err: any) {
    console.error("Error registering user:", err.message);
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}

// PUT /api/users/login (prijava)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const user = await db.select().from(users).where(eq(users.email, email));

    if (!user[0]) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const validPassword = await bcrypt.compare(password, user[0].password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: user[0].id, role: user[0].role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // Izbacivanje password iz odgovora
    const { password: _, ...safeUser } = user[0];

    return NextResponse.json({ token, user: safeUser }, { status: 200 });
  } catch (err: any) {
    console.error("Error logging in:", err.message);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
// PATCH /api/users/update
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, email, password } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing user id" }, { status: 400 });
    }

    const updateData: any = {};
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();

    if (!updatedUser[0]) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Izbacivanje password iz odgovora
    const { password: _, ...safeUser } = updatedUser[0];

    return NextResponse.json(safeUser, { status: 200 });
  } catch (err) {
    console.error("Error updating user:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}


