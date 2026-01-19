import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const korisnik = pgTable("korisnik", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  lozinka: text("lozinka").notNull(),
  ime: text("ime").notNull(),
  prezime: text("prezime").notNull(),
  kreiran: timestamp("kreiran").defaultNow(),
});
