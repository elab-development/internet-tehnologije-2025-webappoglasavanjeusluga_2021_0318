
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProfilePageContent from "@/components/ProfilePageContent";


type Props = {
  params: {
    profileId: string;
    userId: string;
  }
}

export default async function Profile({ params }: Props) {

  const p = await params;

  const profileId = Number(p.profileId);
  const userId = Number(p.userId);

  const res1 = await fetch("http://localhost:3000/api/profiles", {cache: "no-store",});
  const profiles = await res1.json();
  
  const profile = profiles.find((p)=>p.id === profileId && p.user.id === userId)!;

  const res2 = await fetch("http://localhost:3000/api/services", {cache: "no-store",});
  const allServices = await res2.json();
  const services = allServices.filter((s)=>s.profile.id === profileId)!;

  const res3 = await fetch("http://localhost:3000/api/reviews", {cache: "no-store",});
  const allReviews = await res3.json();
  const reviews =  allReviews.filter((r)=>r.profileId === profileId)!;
  
  return (
      
      <div className="bg-linear-to-r from-blue-400 via-blue-200 to-yellow-100">
        <Navbar></Navbar>

        <ProfilePageContent profile={profile} services={services} reviews={reviews}></ProfilePageContent>
        
        <Footer></Footer>
      </div>
  );

}