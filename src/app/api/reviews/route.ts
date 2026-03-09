import { db } from "@/db"; // Putanja do tvoje db instance
import { reviews } from "@/db/schema"; // Putanja do tvoje šeme
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rating, comment, userId, serviceId, profileId } = body;

    // Provera obaveznih podataka
    if (!rating || !userId || !serviceId || !profileId) {
      return NextResponse.json({ error: "Svi podaci su obavezni" }, { status: 400 });
    }

    // Upis u bazu preko Drizzle-a
    const newReview = await db.insert(reviews).values({
      rating: Number(rating),
      comment: comment,
      userId: userId,
      serviceId: serviceId,
      profileId: profileId,
    }).returning();

    return NextResponse.json(newReview[0], { status: 201 });
  } catch (error) {
    console.error("Greška pri čuvanju recenzije:", error);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}