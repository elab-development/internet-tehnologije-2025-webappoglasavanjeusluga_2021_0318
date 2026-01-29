import { NextResponse } from "next/server";
import { db } from "@/db";
import { services } from "@/db/schema";

export async function GET() {
  try {
    const data = await db.select().from(services);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching services:", err);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, price, categoryId, userId, profileId } = body;

    if (!title || !price || !categoryId || !userId || !profileId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newService = await db.insert(services).values({
      title,
      description,
      price,
      categoryId,
      userId,
      profileId,
      createdAt: new Date(), // ako imaš kolonu createdAt
    }).returning();

    return NextResponse.json(newService[0], { status: 201 });
  } catch (err) {
    console.error("Error creating service:", err);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}

