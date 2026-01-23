import "dotenv/config";
import { db } from "./index";
import { categories, users } from "./schema";
import { profiles } from "./schema";
import { sql } from "drizzle-orm"; // na vrhu fajla


async function seed() {
  console.log("🌱 Seeding started...");

  // prvo obriši stare podatke da ne pravi duplikate
   // obriši stare profile (poželjno pre brisanja users zbog FK)
  await db.delete(profiles);
  await db.delete(users);
  await db.execute(sql`ALTER SEQUENCE users_id_seq RESTART WITH 1`);
  await db.delete(categories);

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
        role: "FREELANCER" }, 
        
    { 
        email: "ana.anic@gmail.com", 
            password: "ana123", 
            firstName: "Ana", 
            lastName: "Anic", 
            phone: "062185574", 
            role: "USER" }, 
            
    { 
        email: "milan.milanovic@gmail.com", 
        password: "milan123", 
        firstName: "Milan", 
        lastName: "Milanovic", 
        phone: "064758446", 
        role: "USER" 
    }, 

    { 
        email: "stevan.stevanovic@gmail.com", 
        password: "stevan123", 
        firstName: "Stevan", 
        lastName: "Stevanovic",
        phone: "062659423", 
        role: "FREELANCER" 
    }, 
    
    { 
        email: "bellabeautysalon@gmail.com", 
        password: "marija123", 
        firstName: "Marija", 
        lastName: "Maric", 
        phone: "065674259", 
        role: "COMPANY" 
    }, 
    { 
        email: "beogradroyal@gmail.com", 
        password: "jovan123", 
        firstName: "Jovan", 
        lastName: "Jovanovic", 
        phone: "063258963", 
        role: "COMPANY" 
    }, 
    {
         email: "techsolutions@gmail.com", 
         password: "ana123", 
         firstName: "Ana", 
         lastName: "Marković", 
         phone: "062112233", 
         role: "COMPANY" 
        }, 
    { 
         email: "fitlifegym@gmail.com", 
         password: "petar123", 
         firstName: "Petar", 
         lastName: "Simić", 
         phone: "063445566", 
         role: "COMPANY" 
        }, 

    { 
        email: "creativeagency@gmail.com", 
        password: "milica123", 
        firstName: "Milica", 
        lastName: "Kovačević", 
        phone: "064998877", 
        role: "COMPANY" 
    }, 

    { 
        email: "marija.stojanovic@gmail.com", 
        password: "marija123", 
        firstName: "Marija", 
        lastName: "Stojanović", 
        phone: "0623344559", 
        role: "FREELANCER" 
    }, 
    
    { 
        email: "vladimir.pavlovic@gmail.com", 
        password: "vladimir123", 
        firstName: "Vladimir", 
        lastName: "Pavlović", 
        phone: "0656677881", 
        role: "FREELANCER" 
    }, 
    
    { 
        email: "marko.jovanovic@gmail.com", 
        password: "marko123", 
        firstName: "Marko", 
        lastName: "Jovanović", 
        phone: "0645566778", 
        role: "FREELANCER" 
    }, 

    { 
        email: "itoptimus@gmail.com", 
        password: "nikola23", 
        firstName: "Nikola", 
        lastName: "Petrović", 
        phone: "063445566", 
        role: "COMPANY" 
    },

    { 
        email: "sapapansion@gmail.com", 
        password: "ana123",
        firstName: "Ana", 
        lastName: "Milovanović", 
        phone: "0647788990",
        role: "COMPANY" }, 
        
    { 
        email: "jelena.markovic@gmail.com", 
        password: "jelena123", 
        firstName: "Jelena", 
        lastName: "Marković", 
        phone: "0634455667",
         role: "FREELANCER" },

    { 
        email: "gonzalestransport@gmail.com", 
        password: "zoran123", 
        firstName: "Zoran", 
        lastName: "Lekić", 
        phone: "0653344556", 
        role: "COMPANY" 
    },

    { 
        email: "marko.petrovic@gmail.com", 
        password: "marko123", 
        firstName: "Marko", 
        lastName: "Petrović", 
        phone: "0661122334",
         role: "FREELANCER" 
        }, ]);
   

  // pripremi podatke sa eksplicitnim tipom (numeric -> string)
  const profileData: typeof profiles.$inferInsert[] = [
    {
      city: "Niš",
      address: "Kumanovska 8",
      description: "Profesor i freelance instruktor za arhitektonske softvere...",
      image: "/images/freelancer-architecture.jpg",
      averageRating: "4.6",   // numeric -> string u Drizzle
      firstName: "Petar",
      lastName: "Petrović",
      companyName: null,
      userId: 1,              // Petar (FREELANCER)
    },
    {
      city: "Beograd",
      address: "Bulevar oslobodjenja 86",
      description: "Iskusni tehničar za računare i IT podršku...",
      image: "/images/freelancer-it.jpg",
      averageRating: "4.8",
      firstName: "Stevan",
      lastName: "Stevanović",
      companyName: null,
      userId: 4,              // Stevan (FREELANCER)
    },
    {
      city: "Novi Sad",
      address: "Ustanička 22",
      description: "Salon lepote Bella pruža vrhunske kozmetičke i estetske usluge...",
      image: "/images/beauty-salon.jpg",
      averageRating: "4.9",
      firstName: null,
      lastName: null,
      companyName: "Bella Beauty Salon",
      userId: 5,              // Marija (COMPANY)
    },
    {
      city: "Beograd",
      address: "Bulevar Kralja Aleksandra 153",
      description: "Auto servis Beograd Royal je najopremljeniji i najmoderniji servisni centar...",
      image: "/images/car-service.jpg",
      averageRating: "4.7",
      firstName: null,
      lastName: null,
      companyName: "Beograd Royal",
      userId: 6,              // Jovan (COMPANY)
    },
  ];//

  await db.insert(profiles).values(profileData);


  console.log("✅ Seed finished");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
