import Image from "next/image";
import React, { useState, useEffect } from "react";
import FormLogout from "./FormLogout";
import { useAuth } from "@/components/AuthProvider";

export default function UserCard() {
  const { status, user } = useAuth(); 

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  if (status === "loading") return null;

  if (status !== "authenticated") return null;

  return (
    <div className="relative"> 
      <button
        onClick={() => setIsLogoutOpen((prev) => !prev)} //prev - je trenutna vrednost state-a
        className="flex flex-col items-center rounded-4xl hover:text-gray-600 cursor-pointer"
      >
        <Image src="/images/image3.png" alt="Korisnik" width={50} height={50} />
        <p className="text-xs text-white">{user.firstName} {user.lastName}</p>
      </button>

      {isLogoutOpen && <FormLogout setIsLogoutOpen={setIsLogoutOpen}/>}
    </div>
  );
}

