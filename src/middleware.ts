// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { jwtVerify } from "jose";

// const roleAccess: Record<string, Record<string, string[]>> = {
//   USER: {
//     GET: [
//       "/api/categories",
//       "/api/services",
//       "/api/reviews",
//       "/api/appointments",
//       "/api/profiles",
//       "/api/employees",
//       "/api/availabilities"
//     ],
//     POST: ["/api/appointments", "/api/reviews"],
//     PUT: [],
//     DELETE: [],
//   },
//   FREELANCER: {
//     GET: [
//       "/api/categories",
//       "/api/services",
//       "/api/reviews",
//       "/api/appointments",
//       "/api/profiles",
//       "/api/availabilities",
//       "/api/employees"
//     ],
//     POST: ["/api/services", "/api/availabilities"],
//     PUT: ["/api/services", "/api/availabilities"],
//     DELETE: ["/api/services", "/api/availabilities"],
//   },
//   COMPANY: {
//     GET: [
//       "/api/categories",
//       "/api/services",
//       "/api/employees",
//       "/api/profiles",
//       "/api/reviews",
//       "/api/appointments",
//       "/api/availabilities"
//     ],
//     POST: ["/api/employees", "/api/profiles"],
//     PUT: ["/api/employees", "/api/profiles"],
//     DELETE: ["/api/employees", "/api/profiles"],
//   },
// };

// // Rute koje su javne (bez tokena)
// const publicRoutes = ["/api/categories", "/api/services"];

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // Auth rute su uvek dostupne
//   if (pathname.startsWith("/api/auth")) {
//     return NextResponse.next();
//   }

//   // Public rute su dostupne svima
//   if (publicRoutes.some(route => pathname === route || pathname.startsWith(route + "/"))) {
//     return NextResponse.next();
//   }

//   // Provera tokena
//   const authHeader = req.headers.get("authorization");
//   if (!authHeader) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
//     const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });

//     const role = payload.role as string;
//     const method = req.method; // "GET", "POST", "PUT", "DELETE"
//     const allowedRoutes = roleAccess[role]?.[method] || [];

//     const hasAccess = allowedRoutes.some(
//       (route) => pathname === route || pathname.startsWith(route + "/")
//     );

//     if (!hasAccess) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     return NextResponse.next();
//   } catch (err) {
//     console.error("JWT verification failed:", err);
//     return NextResponse.json({ error: "Invalid token" }, { status: 403 });
//   }
// }

// export const config = {
//   matcher: ["/api/:path*"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE = "auth";

const roleAccess: Record<string, Record<string, string[]>> = {
  USER: {
    GET: [
      "/api/categories",
      "/api/services",
      "/api/reviews",
      "/api/appointments",
      "/api/profiles",
      "/api/employees",
      "/api/availabilities",
    ],
    POST: ["/api/appointments", "/api/reviews"],
    PUT: [],
    DELETE: [],
  },
  FREELANCER: {
    GET: [
      "/api/categories",
      "/api/services",
      "/api/reviews",
      "/api/appointments",
      "/api/profiles",
      "/api/availabilities",
      "/api/employees",
    ],
    POST: ["/api/services", "/api/availabilities"],
    PUT: ["/api/services", "/api/availabilities"],
    DELETE: ["/api/services", "/api/availabilities"],
  },
  COMPANY: {
    GET: [
      "/api/categories",
      "/api/services",
      "/api/employees",
      "/api/profiles",
      "/api/reviews",
      "/api/appointments",
      "/api/availabilities",
    ],
    POST: ["/api/employees", "/api/profiles"],
    PUT: ["/api/employees", "/api/profiles"],
    DELETE: ["/api/employees", "/api/profiles"],
  },
};

// Rute koje su javne (bez tokena)
const publicRoutes = ["/api/categories", "/api/services", "/api/profiles", "/api/reviews"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Auth rute su uvek dostupne
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Public GET rute su dostupne svima
  if (req.method === "GET" && publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Provera tokena iz cookie-a
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });

    const role = payload.role as string;
    const method = req.method; // "GET", "POST", "PUT", "DELETE"
    const allowedRoutes = roleAccess[role]?.[method] || [];

    const hasAccess = allowedRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/")
    );

    if (!hasAccess) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
