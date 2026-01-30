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

