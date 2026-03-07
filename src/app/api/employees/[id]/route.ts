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
        { error: "Niste prijavljeni" },
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

    // 1. PRVO obriši availabilities
    await db
      .delete(availabilities)
      .where(eq(availabilities.employeeId, employeeId));

    //  2. Onda obriši employee (samo ako pripada tom profilu)
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