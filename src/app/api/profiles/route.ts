import { NextResponse } from "next/server";
import { db } from "@/db";
import { profiles, services, reviews } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

//dodati funkciju POST    !!!!!!!!!!!!!!!!!!!!!!! 

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const profileId = Number(params.id);

    // 1. Učitaj profil
    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, profileId));

    if (!profile[0]) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 2. Broj usluga
    const servicesCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(services)
      .where(eq(services.profileId, profileId));

    // 3. Prosečna ocena
    const avgRating = await db
      .select({ avg: sql<number>`coalesce(avg(rating),0)` })
      .from(reviews)
      .where(
        sql`reviews.service_id IN (SELECT id FROM services WHERE profile_id = ${profileId})`
      );

    // 4. Verified logika
    const verified =
      Number(avgRating[0]?.avg ?? 0) > 4.5 &&
      Number(servicesCount[0]?.count ?? 0) > 7;

    // 5. Vrati JSON
    return NextResponse.json({
      ...profile[0],
      servicesCount: Number(servicesCount[0]?.count ?? 0),
      averageRating: Number(avgRating[0]?.avg ?? 0),
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
