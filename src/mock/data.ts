import { FullServiceDto, FullCategoryDto } from "@/shared/types";

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

// Helper funkcija da se pronadje kategorija u listi
const K = (id: number) => mockCategories.find((k) => k.id === id)!;

export const mockServices: FullServiceDto[] = [
    {
        id: 1,
        title: "Servis klime",
        description: "Redovni godišnji servis klima uređaja\nČišćenje filtera i unutrašnje jedinice\nPunjenje freonom (R32, R410a...)\nDetekcija i popravka kvarova\nDezinfekcija i antibakterijsko čišćenje klime",
        price: 7000,
        createdAt: new Date("2025-12-01"),
        category: K(2),
        
    },
    {
        id: 2,
        title: "Čišćenje i popravka komponenti računara",
        description: "Vaši uređaji ne rade kako treba? Nudimo profesionalno čišćenje i popravku kompjuterskih delova i periferija za dugotrajan i pouzdan rad.",
        price: 5000,
        createdAt: new Date("2025-12-17"),
        category: K(1),
    },
    {
        id: 3,
        title: "Žensko šišanje - sve dužine kose",
        description: "Lepa i zdrava kosa najlepši je „nakit“ na ženi, ali za to je potreban trud kao i znanje i iz tog razloga veoma je važno kome ćete poveriti brigu o Vašoj kosi. Mesto gde je zdravlje kose, kao i stručnost, na prvom mestu sada je na samo jedan klik od Vas",
        price: 1700,
        createdAt: new Date("2025-12-20"),
        category: K(4),
    },
    {
        id: 4,
        title: "Manikir + lakiranje noktiju",
        description: "Profesionalni manikir za negovane ruke, zdrave nokte i uredan, dugotrajan izgled.",
        price: 2000,
        createdAt: new Date("2025-12-01"),
        category: K(4),
    },
    {
        id: 5,
        title: "Optimizacija Operativnog Sistema | Rešavanje Problema sa Hlađenjem",
        description: "Vaš računar je usporen, pregreva se ili bučno radi? Nudimo profesionalne usluge optimizacije sistema i poboljšanja hlađenja za stabilan i efikasan rad.",
        price: 8000,
        createdAt: new Date("2025-12-10"),
        category: K(1),
    },
    {
        id: 6,
        title: "Kurs REVIT-a za arhitekte",
        description: "Predavač je Autodesk Certifikovani Instruktor PLATINUM, iskustvo preko 30 godina rada. Časovi mogu biti onlajn ili uživo, na srpskom ili engeskom jeziku. Po završenoj obuci se dobija zvanična Autodeskova diploma ATC. Časovi se održavaju najčešće po 3 termina nedeljno sa 2 ili 3 školska časa 45 min. po terminu. Kurs obuhvata 12 termina.",
        price: 52000,
        createdAt: new Date("2026-01-08"),
        category: K(3),
    },
    {
        id: 7,
        title: "Pansion za pse",
        description: "Dobrodošli u Pansion za pse, smešten u domaćinstvu okruženim prirodom, gde će vaš ljubimac uživati dok ste vi odsutni. Za Vašeg ljubimca obezbeđujemo: čuvanje, šetnju, vežbe, obrok, veterinarsku negu. Vaš pas zaslužuje najbolju brigu. Rezervišite mesto u našem pansionu za pse već danas!",
        price: 8000,
        createdAt: new Date("2025-12-10"),
        category: K(5),
    }
];