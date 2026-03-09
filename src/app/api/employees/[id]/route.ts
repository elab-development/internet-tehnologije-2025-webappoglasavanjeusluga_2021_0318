import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { employees, profiles, availabilities } from "@/db/schema";
import { AUTH_COOKIE, verifyAuthToken } from "@/lib/auth";


export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const employeeId = Number(id);

    if (!employeeId) {
      return NextResponse.json(
        { error: "Nevalidan ID" },
        { status: 400 }
      );
    }

    const token = (await cookies()).get(AUTH_COOKIE)?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Korisnik nije prijavljen" },
        { status: 401 }
      );
    }

    const user = verifyAuthToken(token);
    const userId = Number(user.sub);

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profil nije pronađen" },
        { status: 404 }
      );
    }

    // 1. PRVO obrisi availabilities
    await db
      .delete(availabilities)
      .where(eq(availabilities.employeeId, employeeId));

    //  2. Onda obrisi employee (samo ako pripada tom profilu)
    const deleted = await db
      .delete(employees)
      .where(
        and(
          eq(employees.id, employeeId),
          eq(employees.profileId, profile.id)
        )
      )
      .returning();

    if (!deleted.length) {
      return NextResponse.json(
        { error: "Zaposleni nije pronađen" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Brisanje neuspešno:", err);
    return NextResponse.json(
      { error: "Server greška" },
      { status: 500 }
    );
  }
}



/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: Briše zaposlenog
 *     description: Omogućava vlasniku profila da obriše zaposlenog po ID-ju. Takođe briše sve dostupnosti zaposlenog.
 *     tags:
 *       - Zaposleni
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID zaposlenog koji se briše
 *     responses:
 *       200:
 *         description: Zaposleni uspešno obrisan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Nevalidan ID
 *       401:
 *         description: Korisnik nije prijavljen
 *       404:
 *         description: Profil nije pronađen ili zaposleni nije pronađen
 *       500:
 *         description: Server greška
 */