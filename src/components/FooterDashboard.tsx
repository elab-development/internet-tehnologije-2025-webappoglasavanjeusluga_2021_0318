"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from "next/navigation";

export default function FooterDashboard() {
  const router = useRouter();
  return (
    <div className='relative z-40  bg-cyan-700 text-white'>

      <div className=' text-xs md:text-base flex flex-row justify-between md:px-40 bg-blue p-5'>
          <div className='  px-5 h-40 '>
              <h1 className='font-bold py-3 pb-7 md:text-lg whitespace-nowrap'>Brzi linkovi</h1>
              <div className='flex flex-col gap-2'>
                <Link href="/dashboard" className="hover:text-gray-300" 
                          onClick={() => {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                          //router.push('/');
                          }}>Profil</Link>
                <a href="/reservations" className="hover:text-gray-300">Rezervacije</a>
              </div>
          </div>
          <div className=' border-l px-3 border-amber-50 h-45'>
              <h1 className='font-bold py-3 pb-7 md:text-lg whitespace-nowrap'>Kontaktirajte nas</h1>
              <div className='flex flex-col gap-2'>
                <p>Email: sveusluge@gmail.com</p>
                <p>Broj telefona: 063 123 456</p>
              </div>
          </div>
          <div className='flex flex-col border-l px-3 border-amber-50 h-45'>
              <h1 className='font-bold py-3 pb-7 md:text-lg whitespace-nowrap'>Mobilne aplikacije</h1>
              <div className='m-1 relative h-10 sm:h-12 md:h-20 w-30 sm:w-35 md:w-40 rounded-md'>
                <a href="https://play.google.com/store/games?device=windows" target="_blank" className=""><Image src="/images/image4.png" alt="Google Play" className="object-cover transition-transform duration-300 hover:scale-110" fill/></a>
              </div>
              <div className='m-1 relative h-10 sm:h-12 md:h-20 w-30 sm:w-35 md:w-40 rounded-md'>
                <a href="https://www.apple.com/app-store/" target="_blank" className=""><Image src="/images/image5.png" alt="App Store" className="object-cover transition-transform duration-300 hover:scale-110" fill/></a>
              </div>
          </div>
      </div>
      
      <div className="pb-10">
        <hr className="border-t  border-white my-1 mx-5" />
        <hr className="border-t  border-white my-1 mx-5" />
        <p className="py-2 text-center text-xs md:text-lg">© 2026 SveUsluge • by <i>Ivana&Branka</i> </p>
      </div>
      
    </div>
  )
}
