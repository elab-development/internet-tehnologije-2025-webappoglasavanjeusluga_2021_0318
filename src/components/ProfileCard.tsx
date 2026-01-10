import { FullCompanyDto, FullFreelancerDto, FullUserDto } from "@/shared/types";
import Image from "next/image";
import Link from "next/link";

type Props = {
    profile: FullCompanyDto | FullFreelancerDto;
    users: FullUserDto[];
}

export default function ServiceCard({ profile, users}: Props) {

    return (
        <div
            key={profile.id}
            className="group relative overflow-hidden rounded-3xl border border-gray-400 bg-gray-100 max-w-80 hover:scale-103" >
            
            <div className="flex flex-row justify-between p-2">
                { "companyName" in profile  ? (
                    <p className="text-base p-1 border rounded-xl w-21 h-8 mx-1 my-1 text-yellow-600 bg-amber-100">Kompanija</p>
                    ) : (
                    <p className="text-base p-1 border rounded-xl w-23 h-8 mx-1 my-1  text-blue-700 bg-blue-100">Samostalac</p>
                    )
                }

                { "companyName" in profile && profile.verified===true ? (
                    <Image src="/images/bedz-verifikovan.png" alt="Bedž" width={50} height={50}></Image>
                    ) : (
                    <p></p>
                    )
                } 
            </div>
            
            <div className="flex flex-col gap-3 p-4 px-5 justify-center items-center w-80 ">

                <h3 className="font-semibold text-2xl truncate">
                 {"companyName" in profile ? profile.companyName : `${profile.firstName} ${profile.lastName}`}
                </h3>

                <div className="w-30 h-30 rounded-full overflow-hidden">
                    <Image
                        src="https://picsum.photos/300/400"
                        alt="Avatar"
                        width={150}
                        height={150}
                        className="object-cover transition-transform duration-200 group-hover:scale-110"/>
                </div>
                
            </div>
                <div className="p-4">
                    <p><i className="text-base text-gray-500">Odgovorno lice:</i>{" "}
                    {
                        
                        users.find((u) => u.id === profile.user.id)?.firstName
                    }
                    {" "}
                    {
                        users.find((u) => u.id === profile.user.id)?.lastName
                    
                    }
                    
                    </p>

                    <p><i className="text-base text-gray-500">Mesto:</i>{" "+profile.city}</p>

                    <p><i className="text-base text-gray-500">Telefon:</i>{" "+profile.phone}</p>

                    <p className="line-clamp-3 p-1 my-3 border border-gray-400 rounded-2xl"><i className="text-base text-gray-500">Opis:</i>{" "+profile.description}</p>

                </div>
                
            <Link href={`/profiles/${profile.id}`} className="absolute inset-0" />
        </div>
    )
}