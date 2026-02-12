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

// export async function GET() {
//   try {
//     const data = await db
//       .select({
//         profile: profiles,

//         user: {
//           firstName: users.firstName,
//           lastName: users.lastName,
//           phone: users.phone,
//         },

//         serviceCount: sql<number>`COUNT(DISTINCT ${services.id})`,

//         verageRating: sql<number>`
//           COALESCE(ROUND(AVG(${reviews.rating})::numeric, 2), 0)
//         `
//       })
//       .from(profiles)
//       .leftJoin(users, eq(users.id, profiles.userId))
//       .leftJoin(services, eq(services.profileId, profiles.id))
//       .leftJoin(reviews, eq(reviews.serviceId, services.id)) // ← KLJUČNO
//       .groupBy(profiles.id, users.id);

//     return NextResponse.json(data);

//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: String(error) },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   try {
//     const data = await db
//       .select({
//         profile: profiles,

//         user: {
//           firstName: users.firstName,
//           lastName: users.lastName,
//           phone: users.phone,
//         },

//         serviceCount: sql<number>`COUNT(DISTINCT ${services.id})`,

//         averageRating: sql<number>`
//           COALESCE(AVG(${reviews.rating})::float, 0)
//         `,
//       })
//       .from(profiles)
//       .leftJoin(users, eq(users.id, profiles.userId))
//       .leftJoin(services, eq(services.profileId, profiles.id))
//       .leftJoin(reviews, eq(reviews.serviceId, services.id)) // ← OVO JE KLJUČNO
//       .groupBy(profiles.id, users.id);

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("GRESKA:", error);
//     return NextResponse.json(
//       { error: String(error) },
//       { status: 500 }
//     );
//   }
// }
// export async function GET() {
//   try {
//     const allProfiles = await db
//       .select({
//         profile: profiles,
//         user: {
//           firstName: users.firstName,
//           lastName: users.lastName,
//           phone: users.phone,
//         },
//         serviceCount: sql<number>`(
//           SELECT COUNT(*)
//           FROM ${services}
//           WHERE ${services.profileId} = ${profiles.id}
//         )`,
//         reviewCount: sql<number>`(
//           SELECT COUNT(*)
//           FROM ${reviews} r
//           INNER JOIN ${services} s ON r.service_id = s.id
//           WHERE s.profile_id = ${profiles.id}
//         )`,
//         reviewSum: sql<number>`(
//           SELECT COALESCE(SUM(r.rating), 0)
//           FROM ${reviews} r
//           INNER JOIN ${services} s ON r.service_id = s.id
//           WHERE s.profile_id = ${profiles.id}
//         )`,
//         averageRating: sql<number>`(
//           CASE 
//             WHEN (
//               SELECT COUNT(*)
//               FROM ${reviews} r
//               INNER JOIN ${services} s ON r.service_id = s.id
//               WHERE s.profile_id = ${profiles.id}
//             ) = 0 THEN 0
//             ELSE (
//               SELECT SUM(r.rating)::float
//               FROM ${reviews} r
//               INNER JOIN ${services} s ON r.service_id = s.id
//               WHERE s.profile_id = ${profiles.id}
//             ) / (
//               SELECT COUNT(*)
//               FROM ${reviews} r
//               INNER JOIN ${services} s ON r.service_id = s.id
//               WHERE s.profile_id = ${profiles.id}
//             )
//           END
//         )`,
//       })
//       .from(profiles)
//       .innerJoin(users, eq(profiles.userId, users.id));

