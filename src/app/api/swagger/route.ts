import { NextResponse } from "next/server";
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API specifikacija - Usluge",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:3000" }]
  },
  apis: ["./src/app/api/**/*.ts"],
};

export async function GET() {
  const spec = swaggerJSDoc(options);
  return NextResponse.json(spec);
}