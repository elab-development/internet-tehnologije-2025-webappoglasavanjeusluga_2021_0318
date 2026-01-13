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
            className="group relative overflow-hidden rounded-3xl border border-gray-400 bg-gray-100 
            max-w-80 hover:scale-103 shadow-xl" >
            
            <div className="flex flex-row justify-between p-2">
                { "companyName" in profile  ? (
                    <p className="text-xs md:text-base p-1 border rounded-xl w-17 h-6 md:w-21 md:h-8 mx-1 my-3 md:my-1 text-yellow-600
                     bg-amber-100">Preduzeće
                    </p>
                    ) : (
                    <p className="text-xs md:text-base p-1 border rounded-xl md:w-23 md:h-8 mx-1 my-1  text-blue-700
                     bg-blue-100">Samostalac
                    </p>
                    )
                }

                { "companyName" in profile && profile.verified===true ? (
                    <Image src="/images/bedz-verifikovan.png" alt="Bedž" width={50} height={50}></Image>
                    ) : (
                    <p></p>
                    )
                } 
            </div>
            
            <div className="flex flex-col gap-1 md:gap-3 p-4 px-5 justify-center items-center  ">

                <h3 className="font-semibold text-base md:text-2xl truncate">
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
                <div className="flex flex-col p-2 md:p-4 gap-1">
                    <p className="text-sm md:text-base whitespace-nowrap"><i className=" text-gray-500">Odgovorno lice:</i> 
                    <br className="sm:hidden" /> {" "}
                    {
                        
                        users.find((u) => u.id === profile.user.id)?.firstName
                    }
                    {" "}
                    {
                        users.find((u) => u.id === profile.user.id)?.lastName
                    
                    }
                    
                    </p>

                    <p className="text-sm md:text-base"><i className=" text-gray-500">Mesto:</i>
                        {" "+profile.city}
                    </p>

                    <p className="text-sm md:text-base"><i className=" text-gray-500">Telefon:</i>
                        {" "+users.find((u) => u.id === profile.user.id)?.phone}
                    </p>

                    <p className="text-sm md:text-base line-clamp-3 p-1 my-2 border border-gray-400 rounded-2xl">
                        <i className="md:text-base text-gray-500">Opis:</i>{" "+profile.description}
                    </p>

                    <p className="text-sm md:text-base "><i className=" text-gray-500">Pružalac od:</i>
                        <br className="sm:hidden" />
                        {" "+users.find((u) => u.id === profile.user.id)?.createdAt.toLocaleDateString("sr-RS")}
                    </p>

                </div>
                
            <Link href={`/profiles/${profile.id}`} className="absolute inset-0" />
        </div>
    )
}