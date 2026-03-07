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
      return NextResponse.json({ error: "Niste prijavljeni" }, { status: 401 });
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
        { error: "Ime i prezime su obavezni" },
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
    console.error("CREATE EMPLOYEE ERROR:", err);
    return NextResponse.json({ error: "Server greška" }, { status: 500 });
  }
}




// PATCH /api/employees - izmena zaposlenog
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, firstName, lastName, description } = body;

    if (!id) {
      return NextResponse.json({ error: "Nedostaje id zaposlenog" }, { status: 400 });
    }

    const updatedEmployee = await db.update(employees)
      .set({
        firstName,
        lastName,
        description,
      })
      .where(eq(employees.id, id))
      .returning();

    if (!updatedEmployee[0]) {
      return NextResponse.json({ error: "Zaposleni nije pronadjen" }, { status: 404 });
    }

    return NextResponse.json(updatedEmployee[0], { status: 200 });
  } catch (err) {
    console.error("Azuriranje zaposlenog neuspesno:", err);
    return NextResponse.json({ error: "Azuriranje zaposlenog neuspesno" }, { status: 500 });
  }
}
// DELETE /api/employees - brisanje zaposlenog
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Nedostaje id zaposlenog" }, { status: 400 });
    }

    const deletedEmployee = await db.delete(employees)
      .where(eq(employees.id, id))
      .returning();

    if (!deletedEmployee[0]) {
      return NextResponse.json({ error: "Zaposleni nije pronadjen" }, { status: 404 });
    }

    return NextResponse.json(deletedEmployee[0], { status: 200 });
  } catch (err) {
    console.error("Brisanje zaposlenog neuspesno:", err);
    return NextResponse.json({ error: "Brisanje zaposlenog neuspesno" }, { status: 500 });
  }
}

