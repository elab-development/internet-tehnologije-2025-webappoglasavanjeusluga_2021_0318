console.log("HIT /api/profiles/[id] ROUTE");

import { NextResponse } from "next/server";
import { db } from "@/db";
import { profiles, services, reviews } from "@/db/schema";
import { eq, sql, inArray } from "drizzle-orm";

export async function GET(
  _req: Request,
  context: { params: { id: string } }
) {
  try {
    const profileId = Number(context.params.id);

    if (isNaN(profileId)) {
      return NextResponse.json({ error: "Invalid profile ID" }, { status: 400 });
    }

    // Profil
    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, profileId));

    if (!profile[0]) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Usluge
    const servicesForProfile = await db
      .select({ id: services.id })
      .from(services)
      .where(eq(services.profileId, profileId));

    const serviceIds = servicesForProfile.map(s => s.id);
    const servicesCount = serviceIds.length;

    // Prosečna ocena
    let averageRating = 0;

    if (serviceIds.length > 0) {
      const ratingResult = await db
        .select({ avg: sql<number>`coalesce(avg(rating), 0)` })
        .from(reviews)
        .where(inArray(reviews.serviceId, serviceIds));

      averageRating = Number(ratingResult[0]?.avg ?? 0);
    }

    // Verified logika
    const verified = averageRating > 4.5 && servicesCount > 7;

    return NextResponse.json({
      ...profile[0],
      servicesCount,
      averageRating,
      verified,
    });
  } catch (err) {
    console.error("Error fetching profile details:", err);
    return NextResponse.json(
      { error: "Failed to fetch profile details" },
      { status: 500 }
    );
  }
}
