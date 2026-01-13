import { FullServiceDto, FullCategoryDto, FullUserDto, FullRoleDto, FullCompanyDto, FullFreelancerDto, Profile } from "@/shared/types";



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

export const mockUsers: FullUserDto[] = [
  {
    id: 1,
    email: "petar.petrovic@gmail.com",
    password: "petar123",
    firstName: "Petar",
    lastName: "Petrovic",
    phone: "063245319",
    role: FullRoleDto.FREELANCER,
    createdAt: new Date("2025-11-05"),
   
  },
  {
    id: 2,
    email: "ana.anic@gmail.com",
    password: "ana123",
    firstName: "Ana",
    lastName: "Anic",
    phone: "062185574",
    role: FullRoleDto.USER,
    createdAt: new Date("2026-01-03"),
  },
  {
    id: 3,
    email: "milan.milanovic@gmail.com",
    password: "milan123",
    firstName: "Milan",
    lastName: "Milanovic",
    phone: "064758446",
    role: FullRoleDto.USER,
    createdAt: new Date("2025-12-27"),
  },
  {
    id: 4,
    email: "stevan.stevanovic@gmail.com",
    password: "stevan123",
    firstName: "Stevan",
    lastName: "Stevanovic",
    phone: "062659423",
    role: FullRoleDto.FREELANCER,
    createdAt: new Date("2026-01-09"),
  },
  {
    id: 5,
    email: "bellabeautysalon@gmail.com",
    password: "marija123",
    firstName: "Marija",
    lastName: "Maric",
    phone: "065674259",
    role: FullRoleDto.COMPANY,
    createdAt: new Date("2025-11-05"),
  },
  {
    id: 6,
    email: "beogradroyal@gmail.com",
    password: "jovan123",
    firstName: "Jovan",
    lastName: "Jovanovic",
    phone: "063258963",
    role: FullRoleDto.COMPANY,
    createdAt: new Date("2025-09-21"),
  },
  {
    id: 7,
    email: "techsolutions@gmail.com",
    password: "ana123",
    firstName: "Ana",
    lastName: "Marković",
    phone: "062112233",
    role: FullRoleDto.COMPANY,
    createdAt: new Date("2024-05-10"),
  },
  {
    id: 8,
    email: "fitlifegym@gmail.com",
    password: "petar123",
    firstName: "Petar",
    lastName: "Simić",
    phone: "063445566",
    role: FullRoleDto.COMPANY,
    createdAt: new Date("2023-12-01"),
  },
  {
    id: 9,
    email: "creativeagency@gmail.com",
    password: "milica123",
    firstName: "Milica",
    lastName: "Kovačević",
    phone: "064998877",
    role: FullRoleDto.COMPANY,
    createdAt: new Date("2025-01-15"),
  },
  {
    id: 10,
    email: "marija.stojanovic@gmail.com",
    password: "marija123",
    firstName: "Marija",
    lastName: "Stojanović",
    phone: "0623344559",
    role: FullRoleDto.FREELANCER,
    createdAt: new Date("2025-08-20"),
  },
  {
    id: 11,
    email: "vladimir.pavlovic@gmail.com",
    password: "vladimir123",
    firstName: "Vladimir",
    lastName: "Pavlović",
    phone: "0656677881",
    role: FullRoleDto.FREELANCER,
    createdAt: new Date("2026-01-10"),
  },
  {
    id: 12,
    email: "marko.jovanovic@gmail.com",
    password: "marko123",
    firstName: "Marko",
    lastName: "Jovanović",
    phone: "0645566778",
    role: FullRoleDto.FREELANCER,
    createdAt: new Date("2025-11-10"),
  },
  {
    id: 13,
    email: "itoptimus@gmail.com",
    password: "nikola23",
    firstName: "Nikola",
    lastName: "Petrović",
    phone: "063445566",
    role: FullRoleDto.COMPANY,
    createdAt: new Date("2025-12-05"),
  },
  {
    id: 14,
    email: "sapapansion@gmail.com",
    password: "ana123",
    firstName: "Ana",
    lastName: "Milovanović",
    phone: "0647788990",
    role: FullRoleDto.COMPANY,
    createdAt: new Date("2025-06-10"),
  },
  {
    id: 15,
    email: "jelena.markovic@gmail.com",
    password: "jelena123",
    firstName: "Jelena",
    lastName: "Marković",
    phone: "0634455667",
    role: FullRoleDto.FREELANCER,
    createdAt: new Date("2025-06-10"),
  },
  {
    id: 16,
    email: "gonzalestransport@gmail.com",
    password: "zoran123",
    firstName: "Zoran",
    lastName: "Lekić",
    phone: "0653344556",
    role: FullRoleDto.COMPANY,
    createdAt: new Date("2025-06-11"),
  },
  {
    id: 17,
    email: "marko.petrovic@gmail.com",
    password: "marko123",
    firstName: "Marko",
    lastName: "Petrović",
    phone: "0661122334",
    role: FullRoleDto.FREELANCER,
    createdAt: new Date("2025-06-11"),
  },
];

