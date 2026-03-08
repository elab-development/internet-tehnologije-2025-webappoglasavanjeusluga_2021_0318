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
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
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

    if (!reservatedDate || !serviceId) {
      return NextResponse.json(
        { error: "Nedostaju podaci" },
        { status: 400 }
      );
    }

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

      if (appointment.isBooked) {
        return NextResponse.json(
          { error: "Termin je zauzet" },
          { status: 400 }
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
      { error: "Server error" },
      { status: 500 }
    );
  }
}



