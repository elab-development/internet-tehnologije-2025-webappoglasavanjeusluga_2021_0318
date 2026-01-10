"use client"
import { useState } from "react";
import Image from "next/image";
import BtnLogin from "./BtnLogin";
import { useRouter } from "next/navigation";
import UserCard from "./UserCard";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  

  return (
    

    <div className="sticky top-0 z-80">
    
      <nav className="p-4 bg-gray-800">
        <div className="max-w-7xl max-h-15 mx-auto flex justify-between items-center">
          
          {/* Logo */} 
          <Image src="/images/image2.png" 
          alt="LOGO"
          width={150}
          height={150}
          className="mr-3"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            router.push('/');
          }}/>
  

          {/* Meni (desktop) */}
           <div className="hidden md:flex gap-5 items-center">
            <div className="flex gap-10 items-center text-xl text-white">
                <Link href="/" className="hover:text-gray-300" 
                          onClick={() => {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          router.push('#usluge');
                          }}>Usluge</Link>
                <a href="/profiles" className="hover:text-gray-300">Profili</a>
                <a href="" className="hover:text-gray-300 whitespace-nowrap pr-2">O nama</a>
            </div>
            
            <div className="flex gap-3 ml-4 items-center text-center">
                <a href="" className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-red-400 ">Registracija</a>
                <BtnLogin></BtnLogin>
                <UserCard></UserCard>
            </div>
    
          </div>

          {/* Hamburger dugme (mobilni) */}
          <button
            className="md:hidden text-3xl text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
              ☰
          </button>
        </div>

        {/* Meni (mobilni) */}
        <div
          className={`md:hidden flex flex-col w-full px-4 py-2 space-y-2 transition-all duration-300 bg-gray-800 text-white ${
            isOpen ? "block" : "hidden"}`}>
             <Link href="/" className="hover:text-gray-300" 
                          onClick={() => {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          router.push('/');
                          }}>Usluge</Link>
                <a href="/profiles" className="hover:text-gray-300">Profili</a>
            <a href="" className=" text-white hover:text-gray-300">O nama</a>
            
        </div> 
      </nav>  
    
        {/* Dugme za registraciju, logovanje i UserCard (mobilni) */}
          
          <div className="fixed md:hidden">
              <div className="fixed flex gap-2 bottom-0 ">
                <a href="" className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-red-400 ">Registracija</a>
            
                <BtnLogin></BtnLogin>
              </div>

              <div className="fixed p-1 max-h-25 max-w-25 rounded-md bottom-0 right-0 bg-cyan-700 ">
                <UserCard></UserCard>
              </div>
          </div>

    </div>
    
  );
}