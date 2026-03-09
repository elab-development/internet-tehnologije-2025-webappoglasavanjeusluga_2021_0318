import { NextResponse } from "next/server";
import { db } from "@/db";
import { employees, profiles} from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";


// GET svi zaposleni za usera
export async function GET() {
  try {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Korisnik nije prijavljen" }, { status: 401 });
    }

    const user = verifyAuthToken(token);
    const userId = Number(user.sub);

    if (!userId) {
      return NextResponse.json({ error: "Nevalidan user id" }, { status: 400 });
    }

    // Pronadji profil korisnika
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    if (!profile) {
      return NextResponse.json({ error: "Profil nije pronađen" }, { status: 404 });
    }

    // Vracamo sve zaposlene za taj profil
    const allEmployees = await db.select().from(employees).where(eq(employees.profileId, profile.id));

    return NextResponse.json(allEmployees);
  } catch (err) {
    console.error("Zaposleni nisu pronadjeni:", err);
    return NextResponse.json({ error: "Server greška" }, { status: 500 });
  }
}





export async function POST(req: Request) {
  try {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
    }

    const user = verifyAuthToken(token);
    const userId = Number(user.sub);

    if (!userId) {
      return NextResponse.json(
        { error: "Nevalidan user id" },
        { status: 400 }
      );
    }

    
    const body = await req.json();
    const { firstName, lastName, description } = body;

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "Niste uneli ime ili prezime" },
        { status: 400 }
      );
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profil nije pronađen" },
        { status: 404 }
      );
    }

    const [employee] = await db
      .insert(employees)
      .values({
        firstName,
        lastName,
        description,
        profileId: profile.id,
      })
      .returning();

    return NextResponse.json(employee);

  } catch (err) {
    return NextResponse.json({ error: "Server greška" }, { status: 500 });
  }
}




/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Vraća sve zaposlene za prijavljenog korisnika
 *     description: Vraća listu zaposlenih koji pripadaju profilu prijavljenog korisnika.
 *     tags:
 *       - Zaposleni
 *     responses:
 *       200:
 *         description: Lista zaposlenih uspešno vraćena
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID zaposlenog
 *                     example: 1
 *                   firstName:
 *                     type: string
 *                     description: Ime zaposlenog
 *                     example: "Marko"
 *                   lastName:
 *                     type: string
 *                     description: Prezime zaposlenog
 *                     example: "Marković"
 *                   description:
 *                     type: string
 *                     description: Opis zaposlenog
 *                     example: "FRIZER"
 *                   profileId:
 *                     type: integer
 *                     description: ID profila kojem zaposleni pripada
 *                     example: 3
 *       400:
 *         description: Nevalidan user id
 *       401:
 *         description: Korisnik nije prijavljen
 *       404:
 *         description: Profil nije pronađen
 *       500:
 *         description: Server greška
 */









/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Kreira novog zaposlenog
 *     tags:
 *       - Zaposleni
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Marko"
 *               lastName:
 *                 type: string
 *                 example: "Marković"
 *               description:
 *                 type: string
 *                 example: "Frizer"
 *     responses:
 *       200:
 *         description: Zaposleni uspešno kreiran
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 7
 *                 firstName:
 *                   type: string
 *                   example: "Marko"
 *                 lastName:
 *                   type: string
 *                   example: "Marković"
 *                 description:
 *                   type: string
 *                   example: "Frizer"
 *                 profileId:
 *                   type: integer
 *                   example: 3
 *       400:
 *         description: Nevalidan user id ili nedostaju obavezna polja
 *       401:
 *         description: Niste prijavljeni
 *       404:
 *         description: Profil nije pronađen
 *       500:
 *         description: Server greška
 */