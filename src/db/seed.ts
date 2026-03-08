import "dotenv/config";
import { db } from "./index";
import { categories, users } from "./schema";
import { profiles } from "./schema";
import { services } from "./schema";
import { reviews } from "./schema";
import { appointments } from "./schema";
import { employees, availabilities, bookings } from "./schema"
import { sql } from "drizzle-orm"; 
import bcrypt from "bcryptjs";


async function seed() {
  console.log("Seeding started...");

  const password = "123456";
const hashed = await bcrypt.hash(password, 10);


await db.execute(sql`
TRUNCATE TABLE 
  bookings,
  availabilities,
  employees,
  appointments,
  reviews,
  services,
  profiles,
  users,
  categories
RESTART IDENTITY CASCADE
`);

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
        password: hashed,          //password za sve seedovane korisnike: "123456"
        firstName: "Petar", 
        lastName: "Petrovic", 
        phone: "063245319", 
        role: "FREELANCER" }, 
        
    { 
        email: "ana.anic@gmail.com", 
            password: hashed, 
            firstName: "Ana", 
            lastName: "Anic", 
            phone: "062185574", 
            role: "USER" }, 
            
    { 
        email: "milan.milanovic@gmail.com", 
        password: hashed,
        firstName: "Milan", 
        lastName: "Milanovic", 
        phone: "064758446", 
        role: "USER" 
    }, 

    { 
        email: "stevan.stevanovic@gmail.com", 
        password: hashed,
        firstName: "Stevan", 
        lastName: "Stevanovic",
        phone: "062659423", 
        role: "FREELANCER" 
    }, 
    
    { 
        email: "bellabeautysalon@gmail.com", 
        password: hashed,
        firstName: "Marija", 
        lastName: "Maric", 
        phone: "065674259", 
        role: "COMPANY" 
    }, 
    { 
        email: "beogradroyal@gmail.com", 
        password: hashed,
        firstName: "Jovan", 
        lastName: "Jovanovic", 
        phone: "063258963", 
        role: "COMPANY" 
    }, 
    {
         email: "techsolutions@gmail.com", 
         password: hashed,
         firstName: "Ana", 
         lastName: "Marković", 
         phone: "062112233", 
         role: "COMPANY" 
        }, 
    { 
         email: "fitlifegym@gmail.com", 
         password: hashed, 
         firstName: "Petar", 
         lastName: "Simić", 
         phone: "063445566", 
         role: "COMPANY" 
        }, 

    { 
        email: "creativeagency@gmail.com", 
        password: hashed, 
        firstName: "Milica", 
        lastName: "Kovačević", 
        phone: "064998877", 
        role: "COMPANY" 
    }, 

    { 
        email: "marija.stojanovic@gmail.com", 
        password: hashed,
        firstName: "Marija", 
        lastName: "Stojanović", 
        phone: "0623344559", 
        role: "FREELANCER" 
    }, 
    
    { 
        email: "vladimir.pavlovic@gmail.com", 
       password: hashed, 
        firstName: "Vladimir", 
        lastName: "Pavlović", 
        phone: "0656677881", 
        role: "FREELANCER" 
    }, 
    
    { 
        email: "marko.jovanovic@gmail.com", 
        password: hashed, 
        firstName: "Marko", 
        lastName: "Jovanović", 
        phone: "0645566778", 
        role: "FREELANCER" 
    }, 

    { 
        email: "itoptimus@gmail.com", 
        password: hashed, 
        firstName: "Nikola", 
        lastName: "Petrović", 
        phone: "063445566", 
        role: "COMPANY" 
    },

    { 
        email: "sapapansion@gmail.com", 
        password: hashed,
        firstName: "Ana", 
        lastName: "Milovanović", 
        phone: "0647788990",
        role: "COMPANY" }, 
        
    { 
        email: "jelena.markovic@gmail.com", 
        password: hashed, 
        firstName: "Jelena", 
        lastName: "Marković", 
        phone: "0634455667",
         role: "FREELANCER" },

    { 
        email: "gonzalestransport@gmail.com", 
        password: hashed, 
        firstName: "Zoran", 
        lastName: "Lekić", 
        phone: "0653344556", 
        role: "COMPANY" 
    },

    { 
        email: "marko.petrovic@gmail.com", 
        password: hashed, 
        firstName: "Marko", 
        lastName: "Petrović", 
        phone: "0661122334",
         role: "FREELANCER" 
        }, 
       { 
        email: "sara.petrovic@gmail.com", 
        password: hashed,
        firstName: "Sara", 
        lastName: "Petrovic", 
        phone: "063215391", 
        role: "USER" }, 
        
         { 
        email: "olja.lukic@gmail.com", 
        password: hashed,
        firstName: "Olja", 
        lastName: "Lukic", 
        phone: "063124685", 
        role: "USER" }, 
      
      ]);
   

  // pripremi podatke sa eksplicitnim tipom (numeric -> string)
  const profileData: typeof profiles.$inferInsert[] = [
  // Freelanceri
  {
    city: "Niš",
    address: "Kumanovska 8",
    description: "Profesor i freelance instruktor za arhitektonske softvere sa više od 10 godina iskustva u radu i edukaciji. Specijalizovan za Revit, AutoCAD i Archicad, sa fokusom na BIM metodologiju. Održavam individualne i grupne časove, prilagođene studentima arhitekture, inženjerima i profesionalcima koji žele da unaprede svoje znanje.",
    image: null,
    firstName: "Petar",
    lastName: "Petrović",
    companyName: null,
    userId: 1, // Petar (FREELANCER)
  },
  {
    city: "Beograd",
    address: "Bulevar oslobodjenja 86",
    description: "Iskusni tehničar za računare i IT podršku, specijalizovan za popravku hardvera i softvera. Pružam servis, održavanje i čišćenje desktop i laptop računara, instalaciju i optimizaciju softvera, kao i rešavanje tehničkih problema. Radim sa pojedincima i malim firmama koje žele pouzdanu i brzu IT podršku.",
    image: null,
    firstName: "Stevan",
    lastName: "Stevanović",
    companyName: null,
    userId: 4, // Stevan (FREELANCER)
  },
  {
    city: "Pančevo",
    address: "Cara Lazara 44",
    description: "Profesionalna radnica za čišćenje stanova i poslovnih prostora. Koristim kvalitetna sredstva i garantujem detaljno i pouzdano čišćenje po dogovoru.",
    image: null,
    firstName: "Marija",
    lastName: "Stojanović",
    companyName: null,
    userId: 10, // Marija (FREELANCER)
  },
  {
    city: "Čačak",
    address: "Industrijska zona bb",
    description: "Auto servis Beograd Royal je najopremljeniji i najmoderniji servisni centar u Srbiji. Naš tim sastavljen je od najboljih stručnjaka za održavanje, dijagnostiku i servisiranje vozila. U našem auto servisu održavamo i servisiramo sve vrste, tipove i marke vozila.",
    image: null,
    firstName: "Vladimir",
    lastName: "Pavlović",
    companyName: null,
    userId: 11, // Vladimir (FREELANCER)
  },
  {
    city: "Novi Sad",
    address: "Bulevar Evrope 92",
    description: "Samostalni serviser klima uređaja sa višegodišnjim iskustvom u popravci, redovnom održavanju i dubinskom čišćenju klima uređaja. Pružam usluge dezinfekcije, dopune freona i dijagnostike kvarova za kućne i poslovne objekte.",
    image: null,
    firstName: "Marko",
    lastName: "Jovanović",
    companyName: null,
    userId: 12, // Marko (FREELANCER)
  },
  {
    city: "Beograd",
    address: "Nemanjina 15",
    description: "Samostalni pravnik sa iskustvom u pružanju pravnih usluga fizičkim i pravnim licima. Bavim se pravnim savetovanjem, izradom ugovora, zastupanjem pred sudovima i rešavanjem imovinsko-pravnih i radno-pravnih odnosa.",
    image: null,
    firstName: "Jelena",
    lastName: "Marković",
    companyName: null,
    userId: 15, // Jelena (FREELANCER)
  },
  {
    city: "Novi Sad",
    address: "Bulevar Oslobođenja 22",
    description: "Iskusni moler sa više od 10 godina rada na unutrašnjem i spoljašnjem farbanju, dekorativnim tehnikama i adaptacijama prostora. Nudim preciznost, kvalitetnu izradu i savete za odabir boja i materijala.",
    image: null,
    firstName: "Marko",
    lastName: "Petrović",
    companyName: null,
    userId: 17, // Marko (FREELANCER)
  },

  // Kompanije
  {
    city: "Novi Sad",
    address: "Ustanička 22",
    description: "Salon lepote Bella pruža vrhunske kozmetičke i estetske usluge u prijatnom i luksuznom ambijentu. Naš stručni tim koristi profesionalnu kozmetiku i savremene tretmane kako bi istakao vašu prirodnu lepotu. Posvećeni smo individualnom pristupu i maksimalnom zadovoljstvu klijenata.",
    image: null,
    firstName: null,
    lastName: null,
    companyName: "Bella Beauty Salon",
    userId: 5, // Marija (COMPANY)
  },
  {
    city: "Beograd",
    address: "Bulevar Kralja Aleksandra 153",
    description: "Auto servis Beograd Royal je najopremljeniji i najmoderniji servisni centar u Srbiji. Naš tim sastavljen je od najboljih stručnjaka za održavanje, dijagnostiku i servisiranje vozila. U našem auto servisu održavamo i servisiramo sve vrste, tipove i marke vozila.",
    image: null,
    firstName: null,
    lastName: null,
    companyName: "Beograd Royal",
    userId: 6, // Jovan (COMPANY)
  },
  {
    city: "Beograd",
    address: "Kralja Petra 45",
    description: "Tech Solutions je IT kompanija koja pruža profesionalne usluge web i softverskog razvoja, kao i konsultacije za digitalnu transformaciju. Fokusirani smo na kvalitet i inovativna rešenja prilagođena klijentima.",
    image: null,
    firstName: null,
    lastName: null,
    companyName: "Tech Solutions",
    userId: 7, // Ana (COMPANY)
  },
  {
    city: "Niš",
    address: "Pop Lukina 10",
    description: "FitLife Gym je moderna teretana koja nudi personalizovane trening programe, grupne časove i nutricionističke savete. Naš cilj je da klijenti postignu svoje fitnes ciljeve na zdrav i održiv način.",
    image: null,
    firstName: null,
    lastName: null,
    companyName: "FitLife Gym",
    userId: 8, // Petar (COMPANY)
  },
  {
    city: "Subotica",
    address: "Bajska 18",
    description: "Creative Agency pruža profesionalne usluge grafičkog dizajna, brendiranja i digitalnog marketinga. Naš tim kreativaca pomaže kompanijama da izgrade prepoznatljiv vizuelni identitet i uspešno komuniciraju sa publikom.",
    image: null,
    firstName: null,
    lastName: null,
    companyName: "Creative Agency",
    userId: 9, // Milica (COMPANY)
  },
  {
    city: "Novi Sad",
    address: "Futoška 102",
    description: "IT Optimus je specijalizovana kompanija za optimizaciju, održavanje i unapređenje IT uređaja i sistema. Bavimo se ubrzavanjem rada računara, optimizacijom softvera, nadogradnjom hardvera i preventivnim održavanjem IT opreme za fizička lica i kompanije.",
    image: null,
    firstName: null,
    lastName: null,
    companyName: "IT Optimus",
    userId: 13, // Nikola (COMPANY)
  },
  {
    city: "Sremska Mitrovica",
    address: "Fruškogorska 12",
    description: "Mi smo preduzece koje nudi pansion za pse smešten u mirnom okruženju sa velikim dvorištem i stručno obučenim osobljem. Nudimo dnevni i višednevni boravak, šetnje, obroke, igru i osnovnu veterinarsku brigu kako bi se vaš ljubimac osećao sigurno i voljeno.",
    image: null,
    firstName: null,
    lastName: null,
    companyName: "Sapa Pansion",
    userId: 14, // Ana (COMPANY)
  },
  {
    city: "Beograd",
    address: "Bulevar Kralja Aleksandra 45",
    description: "Preduzeće specijalizovano za transportne usluge, uključujući dostavu paketa, selidbe i logistiku. Pružamo siguran i pouzdan prevoz sa modernim vozilima i iskusnim vozačima.",
    image: null,
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
    description: "Vaši uređaji ne rade kako treba? Nudimo profesionalno čišćenje i popravku kompjuterskih delova i periferija za dugotrajan i pouzdan rad.",
    image: null,
    price: 7000,
    createdAt: new Date("2026-03-07"),
    categoryId: 2,
    userId: 12,
    profileId: profileMap[12],
  },
  {
    title: "Čišćenje i popravka komponenti računara",
    description: "Vaši uređaji ne rade kako treba? Nudimo profesionalno čišćenje i popravku kompjuterskih delova i periferija za dugotrajan i pouzdan rad.",
    image: null,
    price: 5000,
    createdAt: new Date("2026-03-07"),
    categoryId: 1,
    userId: 4,
    profileId: profileMap[4],
  },
  {
    title: "Žensko šišanje - sve dužine kose",
    description: "Lepa i zdrava kosa najlepši je nakit na ženi, ali za to je potreban trud kao i znanje i iz tog razloga veoma je važno kome ćete poveriti brigu o Vašoj kosi. Mesto gde je zdravlje kose, kao i stručnost, na prvom mestu sada je na samo jedan klik od Vas",
    image: null,
    price: 1700,
    createdAt: new Date("2026-03-07"),
    categoryId: 4,
    userId: 5,
    profileId: profileMap[5],
  },
  {
    title: "Manikir + lakiranje noktiju",
    description: "Profesionalni manikir za negovane ruke, zdrave nokte i uredan, dugotrajan izgled.",
    image: null,
    price: 2000,
    createdAt: new Date("2026-03-07"),
    categoryId: 4,
    userId: 5,
    profileId: profileMap[5],
  },
  {
    title: "Optimizacija Operativnog Sistema | Rešavanje Problema sa Hlađenjem",
    description: "Vaš računar je usporen, pregreva se ili bučno radi? Nudimo profesionalne usluge optimizacije sistema i poboljšanja hlađenja za stabilan i efikasan rad.",
    image: null,
    price: 8000,
    createdAt: new Date("2026-03-07"),
    categoryId: 1,
    userId: 4,
    profileId: profileMap[4],
  },
  {
    title: "Kurs REVIT-a za arhitekte",
    description: "Predavač je Autodesk Certifikovani Instruktor PLATINUM, iskustvo preko 30 godina rada. Časovi mogu biti onlajn ili uživo, na srpskom ili engeskom jeziku. Po završenoj obuci se dobija zvanična Autodeskova diploma ATC. Časovi se održavaju najčešće po 3 termina nedeljno sa 2 ili 3 školska časa 45 min. po terminu. Kurs obuhvata 12 termina.",
    image: null,
    price: 52000,
    createdAt: new Date("2026-03-07"),
    categoryId: 3,
    userId: 1,
    profileId: profileMap[1],
  },
  {
    title: "Pansion za pse - jednonedeljni boravak",
    description: "Dobrodošli u Pansion za pse, smešten u domaćinstvu okruženim prirodom, gde će vaš ljubimac uživati dok ste vi odsutni. Za Vašeg ljubimca obezbeđujemo: čuvanje, šetnju, vežbe, obrok, veterinarsku negu. Vaš pas zaslužuje najbolju brigu. Rezervišite mesto u našem pansionu za pse već danas!",
    image: null,
    price: 8000,
    createdAt: new Date("2026-03-07"),
    categoryId: 5,
    userId: 14,
    profileId: profileMap[14],
  },
  {
    title: "Generalno čišćenje stanova",
    description: "Detaljno čišćenje stanova i kuća, uključujući kuhinju, kupatilo, podove i staklene površine. Idealno nakon renoviranja ili pred useljenje.",
    image: null,
    price: 6000,
    createdAt: new Date("2026-03-07"),
    categoryId: 6,
    userId: 10,
    profileId: profileMap[10],
  },
  {
    title: "Mali servis vozila",
    description: "Zamena ulja i filtera uz osnovnu dijagnostiku vozila. Brza i pouzdana usluga održavanja putničkih automobila.",
    image: null,
    price: 5500,
    createdAt: new Date("2026-03-07"),
    categoryId: 7,
    userId: 11,
    profileId: profileMap[11],
  },
  {
    title: "Relaks masaža celog tela",
    description: "Profesionalna relaks masaža koja pomaže u smanjenju stresa, opuštanju mišića i poboljšanju cirkulacije. Tretman se prilagođava individualnim potrebama klijenta.",
    image: null,
    price: 4500,
    createdAt: new Date("2026-03-07"),
    categoryId: 4,
    userId: 5,
    profileId: profileMap[5],
  },
  {
    title: "Pravno savetovanje",
    description: "Stručno pravno savetovanje za fizička i pravna lica. Pomoć u izradi ugovora, tumačenju zakona i rešavanju imovinsko-pravnih odnosa.",
    image: null,
    price: 7000,
    createdAt: new Date("2026-03-07"),
    categoryId: 8,
    userId: 15,
    profileId: profileMap[15],
  },
  {
    title: "Kombi prevoz stvari",
    description: "Pouzdana usluga kombi prevoza za selidbe i transport robe na teritoriji grada i okoline. Brza organizacija i siguran prevoz.",
    image: null,
    price: 9000,
    createdAt: new Date("2026-03-07"),
    categoryId: 9,
    userId: 16,
    profileId: profileMap[16],
  },
  {
    title: "Krečenje stanova",
    description: "Profesionalno krečenje stanova i kuća, uključujući pripremu zidova i završnu obradu. Kvalitetan i uredan rad po dogovoru.",
    image: null,
    price: 12000,
    createdAt: new Date("2026-03-07"),
    categoryId: 11,
    userId: 17,
    profileId: profileMap[17],
  },
  {
    title: "Ketering za proslave",
    description: "Organizacija keteringa za rođendane, svadbe i poslovne događaje. Bogat meni, profesionalna usluga i prilagođavanje potrebama klijenata.",
    image: null,
    price: 25000,
    createdAt: new Date("2026-03-07"),
    categoryId: 14,
    userId: 17,
    profileId: profileMap[17],
  },
  {
    title: "Muško šišanje",
    description: "Profesionalno šišanje prilagođeno vašem stilu i tipu kose. Usluga uključuje šišanje makazama i/ili mašinicom, precizne prelaze, sređivanje kontura i završno stilizovanje za uredan i moderan izgled.",
    image: null,
    price: 1700,
    createdAt: new Date("2026-03-07"),
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
    profileId:5
  },
  {
    rating: 4,
    comment: "Brzo i kvalitetno, ali malo skuplje.",
    createdAt: new Date("2025-12-20"),
    userId: 3, // Milan (USER)
    serviceId: 2, // Čišćenje i popravka komponenti računara
    profileId: 2
  },
  {
    rating: 5,
    comment: "Najbolji salon u gradu!",
    createdAt: new Date("2025-12-22"),
    userId: 2,
    serviceId: 3, // Žensko šišanje
    profileId:8
  },
  {
    rating: 5,
    comment: "Manikir je bio savršen!",
    createdAt: new Date("2025-12-23"),
    userId: 19,
    serviceId: 4, // Manikir
    profileId:8
  },
  {
    rating: 4,
    comment: "Kurs je odličan, predavač stručan.",
    createdAt: new Date("2026-01-10"),
    userId: 1,
    serviceId: 3, // Kurs REVIT-a
    profileId:1
  },
  {
    rating: 5,
    comment: "Pansion za pse je fantastičan, moj pas je bio srećan!",
    createdAt: new Date("2025-12-12"),
    userId: 3,
    serviceId: 7, // Pansion za pse
    profileId:14
  },
  {
    rating: 5,
    comment: "Stan je blistao posle čišćenja!",
    createdAt: new Date("2025-08-22"),
    userId: 2,
    serviceId: 8, // Generalno čišćenje
    profileId:3
  },
  {
    rating: 4,
    comment: "Servis vozila urađen korektno.",
    createdAt: new Date("2026-01-12"),
    userId: 3,
    serviceId: 9, // Mali servis vozila
    profileId:4
  },
  {
    rating: 5,
    comment: "Masaža je bila fantastična!",
    createdAt: new Date("2025-12-13"),
    userId: 18,
    serviceId: 10, // Relaks masaža
    profileId: 8
  },
  {
    rating: 5,
    comment: "Pravni savet mi je mnogo pomogao.",
    createdAt: new Date("2025-06-21"),
    userId: 19,
    serviceId: 11, // Pravno savetovanje
    profileId:6
  },
  {
    rating: 4,
    comment: "Zadovoljan frizurom. Bas kako sam trazio!",
    createdAt: new Date("2025-12-25"),
    userId: 3,
    serviceId: 4, // Musko sisanje
    profileId:8
  },
];

