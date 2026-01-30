import { NextResponse } from "next/server";
import { db } from "@/db";
import { employees } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/employees → lista svih zaposlenih
export async function GET() {
  try {
    const data = await db.select().from(employees);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching employees:", err);
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}
// POST /api/employees → dodavanje zaposlenog
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, description, profileId } = body;

    if (!firstName || !lastName || !profileId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newEmployee = await db.insert(employees).values({
      firstName,
      lastName,
      description,
      profileId,
    }).returning();

    return NextResponse.json(newEmployee[0], { status: 201 });
  } catch (err) {
    console.error("Error creating employee:", err);
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
  }
}

