import { db } from "./index";
import { users, profiles, categories, services, reviews, appointments, employees, availabilities } from "./schema";

async function check() {
  const allUsers = await db.select().from(users);
  console.table(allUsers);

  const allProfiles = await db.select().from(profiles);
  console.table(allProfiles);

  const allCategories = await db.select().from(categories);
  console.table(allCategories);

  const allServices = await db.select().from(services);
  console.table(allServices);

  const allReviews = await db.select().from(reviews);
  console.table(allReviews);

  const allAppointments = await db.select().from(appointments);
  console.table(allAppointments);

  const allEmployees = await db.select().from(employees);
  console.table(allEmployees);

  const allAvailabilities = await db.select().from(availabilities);
  console.table(allAvailabilities);

  // broj redova u svakoj tabeli
  console.log("Users count:", allUsers.length);
  console.log("Profiles count:", allProfiles.length);
  console.log("Categories count:", allCategories.length);
  console.log("Services count:", allServices.length);
  console.log("Reviews count:", allReviews.length);
  console.log("Appointments count:", allAppointments.length);
  console.log("Employees count:", allEmployees.length);
  console.log("Availabilities count:", allAvailabilities.length);

  process.exit(0);
}

check();
