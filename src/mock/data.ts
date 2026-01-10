import { FullServiceDto, FullCategoryDto, FullUserDto, FullRoleDto, FullCompanyDto, FullFreelancerDto } from "@/shared/types";

// Helper funkcije
const getCategory = (id: number) => mockCategories.find((c) => c.id === id)!;
const getUser = (id: number) => mockUsers.find((u)=>u.id === id)!;

export const mockCategories: FullCategoryDto[] = [
    { id: 1, name: "IT i digitalne usluge", icon:"/icons/computer-settings_2360707.png"},
    { id: 2, name: "Zanatske i instalaterske usluge", icon:"/icons/mechanic.png"},
    { id: 3, name: "Obrazovanje i obuke", icon:"/icons/school.png"},
    { id: 4, name: "Zdravlje i lepota", icon:"/icons/beauty-treatment.png"},
    { id: 5, name: "Kućni ljubimci", icon:"/icons/paw.png"},
    { id: 6, name: "Usluga pranja i čišćenja", icon:"/icons/cleaning-products.png"},
    { id: 7, name: "Auto usluge", icon:"/icons/car-wash.png"},
    { id: 8, name: "Finansijske i pravne usluge", icon:"/icons/contract-law.png"},
    { id: 9, name: "Transportne usluge", icon:"/icons/truck.png"},
    { id: 10, name: "Kreativne i zanatske usluge", icon:"/icons/craft.png"},
    { id: 11, name: "Dom i građevinski radovi", icon:"/icons/house.png"},
    { id: 12, name: "Usluge za decu i starije ", icon:"/icons/child_13640746.png"},
    { id: 13, name: "Freelancer usluge ", icon:"/icons/activism_18917750.png"},
    { id: 14, name: "Događaji i Ketering", icon:"/icons/event_12120674.png"},
];

