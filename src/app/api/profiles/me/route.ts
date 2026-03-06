import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {users, profiles, services, reviews, categories,} from "@/db/schema";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

/**
 * @swagger
 * /api/profiles/me:
 *   get:
 *     summary: Dohvatanje profila trenutno prijavljenog korisnika
 *     tags:
 *       - Profili
 *     responses:
 *       200:
 *         description: Uspešno vraćeni podaci profila
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProfileMeResponse'
 *       401:
 *         description: Niste prijavljeni ili token nije validan
 *       404:
 *         description: Profil ne postoji
 *       500:
 *         description: Greška na serveru
 */

export async function GET() {
  try {
    // Uzmi token iz cookie-a
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Niste prijavljeni" },
        { status: 401 }
      );
    }

    // Verifikuj token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Uzimamo userId iz sub
    const userId = Number(payload.sub);

    if (!userId) {
      return NextResponse.json(
        { error: "Nevalidan token" },
        { status: 401 }
      );
    }

    // Pronadjii profil preko userId
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
      .where(eq(profiles.userId, userId))
      .groupBy(profiles.id, users.id);

    if (!profileData.length) {
      return NextResponse.json(
        { error: "Profil ne postoji" },
        { status: 404 }
      );
    }

    const profile = profileData[0];
    const profileId = profile.id;

    // Usluge
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
          .where(eq(services.profileId, profileId));

    // Recenzije
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
         .where(eq(reviews.profileId, profileId));

    // Vrati sve podatke
   return NextResponse.json({
         profile,
         services: servicesData,
         reviews: reviewsData,
       });
  } catch (error) {
    console.error("PROFILE ME ERROR:", error);

    return NextResponse.json(
      { error: "Greska na serveru" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     ProfileMeResponse:
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
 */