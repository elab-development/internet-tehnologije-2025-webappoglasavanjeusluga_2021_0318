import { NextResponse } from "next/server";
import { db } from "@/db";
import { services, reviews, appointments } from "@/db/schema";
import { eq } from "drizzle-orm";

// ✅ 
export async function GET(req: Request) {  // ✅ samo jedan argument, req

  try {
    const url = new URL(req.url); // ✅ novo, uzimamo URL da dohvatimo id
    const segments = url.pathname.split("/").filter(Boolean); // ✅ parsira path na segmente
    const serviceId = Number(segments[segments.length - 1]); // ✅ poslednji segment je id

    // ✅ dodata provera NaN
    if (isNaN(serviceId)) {
      return NextResponse.json({ error: "Nedostaje id usluge" }, { status: 400 });
    }

    //✅✅✅✅✅✅✅✅✅✅✅✅✅izmenjen kod iznad✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅

    // osnovni podaci o usluzi
    const service = await db
      .select()
      .from(services)
      .where(eq(services.id, serviceId));

    if (!service[0]) {
      return NextResponse.json({ error: "Usluga nije pronadjena" }, { status: 404 });
    }

    // recenzije za uslugu
    const serviceReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.serviceId, serviceId));

    // termini za uslugu
    const serviceAppointments = await db
      .select()
      .from(appointments)
      .where(eq(appointments.serviceId, serviceId));

    return NextResponse.json({
      ...service[0],
      reviews: serviceReviews,
      appointments: serviceAppointments,
    });
  } catch (err) {
    console.error("Neuspesno slanje podataka o usluzi:", err);
    return NextResponse.json(
      { error: "Neuspesno slanje podataka o usluzi" },
      { status: 500 }
    );
  }
}
