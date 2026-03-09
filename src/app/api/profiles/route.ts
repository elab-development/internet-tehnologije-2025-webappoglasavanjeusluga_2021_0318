import { NextResponse } from "next/server";
import { db } from "@/db";
import { profiles, users, services, reviews } from "@/db/schema";
import { eq, sql} from "drizzle-orm";



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
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID profila
 *                     example: 3
 *                   city:
 *                     type: string
 *                     description: Grad u kojem se profil nalazi
 *                     example: "Beograd"
 *                   description:
 *                     type: string
 *                     description: Opis profila
 *                     example: "Profesionalni frizerski salon"
 *                   image:
 *                     type: string
 *                     nullable: true
 *                     description: URL slike profila
 *                     example: "https://example.com/profile.jpg"
 *                   companyName:
 *                     type: string
 *                     nullable: true
 *                     description: Naziv kompanije ako je profil kompanijski
 *                     example: "Salon Lepote"
 *                   firstName:
 *                     type: string
 *                     description: Ime freelancera
 *                     example: "Ana"
 *                   lastName:
 *                     type: string
 *                     description: Prezime freelancera
 *                     example: "Jovanović"
 *                   userId:
 *                     type: integer
 *                     description: ID korisnika koji poseduje profil
 *                     example: 5
 *                   user:
 *                     type: object
 *                     description: Osnovni podaci o korisniku
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID korisnika
 *                         example: 5
 *                       firstName:
 *                         type: string
 *                         description: Ime korisnika
 *                         example: "Petar"
 *                       lastName:
 *                         type: string
 *                         description: Prezime korisnika
 *                         example: "Petrović"
 *                       phone:
 *                         type: string
 *                         description: Telefon korisnika
 *                         example: "+381641234567"
 *       500:
 *         description: Neuspešno pronalaženje profila
 */


