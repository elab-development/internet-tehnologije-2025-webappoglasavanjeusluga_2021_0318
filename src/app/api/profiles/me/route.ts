import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {users, profiles, services, reviews, categories,} from "@/db/schema";


const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

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
            image: services.image,
    
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

    return NextResponse.json(
      { error: "Greska na serveru" },
      { status: 500 }
    );
  }
}


/**
 * @swagger
 * /api/profiles/me:
 *   get:
 *     summary: Dohvatanje profila trenutno prijavljenog korisnika
 *     tags:
 *       - Profili
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Uspešno vraćeni podaci profila
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
 *                     userId:
 *                       type: integer
 *                       example: 5
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
 *                     serviceCount:
 *                       type: number
 *                       example: 4
 *                     averageRating:
 *                       type: number
 *                       example: 4.75
 *
 *                 services:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 10
 *                       title:
 *                         type: string
 *                         example: "Muško šišanje"
 *                       description:
 *                         type: string
 *                         example: "Šišanje mašinicom i makazama"
 *                       price:
 *                         type: integer
 *                         example: 1200
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-02-01T09:00:00Z"
 *                       image:
 *                         type: string
 *                         example: "https://example.com/service.jpg"
 *                       category:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 2
 *                           name:
 *                             type: string
 *                             example: "Frizerske usluge"
 *                       profile:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 3
 *                           city:
 *                             type: string
 *                             example: "Beograd"
 *
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
 *                       profileId:
 *                         type: integer
 *                         example: 3
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 8
 *                           firstName:
 *                             type: string
 *                             example: "Ivana"
 *                           lastName:
 *                             type: string
 *                             example: "Petrović"
 *                       service:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 10
 *                           title:
 *                             type: string
 *                             example: "Muško šišanje"
 *
 *       401:
 *         description: Niste prijavljeni ili token nije validan
 *       404:
 *         description: Profil ne postoji
 *       500:
 *         description: Greška na serveru
 */