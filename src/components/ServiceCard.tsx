import { FullServiceDto} from "@/shared/types";
import Image from "next/image"
import Link from "next/link"

type Props = {
    service: FullServiceDto;
}

export default function ServiceCard({ service }: Props){

    return (
        <div
            key={service.id}
            className="group relative overflow-hidden rounded-lg border border-gray-400 bg-gray-100 hover:scale-103 shadow-xl max-h-105 " >
            <Image
                src={service.image && service.image.length > 0
                        ? `${service.image}`
                        : `https://picsum.photos/seed/${service.id}/300/300`}
                alt=""
                width={300}
                height={400}
                className="h-45 w-full object-cover transition-transform duration-200 group-hover:scale-105" />

            <div className="flex flex-col gap-3 p-4 ">
                <h3 className="font-semibold text-xl truncate">{service.title}</h3>
                <p className="text-base text-gray-500">{service.profile.city}</p>
                <p className="font-lg line-clamp-2">{service.description}</p>
                <p className="text-base text-gray-500">{service.category.name}</p>
                <p className="text-xl font-bold border border-gray-400 p-1">{service.price} rsd</p>
            </div>
            <Link href={`/services/${service.id}`} className="absolute inset-0" />
        </div>
    )
}