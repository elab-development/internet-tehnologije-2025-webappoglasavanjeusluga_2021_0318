import Image from "next/image";
import React, { useState, useEffect } from "react";
import FormLogout from "./FormLogout";

export default function UserCard() {

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(localStorage.getItem("email"));
  }, []);

  return (
    <div className="relative"> 
      <button
        onClick={() => setIsLogoutOpen((prev) => !prev)} //prev - je trenutna (prethodna) vrednost state-a
        className="flex flex-col items-center rounded-4xl hover:text-gray-600 cursor-pointer"
      >
        <Image src="/images/image3.png" alt="Korisnik" width={50} height={50} />
        <p className="text-xs text-white">{email}</p>
      </button>

      {isLogoutOpen && <FormLogout/>}
    </div>
  );
}

