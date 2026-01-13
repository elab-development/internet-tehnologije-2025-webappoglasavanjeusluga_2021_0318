import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProfileCard from "@/components/ProfileCard";
import { mockCategories, mockProfiles, mockServices, mockUsers } from "@/mock/data";
import { FullUserDto } from "@/shared/types";
import Image from "next/image";


type Props = {
  params: {
    serviceId: string;
  }
}

export default async function Service({ params }: Props) {

  const p = await params;

  const serviceId = Number(p.serviceId);

  const service = mockServices.find((s) => s.id === serviceId)!;
  const user = mockUsers.find((u) => u.id===service.user.id)!;

  const users: FullUserDto[] = [user];
  const profile = mockProfiles.find((p) => p.id===service.profile.id && p.user.id===service.user.id)!;

  return (
      
      <div className="bg-linear-to-r from-blue-400 via-blue-200 to-yellow-100">
        <Navbar></Navbar>
        <div className=" py-5 px-5 mx-auto max-w-6xl">
          <div className="flex gap-1 justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-bold mb-4"> {service.title} </h1>
              <Image src="https://picsum.photos/700/500" width={700} height={500} alt="Slika usluge" className=""/>
              <p className="font-semibold text-base md:text-xl py-3">Cena: {service.price} rsd</p>
            </div>
            <div className="sm:pt-10">
              <ProfileCard profile={profile} users={users}></ProfileCard>
            </div> 
          </div>
           
          <div className="border border-gray-400 bg-gray-100 mt-3 p-2 gap-1">
            <p className="font-semibold text-sm bg-gray-300 pl-1">OSNOVNI PODACI</p>
            <div className="flex flex-col xl:flex-row ">
              <div className="xl:w-1/2 py-3">
                <h1><i className="text-gray-500">Usluga:</i> {service.title} </h1>
                <p><i className="text-gray-500">Kategorija:</i> {mockCategories.find((k)=>k.id===service.category.id)?.name}</p>
                <p><i className="text-gray-500">Kreirana:</i>{service.createdAt.toLocaleDateString("sr-RS")}</p>
              </div>
                
              <div className="xl:w-1/2 py-3">
                <p><i className="text-gray-500">Pružalac:</i> 
                    {"companyName" in profile ? profile.companyName : `${profile.firstName} ${profile.lastName}`}
                </p>
                <p><i className="text-gray-500">Mesto</i>: {profile.city}</p>
                <p><i className="text-gray-500">Adresa:</i> {profile.address}</p>
                <p><i className="text-gray-500">Telefon:</i> {user.phone}</p>
                <p><i className="text-gray-500">Pružalac od:</i> {user.createdAt.toLocaleDateString("sr-RS")}</p>
              </div>
            </div>
              
              <hr className="border-gray-300"/>
              <p className="py-5"><i className="text-gray-500">Opis:</i> <br className="mb-2"/>{service.description}</p>
          </div>
         
        </div>

        <Footer></Footer>
      </div>
  );

}

