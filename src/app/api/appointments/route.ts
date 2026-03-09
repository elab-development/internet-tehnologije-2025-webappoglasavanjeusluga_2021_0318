// import { NextResponse } from "next/server";
// import { db } from "@/db";
// import { appointments } from "@/db/schema";
// import { eq } from "drizzle-orm";

// // GET /api/appointments - lista svih termina
// export async function GET() {
//   try {
//     const data = await db.select().from(appointments);
//     return NextResponse.json(data);
//   } catch (err) {
//     console.error("Termini nisu pronadjeni:", err);
//     return NextResponse.json({ error: "Termini nisu pronadjeni" }, { status: 500 });
//   }
// }

// // POST /api/appointments - kreiranje termina
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { date, time, serviceId } = body;

//     if (!date || !time || !serviceId) {
//       return NextResponse.json({ error: "Neko polje nije popunjeno" }, { status: 400 });
//     }

//     const newAppointment = await db.insert(appointments).values({
//       date: new Date(date),
//       time,
//       serviceId,
//       isBooked: true, // označavamo da je termin rezervisan
//     }).returning();

//     return NextResponse.json(newAppointment[0], { status: 201 });
//   } catch (err) {
//     console.error("Greska pri kreiranju termina:", err);
//     return NextResponse.json({ error: "Greska pri kreiranju termina:" }, { status: 500 });
//   }
// }
// // DELETE /api/appointments - brisanje termina
// export async function DELETE(req: Request) {
//   try {
//     const body = await req.json();
//     const { id } = body;

//     if (!id) {
//       return NextResponse.json({ error: "Nedostaje id termina" }, { status: 400 });
//     }

//     const deletedAppointment = await db.delete(appointments).where(eq(appointments.id, id)).returning();

//     if (!deletedAppointment[0]) {
//       return NextResponse.json({ error: "Termin nije pronadjen" }, { status: 404 });
//     }

//     return NextResponse.json(deletedAppointment[0], { status: 200 });
//   } catch (err) {
//     console.error("Greska pri brisanju termina:", err);
//     return NextResponse.json({ error: "Greska pri brisanju termina:" }, { status: 500 });
//   }
// }