//     return NextResponse.json(allProfiles);
//   } catch (err) {
//     console.error("Greska prilikom pronalaska profila", err);
//     return NextResponse.json(
//       { error: "Neuspešno pronalazenje profila" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   try {
//     const allProfiles = await db
//       .select({
//         profile: profiles,
//         user: {
//           firstName: users.firstName,
//           lastName: users.lastName,
//           phone: users.phone,
//         },
//         serviceCount: sql<number>`(
//           SELECT COUNT(*)
//           FROM ${services}
//           WHERE ${services.profileId} = ${profiles.id}
//         )`,
//         reviewCount: sql<number>`(
//           SELECT COUNT(*)
//           FROM ${reviews}
//           WHERE ${reviews.userId} = ${profiles.userId}
//         )`,
//         reviewSum: sql<number>`(
//           SELECT COALESCE(SUM(${reviews.rating}), 0)
//           FROM ${reviews}
//           WHERE ${reviews.userId} = ${profiles.userId}
//         )`,
//       })
//       .from(profiles)
//       .innerJoin(users, eq(profiles.userId, users.id));

//     return NextResponse.json(allProfiles);
//   } catch (err) {
//     console.error("Greska prilikom pronalaska profila", err);
//     return NextResponse.json(
//       { error: "Neuspešno pronalazenje profila" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   try {
//     const allProfiles = await db
//       .select({
//         profile: profiles,
//         user: {
//           firstName: users.firstName,
//           lastName: users.lastName,
//           phone: users.phone,
//         },
//         serviceCount: sql<number>`(
//           SELECT COUNT(*)
//           FROM ${services}
//           WHERE ${services.profileId} = ${profiles.id}
//         )`,
//         reviewCount: sql<number>`(
//           SELECT COUNT(*)
//           FROM ${reviews}
//           WHERE ${reviews.userId} = ${profiles.userId}
//         )`,
//         reviewSum: sql<number>`(
//           SELECT COALESCE(SUM(${reviews.rating}), 0)
//           FROM ${reviews}
//           WHERE ${reviews.userId} = ${profiles.userId}
//         )`,
//       })
//       .from(profiles)
//       .innerJoin(users, eq(profiles.userId, users.id));

//     return NextResponse.json(allProfiles);
//   } catch (err) {
//     console.error("Greska prilikom pronalaska profila", err);
//     return NextResponse.json(
//       { error: "Neuspešno pronalazenje profila" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   try {
//     const allProfiles = await db
//       .select({
//         profile: profiles,
//         user: {
//           firstName: users.firstName,
//           lastName: users.lastName,
//           phone: users.phone,
//         },
//         serviceCount: sql<number>`(
//           SELECT COUNT(*)
//           FROM ${services}
//           WHERE ${services.profileId} = ${profiles.id}
//         )`,
//       })
//       .from(profiles)
//       .innerJoin(users, eq(profiles.userId, users.id));

//     return NextResponse.json(allProfiles);
//   } catch (err) {
//     console.error("Greska prilikom pronalaska profila", err);
//     return NextResponse.json(
//       { error: "Neuspešno pronalazenje profila" },
//       { status: 500 }
//     );
//   }
// }
// // GET - svi profili
// export async function GET() {
//   try {
//     const allProfiles = await db
//   .select({
//     profile: profiles,
//     user: {
//       firstName: users.firstName,
//       lastName: users.lastName,
//       phone: users.phone,
//     },
//   })
//   .from(profiles)
//   .innerJoin(users, eq(profiles.userId, users.id));

//     return NextResponse.json(allProfiles);
//   } catch (err) {
//     console.error("Greska prilikom pronalaska profila", err);
//     return NextResponse.json(
//       { error: "Neuspešno pronalazenje profila" },
//       { status: 500 }
//     );
//   }
// }

// POST - kreiranje novog profila
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newProfile = await db.insert(profiles).values(body).returning();
    return NextResponse.json(newProfile[0], { status: 201 });
  } catch (err) {
    console.error("Error creating profile:", err);
    return NextResponse.json(
      { error: "Failed to create profile" },
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
    console.error("Error updating profile:", err);
    return NextResponse.json(
      { error: "Failed to update profile" },
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
    console.error("Error patching profile:", err);
    return NextResponse.json(
      { error: "Failed to patch profile" },
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
    console.error("Error deleting profile:", err);
    return NextResponse.json(
      { error: "Failed to delete profile" },
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
