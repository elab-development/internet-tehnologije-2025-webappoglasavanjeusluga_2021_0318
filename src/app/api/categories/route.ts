import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories } from "@/db/schema";

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Vraća listu svih kategorija
 *     description: Preuzima sve kategorije iz baze podataka.
 *     tags:
 *       - Kategorije
 *     responses:
 *       200:
 *         description: Uspešno vraćena lista kategorija
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   icon:
 *                     type: string
 *       500:
 *         description: Greška na serveru. Neuspesno pronalazenje kategorija.
 */


export async function GET() {
  try {
    const data = await db.select().from(categories);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Greška na serveru. Neuspesno pronalazenje kategorija." },
      { status: 500 }
    );
  }
}
