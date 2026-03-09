import { NextResponse } from "next/server";
import { db } from "@/db";
import {profiles,services,reviews,users,categories} from "@/db/schema";
import { eq, sql } from "drizzle-orm";

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
 *     responses:
 *       200:
 *         description: Uspešno vraćen profil sa uslugama i recenzijama
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileDetailsResponse'
 *       400:
 *         description: Nevalidan ID
 *       404:
 *         description: Profil ne postoji
 *       500:
 *         description: Greška na serveru
 */

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
 * components:
 *   schemas:
 *
 *     ProfileDetailsResponse:
 *       type: object
 *       properties:
 *         profile:
 *           $ref: '#/components/schemas/ProfileDetails'
 *         services:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Service'
 *         reviews:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Review'
 *
 *     ProfileDetails:
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
 *         companyName:
 *           type: string
 *           nullable: true
 *         firstName:
 *           type: string
 *           nullable: true
 *         lastName:
 *           type: string
 *           nullable: true
 *         userId:
 *           type: integer
 *         user:
 *           $ref: '#/components/schemas/User'
 *         serviceCount:
 *           type: string
 *         averageRating:
 *           type: string
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
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
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         category:
 *           $ref: '#/components/schemas/CategoryName'
 *         profile:
 *           $ref: '#/components/schemas/ProfileCity'
 *
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
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         rating:
 *           type: integer
 *         comment:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         profileId:
 *           type: integer
 *         user:
 *           $ref: '#/components/schemas/ReviewUser'
 *         service:
 *           $ref: '#/components/schemas/ReviewService'
 *
 *     ReviewUser:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *
 *     ReviewService:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 */



