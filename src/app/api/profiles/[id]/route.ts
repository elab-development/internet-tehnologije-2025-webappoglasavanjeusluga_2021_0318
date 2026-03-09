import { NextResponse } from "next/server";
import { db } from "@/db";
import {profiles,services,reviews,users,categories} from "@/db/schema";
import { eq, sql } from "drizzle-orm";


//GET /api/profiles/:id - detaljan prikaz profila
export async function GET(req: Request) {
  try {
  const url = new URL(req.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const id = Number(segments[segments.length - 1]);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Nevalidan ID" }, { status: 400 });
  }
 // =========================
    // PROFIL
    // =========================
    const profileData = await db
      .select({
        id: profiles.id,
        city: profiles.city,
        address: profiles.address,
        description: profiles.description,
        image: profiles.image,
        companyName: profiles.companyName,
        firstName: profiles.firstName,
        lastName: profiles.lastName,
        userId: profiles.userId,

        user: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          phone: users.phone,
          createdAt: users.createdAt,
        },

        serviceCount: sql<number>`
          COUNT(DISTINCT ${services.id})
        `,

        averageRating: sql<number>`
          COALESCE(ROUND(AVG(${reviews.rating})::numeric, 2), 0)
        `,
      })
      .from(profiles)
      .leftJoin(users, eq(users.id, profiles.userId))
      .leftJoin(services, eq(services.profileId, profiles.id))
      .leftJoin(reviews, eq(reviews.profileId, profiles.id))
      .where(eq(profiles.id, id))
      .groupBy(profiles.id, users.id); //zbog agregatnih f-ja

    if (!profileData.length) {
      return NextResponse.json(
        { error: "Profil ne postoji" },
        { status: 404 }
      );
    }

    const profile = profileData[0];

    // =========================
    // USLUGE
    // =========================
    const servicesData = await db
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
      .leftJoin(profiles, eq(services.profileId, profiles.id))
      .where(eq(services.profileId, id));

    // =========================
    // RECENZIJE
    // =========================
    const reviewsData = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        profileId: reviews.profileId,

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
      .innerJoin(users, eq(reviews.userId, users.id))
      .leftJoin(services, eq(reviews.serviceId, services.id))
      .where(eq(reviews.profileId, id));

    return NextResponse.json({
      profile,
      services: servicesData,
      reviews: reviewsData,
    });

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
 * /api/profiles/{id}:
 *   get:
 *     summary: Detaljan prikaz jednog profila
 *     tags:
 *       - Profili
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID profila
 *         schema:
 *           type: integer
 *           example: 3
 *     responses:
 *       200:
 *         description: Uspešno vraćen profil sa uslugama i recenzijama
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 profile:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID profila
 *                       example: 3
 *                     city:
 *                       type: string
 *                       description: Grad
 *                       example: "Beograd"
 *                     address:
 *                       type: string
 *                       description: Adresa
 *                       example: "Knez Mihailova 10"
 *                     description:
 *                       type: string
 *                       description: Opis profila
 *                       example: "Profesionalni frizerski salon"
 *                     image:
 *                       type: string
 *                       description: URL slike profila
 *                       example: "https://example.com/profile.jpg"
 *                     companyName:
 *                       type: string
 *                       nullable: true
 *                       description: Naziv firme
 *                       example: "Salon Lepote"
 *                     firstName:
 *                       type: string
 *                       nullable: true
 *                       description: Ime freelancera
 *                       example: "Ana"
 *                     lastName:
 *                       type: string
 *                       nullable: true
 *                       description: Prezime freelancera
 *                       example: "Jovanović"
 *                     userId:
 *                       type: integer
 *                       description: ID korisnika
 *                       example: 5
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           description: ID korisnika
 *                           example: 5
 *                         firstName:
 *                           type: string
 *                           description: Ime korisnika
 *                           example: "Petar"
 *                         lastName:
 *                           type: string
 *                           description: Prezime korisnika
 *                           example: "Petrović"
 *                         phone:
 *                           type: string
 *                           description: Telefon korisnika
 *                           example: "063156324"
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           description: Datum kreiranja naloga
 *                           example: "2026-01-15T10:30:00Z"
 *                     serviceCount:
 *                       type: number
 *                       description: Ukupan broj usluga koje profil ima
 *                       example: 4
 *                     averageRating:
 *                       type: number
 *                       description: Prosečna ocena profila
 *                       example: 4.75
 *
 *                 services:
 *                   type: array
 *                   description: Lista usluga koje profil nudi
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID usluge
 *                         example: 10
 *                       title:
 *                         type: string
 *                         description: Naziv usluge
 *                         example: "Muško šišanje"
 *                       description:
 *                         type: string
 *                         description: Opis usluge
 *                         example: "Šišanje mašinicom i makazama"
 *                       price:
 *                         type: integer
 *                         description: Cena usluge
 *                         example: 1200
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Datum kreiranja usluge
 *                         example: "2026-02-01T09:00:00Z"
 *                       category:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: ID kategorije
 *                             example: 2
 *                           name:
 *                             type: string
 *                             description: Naziv kategorije
 *                             example: "Frizerske usluge"
 *                       profile:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: ID profila
 *                             example: 3
 *                           city:
 *                             type: string
 *                             description: Grad profila
 *                             example: "Beograd"
 *
 *                 reviews:
 *                   type: array
 *                   description: Lista recenzija za profil
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID recenzije
 *                         example: 15
 *                       rating:
 *                         type: integer
 *                         description: Ocena usluge
 *                         example: 5
 *                       comment:
 *                         type: string
 *                         description: Komentar korisnika
 *                         example: "Odlična usluga!"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Datum kreiranja recenzije
 *                         example: "2026-02-10T14:20:00Z"
 *                       profileId:
 *                         type: integer
 *                         description: ID profila na koji se odnosi recenzija
 *                         example: 3
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: ID korisnika koji je ostavio recenziju
 *                             example: 8
 *                           firstName:
 *                             type: string
 *                             description: Ime korisnika
 *                             example: "Ivana"
 *                           lastName:
 *                             type: string
 *                             description: Prezime korisnika
 *                             example: "Petrović"
 *                       service:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: ID usluge
 *                             example: 10
 *                           title:
 *                             type: string
 *                             description: Naziv usluge
 *                             example: "Muško šišanje"
 *
 *       400:
 *         description: Nevalidan ID
 *       404:
 *         description: Profil ne postoji
 *       500:
 *         description: Greška na serveru
 */