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
// PATCH /api/employees → izmena zaposlenog
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, firstName, lastName, description } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing employee id" }, { status: 400 });
    }

    const updatedEmployee = await db.update(employees)
      .set({
        firstName,
        lastName,
        description,
      })
      .where(eq(employees.id, id))
      .returning();

    if (!updatedEmployee[0]) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEmployee[0], { status: 200 });
  } catch (err) {
    console.error("Error updating employee:", err);
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
  }
}

