"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

interface PropsFormLogin {
  setIsLoginOpen: (value: boolean) => void;
}

type UserRole = "USER" | "FREELANCER" | "COMPANY"; //uloge koje backend može vratiti


export default function FormLogin({ setIsLoginOpen }: PropsFormLogin) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const { refresh } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
     
      const endpoint = "/api/auth/login"; // endpoint za login
      const body = { email, password };    // telo zahteva

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setErr(data.error || "Greška pri logovanju");
        return;
      }

      const data = await res.json();
      console.log("LOGIN DATA:", data);
      const role = data.role;
      
      await refresh();

      setIsLoginOpen(false); // zatvori modal

      // preusmeravanje na osnovu tipa korisnika
      if (role === "FREELANCER" || role === "COMPANY") {
        router.push("/dashboard");
      } 
    } catch (error) {
      setErr("Greška pri logovanju");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center mb-30 ">
      <div className="relative rounded-lg p-6 w-full max-w-md bg-white border border-gray-700">
        {/* Dugme za zatvaranje */}
        <button
          onClick={() => setIsLoginOpen(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Login forma */}
        <h2 className="text-2xl font-semibold mb-4">Logovanje</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Lozinka"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
          />
          {err && <p className="text-red-600 text-sm">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900"
          >
            {loading ? "Obrada..." : "Prijavi se"}
          </button>
        </form>
      </div>
    </div>
  );
}