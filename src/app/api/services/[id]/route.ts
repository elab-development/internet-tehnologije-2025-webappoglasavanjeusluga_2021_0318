import { NextResponse } from "next/server";
import { db } from "@/db";
import {services, categories, profiles, users, reviews, appointments, employees, availabilities} from "@/db/schema";
import { eq } from "drizzle-orm";

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
 *               $ref: '#/components/schemas/ServiceDetailsResponse'
 *       400:
 *         description: Nevalidan ID
 *       404:
 *         description: Usluga nije pronađena
 *       500:
 *         description: Greška na serveru
 */

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

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     ServiceDetailsResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: string
 *           nullable: true
 *         price:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         category:
 *           $ref: '#/components/schemas/CategoryName'
 *         profile:
 *           $ref: '#/components/schemas/ProfileServiceDetails'
 *         reviews:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Review'
 *         appointments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Appointment'
 *         employees:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Employee'
 *         availabilities:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Availability'
 *
 *
 *     ProfileServiceDetails:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         city:
 *           type: string
 *         address:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: string
 *           nullable: true
 *         companyName:
 *           type: string
 *           nullable: true
 *         firstName:
 *           type: string
 *           nullable: true
 *         lastName:
 *           type: string
 *           nullable: true
 *         user:
 *           $ref: '#/components/schemas/User'
 *
 *
 *     Employee:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         description:
 *           type: string
 *
 *
 *     Appointment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         date:
 *           type: string
 *           format: date-time
 *         time:
 *           type: string
 *         isBooked:
 *           type: boolean
 *
 *
 *     Availability:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         note:
 *           type: string
 *         employee:
 *           $ref: '#/components/schemas/Employee'
 *         appointment:
 *           $ref: '#/components/schemas/Appointment'
 */

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

    // Obrisi sve termine vezane za uslugu
    await db
      .delete(appointments)
      .where(eq(appointments.serviceId, serviceId));

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