export const mockServices: FullServiceDto[] = [
    {
        id: 1,
        title: "Servis klime",
        description: "Redovni godišnji servis klima uređaja\nČišćenje filtera i unutrašnje jedinice\nPunjenje freonom (R32, R410a...)\nDetekcija i popravka kvarova\nDezinfekcija i antibakterijsko čišćenje klime",
        price: 7000,
        createdAt: new Date("2025-12-01"),
        category: getCategory(2),
        
    },
    {
        id: 2,
        title: "Čišćenje i popravka komponenti računara",
        description: "Vaši uređaji ne rade kako treba? Nudimo profesionalno čišćenje i popravku kompjuterskih delova i periferija za dugotrajan i pouzdan rad.",
        price: 5000,
        createdAt: new Date("2025-12-17"),
        category: getCategory(1),
    },
    {
        id: 3,
        title: "Žensko šišanje - sve dužine kose",
        description: "Lepa i zdrava kosa najlepši je „nakit“ na ženi, ali za to je potreban trud kao i znanje i iz tog razloga veoma je važno kome ćete poveriti brigu o Vašoj kosi. Mesto gde je zdravlje kose, kao i stručnost, na prvom mestu sada je na samo jedan klik od Vas",
        price: 1700,
        createdAt: new Date("2025-12-20"),
        category: getCategory(4),
    },
    {
        id: 4,
        title: "Manikir + lakiranje noktiju",
        description: "Profesionalni manikir za negovane ruke, zdrave nokte i uredan, dugotrajan izgled.",
        price: 2000,
        createdAt: new Date("2025-12-01"),
        category: getCategory(4),
    },
    {
        id: 5,
        title: "Optimizacija Operativnog Sistema | Rešavanje Problema sa Hlađenjem",
        description: "Vaš računar je usporen, pregreva se ili bučno radi? Nudimo profesionalne usluge optimizacije sistema i poboljšanja hlađenja za stabilan i efikasan rad.",
        price: 8000,
        createdAt: new Date("2025-12-10"),
        category: getCategory(1),
    },
    {
        id: 6,
        title: "Kurs REVIT-a za arhitekte",
        description: "Predavač je Autodesk Certifikovani Instruktor PLATINUM, iskustvo preko 30 godina rada. Časovi mogu biti onlajn ili uživo, na srpskom ili engeskom jeziku. Po završenoj obuci se dobija zvanična Autodeskova diploma ATC. Časovi se održavaju najčešće po 3 termina nedeljno sa 2 ili 3 školska časa 45 min. po terminu. Kurs obuhvata 12 termina.",
        price: 52000,
        createdAt: new Date("2026-01-08"),
        category: getCategory(3),
    },
    {
        id: 7,
        title: "Pansion za pse",
        description: "Dobrodošli u Pansion za pse, smešten u domaćinstvu okruženim prirodom, gde će vaš ljubimac uživati dok ste vi odsutni. Za Vašeg ljubimca obezbeđujemo: čuvanje, šetnju, vežbe, obrok, veterinarsku negu. Vaš pas zaslužuje najbolju brigu. Rezervišite mesto u našem pansionu za pse već danas!",
        price: 8000,
        createdAt: new Date("2025-12-10"),
        category: getCategory(5),
    },
    {
        id: 8,
        title: "Generalno čišćenje stanova",
        description:
            "Detaljno čišćenje stanova i kuća, uključujući kuhinju, kupatilo, podove i staklene površine. Idealno nakon renoviranja ili pred useljenje.",
        price: 6000,
        createdAt: new Date("2025-08-18"),
        category: getCategory(6),
    },
    {
        id: 9,
        title: "Mali servis vozila",
        description:
            "Zamena ulja i filtera uz osnovnu dijagnostiku vozila. Brza i pouzdana usluga održavanja putničkih automobila.",
        price: 5500,
        createdAt: new Date("2025-07-30"),
        category: getCategory(7),
    },
    {
        id: 10,
        title: "Relaks masaža celog tela",
        description:
            "Profesionalna relaks masaža koja pomaže u smanjenju stresa, opuštanju mišića i poboljšanju cirkulacije. Tretman se prilagođava individualnim potrebama klijenta.",
        price: 4500,
        createdAt: new Date("2025-06-12"),
        category: getCategory(4),
    },
    {
        id: 11,
        title: "Pravno savetovanje",
        description:
            "Stručno pravno savetovanje za fizička i pravna lica. Pomoć u izradi ugovora, tumačenju zakona i rešavanju imovinsko-pravnih odnosa.",
        price: 7000,
        createdAt: new Date("2025-05-20"),
        category: getCategory(8),
    },
    {
        id: 12,
        title: "Kombi prevoz stvari",
        description:
            "Pouzdana usluga kombi prevoza za selidbe i transport robe na teritoriji grada i okoline. Brza organizacija i siguran prevoz.",
        price: 9000,
        createdAt: new Date("2025-04-18"),
        category: getCategory(9),
    },
    {
        id: 13,
        title: "Krečenje stanova",
        description:
            "Profesionalno krečenje stanova i kuća, uključujući pripremu zidova i završnu obradu. Kvalitetan i uredan rad po dogovoru.",
        price: 12000,
        createdAt: new Date("2025-03-25"),
        category: getCategory(11),
    },
    {
        id: 14,
        title: "Ketering za proslave",
        description:
            "Organizacija keteringa za rođendane, svadbe i poslovne događaje. Bogat meni, profesionalna usluga i prilagođavanje potrebama klijenata.",
        price: 25000,
        createdAt: new Date("2025-02-10"),
        category: getCategory(14),
    }


];



