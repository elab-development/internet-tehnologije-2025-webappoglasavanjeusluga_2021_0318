import { NextResponse } from "next/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/profiles → lista svih profila
export async function GET() {
  try {
    const data = await db.select().from(profiles);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching profiles:", err);
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }
}

