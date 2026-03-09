import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * @swagger
 * /api/bookings/{id}:
 *   patch:
 *     summary: Ažurira status rezervacije (finished)
 *     tags:
 *       - Rezervacije
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID rezervacije
 *         schema:
 *           type: integer
 *     requestBody:
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
 *     responses:
 *       200:
 *         description: Status rezervacije uspešno ažuriran
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Greška na serveru
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookingId = Number(id);

    const body = await req.json();

    await db
      .update(bookings)
      .set({ finished: body.finished })
      .where(eq(bookings.id, bookingId));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