// Helper funkcije
const getCategory = (id: number) => mockCategories.find((c) => c.id === id)!;
const getUser = (id: number) => mockUsers.find((u)=>u.id === id)!;

export const mockCompanies: FullCompanyDto[] = [
    {
        id: 1,
        city: "Beograd",
        address: "Bulevar Kralja Aleksandra 153",
        description: "Auto servis Beograd Royal je najopremljeniji i najmoderniji servisni centar u Srbiji. Naš tim sastavljen je od najboljih stručnjaka za održavanje, dijagnostiku i servisiranje vozila. U našem auto servisu održavamo i servisiramo sve vrste, tipove i marke vozila.",
        image: "/images/car-service.jpg",
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
    servicesCount: 7,
    averageRating: 4.6,
    companyName: "Creative Agency",
    verified: true,
    user: getUser(9),
},
{
  id: 6,
  city: "Novi Sad",
  address: "Futoška 102",
  description:
    "IT Optimus je specijalizovana kompanija za optimizaciju, održavanje i unapređenje IT uređaja i sistema. Bavimo se ubrzavanjem rada računara, optimizacijom softvera, nadogradnjom hardvera i preventivnim održavanjem IT opreme za fizička lica i kompanije.",
  image: "/images/it-optimization.jpg",
  servicesCount: 8,
  averageRating: 4.7,
  companyName: "IT Optimus",
  verified: true,
  user: getUser(13),
},
{
  id: 7,
  city: "Sremska Mitrovica",
  address: "Fruškogorska 12",
  description:
    "Mi smo preduzece koje nudi pansion za pse smešten u mirnom okruženju sa velikim dvorištem i stručno obučenim osobljem. Nudimo dnevni i višednevni boravak, šetnje, obroke, igru i osnovnu veterinarsku brigu kako bi se vaš ljubimac osećao sigurno i voljeno.",
  image: "/images/dog-hotel.jpg",
  servicesCount: 5,
  averageRating: 4.8,
  companyName: "Sapa Pansion",
  verified: false,
  user: getUser(14),
},
{
  id: 8,
  city: "Beograd",
  address: "Bulevar Kralja Aleksandra 45",
  description: "Preduzeće specijalizovano za transportne usluge, uključujući dostavu paketa, selidbe i logistiku. Pružamo siguran i pouzdan prevoz sa modernim vozilima i iskusnim vozačima.",
  image: "/images/transport-services.jpg",
  servicesCount: 3,
  averageRating: 4.7,
  companyName: "Gonzales Transport",
  verified: false,
  user: getUser(16)
}
];


