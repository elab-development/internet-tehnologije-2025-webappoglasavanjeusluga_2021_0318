import "dotenv/config";
import { db } from "./index";
import { categories, users } from "./schema";
import { profiles } from "./schema";
import { services } from "./schema";
import { reviews } from "./schema";
import { appointments } from "./schema";
import { sql } from "drizzle-orm"; // na vrhu fajla 


async function seed() {
  console.log("🌱 Seeding started...");

  // prvo obriši stare podatke da ne pravi duplikate
   // obriši stare profile (poželjno pre brisanja users zbog FK)
// prvo obriši zavisne tabele da ne pravi duplikate
await db.delete(reviews);
await db.execute(sql`ALTER SEQUENCE reviews_id_seq RESTART WITH 1`);

await db.delete(appointments);
await db.execute(sql`ALTER SEQUENCE appointments_id_seq RESTART WITH 1`);

await db.delete(services);
await db.execute(sql`ALTER SEQUENCE services_id_seq RESTART WITH 1`);

await db.delete(profiles);
await db.execute(sql`ALTER SEQUENCE profiles_id_seq RESTART WITH 1`);

await db.delete(users);
await db.execute(sql`ALTER SEQUENCE users_id_seq RESTART WITH 1`);

await db.delete(categories);
await db.execute(sql`ALTER SEQUENCE categories_id_seq RESTART WITH 1`);


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
  // Freelanceri
  {
    city: "Niš",
    address: "Kumanovska 8",
    description: "Profesor i freelance instruktor za arhitektonske softvere sa više od 10 godina iskustva...",
    image: "/images/freelancer-architecture.jpg",
    averageRating: "4.6",
    firstName: "Petar",
    lastName: "Petrović",
    companyName: null,
    userId: 1, // Petar (FREELANCER)
  },
  {
    city: "Beograd",
    address: "Bulevar oslobodjenja 86",
    description: "Iskusni tehničar za računare i IT podršku, specijalizovan za popravku hardvera i softvera...",
    image: "/images/freelancer-it.jpg",
    averageRating: "4.8",
    firstName: "Stevan",
    lastName: "Stevanović",
    companyName: null,
    userId: 4, // Stevan (FREELANCER)
  },
  {
    city: "Pančevo",
    address: "Cara Lazara 44",
    description: "Profesionalna radnica za čišćenje stanova i poslovnih prostora...",
    image: "/images/freelancer-cleaning.jpg",
    averageRating: "4.6",
    firstName: "Marija",
    lastName: "Stojanović",
    companyName: null,
    userId: 10, // Marija (FREELANCER)
  },
  {
    city: "Čačak",
    address: "Industrijska zona bb",
    description: "Auto-mehaničar specijalizovan za brze intervencije i redovno održavanje vozila...",
    image: "/images/freelancer-auto.jpg",
    averageRating: "4.5",
    firstName: "Vladimir",
    lastName: "Pavlović",
    companyName: null,
    userId: 11, // Vladimir (FREELANCER)
  },
  {
    city: "Novi Sad",
    address: "Bulevar Evrope 92",
    description: "Samostalni serviser klima uređaja sa višegodišnjim iskustvom...",
    image: "/images/freelancer-ac-service.jpg",
    averageRating: "4.7",
    firstName: "Marko",
    lastName: "Jovanović",
    companyName: null,
    userId: 12, // Marko (FREELANCER)
  },
  {
    city: "Beograd",
    address: "Nemanjina 15",
    description: "Samostalni pravnik sa iskustvom u pružanju pravnih usluga...",
    image: "/images/freelancer-lawyer.jpg",
    averageRating: "4.6",
    firstName: "Jelena",
    lastName: "Marković",
    companyName: null,
    userId: 15, // Jelena (FREELANCER)
  },
  {
    city: "Novi Sad",
    address: "Bulevar Oslobođenja 22",
    description: "Iskusni moler sa više od 10 godina rada na unutrašnjem i spoljašnjem farbanju...",
    image: "/images/freelancer-painter.jpg",
    averageRating: "4.7",
    firstName: "Marko",
    lastName: "Petrović",
    companyName: null,
    userId: 17, // Marko (FREELANCER)
  },

  // Kompanije
  {
    city: "Novi Sad",
    address: "Ustanička 22",
    description: "Salon lepote Bella pruža vrhunske kozmetičke i estetske usluge...",
    image: "/images/beauty-salon.jpg",
    averageRating: "4.9",
    firstName: null,
    lastName: null,
    companyName: "Bella Beauty Salon",
    userId: 5, // Marija (COMPANY)
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
    userId: 6, // Jovan (COMPANY)
  },
  {
    city: "Beograd",
    address: "Kralja Petra 45",
    description: "Tech Solutions je IT kompanija koja pruža profesionalne usluge web i softverskog razvoja...",
    image: "/images/tech-solutions.jpg",
    averageRating: "4.7",
    firstName: null,
    lastName: null,
    companyName: "Tech Solutions",
    userId: 7, // Ana (COMPANY)
  },
  {
    city: "Niš",
    address: "Pop Lukina 10",
    description: "FitLife Gym je moderna teretana koja nudi personalizovane trening programe...",
    image: "/images/fitlife-gym.jpg",
    averageRating: "4.8",
    firstName: null,
    lastName: null,
    companyName: "FitLife Gym",
    userId: 8, // Petar (COMPANY)
  },
  {
    city: "Subotica",
    address: "Bajska 18",
    description: "Creative Agency pruža profesionalne usluge grafičkog dizajna, brendiranja i marketinga...",
    image: "/images/creative-agency.jpg",
    averageRating: "4.6",
    firstName: null,
    lastName: null,
    companyName: "Creative Agency",
    userId: 9, // Milica (COMPANY)
  },
  {
    city: "Novi Sad",
    address: "Futoška 102",
    description: "IT Optimus je specijalizovana kompanija za optimizaciju i održavanje IT sistema...",
    image: "/images/it-optimization.jpg",
    averageRating: "4.7",
    firstName: null,
    lastName: null,
    companyName: "IT Optimus",
    userId: 13, // Nikola (COMPANY)
  },
  {
    city: "Sremska Mitrovica",
    address: "Fruškogorska 12",
    description: "Pansion za pse smešten u mirnom okruženju sa velikim dvorištem...",
    image: "/images/dog-hotel.jpg",
    averageRating: "4.8",
    firstName: null,
    lastName: null,
    companyName: "Sapa Pansion",
    userId: 14, // Ana (COMPANY)
  },
  {
    city: "Beograd",
    address: "Bulevar Kralja Aleksandra 45",
    description: "Preduzeće specijalizovano za transportne usluge, uključujući dostavu paketa i selidbe...",
    image: "/images/transport-services.jpg",
    averageRating: "4.7",
    firstName: null,
    lastName: null,
    companyName: "Gonzales Transport",
    userId: 16, // Zoran (COMPANY)
  },
];