await db.insert(reviews).values(reviewsData);


const appointmentsData: typeof appointments.$inferInsert[] = [
  {
    date: "2026-01-20",
    time: "09:00",
    isBooked: false,
    serviceId: 2,
  },
  {
    date: "2026-01-23",
    time: "10:30",
    isBooked: true,
    serviceId: 2,
  },
  {
    date: "2026-01-27",
    time: "12:00",
    isBooked: false,
    serviceId: 2,
  },
  {
    date: "2026-01-27",
    time: "14:00",
    isBooked: false,
    serviceId: 2,
  },
  {
    date: "2026-01-27",
    time: "16:00",
    isBooked: true,
    serviceId: 2,
  },
  {
    date: "2026-01-27",
    time: "18:00",
    isBooked: false,
    serviceId: 2,
  },
  {
    date: "2026-01-27",
    time: "20:00",
    isBooked: false,
    serviceId: 2,
  },
  {
    date: "2026-01-30",
    time: "10:30",
    isBooked: false,
    serviceId: 2,
  },
  {
    date: "2026-01-30",
    time: "15:00",
    isBooked: false,
    serviceId: 2,
  },
  {
    date: "2026-01-17",
    time: "15:00",
    isBooked: false,
    serviceId: 3,
  },
  {
    date: "2026-01-19",
    time: "17:00",
    isBooked: false,
    serviceId: 3,
  },
  {
    date: "2026-01-19",
    time: "19:00",
    isBooked: false,
    serviceId: 3,
  },
  {
    date: "2026-01-27",
    time: "21:00",
    isBooked: false,
    serviceId: 2,
  },


   {
    date: "2026-02-05",
    time: "10:00",
    isBooked: false,
    serviceId: 3,
  },
  {
    date: "2026-02-05",
    time: "12:00",
    isBooked: false,
    serviceId: 3,
  },
  {
    date: "2026-02-06",
    time: "14:00",
    isBooked: false,
    serviceId: 4,
  },
  {
    date: "2026-02-06",
    time: "16:00",
    isBooked: false,
    serviceId: 4,
  },

];

