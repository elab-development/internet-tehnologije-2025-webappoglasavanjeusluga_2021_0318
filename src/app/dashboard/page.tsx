// import NavbarDashboard from "@/components/NavbarDashboard";
// import FooterDashboard from "@/components/FooterDashboard";
// import ProfilePageContent from "@/components/ProfilePageContent";

// export default  function Dashboard() {
//  const res = await fetch(`http://localhost:3000/api/profiles/me`, {
//   cache: "no-store",
//   credentials: "include",
// });

//   if (!res.ok) {
//     throw new Error("Greška pri učitavanju profila");
//   }

//   const data = await res.json();
//   const { profile, services, reviews } = data;

//   return (
//     <div className="bg-linear-to-r from-blue-400 via-blue-200 to-yellow-100">
//       <NavbarDashboard />
//       <p className="text-center text-3xl">Dashboard stranica</p>
//       <ProfilePageContent
//         profile={profile}
//         services={services}
//         reviews={reviews}
//       />
//       <FooterDashboard />
//     </div>
//   );
// }

// import NavbarDashboard from "@/components/NavbarDashboard";
// import FooterDashboard from "@/components/FooterDashboard";
// import ProfilePageContent from "@/components/ProfilePageContent";

// export default async function Dashboard() {
//  const res = await fetch(`http://localhost:3000/api/profiles/me`, {
//   cache: "no-store",
//   credentials: "include",
// });

//   if (!res.ok) {
//     throw new Error("Greška pri učitavanju profila");
//   }

//   const data = await res.json();
//   const { profile, services, reviews } = data;

//   return (
//     <div className="bg-linear-to-r from-blue-400 via-blue-200 to-yellow-100">
//       <NavbarDashboard />
//       <p className="text-center text-3xl">Dashboard stranica</p>
//       <ProfilePageContent
//         profile={profile}
//         services={services}
//         reviews={reviews}
//       />
//       <FooterDashboard />
//     </div>
//   );
// }

import NavbarDashboard from "@/components/NavbarDashboard";
import FooterDashboard from "@/components/FooterDashboard";
import ProfilePageContent from "@/components/ProfilePageContent";
import { cookies } from "next/headers";

export default async function Dashboard() {

  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;

  const res = await fetch("http://localhost:3000/api/profiles/me", {
    cache: "no-store",
    headers: {
      Cookie: `auth=${token}`, //rusno saljemo cookie kroz header
    },
  });

  if (!res.ok) {
    throw new Error("Greška pri učitavanju profila");
  }

  const data = await res.json();
  const { profile, services, reviews } = data;

  return (
    <div className="bg-linear-to-r from-blue-400 via-blue-200 to-yellow-100">
      <NavbarDashboard />
      <div className="text-center mt-3 mb-2 flex flex-col gap-2">
          <p className="text-4xl">Dashboard</p>
          <p className="text-3xl">- Vas profil -</p>
      </div>
      

      <ProfilePageContent
        profile={profile}
        services={services}
        reviews={reviews}
      />

      <FooterDashboard />
    </div>
  );
}