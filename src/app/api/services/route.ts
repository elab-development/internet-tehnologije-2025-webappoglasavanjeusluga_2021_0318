import { NextResponse } from "next/server";
import { db } from "@/db";
import { services, categories, profiles } from "@/db/schema"; 
import { eq, ilike, and, or } from "drizzle-orm";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";
import { appointments } from "@/db/schema";
import {  availabilities as availabilitiesTable } from "@/db/schema";

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
      availabilities, 
    } = body;

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

    let insertedAppointments: any[] = [];

    if (appointmentList?.length > 0) {
      insertedAppointments = await db
        .insert(appointments)
        .values(
          appointmentList.map((a: any) => ({
            date: a.date,
            time: a.time ?? null,
            isBooked: false,
            serviceId: newService.id,
          }))
        )
        .returning();
    }

    if (availabilities?.length > 0) { 
      await db.insert(availabilitiesTable).values(
        availabilities.map((a: any) => ({
          employeeId: a.employeeId,
          appointmentId:
            insertedAppointments[a.appointmentIndex].id,
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







// /* PUT - Izmena usluge */
// export async function PUT(req: Request) {
//   try {
//     const body = await req.json();
//     const { id, title, description, price } = body;

//     if (!id) {
//       return NextResponse.json(
//         { error: "Nedostaje id usluge" },
//         { status: 400 }
//       );
//     }

//     const updatedService = await db
//       .update(services)
//       .set({
//         title,
//         description,
//         price,
//       })
//       .where(eq(services.id, id))
//       .returning();

//     return NextResponse.json(updatedService[0], { status: 200 });
//   } catch (err) {
//     console.error("Neuspesno azuriranje usluge:", err);
//     return NextResponse.json(
//       { error: "Neuspesno azuriranje usluge" },
//       { status: 500 }
//     );
//   }
// }

// /* DELETE - Brisanje usluge */
// export async function DELETE(req: Request) {
//   try {
//     const body = await req.json();
//     const { id } = body;

//     if (!id) {
//       return NextResponse.json(
//         { error: "Nedostaje id usluge" },
//         { status: 400 }
//       );
//     }

//     const deletedService = await db
//       .delete(services)
//       .where(eq(services.id, id))
//       .returning();

//     return NextResponse.json(deletedService[0], { status: 200 });
//   } catch (err) {
//     console.error("Neuspesno brisanje usluge:", err);
//     return NextResponse.json(
//       { error: "Neuspesno brisanje usluge" },
//       { status: 500 }
//     );
//   }
// }