export const mockUsers: FullUserDto[] = [
    { id: 1, email:"petar.petrovic@gmail.com", password:"petar123", firstName:"Petar", lastName:"Petrovic" ,phone:"063245319", role:FullRoleDto.FREELANCER, createdAt: new Date("2025-11-05")},
    { id: 2, email:"ana.anic@gmail.com", password:"ana123" ,firstName:"Ana", lastName:"Anic" ,phone:"062185574", role:FullRoleDto.USER ,createdAt:new Date("2026-01-03")},
    { id: 3, email:"milan.milanovic@gmail.com", password:"milan123", firstName:"Milan", lastName:"Milanovic", phone:"064758446", role:FullRoleDto.USER , createdAt:new Date("2025-12-27")},
    { id: 4, email:"stevan.stevanovic@gmail.com" ,password:"stevan123", firstName:"Stevan", lastName:"Stevanovic" ,phone:"062659423", role:FullRoleDto.FREELANCER ,createdAt:new Date("2026-01-09")},
    { id: 5, email:"marija.maric@gmail.com", password:"marija123", firstName:"Marija", lastName:"Maric", phone:"065674259", role:FullRoleDto.COMPANY, createdAt:new Date("2025-11-05")},
    { id: 6, email:"jovan.jovanovic@gmail.com", password:"jovan123", firstName:"Jovan", lastName:"Jovanovic", phone:"063258963", role:FullRoleDto.COMPANY, createdAt:new Date("2025-09-21")},
    
    { id: 7, email:"ana.markovic@gmail.com", password:"ana123", firstName:"Ana", lastName:"Marković", phone:"062112233", role:FullRoleDto.COMPANY, createdAt:new Date("2024-05-10") },
    { id: 8, email:"petar.simic@gmail.com", password:"petar123", firstName:"Petar", lastName:"Simić", phone:"063445566", role:FullRoleDto.COMPANY, createdAt:new Date("2023-12-01") },
    { id: 9, email:"milica.kovacevic@gmail.com", password:"milica123", firstName:"Milica", lastName:"Kovačević", phone:"064998877", role:FullRoleDto.COMPANY, createdAt:new Date("2025-01-15") },
    { id: 10, email:"marija.stojanovic@gmail.com", password:"marija123", firstName:"Marija", lastName:"Stojanović", phone:"0623344559", role:FullRoleDto.FREELANCER, createdAt:new Date("2025-08-20")},
    { id: 11, email:"vladimir.pavlovic@gmail.com", password:"vladimir123", firstName:"Vladimir", lastName:"Pavlović", phone:"0656677881", role:FullRoleDto.FREELANCER, createdAt:new Date("2026-01-10") }

];

export const mockCompanies: FullCompanyDto[] = [
    {
        id: 1,
        city: "Beograd",
        address: "Bulevar Kralja Aleksandra 153",
        description: "Auto servis Beograd Royal je najopremljeniji i najmoderniji servisni centar u Srbiji. Naš tim sastavljen je od najboljih stručnjaka za održavanje, dijagnostiku i servisiranje vozila. U našem auto servisu održavamo i servisiramo sve vrste, tipove i marke vozila.",
        image: "/images/car-service.jpg",
        phone: "063548667",
        createdAt: new Date("2025-07-12"),
        servicesCount: 4,
        averageRating: 4.7,
        companyName: "Beograd Royal",
        verified: false,
        user: getUser(6),
    },
    {
        id: 2,
        city: "Novi Sad",
        address: "Ustanička 22",
        description:
            "Salon lepote Bella pruža vrhunske kozmetičke i estetske usluge u prijatnom i luksuznom ambijentu. Naš stručni tim koristi profesionalnu kozmetiku i savremene tretmane kako bi istakao vašu prirodnu lepotu. Posvećeni smo individualnom pristupu i maksimalnom zadovoljstvu klijenata.",
        image: "/images/beauty-salon.jpg",
        phone: "062778899",
        createdAt: new Date("2025-06-18"),
        servicesCount: 8,
        averageRating: 4.9,
        companyName: "Bella Beauty Salon",
        verified: true,
        user: getUser(5),
    },





    {
    id: 3,
    city: "Beograd",
    address: "Kralja Petra 45",
    description:
        "Tech Solutions je IT kompanija koja pruža profesionalne usluge web i softverskog razvoja, kao i konsultacije za digitalnu transformaciju. Fokusirani smo na kvalitet i inovativna rešenja prilagođena klijentima.",
    image: "/images/tech-solutions.jpg",
    phone: "0612345678",
    createdAt: new Date("2025-11-12"),
    servicesCount: 3,
    averageRating: 4.7,
    companyName: "Tech Solutions",
    verified: false,
    user: getUser(7),
},
{
    id: 4,
    city: "Niš",
    address: "Pop Lukina 10",
    description:
        "FitLife Gym je moderna teretana koja nudi personalizovane trening programe, grupne časove i nutricionističke savete. Naš cilj je da klijenti postignu svoje fitnes ciljeve na zdrav i održiv način.",
    image: "/images/fitlife-gym.jpg",
    phone: "063445566",
    createdAt: new Date("2025-09-05"),
    servicesCount: 5,
    averageRating: 4.8,
    companyName: "FitLife Gym",
    verified: false,
    user: getUser(8),
},
{
    id: 5,
    city: "Subotica",
    address: "Bajska 18",
    description:
        "Creative Agency pruža profesionalne usluge grafičkog dizajna, brendiranja i digitalnog marketinga. Naš tim kreativaca pomaže kompanijama da izgrade prepoznatljiv vizuelni identitet i uspešno komuniciraju sa publikom.",
    image: "/images/creative-agency.jpg",
    phone: "064998877",
    createdAt: new Date("2025-02-20"),
    servicesCount: 7,
    averageRating: 4.6,
    companyName: "Creative Agency",
    verified: true,
    user: getUser(9),
},
];


