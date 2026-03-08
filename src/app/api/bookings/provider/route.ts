// // /api/bookings/route.ts
// import { NextResponse } from "next/server";
// import { db } from "@/db";
// import { bookings, services, employees, users } from "@/db/schema";
// import { eq, desc } from "drizzle-orm";

// interface RequestBody {
//   providerId: number;
// }

// export async function POST(req: Request) {
//   try {
//     const body: RequestBody = await req.json();

//     if (!body.providerId) {
//       return NextResponse.json([], { status: 400 });
//     }

//     // Query za sve rezervacije za datog providera
//     const result = await db
//       .select({
//         id: bookings.id,
//         reservedDate: bookings.reservedDate,
//         createdAt: bookings.createdAt,
//         time: bookings.time,
//         finished: bookings.finished,

//         service: {
//           id: services.id,
//           title: services.title,
//         },

//         employee: {
//           id: employees.id,
//           firstName: employees.firstName,
//           lastName: employees.lastName,
//         },

//         user: {
//           id: users.id,
//           firstName: users.firstName,
//           lastName: users.lastName,
//         },
//       })
//       .from(bookings)
//       .innerJoin(services, eq(bookings.serviceId, services.id))
//       .leftJoin(users, eq(bookings.userId, users.id))
//       .leftJoin(employees, eq(bookings.employeeId, employees.id))
//       .where(eq(services.userId, body.providerId))
//       .orderBy(desc(bookings.createdAt));

//     return NextResponse.json(result);
//   } catch (error) {
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }