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
// POST /api/reviews → dodavanje ocene
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rating, comment, userId, serviceId } = body;

    if (!rating || !userId || !serviceId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newReview = await db.insert(reviews).values({
      rating,
      comment,
      userId,
      serviceId,
      createdAt: new Date(),
    }).returning();

    return NextResponse.json(newReview[0], { status: 201 });
  } catch (err) {
    console.error("Error creating review:", err);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}

