import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = Number(id);

    const body = await req.json();

    const updated = await db
    .update(bookings)
    .set({ finished: body.finished })
    .where(eq(bookings.id, bookingId))
    .returning();

  if (updated.length === 0) {
    return NextResponse.json(
      { error: "Rezervacija ne postoji" },
      { status: 404 }
    );
  }

return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Greška na serveru" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/bookings/{id}:
 *   patch:
 *     summary: Ažurira status rezervacije ('finished' polje)
 *     description: Menja vrednost polja 'finished'za određenu rezervaciju.
 *     tags:
 *       - Rezervacije
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID rezervacije
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       description: Novi status rezervacije
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - finished
 *             properties:
 *               finished:
 *                 type: boolean
 *                 description: Označava da li je rezervacija obrađena
 *                 example: true
 *     responses:
 *       200:
 *         description: Status rezervacije uspešno ažuriran
 *       404:
 *         description: Rezervacija ne postoji
 *       500:
 *         description: Greška na serveru
 */