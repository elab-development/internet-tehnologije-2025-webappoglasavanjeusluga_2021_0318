import "dotenv/config";
import { db } from "./index";
import { categories, users } from "./schema";

async function check() {
  const allCategories = await db.select().from(categories);
  const allUsers = await db.select().from(users);

  console.log("📂 Kategorije:");
  console.table(allCategories);

  console.log("👤 Korisnici:");
  console.table(allUsers);
}

check().catch((e) => {
  console.error("Greška pri proveri:", e);
});
