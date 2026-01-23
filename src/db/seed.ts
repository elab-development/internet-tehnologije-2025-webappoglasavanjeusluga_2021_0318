import "dotenv/config";
import { db } from "./index";
import { categories, users } from "./schema";

async function seed() {
  console.log("🌱 Seeding started...");

  // prvo obriši stare podatke da ne pravi duplikate
  await db.delete(categories);
  await db.delete(users);

  // ubaci nove kategorije
  await db.insert(categories).values([
    { name: "IT i digitalne usluge", icon: "/icons/computer-settings_2360707.png" },
    { name: "Zanatske i instalaterske usluge", icon: "/icons/mechanic.png" },
    { name: "Obrazovanje i obuke", icon: "/icons/school.png" },
    { name: "Zdravlje i lepota", icon: "/icons/beauty-treatment.png" },
    { name: "Kućni ljubimci", icon: "/icons/paw.png" },
    { name: "Usluga pranja i čišćenja", icon: "/icons/cleaning-products.png" },
    { name: "Auto usluge", icon: "/icons/car-wash.png" },
    { name: "Finansijske i pravne usluge", icon: "/icons/contract-law.png" },
    { name: "Transportne usluge", icon: "/icons/truck.png" },
    { name: "Kreativne i zanatske usluge", icon: "/icons/craft.png" },
    { name: "Dom i građevinski radovi", icon: "/icons/house.png" },
    { name: "Usluge za decu i starije", icon: "/icons/child_13640746.png" },
    { name: "Freelancer usluge", icon: "/icons/activism_18917750.png" },
    { name: "Događaji i Ketering", icon: "/icons/event_12120674.png" },
  ]);

  // ubaci nove korisnike
  await db.insert(users).values([
    {
      email: "petar.petrovic@gmail.com",
      password: "petar123",
      firstName: "Petar",
      lastName: "Petrovic",
      phone: "063245319",
      role: "FREELANCER",
    },
    {
      email: "ana.anic@gmail.com",
      password: "ana123",
      firstName: "Ana",
      lastName: "Anic",
      phone: "062185574",
      role: "USER",
    },
  ]);

  console.log("✅ Seed finished");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