const insertedProfiles = await db.insert(profiles).values(profileData).returning({
  id: profiles.id,
  userId: profiles.userId,
});
const profileMap = Object.fromEntries(
  insertedProfiles.map((p) => [p.userId, p.id])
);


const servicesData: typeof services.$inferInsert[] = [
  {
    title: "Servis klime",
    description: "Redovni godišnji servis klima uređaja...",
    price: 7000,
    createdAt: new Date("2025-12-01"),
    categoryId: 2,   // Zanatske i instalaterske usluge
    userId: 12,      // Marko Jovanović (FREELANCER)
    profileId: profileMap[12],
  },
  {
    title: "Čišćenje i popravka komponenti računara",
    description: "Profesionalno čišćenje i popravku kompjuterskih delova...",
    price: 5000,
    createdAt: new Date("2026-01-11"),
    categoryId: 1,   // IT i digitalne usluge
    userId: 4,       // Stevan (FREELANCER)
    profileId: profileMap[4],
  },
  {
    title: "Žensko šišanje - sve dužine kose",
    description: "Lepa i zdrava kosa najlepši je „nakit“ na ženi...",
    price: 1700,
    createdAt: new Date("2025-12-20"),
    categoryId: 4,   // Zdravlje i lepota
    userId: 5,       // Bella Beauty Salon
    profileId: profileMap[5],
  },
  {
    title: "Manikir + lakiranje noktiju",
    description: "Profesionalni manikir za negovane ruke...",
    price: 2000,
    createdAt: new Date("2025-12-01"),
    categoryId: 4,
    userId: 5,
    profileId: profileMap[5],
  },
  {
    title: "Optimizacija Operativnog Sistema | Rešavanje Problema sa Hlađenjem",
    description: "Vaš računar je usporen, pregreva se ili bučno radi...",
    price: 8000,
    createdAt: new Date("2026-01-11"),
    categoryId: 1,
    userId: 4,
    profileId: profileMap[4],
  },
  {
    title: "Kurs REVIT-a za arhitekte",
    description: "Predavač je Autodesk Certifikovani Instruktor...",
    price: 52000,
    createdAt: new Date("2026-01-08"),
    categoryId: 3,   // Obrazovanje i obuke
    userId: 1,       // Petar (FREELANCER)
    profileId: profileMap[1],
  },
  {
    title: "Pansion za pse - jednonedeljni boravak",
    description: "Dobrodošli u Pansion za pse...",
    price: 8000,
    createdAt: new Date("2025-12-10"),
    categoryId: 5,   // Kućni ljubimci
    userId: 14,      // Ana (COMPANY)
    profileId: profileMap[14],
  },
  {
    title: "Generalno čišćenje stanova",
    description: "Detaljno čišćenje stanova i kuća...",
    price: 6000,
    createdAt: new Date("2025-08-20"),
    categoryId: 6,   // Usluga pranja i čišćenja
    userId: 10,      // Marija (FREELANCER)
    profileId: profileMap[10],
  },
  {
    title: "Mali servis vozila",
    description: "Zamena ulja i filtera uz osnovnu dijagnostiku...",
    price: 5500,
    createdAt: new Date("2026-01-11"),
    categoryId: 7,   // Auto usluge
    userId: 11,      // Vladimir (FREELANCER)
    profileId: profileMap[11],
  },
  {
    title: "Relaks masaža celog tela",
    description: "Profesionalna relaks masaža koja pomaže u smanjenju stresa...",
    price: 4500,
    createdAt: new Date("2025-12-12"),
    categoryId: 4,
    userId: 5,
    profileId: profileMap[5],
  },
  {
    title: "Pravno savetovanje",
    description: "Stručno pravno savetovanje za fizička i pravna lica...",
    price: 7000,
    createdAt: new Date("2025-06-20"),
    categoryId: 8,   // Finansijske i pravne usluge
    userId: 15,      // Jelena (FREELANCER)
    profileId: profileMap[15],
  },
  {
    title: "Kombi prevoz stvari",
    description: "Pouzdana usluga kombi prevoza za selidbe i transport robe...",
    price: 9000,
    createdAt: new Date("2025-06-18"),
    categoryId: 9,   // Transportne usluge
    userId: 16,      // Zoran (COMPANY)
    profileId: profileMap[16],
  },
  {
    title: "Krečenje stanova",
    description: "Profesionalno krečenje stanova i kuća...",
    price: 12000,
    createdAt: new Date("2025-06-25"),
    categoryId: 11,  // Dom i građevinski radovi
    userId: 17,      // Marko (FREELANCER)
    profileId: profileMap[17],
  },
  {
    title: "Ketering za proslave",
    description: "Organizacija keteringa za rođendane, svadbe i poslovne događaje...",
    price: 25000,
    createdAt: new Date("2025-06-15"),
    categoryId: 14,  // Događaji i Ketering
    userId: 17,
    profileId: profileMap[17],
  },
  {
    title: "Muško šišanje",
    description: "Profesionalno šišanje prilagođeno vašem stilu i tipu kose...",
    price: 1700,
    createdAt: new Date("2025-12-20"),
    categoryId: 4,
    userId: 5,
    profileId: profileMap[5],
  },
];

