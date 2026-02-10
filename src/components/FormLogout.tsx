"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function FormLogout() {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  const handleLogout = async () => { 
  setLoading(true);

  try {
    await fetch("/api/auth/logout", { 
      method: "POST",                 
      headers: {                      
        "Content-Type": "application/json", 
      },
    });

      localStorage.clear();
   
      router.refresh();
      router.push("/");
      //window.location.reload();

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
          {loading ? "Odjavljivanje..." : "Logout"}
        </button>
      </div>
    </div>
  );
}

