import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { bookings, services, users, employees, profiles } from "@/db/schema";


export const runtime = "nodejs";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET() {
  try {
    // Token iz cookie-ja
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Korisnik nije prijavljen" },
        { status: 401 }
      );
    }

    //  Verifikacija tokena
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = Number(payload.sub);

    if (!userId) {
      return NextResponse.json(
        { error: "Nevalidan token" },
        { status: 401 }
      );
    }

    //  Pronađi profil tog usera
    const [profile] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.userId, userId));

    if (!profile) {
      return NextResponse.json(
        { error: "Profil korisnika ne postoji" },
        { status: 404 }
      );
    }

    //  Uzmi sve rezervacije vezane za usluge tog profila
    const result = await db
      .select({
        id: bookings.id,
        reservedDate: bookings.reservedDate,
        createdAt: bookings.createdAt,
        time: bookings.time,
        finished: bookings.finished,

        service: {
          id: services.id,
          title: services.title,
        },

        employee: {
          id: employees.id,
          firstName: employees.firstName,
          lastName: employees.lastName,
        },

        user: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          phone: users.phone,
        },
      })
      .from(bookings)
      .innerJoin(services, eq(bookings.serviceId, services.id))
      .leftJoin(users, eq(bookings.userId, users.id))
      .leftJoin(employees, eq(bookings.employeeId, employees.id))
      .where(eq(services.profileId, profile.id)) 
      .orderBy(desc(bookings.createdAt));

    return NextResponse.json(result);

  } catch (error) {

    return NextResponse.json(
      { error: "Greška na serveru" },
      { status: 500 }
    );
  }
}


/**
 * @swagger
 * /api/bookings/me:
 *   get:
 *     summary: Vraca listu rezervacija za ulogovanog pružaoca usluge
 *     description: Vraća sve rezervacije za usluge koje pripadaju profilu trenutno prijavljenog korisnika. Autentifikacija se vrši putem JWT tokena iz cookie-ja.
 *     tags:
 *       - Rezervacije
 *     responses:
 *       200:
 *         description: Lista rezervacija uspešno vraćena
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 5
 *                   reservedDate:
 *                     type: string
 *                     example: "2026-03-20"
 *                   time:
 *                     type: string
 *                     nullable: true
 *                     example: "09:00"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2026-03-01T10:15:30.000Z"
 *                   finished:
 *                     type: boolean
 *                     example: false
 *                   service:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 2
 *                       title:
 *                         type: string
 *                         example: Šišanje
 *                   employee:
 *                     type: object
 *                     nullable: true
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 3
 *                       firstName:
 *                         type: string
 *                         example: Marko
 *                       lastName:
 *                         type: string
 *                         example: Petrović
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 7
 *                       firstName:
 *                         type: string
 *                         example: Ivana
 *                       lastName:
 *                         type: string
 *                         example: Jovanović
 *                       email:
 *                         type: string
 *                         example: ivana@gmail.com
 *                       phone:
 *                         type: string
 *                         example: "+381601234567"
 *       401:
 *         description: Korisnik nije prijavljen ili token nije validan
 *       404:
 *         description: Profil korisnika ne postoji
 *       500:
 *         description: Greška na serveru
 */