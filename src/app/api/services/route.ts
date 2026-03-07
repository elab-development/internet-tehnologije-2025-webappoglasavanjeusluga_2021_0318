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
        //image: service.image,

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



/**
 * @swagger
 * /api/services:
 *   post:
 *     summary: Kreiranje nove usluge
 *     tags:
 *       - Usluge
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateServiceRequest'
 *     responses:
 *       200:
 *         description: Usluga uspešno kreirana
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateServiceResponse'
 *       400:
 *         description: Nevalidni podaci
 *       401:
 *         description: Niste prijavljeni
 *       404:
 *         description: Profil nije pronađen
 *       500:
 *         description: Greška na serveru
 */

import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { appointments } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Niste prijavljeni" },
        { status: 401 }
      );
    }

    const user = verifyAuthToken(token);

    const body = await req.json();

    const {
      title,
      description,
      price,
      categoryId,
      image,
      appointments: appointmentList,
    } = body;

    //  PRONALAZAK PROFILA ZA PRIJAVLJENOG KORISNIKA
    const profile = await db.query.profiles.findFirst({
      where: (profiles, { eq }) =>
        eq(profiles.userId, Number(user.sub)),
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profil nije pronađen" },
        { status: 404 }
      );
    }

    // KREIRANJE USLUGE SA TACNIM profileId
    const [newService] = await db
      .insert(services)
      .values({
        title,
        description,
        price,
        categoryId,
        image: image ?? null,
        userId: Number(user.sub),
        profileId: profile.id, 
      })
      .returning();

    // TERMINI (ako postoje)
    if (appointmentList?.length > 0) {
     await db.insert(appointments).values(
        appointmentList.map((a: any) => ({
          date: a.date,
          time: a.time ?? null,
          isBooked: false,
          serviceId: newService.id,
        }))
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Greška na serveru" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     CreateServiceRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - price
 *         - categoryId
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         categoryId:
 *           type: integer
 *         image:
 *           type: string
 *           nullable: true
 *         appointments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AppointmentInput'
 *
 *
 *     AppointmentInput:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           description: Datum u formatu YYYY-MM-DD
 *         time:
 *           type: string
 *           nullable: true
 *           description: Vreme u formatu HH:mm
 */
 /**
 * @swagger
 * components:
 *   schemas:
 *
 *     CreateServiceResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 */






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
