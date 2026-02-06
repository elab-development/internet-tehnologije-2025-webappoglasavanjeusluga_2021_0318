import { NextResponse } from "next/server";
import { db } from "@/db";
import { services, reviews, appointments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const serviceId = Number(params.id);

    // osnovni podaci o usluzi
    const service = await db
      .select()
      .from(services)
      .where(eq(services.id, serviceId));

    if (!service[0]) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
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
    console.error("Error fetching service details:", err);
    return NextResponse.json(
      { error: "Failed to fetch service details" },
      { status: 500 }
    );
  }
}
