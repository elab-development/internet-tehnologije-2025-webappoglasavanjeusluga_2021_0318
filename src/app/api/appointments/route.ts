import { NextResponse } from "next/server";
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/appointments → lista svih termina
export async function GET() {
  try {
    const data = await db.select().from(appointments);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching appointments:", err);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

// POST /api/appointments → kreiranje termina
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { date, time, serviceId } = body;

    if (!date || !time || !serviceId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newAppointment = await db.insert(appointments).values({
      date: new Date(date),
      time,
      serviceId,
      isBooked: true, // označavamo da je termin rezervisan
    }).returning();

    return NextResponse.json(newAppointment[0], { status: 201 });
  } catch (err) {
    console.error("Error creating appointment:", err);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
