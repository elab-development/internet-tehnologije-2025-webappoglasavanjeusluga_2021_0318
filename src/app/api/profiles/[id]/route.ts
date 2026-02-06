import { NextResponse } from "next/server";
import { db } from "@/db";
import { profiles, services, reviews } from "@/db/schema";
import { eq, sql, inArray } from "drizzle-orm";
import { jwtVerify } from "jose";

// GET /api/profiles/:id → detaljan prikaz profila
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const profileId = Number(params.id);

    // Osnovni profil
    const profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, profileId));

    if (!profile[0]) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Usluge za ovaj profil
    const servicesForProfile = await db
      .select({ id: services.id })
      .from(services)
      .where(eq(services.profileId, profileId));

    const serviceIds = servicesForProfile.map((s) => s.id);

    // Broj usluga
    const servicesCount = serviceIds.length;

    // Prosek ocena
    let averageRating = 0;
    if (serviceIds.length > 0) {
      const ratings = await db
        .select({ avg: sql<number>`avg(rating)` })
        .from(reviews)
        .where(inArray(reviews.serviceId, serviceIds));

      averageRating = ratings[0]?.avg ?? 0;
    }

    const result = {
      ...profile[0],
      servicesCount,
      averageRating,
      verified: averageRating > 4.5 && servicesCount > 7,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("Error fetching profile details:", err);
    return NextResponse.json(
      { error: "Failed to fetch profile details" },
      { status: 500 }
    );
  }
}

// PATCH /api/profiles/:id → izmena profila (samo vlasnik ili COMPANY)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const profileId = Number(params.id);

    // Provera tokena
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });

    const body = await req.json();
    const { city, address, description, image, companyName, firstName, lastName } = body;

    // Proveri da li profil postoji
    const existingProfile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, profileId));

    if (!existingProfile[0]) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Dozvoljeno samo vlasniku profila ili COMPANY
    if (payload.role !== "COMPANY" && Number(payload.id) !== existingProfile[0].userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedProfile = await db
      .update(profiles)
      .set({
        city,
        address,
        description,
        image,
        companyName,
        firstName,
        lastName,
      })
      .where(eq(profiles.id, profileId))
      .returning();

    return NextResponse.json(updatedProfile[0], { status: 200 });
  } catch (err) {
    console.error("Error updating profile:", err);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
