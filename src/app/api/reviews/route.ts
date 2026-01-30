import { NextResponse } from "next/server";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/reviews → lista svih ocena
export async function GET() {
  try {
    const data = await db.select().from(reviews);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

