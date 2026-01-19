import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",   // putanja do tvog schema fajla
  out: "./drizzle",               // folder gde će generisati migracije
  dialect: "postgresql",          // OVO je ispravno, ne "driver"
  dbCredentials: {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "postgres",
    database: "usluge"
  }
});