await db.insert(appointments).values(appointmentsData);



const employeesData: typeof employees.$inferInsert[] = [
  {
    firstName: "Marko",
    lastName: "Marković",
    description: "FRIZER",
    profileId: profileMap[5], // Bella Beauty Salon
  },
  {
    firstName: "Jelena",
    lastName: "Jovanović",
    description: "FRIZER",
    profileId: profileMap[5],
  },
  {
    firstName: "Stefan",
    lastName: "Milošević",
    description: "FRIZER",
    profileId: profileMap[5],
  },
];

const insertedEmployees = await db.insert(employees).values(employeesData).returning({
  id: employees.id,
  firstName: employees.firstName,
});
const employeeMap = Object.fromEntries(
  insertedEmployees.map((e) => [e.firstName, e.id])
);

const availabilitiesData: typeof availabilities.$inferInsert[] = [
  {
    note: "",
    employeeId: employeeMap["Marko"],
    appointmentId: 11, 
  },
  {
    note: "",
    employeeId: employeeMap["Jelena"],
    appointmentId: 11,
  },
  {
    note: "",
    employeeId: employeeMap["Stefan"],
    appointmentId: 11,
  },
];

await db.insert(availabilities).values(availabilitiesData);


await db.insert(bookings).values([
  {
    reservedDate: "2026-02-05",
    time: "10:00",
    userId: 2, // Ana
    serviceId: 3, // Žensko šišanje
    appointmentId: 14,
    employeeId: employeeMap["Marko"],
    finished: true,
  },
  {
    reservedDate: "2026-02-06",
    time: "14:00",
    userId: 3, // Milan
    serviceId: 4, // Manikir
    appointmentId: 16,
    employeeId: employeeMap["Jelena"],
    finished: true,
  },
]);

console.log("Seed finished");
process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});


