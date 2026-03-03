import { NextResponse } from "next/server";
import { db } from "@/db";
import { profiles, users, services, reviews } from "@/db/schema";
import { eq, sql} from "drizzle-orm";

// GET - svi profili
export async function GET() {
  try {
    const data = await db
      .select({
        //profile: profiles,
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
      .groupBy(profiles.id, users.id);

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
   return NextResponse.json(
      { error: "Neuspesno pronalazenje profila" },
      { status: 500 }
    );
  }
}

// POST - kreiranje novog profila
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newProfile = await db.insert(profiles).values(body).returning();
    return NextResponse.json(newProfile[0], { status: 201 });
  } catch (err) {
    console.error("Neuspesno kreiranje profila:", err);
    return NextResponse.json(
      { error: "Neuspesno kreiranje profila" },
      { status: 500 }
    );
  }
}

// PUT - zamena celog profila
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const profileId = Number(body.id);

    const updated = await db
      .update(profiles)
      .set(body)
      .where(eq(profiles.id, profileId))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (err) {
    console.error("Neuspesno azuriranje profila:", err);
    return NextResponse.json(
      { error: "Neuspesno azuriranje profila" },
      { status: 500 }
    );
  }
}

// PATCH - delimična izmena profila
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const profileId = Number(body.id);

    const updated = await db
      .update(profiles)
      .set(body)
      .where(eq(profiles.id, profileId))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (err) {
    console.error("Neuspesna izmena profila:", err);
    return NextResponse.json(
      { error: "Neuspesna izmena profila" },
      { status: 500 }
    );
  }
}

// DELETE - brisanje profila
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const profileId = Number(body.id);

    await db.delete(profiles).where(eq(profiles.id, profileId));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Neuspesno brisanje profila:", err);
    return NextResponse.json(
      { error: "Neuspesno brisanje profila" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import { db } from "@/db";
// import { profiles, services, reviews } from "@/db/schema";
// import { eq, sql } from "drizzle-orm";

// //dodati funkciju POST    !!!!!!!!!!!!!!!!!!!!!!! 

// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const profileId = Number(params.id);

//     // 1. Učitaj profil
//     const profile = await db
//       .select()
//       .from(profiles)
//       .where(eq(profiles.id, profileId));

//     if (!profile[0]) {
//       return NextResponse.json({ error: "Profile not found" }, { status: 404 });
//     }

//     // 2. Broj usluga
//     const servicesCount = await db
//       .select({ count: sql<number>`count(*)` })
//       .from(services)
//       .where(eq(services.profileId, profileId));

//     // 3. Prosečna ocena
//     const avgRating = await db
//       .select({ avg: sql<number>`coalesce(avg(rating),0)` })
//       .from(reviews)
//       .where(
//         sql`reviews.service_id IN (SELECT id FROM services WHERE profile_id = ${profileId})`
//       );

//     // 4. Verified logika
//     const verified =
//       Number(avgRating[0]?.avg ?? 0) > 4.5 &&
//       Number(servicesCount[0]?.count ?? 0) > 7;

//     // 5. Vrati JSON
//     return NextResponse.json({
//       ...profile[0],
//       servicesCount: Number(servicesCount[0]?.count ?? 0),
//       averageRating: Number(avgRating[0]?.avg ?? 0),
//       verified,
//     });
//   } catch (err) {
//     console.error("Error fetching profile details:", err);
//     return NextResponse.json(
//       { error: "Failed to fetch profile details" },
//       { status: 500 }
//     );
//   }
// }
