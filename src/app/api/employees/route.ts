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

