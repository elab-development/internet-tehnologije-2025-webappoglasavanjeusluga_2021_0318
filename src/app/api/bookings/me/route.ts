import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { bookings, services, users, employees, profiles } from "@/db/schema";

export const runtime = "nodejs";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET() {
  try {
    // Token iz cookie-ja
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Niste prijavljeni" },
        { status: 401 }
      );
    }

    //  Verifikacija tokena
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userId = Number(payload.sub);

    if (!userId) {
      return NextResponse.json(
        { error: "Nevalidan token" },
        { status: 401 }
      );
    }

    //  Pronađi profil tog usera
    const [profile] = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.userId, userId));

    if (!profile) {
      return NextResponse.json(
        { error: "Profil ne postoji" },
        { status: 404 }
      );
    }

    //  Uzmi sve rezervacije vezane za usluge tog profila
    const result = await db
      .select({
        id: bookings.id,
        reservedDate: bookings.reservedDate,
        createdAt: bookings.createdAt,
        time: bookings.time,
        finished: bookings.finished,

        service: {
          id: services.id,
          title: services.title,
        },

        employee: {
          id: employees.id,
          firstName: employees.firstName,
          lastName: employees.lastName,
        },

        user: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          phone: users.phone,
        },
      })
      .from(bookings)
      .innerJoin(services, eq(bookings.serviceId, services.id))
      .leftJoin(users, eq(bookings.userId, users.id))
      .leftJoin(employees, eq(bookings.employeeId, employees.id))
      .where(eq(services.profileId, profile.id)) 
      .orderBy(desc(bookings.createdAt));

    return NextResponse.json(result);

  } catch (error) {

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}