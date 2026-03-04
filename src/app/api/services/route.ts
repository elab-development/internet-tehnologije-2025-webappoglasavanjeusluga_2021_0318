import { NextResponse } from "next/server";
import { db } from "@/db";
import { services, categories, profiles } from "@/db/schema"; 
import { eq, ilike, and, or } from "drizzle-orm";

/**
 * @swagger
 * /api/services:
 *   get:
 *     summary: Vraća listu svih usluga
 *     description: Preuzima sve usluge zajedno sa kategorijom kojoj pripada i gradom pruzaoca (podatak sa profila)
 *     tags:
 *       - Usluge
 *     responses:
 *       200:
 *         description: Uspešno vraćena lista usluga
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 *       500:
 *         description: Neuspešno pronalaženje usluga
 */
export async function GET() {
  try {
    const data = await db
      .select({
        id: services.id,
        title: services.title,
        description: services.description,
        price: services.price,
        createdAt: services.createdAt,

        category: {
          id: categories.id,
          name: categories.name,
        },

        profile: {
          id: profiles.id,
          city: profiles.city,
        },
      })
      .from(services)
      .leftJoin(categories, eq(services.categoryId, categories.id))
      .leftJoin(profiles, eq(services.profileId, profiles.id));

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Neuspesno pronalazenje usluga" },
      { status: 500 }
    );
  }
}


/**
 * @swagger
 * components:
 *   schemas:
 *     CategoryName:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *
 *     ProfileCity:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         city:
 *           type: string
 *
 *     Service:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         category:
 *           $ref: '#/components/schemas/CategoryName'
 *         profile:
 *           $ref: '#/components/schemas/ProfileCity'
 */




/*  POST - Kreiranje usluge */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, price, categoryId, userId, profileId } = body;

    if (!title || !price || !categoryId || !userId || !profileId) {
      return NextResponse.json(
        { error: "Nisu popunjena sva polja" },
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
    console.error("Neuspesno kreiranje usluge:", err);
    return NextResponse.json(
      { error: "Neuspesno kreiranje usluge" },
      { status: 500 }
    );
  }
}

/* PUT - Izmena usluge */
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, description, price } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Nedostaje id usluge" },
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
    console.error("Neuspesno azuriranje usluge:", err);
    return NextResponse.json(
      { error: "Neuspesno azuriranje usluge" },
      { status: 500 }
    );
  }
}

/* DELETE - Brisanje usluge */
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Nedostaje id usluge" },
        { status: 400 }
      );
    }

    const deletedService = await db
      .delete(services)
      .where(eq(services.id, id))
      .returning();

    return NextResponse.json(deletedService[0], { status: 200 });
  } catch (err) {
    console.error("Neuspesno brisanje usluge:", err);
    return NextResponse.json(
      { error: "Neuspesno brisanje usluge" },
      { status: 500 }
    );
  }
}
