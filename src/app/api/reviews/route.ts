import { db } from "@/db"; // Putanja do tvoje db instance
import { reviews } from "@/db/schema"; // Putanja do tvoje šeme
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rating, comment, userId, serviceId, profileId } = body;

    // Provera obaveznih podataka
    if (!rating || !userId || !serviceId || !profileId) {
      return NextResponse.json({ error: "Nedostaju obavezni podaci" }, { status: 400 });
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

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Kreira novu recenziju
 *     tags:
 *       - Recenzije
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - userId
 *               - serviceId
 *               - profileId
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Odlična usluga!"
 *               userId:
 *                 type: integer
 *                 example: 7
 *               serviceId:
 *                 type: integer
 *                 example: 10
 *               profileId:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       201:
 *         description: Recenzija uspešno kreirana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 15
 *                 rating:
 *                   type: integer
 *                   example: 5
 *                 comment:
 *                   type: string
 *                   example: "Odlična usluga!"
 *                 userId:
 *                   type: integer
 *                   example: 7
 *                 serviceId:
 *                   type: integer
 *                   example: 10
 *                 profileId:
 *                   type: integer
 *                   example: 3
 *       400:
 *         description: Nedostaju obavezni podaci
 *       500:
 *         description: Greška na serveru
 */