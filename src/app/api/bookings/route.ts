import { NextResponse } from "next/server";
import { db } from "@/db";
import { bookings, appointments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { cookies } from "next/headers";
import { verifyAuthToken, AUTH_COOKIE } from "@/lib/auth";


export async function POST(req: Request) {
  try {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Korisnik nije prijavljen" }, { status: 401 });
    }

    const user = verifyAuthToken(token);
    const userId = Number(user.sub);

    const body = await req.json();

    const {
      reservatedDate,
      time,
      serviceId,
      selectedEmployee,
    } = body;

    let appointmentId = null;

    // Ako je izabrano konkretno vreme
    if (time) {
      const appointment = await db.query.appointments.findFirst({
        where: and(
            eq(appointments.date, reservatedDate),
            eq(appointments.time, time),
        ),
      });

      if (!appointment) {
        return NextResponse.json(
          { error: "Termin ne postoji" },
          { status: 404 }
        );
      }

      appointmentId = appointment.id;

      // Zakljucaj termin
      await db
        .update(appointments)
        .set({ isBooked: true })
        .where(eq(appointments.id, appointment.id));
    }

    // Kreiraj booking
    await db.insert(bookings).values({
      reservedDate: reservatedDate,
      time: time ?? null,
      userId,
      serviceId,
      appointmentId,
      employeeId:
        selectedEmployee &&
        selectedEmployee !== "Slobodan zaposleni"
          ? Number(selectedEmployee)
          : null,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Greska na serveru" },
      { status: 500 }
    );
  }
}


/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Kreira novu rezervaciju
 *     description: Omogućava korisniku da rezerviše termin za određenu uslugu. Autentifikacija se vrši putem JWT tokena iz cookie-ja.
 *     tags:
 *       - Rezervacije
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reservatedDate
 *               - serviceId
 *             properties:
 *               reservatedDate:
 *                 type: string
 *                 description: Datum rezervacije (YYYY-MM-DD)
 *                 example: "2026-03-20"
 *               time:
 *                 type: string
 *                 description: Vreme termina (opciono, "Po dogovoru" ako nije izabrano)
 *                 nullable: true
 *                 example: "09:00"
 *               serviceId:
 *                 type: integer
 *                 description: ID usluge
 *                 example: 3
 *               selectedEmployee:
 *                 type: string
 *                 description: ID izabranog zaposlenog ili "Slobodan zaposleni"
 *                 nullable: true
 *                 example: "7"
 *     responses:
 *       200:
 *         description: Rezervacija uspešno kreirana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Korisnik nije prijavljen
 *       404:
 *         description: Termin ne postoji
 *       500:
 *         description: Greska na serveru
 */

