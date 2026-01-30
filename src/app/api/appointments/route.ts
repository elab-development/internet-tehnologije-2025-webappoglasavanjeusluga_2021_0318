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

