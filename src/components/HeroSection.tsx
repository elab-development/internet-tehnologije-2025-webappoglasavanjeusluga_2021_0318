import Image from "next/image";
import Link from "next/link";

type PropsHeroSection = {
  search: string,
  setSearch: (value: string) => void,
  title: string,
  desc: string,
  placeholder: string
}

export default function HeroSection({search, setSearch, title, desc, placeholder}: PropsHeroSection) {
  return (
    <section className="relative py-12 md:py-20">
      
      {/* Pozadinska slika */}
      <Image
        src="/images/image1.jpg"
        alt="Hero background"
        fill
        priority
        className="object-cover opacity-40 "
      />

      {/* Sadržaj preko slike */}
      <div className="relative flex flex-col gap-1 z-20 max-w-4xl mx-auto px-6 text-center">

            <h1 className="text-2xl md:text-4xl font-semibold text-gray-800 mb-4">
            {title}
            </h1>

            <p className=" text-1xl md:text-2xl text-gray-600 mb-8">
            {desc}
            </p>

            {/* Search */}
            <div className="flex flex-row md:text-xl gap-2 justify-center mb-6">
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full  px-4 py-3 border rounded-md focus:outline-none border-gray-300 bg-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <a href="#trazi" className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 scroll-smooth">
                    Traži 
                </a>
            </div>

            {/* Buttons */}
            <div className="flex flex-row md:text-xl gap-4 justify-center">
                <a href="" className="px-3 py-3 bg-gray-700 text-white rounded-md hover:bg-gray-800 ">
                    Postavi svoj oglas ❯
                </a>

                {placeholder==="Pretraži uslugu..." ? (
                    <a href="#trazi" className="px-3 py-3 border  rounded-md border-gray-400 text-gray-700 hover:bg-gray-200 bg-white scroll-smooth">
                      Pronađi usluge ❯
                    </a>
                ):(
                    <Link href="/" className="px-3 py-3 border  rounded-md border-gray-400 text-gray-700 hover:bg-gray-200 bg-white scroll-smooth">
                      Pronađi usluge ❯
                    </Link>
                )
                }
                
            </div>

      </div>
    </section>
  );
}