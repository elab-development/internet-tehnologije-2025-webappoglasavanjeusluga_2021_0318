import React from 'react'
import Image from 'next/image'

export default function Footer() {
  return (
    <div className='relative z-90  bg-cyan-700 text-white'>

      <div className=' text-xs md:text-base flex flex-row justify-between md:px-40 bg-blue p-5'>
          <div className='  px-5 h-40 '>
              <h1 className='font-bold py-3 pb-7 md:text-lg whitespace-nowrap'>Brzi linkovi</h1>
              <div className='flex flex-col gap-2'>
                <a href="" className="hover:text-gray-300">Usluge</a>
                <a href="" className="hover:text-gray-300">Registracija</a>
              </div>
          </div>
          <div className=' border-l px-3 border-amber-50 h-45'>
              <h1 className='font-bold py-3 pb-7 md:text-lg whitespace-nowrap'>Kontakt informacije</h1>
              <div className='flex flex-col gap-2'>
                <a href="" className="hover:text-gray-300">O nama</a>
                <a href="" className="hover:text-gray-300">Profili</a>
              </div>
          </div>
          <div className='flex flex-col border-l px-3 border-amber-50 h-45'>
              <h1 className='font-bold py-3 pb-7 md:text-lg whitespace-nowrap'>Mobilne aplikacije</h1>
              <div className='m-1 relative h-10 sm:h-12 md:h-20 w-30 sm:w-35 md:w-40 rounded-md'>
                <a href="" className=""><Image src="/images/image4.png" alt="Google Play" className="object-cover transition-transform duration-300 hover:scale-110" fill/></a>
              </div>
              <div className='m-1 relative h-10 sm:h-12 md:h-20 w-30 sm:w-35 md:w-40 rounded-md'>
                <a href="" className=""><Image src="/images/image5.png" alt="App Store" className="object-cover transition-transform duration-300 hover:scale-110" fill/></a>
              </div>
          </div>
      </div>
      
      <div>
        <hr className="border-t  border-white my-1 mx-5" />
        <hr className="border-t  border-white my-1 mx-5" />
        <p className="py-2 text-center text-xs md:text-lg">© 2026 SveUsluge • by Ivana&Branka</p>
      </div>
      
    </div>
  )
}
