import { NextResponse } from "next/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/profiles → lista svih profila
export async function GET() {
  try {
    const data = await db.select().from(profiles);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching profiles:", err);
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }
}

// PATCH /api/profiles → izmena profila
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, city, address, description, image, averageRating, companyName, firstName, lastName } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing profile id" }, { status: 400 });
    }

    const updatedProfile = await db.update(profiles)
      .set({
        city,
        address,
        description,
        image,
        averageRating,
        companyName,
        firstName,
        lastName,
      })
      .where(eq(profiles.id, id))
      .returning();

    if (!updatedProfile[0]) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProfile[0], { status: 200 });
  } catch (err) {
    console.error("Error updating profile:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