export const mockFreelancers: FullFreelancerDto[] = [
    {
        id: 3,
        city: "Niš",
        address: "Kumanovska 8",
        description:"Profesor i freelance instruktor za arhitektonske softvere sa više od 10 godina iskustva u radu i edukaciji. Specijalizovan za Revit, AutoCAD i Archicad, sa fokusom na BIM metodologiju. Održavam individualne i grupne časove, prilagođene studentima arhitekture, inženjerima i profesionalcima koji žele da unaprede svoje znanje.",
        image: "/images/freelancer-architecture.jpg",
        phone: "0641122334",
        createdAt: new Date("2025-02-10"),
        servicesCount: 1,
        averageRating: 4.6,
        firstName: "Petar",
        lastName: "Petrović",
        user: getUser(1),
        },
        {
        id: 4,
        city: "Beograd",
        address: "Bulevar oslobodjenja 86",
        description:"Iskusni tehničar za računare i IT podršku, specijalizovan za popravku hardvera i softvera. Pružam servis i održavanje desktop i laptop računara, instalaciju i optimizaciju softvera, kao i rešavanje tehničkih problema. Radim sa pojedincima i malim firmama koje žele pouzdanu i brzu IT podršku.",
        image: "/images/freelancer-it.jpg",
        phone: "0659988776",
        createdAt: new Date("2025-05-15"),
        servicesCount: 3,
        averageRating: 4.8,
        firstName: "Stevan",
        lastName: "Stevanović",
        user: getUser(4),
        },
        {
        id: 5,
        city: "Pančevo",
        address: "Cara Lazara 44",
        description:
            "Profesionalna radnica za čišćenje stanova i poslovnih prostora. Koristim kvalitetna sredstva i garantujem detaljno i pouzdano čišćenje po dogovoru.",
        image: "/images/freelancer-cleaning.jpg",
        phone: "0623344559",
        createdAt: new Date("2025-08-20"),
        servicesCount: 6,
        averageRating: 4.6,
        firstName: "Marija",
        lastName: "Stojanović",
        user: getUser(10),
        },
        {
        id: 6,
        city: "Čačak",
        address: "Industrijska zona bb",
        description:
            "Auto-mehaničar specijalizovan za brze intervencije i redovno održavanje vozila. Pružam usluge malog servisa, dijagnostike i popravki na terenu.",
        image: "/images/freelancer-auto.jpg",
        phone: "0656677881",
        createdAt: new Date("2026-01-10"),
        servicesCount: 9,
        averageRating: 4.5,
        firstName: "Vladimir",
        lastName: "Pavlović",
        user: getUser(11),
    }
];
