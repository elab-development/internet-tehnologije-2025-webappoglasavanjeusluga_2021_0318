import { NextResponse } from "next/server";
import { db } from "@/db";
import { services, categories, profiles } from "@/db/schema"; 
import { eq, ilike, and, or } from "drizzle-orm";

/* ============================
   GET - Pregled, filtriranje, pretraga
============================ */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const categoryId = searchParams.get("categoryId");
    const keyword = searchParams.get("search");

    let condition;

    if (categoryId && keyword) {
      // filtriranje po kategoriji + pretraga po title ili description
      condition = and(
        eq(services.categoryId, Number(categoryId)),
        or(
          ilike(services.title, `%${keyword}%`),
          ilike(services.description, `%${keyword}%`)
        )
      );
    } else if (categoryId) {
      condition = eq(services.categoryId, Number(categoryId));
    } else if (keyword) {
      condition = or(
        ilike(services.title, `%${keyword}%`),
        ilike(services.description, `%${keyword}%`)
      );
    }

    // ✅ query sada radi JOIN sa kategorijama i profilima
    const query = db
      .select({
        id: services.id,
        title: services.title,
        description: services.description,
        price: services.price,
        createdAt: services.createdAt, // ✅ dodato

        category: { // ✅ dodato
          id: categories.id,
          name: categories.name,
        },

        profile: { // ✅ dodato
          id: profiles.id,
          city: profiles.city,
        },
      })
      .from(services)
      .leftJoin(categories, eq(services.categoryId, categories.id)) // ✅
      .leftJoin(profiles, eq(services.profileId, profiles.id)); // ✅

      // ✅ OVDE koristimo query
    const data = condition
      ? await query.where(condition)
      : await query;

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching services:", err);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

/* ============================
   POST - Kreiranje usluge
============================ */
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
      createdAt: new Date(),
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

/* ============================
   PUT - Izmena usluge
============================ */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, description, price } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing service id" },
        { status: 400 }
      );
    }

    const updatedService = await db
      .update(services)
      .set({
        title,
        description,
        price,
      })
      .where(eq(services.id, id))
      .returning();

    return NextResponse.json(updatedService[0], { status: 200 });
  } catch (err) {
    console.error("Error updating service:", err);
    return NextResponse.json(
      { error: "Failed to update service" },
      { status: 500 }
    );
  }
}

/* ============================
   DELETE - Brisanje usluge
============================ */
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Missing service id" },
        { status: 400 }
      );
    }

    const deletedService = await db
      .delete(services)
      .where(eq(services.id, id))
      .returning();

    return NextResponse.json(deletedService[0], { status: 200 });
  } catch (err) {
    console.error("Error deleting service:", err);
    return NextResponse.json(
      { error: "Failed to delete service" },
      { status: 500 }
    );
  }
}
