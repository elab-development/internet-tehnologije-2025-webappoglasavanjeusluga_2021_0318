import Image from 'next/image'

export default function UserCard() {
  return (
    <div>
        <a href="" className="flex flex-col items-center rounded-4xl hover:text-gray-600">
            <Image src="/images/image3.png" alt="Korisnik" width={50} height={50}></Image>
            <p className="text-xs text-white ">Ime i prezime</p>
        </a>
    </div>
  )
}