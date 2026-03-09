import { NextResponse } from "next/server";
import { db } from "@/db";
import { profiles, users, services, reviews } from "@/db/schema";
import { eq, sql} from "drizzle-orm";
/**
 * @swagger
 * /api/profiles:
 *   get:
 *     summary: Vraća listu svih profila
 *     tags:
 *       - Profili
 *     responses:
 *       200:
 *         description: Uspešno vraćena lista profila
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProfilePreview'
 *       500:
 *         description: Neuspešno pronalaženje profila
 */

// GET - svi profili
export async function GET() {
  try {
    const data = await db
      .select({
        id: profiles.id,
        city: profiles.city,
       
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
          
        },
        
      })                                                               
      .from(profiles)
      .leftJoin(users, eq(users.id, profiles.userId))
      

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
   return NextResponse.json(
      { error: "Neuspesno pronalazenje profila" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * components:
 *   schemas:
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
 *
 *     ProfilePreview:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         city:
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
 *         lastName:
 *           type: string
 *         userId:
 *           type: integer
 *         user:
 *           $ref: '#/components/schemas/User'
 */



