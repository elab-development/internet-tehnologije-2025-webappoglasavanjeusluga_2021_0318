import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProfilePageContent from "@/components/ProfilePageContent";

type Props = {
  params: {
    profileId: string;
  };
};

export default async function Profile({ params }: Props) {
  const p = await params;

  const profileId = Number(p.profileId);

  const res = await fetch(`http://localhost:3000/api/profiles/${profileId}`,{ cache: "no-store" });

  if (!res.ok) {
    throw new Error("Greška pri učitavanju profila");
  }

  const data = await res.json();

  const { profile, services, reviews } = data;

  return (
    <div className="bg-linear-to-r from-blue-400 via-blue-200 to-yellow-100">
      <Navbar />

      <ProfilePageContent profile={profile} services={services} reviews={reviews}/>

      <Footer />
    </div>
  );
}