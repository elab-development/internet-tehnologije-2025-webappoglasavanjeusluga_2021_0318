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
// DELETE /api/reviews → brisanje ocene
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing review id" }, { status: 400 });
    }

    const deletedReview = await db.delete(reviews).where(eq(reviews.id, id)).returning();

    if (!deletedReview[0]) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json(deletedReview[0], { status: 200 });
  } catch (err) {
    console.error("Error deleting review:", err);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}

