"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";


interface PropsFormLogout {
  setIsLogoutOpen: (value: boolean) => void;
}

export default function FormLogout({ setIsLogoutOpen }: PropsFormLogout) {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const { logout } = useAuth();

  const handleLogout = async () => { 
  setLoading(true);
  try {
      await logout();

      setIsLogoutOpen(false);

      router.push("/");

    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="absolute bottom-full md:top-full right-0 mt-5 z-50  bg-gray-100"> 
        {/* top-full - element tacno ispod roditelja, gornja ivica elementa se poklapa sa donjom ivicom roditelja (na desktop)
            bottom-full -element tacno iznad roditelja, donja ivica elementa se poklapa sa gornjom ivicom roditelja (na mobilnim)  
            right-0 - element je poravnat uz desni rub roditelja, */}
      <div className="rounded-lg p-4 w-48 bg-white border border-gray-300 shadow-lg">
        <h3 className="text-lg font-semibold mb-3">Nalog</h3>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full bg-red-400 text-white py-2 rounded-md hover:bg-red-700"
        >
          {loading ? "Odjavljivanje..." : "Odjavi se"}
        </button>
      </div>
    </div>
  );
}

