import { NextResponse } from "next/server";
import { db } from "@/db";
import { reviews, users, services } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/reviews - lista svih ocena
export async function GET() {
  try {
    const data = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        profileId: reviews.profileId,
        user: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
        },
        service: {
          id: services.id,
          title: services.title,
        },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id)) //garancija da user postoji
      .leftJoin(services, eq(reviews.serviceId, services.id));

    return NextResponse.json(data);
  } catch (err) {
    console.error("Neuspesno ucitavanje recencija", err);
    return NextResponse.json(
      { error: "Neuspesno ucitavanje recencija" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rating, comment, userId, serviceId } = body;

    if (!rating || !userId || !serviceId) {
      return NextResponse.json({ error: "Nisu popunjena sva polja" }, { status: 400 });
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
    console.error("Greska u kreiranju recenzije:", err);
    return NextResponse.json({ error: "Greska u kreiranju recenzije" }, { status: 500 });
  }
}
// DELETE /api/reviews - brisanje ocene
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Nedostaje id recenzije" }, { status: 400 });
    }

    const deletedReview = await db.delete(reviews).where(eq(reviews.id, id)).returning();

    if (!deletedReview[0]) {
      return NextResponse.json({ error: "Recenzija nije pronadjena" }, { status: 404 });
    }

    return NextResponse.json(deletedReview[0], { status: 200 });
  } catch (err) {
    console.error("Neuspesno brisanje recenzije:", err);
    return NextResponse.json({ error: "Neuspesno brisanje recenzije" }, { status: 500 });
  }
}

