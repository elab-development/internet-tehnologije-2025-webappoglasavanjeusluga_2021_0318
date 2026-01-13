import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProfilePageContent from "@/components/ProfilePageContent";
import { mockProfiles} from "@/mock/data";


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

  const profile = mockProfiles.find((p)=>p.id === profileId && p.user.id === userId)!;
  
  return (
      
      <div className="bg-linear-to-r from-blue-400 via-blue-200 to-yellow-100">
        <Navbar></Navbar>

        <ProfilePageContent profile={profile}></ProfilePageContent>
        
        <Footer></Footer>
      </div>
  );

}