import { NextResponse } from "next/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET - svi profili
export async function GET() {
  try {
    const allProfiles = await db.select().from(profiles);
    return NextResponse.json(allProfiles);
  } catch (err) {
    console.error("Error fetching profiles:", err);
    return NextResponse.json(
      { error: "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}

// POST - kreiranje novog profila
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newProfile = await db.insert(profiles).values(body).returning();
    return NextResponse.json(newProfile[0], { status: 201 });
  } catch (err) {
    console.error("Error creating profile:", err);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}

// PUT - zamena celog profila
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const profileId = Number(body.id);

    const updated = await db
      .update(profiles)
      .set(body)
      .where(eq(profiles.id, profileId))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (err) {
    console.error("Error updating profile:", err);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

// PATCH - delimična izmena profila
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const profileId = Number(body.id);

    const updated = await db
      .update(profiles)
      .set(body)
      .where(eq(profiles.id, profileId))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (err) {
    console.error("Error patching profile:", err);
    return NextResponse.json(
      { error: "Failed to patch profile" },
      { status: 500 }
    );
  }
}

// DELETE - brisanje profila
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const profileId = Number(body.id);

    await db.delete(profiles).where(eq(profiles.id, profileId));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting profile:", err);
    return NextResponse.json(
      { error: "Failed to delete profile" },
      { status: 500 }
    );
  }
}
