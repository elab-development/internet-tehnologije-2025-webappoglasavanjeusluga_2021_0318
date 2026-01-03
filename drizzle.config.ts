import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/schema", // ovde ćeš kasnije dodati modele
  out: "./drizzle",       // ovde će migracije biti smeštene
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://admin:admin123@localhost:5432/mvp_app",
  },
});