export const mockFreelancers: FullFreelancerDto[] = [
    {
        id: 1,
        city: "Niš",
        address: "Kumanovska 8",
        description:"Profesor i freelance instruktor za arhitektonske softvere sa više od 10 godina iskustva u radu i edukaciji. Specijalizovan za Revit, AutoCAD i Archicad, sa fokusom na BIM metodologiju. Održavam individualne i grupne časove, prilagođene studentima arhitekture, inženjerima i profesionalcima koji žele da unaprede svoje znanje.",
        image: "/images/freelancer-architecture.jpg",
        servicesCount: 1,
        averageRating: 4.6,
        firstName: "Petar",
        lastName: "Petrović",
        user: getUser(1),
        },
        {
        id: 2,
        city: "Beograd",
        address: "Bulevar oslobodjenja 86",
        description:"Iskusni tehničar za računare i IT podršku, specijalizovan za popravku hardvera i softvera. Pružam servis, održavanje i čišćenje desktop i laptop računara, instalaciju i optimizaciju softvera, kao i rešavanje tehničkih problema. Radim sa pojedincima i malim firmama koje žele pouzdanu i brzu IT podršku.",
        image: "/images/freelancer-it.jpg",
        servicesCount: 3,
        averageRating: 4.8,
        firstName: "Stevan",
        lastName: "Stevanović",
        user: getUser(4),
        },
        {
        id: 3,
        city: "Pančevo",
        address: "Cara Lazara 44",
        description:
            "Profesionalna radnica za čišćenje stanova i poslovnih prostora. Koristim kvalitetna sredstva i garantujem detaljno i pouzdano čišćenje po dogovoru.",
        image: "/images/freelancer-cleaning.jpg",
        servicesCount: 6,
        averageRating: 4.6,
        firstName: "Marija",
        lastName: "Stojanović",
        user: getUser(10),
        },
        {
        id: 4,
        city: "Čačak",
        address: "Industrijska zona bb",
        description:
            "Auto-mehaničar specijalizovan za brze intervencije i redovno održavanje vozila. Pružam usluge malog servisa, dijagnostike i popravki na terenu.",
        image: "/images/freelancer-auto.jpg",
        servicesCount: 9,
        averageRating: 4.5,
        firstName: "Vladimir",
        lastName: "Pavlović",
        user: getUser(11),
    },
    {
        id: 5,
        city: "Novi Sad",
        address: "Bulevar Evrope 92",
        description:
            "Samostalni serviser klima uređaja sa višegodišnjim iskustvom u popravci, redovnom održavanju i dubinskom čišćenju klima uređaja. Pružam usluge dezinfekcije, dopune freona i dijagnostike kvarova za kućne i poslovne objekte.",
        image: "/images/freelancer-ac-service.jpg",
        servicesCount: 7,
        averageRating: 4.7,
        firstName: "Marko",
        lastName: "Jovanović",
        user: getUser(12),
    },
    {
        id: 6,
        city: "Beograd",
        address: "Nemanjina 15",
        description:
            "Samostalni pravnik sa iskustvom u pružanju pravnih usluga fizičkim i pravnim licima. Bavim se pravnim savetovanjem, izradom ugovora, zastupanjem pred sudovima i rešavanjem imovinsko-pravnih i radno-pravnih odnosa.",
        image: "/images/freelancer-lawyer.jpg",
        servicesCount: 6,
        averageRating: 4.6,
        firstName: "Jelena",
        lastName: "Marković",
        user: getUser(15),
    },
    {
        id: 7,
        city: "Novi Sad",
        address: "Bulevar Oslobođenja 22",
        description: "Iskusni moler sa više od 10 godina rada na unutrašnjem i spoljašnjem farbanju, dekorativnim tehnikama i adaptacijama prostora. Nudim preciznost, kvalitetnu izradu i savete za odabir boja i materijala.",
        image: "/images/freelancer-painter.jpg",
        servicesCount: 5,
        averageRating: 4.7,
        firstName: "Marko",
        lastName: "Petrović",
        user: getUser(17)
    }
];



export const mockProfiles: Profile[] = [...mockCompanies,...mockFreelancers,];
const getProfile = (idProfile: number, idUser: number) => mockProfiles.find((p)=>p.id === idProfile && p.user.id === idUser)!;



