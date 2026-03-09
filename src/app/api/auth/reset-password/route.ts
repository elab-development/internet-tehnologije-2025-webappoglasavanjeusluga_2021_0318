// import { NextResponse } from "next/server";
// import { db } from "@/db";
// import { users } from "@/db/schema";
// import { eq } from "drizzle-orm";
// import { jwtVerify } from "jose";
// import bcrypt from "bcryptjs";

// interface AuthPayload {
//   id: number;
//   role: string;
//   action?: string;
// }

// export async function POST(req: Request) {
//   try {
//     const { token, newPassword } = await req.json();

//     if (!token || !newPassword) {
//       return NextResponse.json(
//         { error: "Nedostaje token ili lozinka" },
//         { status: 400 }
//       );
//     }

//     // 1. Proveri token
//     const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
//     const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });

//     // Cast preko unknown - AuthPayload
//     const typedPayload = payload as unknown as AuthPayload;

//     if (typedPayload.action !== "reset") {
//       return NextResponse.json({ error: "Nespravan token" }, { status: 403 });
//     }

//     // 2. Hashuj novu lozinku
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // 3. Ažuriraj korisnika
//     await db
//       .update(users)
//       .set({ password: hashedPassword })
//       .where(eq(users.id, Number(typedPayload.id)));

//     return NextResponse.json(
//       { message: "Uspesno postavljanje lozinke" },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("Neuspesno resetovanje lozinke", err);
//     return NextResponse.json(
//       { error: "Neuspesno resetovanje lozinke" },
//       { status: 500 }
//     );
//   }
// }