await db.insert(services).values(servicesData);

// ubaci reviews
const reviewsData: typeof reviews.$inferInsert[] = [
  {
    rating: 5,
    comment: "Odlična usluga, sve preporuke!",
    createdAt: new Date("2025-12-15"),
    userId: 2, // Ana (USER)
    serviceId: 1, // Servis klime
  },
  {
    rating: 4,
    comment: "Brzo i kvalitetno, ali malo skuplje.",
    createdAt: new Date("2025-12-20"),
    userId: 3, // Milan (USER)
    serviceId: 2, // Čišćenje i popravka komponenti računara
  },
  {
    rating: 5,
    comment: "Najbolji salon u gradu!",
    createdAt: new Date("2025-12-22"),
    userId: 2,
    serviceId: 3, // Žensko šišanje
  },
  {
    rating: 5,
    comment: "Manikir je bio savršen!",
    createdAt: new Date("2025-12-23"),
    userId: 3,
    serviceId: 4, // Manikir
  },
  {
    rating: 4,
    comment: "Kurs je odličan, predavač stručan.",
    createdAt: new Date("2026-01-10"),
    userId: 2,
    serviceId: 6, // Kurs REVIT-a
  },
  {
    rating: 5,
    comment: "Pansion za pse je fantastičan, moj pas je bio srećan!",
    createdAt: new Date("2025-12-12"),
    userId: 3,
    serviceId: 7, // Pansion za pse
  },
  {
    rating: 5,
    comment: "Stan je blistao posle čišćenja!",
    createdAt: new Date("2025-08-22"),
    userId: 2,
    serviceId: 8, // Generalno čišćenje
  },
  {
    rating: 4,
    comment: "Servis vozila urađen korektno.",
    createdAt: new Date("2026-01-12"),
    userId: 3,
    serviceId: 9, // Mali servis vozila
  },
  {
    rating: 5,
    comment: "Masaža je bila fantastična!",
    createdAt: new Date("2025-12-13"),
    userId: 2,
    serviceId: 10, // Relaks masaža
  },
  {
    rating: 5,
    comment: "Pravni savet mi je mnogo pomogao.",
    createdAt: new Date("2025-06-21"),
    userId: 3,
    serviceId: 11, // Pravno savetovanje
  },
];