export const mockServices: FullServiceDto[] = [
    {
        id: 1,
        title: "Servis klime",
        description: "Redovni godišnji servis klima uređaja\nČišćenje filtera i unutrašnje jedinice\nPunjenje freonom (R32, R410a...)\nDetekcija i popravka kvarova\nDezinfekcija i antibakterijsko čišćenje klime",
        price: 7000,
        createdAt: new Date("2025-12-01"),
        category: getCategory(2),
        user: getUser(12),
        profile: getProfile(5,12)
        
    },
    {
        id: 2,
        title: "Čišćenje i popravka komponenti računara",
        description: "Vaši uređaji ne rade kako treba? Nudimo profesionalno čišćenje i popravku kompjuterskih delova i periferija za dugotrajan i pouzdan rad.",
        price: 5000,
        createdAt: new Date("2026-01-11"),
        category: getCategory(1),
        user: getUser(4),
        profile: getProfile(2,4)
    },
    {
        id: 3,
        title: "Žensko šišanje - sve dužine kose",
        description: "Lepa i zdrava kosa najlepši je „nakit“ na ženi, ali za to je potreban trud kao i znanje i iz tog razloga veoma je važno kome ćete poveriti brigu o Vašoj kosi. Mesto gde je zdravlje kose, kao i stručnost, na prvom mestu sada je na samo jedan klik od Vas",
        price: 1700,
        createdAt: new Date("2025-12-20"),
        category: getCategory(4),
        user: getUser(5),
        profile: getProfile(2,5)
    },
    {
        id: 4,
        title: "Manikir + lakiranje noktiju",
        description: "Profesionalni manikir za negovane ruke, zdrave nokte i uredan, dugotrajan izgled.",
        price: 2000,
        createdAt: new Date("2025-12-01"),
        category: getCategory(4),
        user: getUser(5),
        profile: getProfile(2,5)
    },
    {
        id: 5,
        title: "Optimizacija Operativnog Sistema | Rešavanje Problema sa Hlađenjem",
        description: "Vaš računar je usporen, pregreva se ili bučno radi? Nudimo profesionalne usluge optimizacije sistema i poboljšanja hlađenja za stabilan i efikasan rad.",
        price: 8000,
        createdAt: new Date("2026-01-11"),
        category: getCategory(1),
        user: getUser(4),
        profile: getProfile(2,4)
    },
    {
        id: 6,
        title: "Kurs REVIT-a za arhitekte",
        description: "Predavač je Autodesk Certifikovani Instruktor PLATINUM, iskustvo preko 30 godina rada. Časovi mogu biti onlajn ili uživo, na srpskom ili engeskom jeziku. Po završenoj obuci se dobija zvanična Autodeskova diploma ATC. Časovi se održavaju najčešće po 3 termina nedeljno sa 2 ili 3 školska časa 45 min. po terminu. Kurs obuhvata 12 termina.",
        price: 52000,
        createdAt: new Date("2026-01-08"),
        category: getCategory(3),
        user: getUser(1),
        profile: getProfile(1,1)
    },
    {
        id: 7,
        title: "Pansion za pse - jednonedeljni boravak",
        description: "Dobrodošli u Pansion za pse, smešten u domaćinstvu okruženim prirodom, gde će vaš ljubimac uživati dok ste vi odsutni. Za Vašeg ljubimca obezbeđujemo: čuvanje, šetnju, vežbe, obrok, veterinarsku negu. Vaš pas zaslužuje najbolju brigu. Rezervišite mesto u našem pansionu za pse već danas!",
        price: 8000,
        createdAt: new Date("2025-12-10"),
        category: getCategory(5),
        user: getUser(14),
        profile: getProfile(7,14)
    },
    {
        id: 8,
        title: "Generalno čišćenje stanova",
        description:
            "Detaljno čišćenje stanova i kuća, uključujući kuhinju, kupatilo, podove i staklene površine. Idealno nakon renoviranja ili pred useljenje.",
        price: 6000,
        createdAt: new Date("2025-08-20"),
        category: getCategory(6),
        user: getUser(10),
        profile: getProfile(3,10)
    },
    {
        id: 9,
        title: "Mali servis vozila",
        description:
            "Zamena ulja i filtera uz osnovnu dijagnostiku vozila. Brza i pouzdana usluga održavanja putničkih automobila.",
        price: 5500,
        createdAt: new Date("2026-01-11"),
        category: getCategory(7),
        user: getUser(11),
        profile: getProfile(4,11)
    },
    {
        id: 10,
        title: "Relaks masaža celog tela",
        description:
            "Profesionalna relaks masaža koja pomaže u smanjenju stresa, opuštanju mišića i poboljšanju cirkulacije. Tretman se prilagođava individualnim potrebama klijenta.",
        price: 4500,
        createdAt: new Date("2025-12-12"),
        category: getCategory(4),
        user: getUser(5),
        profile: getProfile(2,5)
        
    },
    {
        id: 11,
        title: "Pravno savetovanje",
        description:
            "Stručno pravno savetovanje za fizička i pravna lica. Pomoć u izradi ugovora, tumačenju zakona i rešavanju imovinsko-pravnih odnosa.",
        price: 7000,
        createdAt: new Date("2025-06-20"),
        category: getCategory(8),
        user: getUser(15),
        profile: getProfile(6,15)
    },
    {
        id: 12,
        title: "Kombi prevoz stvari",
        description:
            "Pouzdana usluga kombi prevoza za selidbe i transport robe na teritoriji grada i okoline. Brza organizacija i siguran prevoz.",
        price: 9000,
        createdAt: new Date("2025-06-18"),
        category: getCategory(9),
        user: getUser(16),
        profile: getProfile(8,16)
    },
    {
        id: 13,
        title: "Krečenje stanova",
        description:
            "Profesionalno krečenje stanova i kuća, uključujući pripremu zidova i završnu obradu. Kvalitetan i uredan rad po dogovoru.",
        price: 12000,
        createdAt: new Date("2025-06-25"),
        category: getCategory(11),
        user: getUser(17),
        profile: getProfile(7,17)
    },
    {
        id: 14,
        title: "Ketering za proslave",
        description:
            "Organizacija keteringa za rođendane, svadbe i poslovne događaje. Bogat meni, profesionalna usluga i prilagođavanje potrebama klijenata.",
        price: 25000,
        createdAt: new Date("2025-06-15"),
        category: getCategory(14),
        user: getUser(17),
        profile: getProfile(7,17)
    }


];









