import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  numeric,
  pgEnum,
} from "drizzle-orm/pg-core";

/* =======================
   ENUMS
======================= */

export const roleEnum = pgEnum("role", [
  "USER",
  "FREELANCER",
  "COMPANY",
]);

/* =======================
   USERS
======================= */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  role: roleEnum("role").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

/* =======================
   CATEGORIES
======================= */
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon"),
});

/* =======================
   PROFILES (company + freelancer)
======================= */
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  description: text("description"),
  image: text("image"),
  averageRating: numeric("average_rating"),
  companyName: text("company_name"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
});

/* =======================
   SERVICES
======================= */
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  createdAt: timestamp("created_at").defaultNow(),

  categoryId: integer("category_id")
    .references(() => categories.id)
    .notNull(),

  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),

  profileId: integer("profile_id")
    .references(() => profiles.id)
    .notNull(),
});

/* =======================
   REVIEWS
======================= */
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),

  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),

  serviceId: integer("service_id")
    .references(() => services.id)
    .notNull(),
});

/* =======================
   APPOINTMENTS
======================= */
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  date: timestamp("date").notNull(),
  time: text("time").notNull(),
  isBooked: boolean("is_booked").default(false),

  serviceId: integer("service_id")
    .references(() => services.id)
    .notNull(),
});

/* =======================
   EMPLOYEES
======================= */
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  description: text("description"),

  profileId: integer("profile_id")
    .references(() => profiles.id)
    .notNull(),
});

/* =======================
   AVAILABILITIES
======================= */
export const availabilities = pgTable("availabilities", {
  id: serial("id").primaryKey(),
  note: text("note"),

  employeeId: integer("employee_id")
    .references(() => employees.id)
    .notNull(),

  appointmentId: integer("appointment_id")
    .references(() => appointments.id)
    .notNull(),
});
