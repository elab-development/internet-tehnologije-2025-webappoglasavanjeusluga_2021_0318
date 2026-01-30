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


