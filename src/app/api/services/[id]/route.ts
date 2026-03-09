import { NextResponse } from "next/server";
import { db } from "@/db";
import {services, categories, profiles, users, reviews, appointments, employees, availabilities} from "@/db/schema";
import { eq } from "drizzle-orm";



export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const serviceId = Number(segments[segments.length - 1]);

    if (isNaN(serviceId)) {
      return NextResponse.json({ error: "Nevalidan ID usluge" }, { status: 400 });
    }

    // SERVICE + CATEGORY + PROFILE + USER
    const serviceData = await db
      .select({
        id: services.id,
        title: services.title,
        description: services.description,
        image: services.image,
        price: services.price,
        createdAt: services.createdAt,

        category: {
          id: categories.id,
          name: categories.name,
        },

        profile: {
          id: profiles.id,
          city: profiles.city,
          address: profiles.address,
          description: profiles.description,
          image: profiles.image,
          companyName: profiles.companyName,
          firstName: profiles.firstName,
          lastName: profiles.lastName,

          user: { 
            id: users.id,
            firstName: users.firstName,
            lastName: users.lastName,
            phone: users.phone,
            createdAt: users.createdAt,
          },
        },
      })
      .from(services)
      .leftJoin(categories, eq(services.categoryId, categories.id))
      .leftJoin(profiles, eq(services.profileId, profiles.id))
      .leftJoin(users, eq(profiles.userId, users.id))
      .where(eq(services.id, serviceId));

    if (!serviceData[0]) {
      return NextResponse.json({ error: "Usluga nije pronađena" }, { status: 404 });
    }

    // REVIEWS
    const serviceReviews = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,

        user: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
        },

        service: {
          id: services.id,
          title: services.title,
        },
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .leftJoin(services, eq(reviews.serviceId, services.id))
      .where(eq(reviews.serviceId, serviceId));

    // APPOINTMENTS
    const serviceAppointments = await db
      .select()
      .from(appointments)
      .where(eq(appointments.serviceId, serviceId));

    // EMPLOYEES
    const profileEmployees = await db
      .select()
      .from(employees)
      .where(eq(employees.profileId, serviceData[0].profile.id));

    // AVAILABILITIES
    const availabilityData = await db
      .select({
        id: availabilities.id,
        note: availabilities.note,
        employee: {
          id: employees.id,
          firstName: employees.firstName,
          lastName: employees.lastName,
          description: employees.description,
        },
        appointment: {
          id: appointments.id,
          date: appointments.date,
          time: appointments.time,
          isBooked: appointments.isBooked,
        },
      })
      .from(availabilities)
      .leftJoin(employees, eq(availabilities.employeeId, employees.id))
      .leftJoin(appointments, eq(availabilities.appointmentId, appointments.id));

    return NextResponse.json({
      ...serviceData[0],
      reviews: serviceReviews,
      appointments: serviceAppointments,
      employees: profileEmployees,
      availabilities: availabilityData,
    });
  } catch (err) {
    console.error("Greška:", err);

    return NextResponse.json(
      { error: "Neuspešno učitavanje usluge" },
      { status: 500 }
    );
  }
}




export async function DELETE(req: Request) {
  try {
    // Izvlacenje ID-a iz URL-a
    const url = new URL(req.url);
    const segments = url.pathname.split("/").filter(Boolean);
    const serviceId = Number(segments[segments.length - 1]);

    if (isNaN(serviceId)) {
      return NextResponse.json(
        { error: "Nevalidan ID usluge" },
        { status: 400 }
      );
    }

    // Obrisi uslugu
    await db
      .delete(services)
      .where(eq(services.id, serviceId));

    return NextResponse.json({ message: "Usluga i termini uspešno obrisani" });
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
 * /api/services/{id}:
 *   get:
 *     summary: Detaljan prikaz jedne usluge
 *     tags:
 *       - Usluge
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID usluge
 *     responses:
 *       200:
 *         description: Uspešno vraćeni podaci o usluzi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 10
 *                 title:
 *                   type: string
 *                   example: "Muško šišanje"
 *                 description:
 *                   type: string
 *                   example: "Šišanje mašinicom i makazama"
 *                 image:
 *                   type: string
 *                   example: "https://example.com/service.jpg"
 *                 price:
 *                   type: number
 *                   example: 1200
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-02-01T09:00:00Z"
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 2
 *                     name:
 *                       type: string
 *                       example: "Frizerske usluge"
 *                 profile:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     city:
 *                       type: string
 *                       example: "Beograd"
 *                     address:
 *                       type: string
 *                       example: "Knez Mihailova 10"
 *                     description:
 *                       type: string
 *                       example: "Profesionalni frizerski salon"
 *                     image:
 *                       type: string
 *                       example: "https://example.com/profile.jpg"
 *                     companyName:
 *                       type: string
 *                       example: "Salon Lepote"
 *                     firstName:
 *                       type: string
 *                       example: "Ana"
 *                     lastName:
 *                       type: string
 *                       example: "Jovanović"
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 5
 *                         firstName:
 *                           type: string
 *                           example: "Petar"
 *                         lastName:
 *                           type: string
 *                           example: "Petrović"
 *                         phone:
 *                           type: string
 *                           example: "+381641234567"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: "2026-01-15T10:30:00Z"
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 15
 *                       rating:
 *                         type: integer
 *                         example: 5
 *                       comment:
 *                         type: string
 *                         example: "Odlična usluga!"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-02-10T14:20:00Z"
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 7
 *                           firstName:
 *                             type: string
 *                             example: "Marko"
 *                           lastName:
 *                             type: string
 *                             example: "Marković"
 *                       service:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 10
 *                           title:
 *                             type: string
 *                             example: "Muško šišanje"
 *                 appointments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 21
 *                       date:
 *                         type: string
 *                         example: "2026-03-10"
 *                       time:
 *                         type: string
 *                         example: "09:00"
 *                       isBooked:
 *                         type: boolean
 *                         example: false
 *                 employees:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 7
 *                       firstName:
 *                         type: string
 *                         example: "Marko"
 *                       lastName:
 *                         type: string
 *                         example: "Marković"
 *                       description:
 *                         type: string
 *                         example: "Frizer sa 5 godina iskustva"
 *                 availabilities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 33
 *                       note:
 *                         type: string
 *                         example: "Slobodan ujutru"
 *                       employee:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 7
 *                           firstName:
 *                             type: string
 *                             example: "Marko"
 *                           lastName:
 *                             type: string
 *                             example: "Marković"
 *                           description:
 *                             type: string
 *                             example: "Frizer sa 5 godina iskustva"
 *                       appointment:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 21
 *                           date:
 *                             type: string
 *                             example: "2026-03-10"
 *                           time:
 *                             type: string
 *                             example: "09:00"
 *                           isBooked:
 *                             type: boolean
 *                             example: false
 *       400:
 *         description: Nevalidan ID
 *       404:
 *         description: Usluga nije pronađena
 *       500:
 *         description: Greška na serveru
 */








/**
 * @swagger
 * /api/services/{id}:
 *   delete:
 *     summary: Briše jednu uslugu
 *     tags:
 *       - Usluge
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID usluge koju treba obrisati
 *     responses:
 *       200:
 *         description: Usluga i termini uspešno obrisani
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Usluga i termini uspešno obrisani"
 *       400:
 *         description: Nevalidan ID usluge
 *       500:
 *         description: Greška na serveru
 */