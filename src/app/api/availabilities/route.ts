import { NextResponse } from "next/server";
import { db } from "@/db";
import { availabilities } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/availabilities → lista svih dostupnosti
export async function GET() {
  try {
    const data = await db.select().from(availabilities);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching availabilities:", err);
    return NextResponse.json({ error: "Failed to fetch availabilities" }, { status: 500 });
  }
}
// POST /api/availabilities → dodavanje dostupnosti
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { note, employeeId, appointmentId } = body;

    if (!employeeId || !appointmentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newAvailability = await db.insert(availabilities).values({
      note,
      employeeId,
      appointmentId,
    }).returning();

    return NextResponse.json(newAvailability[0], { status: 201 });
  } catch (err) {
    console.error("Error creating availability:", err);
    return NextResponse.json({ error: "Failed to create availability" }, { status: 500 });
  }
}
// DELETE /api/availabilities → brisanje dostupnosti
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing availability id" }, { status: 400 });
    }

    const deletedAvailability = await db.delete(availabilities)
      .where(eq(availabilities.id, id))
      .returning();

    if (!deletedAvailability[0]) {
      return NextResponse.json({ error: "Availability not found" }, { status: 404 });
    }

    return NextResponse.json(deletedAvailability[0], { status: 200 });
  } catch (err) {
    console.error("Error deleting availability:", err);
    return NextResponse.json({ error: "Failed to delete availability" }, { status: 500 });
  }
}




