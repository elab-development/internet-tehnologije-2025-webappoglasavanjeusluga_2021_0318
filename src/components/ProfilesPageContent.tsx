import HeroSection from "@/components/HeroSection";
import ProfileCard from "@/components/ProfileCard";
//import { mockProfiles, mockUsers } from "@/mock/data";
import { FullProfileDto} from "@/shared/types";
import { useEffect, useState } from "react";

export default function ProfilesPageContent() {

      const [profiles, setProfiles] = useState<FullProfileDto[]>([]);
 
      const [search, setSearch] = useState("");


       useEffect(() => {
           async function loadProfiles() {
               const res = await fetch("/api/profiles");
               const data = await res.json();
                const shuffledProfiles =[...data] .sort(() => Math.random() - 0.5);
       
               setProfiles(shuffledProfiles);
               
               }
              loadProfiles();
              }, []);
      useEffect(() => {
               
                  let data = profiles;
                   const shuffledProfiles =[...data] .sort(() => Math.random() - 0.5);
                  console.log(search);
                  //let data = shuffledProfiles;
                   if (search.trim()) {
                      data = data.filter(d => {
                      if (d.companyName!=null) {
                        // Kompanija
                        return d.companyName
                          ?.toLowerCase()
                          .normalize()
                          .includes(search.toLowerCase());
                      } else {
                        // Freelancer
                        return d.firstName
                          ?.toLowerCase()
                          .normalize()
                          .includes(search.toLowerCase())
                          || d.lastName
                            ?.toLowerCase()
                            .normalize()
                            .includes(search.toLowerCase());
                      }
                    });
      
                   }
                    setProfiles(data);
                   
                }, [search]);
                   
  return (
    <div>
        {/* Hero sekcija */}
        <HeroSection search = {search} setSearch ={setSearch}
      title={"Pronađite profil kompanije ili samostalca za čiju uslugu ste zainteresovani"}
      desc={"Na profilu možete pronaći kontakt informacije o pružaocu usluge, kao i usluge koje pruža.\nIzaberi, rezerviši ili dogovori uslugu direktno!"}
      placeholder={"Pretraži profil..."}/>

      {/* Horizontalni talas koji razdvaja HeroSection od Sidebar-a i Usluga */}
            <div className="w-full h-10 overflow-hidden bg-gray-200">
            <svg
                className="w-full h-full"
                viewBox="0 0 1440 40"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
            >
                <path
                d="M0,20 C360,0 1080,40 1440,20 L1440,40 L0,40 Z"
                fill="#60a5fa" 
                />
            </svg>
            </div>

        {/* Katice profila */}
        <div id="trazi" className="bg-linear-to-r from-blue-400 via-blue-200 to-yellow-100 pt-20">
        {profiles.length===0 ? (
             <p className="text-center text-gray-500 pb-50 pt-20"> Nema profila </p>
        ):(
           
            <div className="flex mx-auto md:flex-row flex-wrap  justify-center gap-5 p-10 max-w-7xl">
                {profiles.map((profile, id) => (
                <ProfileCard key={id} profile={profile}
                />
                ))}
            </div> 
        )}
        </div>

    </div>
  )
}