await db.insert(reviews).values(reviewsData);

// ubaci appointments
const appointmentsData: typeof appointments.$inferInsert[] = [
  {
    date: new Date("2026-02-01T10:00:00"),
    time: "10:00",
    isBooked: true,
    serviceId: 1,
  },
  {
    date: new Date("2026-02-02T14:00:00"),
    time: "14:00",
    isBooked: false,
    serviceId: 2,
  },
  {
    date: new Date("2026-02-03T09:00:00"),
    time: "09:00",
    isBooked: true,
    serviceId: 3,
  },
  {
    date: new Date("2026-02-04T11:00:00"),
    time: "11:00",
    isBooked: false,
    serviceId: 4,
  },
  {
    date: new Date("2026-02-05T15:00:00"),
    time: "15:00",
    isBooked: true,
    serviceId: 6,
  },
  {
    date: new Date("2026-02-06T13:00:00"),
    time: "13:00",
    isBooked: true,
    serviceId: 7,
  },
  {
    date: new Date("2026-02-07T16:00:00"),
    time: "16:00",
    isBooked: false,
    serviceId: 8,
  },
  {
    date: new Date("2026-02-08T10:30:00"),
    time: "10:30",
    isBooked: true,
    serviceId: 9,
  },
  {
    date: new Date("2026-02-09T12:00:00"),
    time: "12:00",
    isBooked: true,
    serviceId: 10,
  },
  {
    date: new Date("2026-02-10T09:30:00"),
    time: "09:30",
    isBooked: false,
    serviceId: 11,
  },
];

await db.insert(appointments).values(appointmentsData);



console.log("✅ Seed finished");
process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
