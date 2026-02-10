"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";

type UserRole = "USER" | "FREELANCER" | "COMPANY";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<UserRole>("USER");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // HANDLER ZA SLIKU
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // SUBMIT HANDLER
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      let imageBase64: string | null = null;

      if (imageFile) {
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

     const body =
     role === "USER"
    ? { role, firstName, lastName, phone, email, password }
    : role === "FREELANCER"
    ? { role, firstName, lastName, phone, email, password, city, address, description, image: imageBase64 }
    : { role, firstName, lastName, phone, email, password, companyName, city, address, description, image: imageBase64 };

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
         const data = await res.json();
        setErr(data.error || "Došlo je do greške pri registraciji");
        return;
      }

      const userData = await res.json();

      localStorage.setItem("userId", userData.id); //Treba uraditi preko JWT tokena na backend-u
      localStorage.setItem("role", userData.role);

      //✅
      localStorage.setItem("email", userData.email);



      // REDIRECT PREMA ROLE
      if (userData.role === "FREELANCER" || userData.role === "COMPANY") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      setErr("Došlo je do greške pri registraciji");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col md:flex-row justify-center gap-5 py-5 px-1 bg-linear-to-r from-blue-400 via-blue-200 to-yellow-100">
        {/* LEVA STRANA */}
        <div className="relative flex flex-col border border-gray-600 py-6 rounded md:h-150 md:max-w-sm md:gap-25 gap-10 bg-gray-100 text-center mx-3">
          <Image
            src="/images/image1.jpg"
            alt="Hero background"
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="relative flex flex-col md:gap-30 gap-10 py-5">
            <h2 className="md:text-2xl text-xl font-semibold ont-semibold text-gray-800 mb-4 drop-shadow-md">
              Postanite deo naše platforme!
            </h2>
            <p className="text-gray-800 md:text-xl text-base mb-8 px-5">
              Unesite lične podatke i odaberite da li želite da koristite ili
              pružate usluge.
            </p>
            <p className="text-gray-800 md:text-xl text-base mb-8 px-5">
              Odabirom opcije oglašavanja kreiraćete profil na kojem možete
              kačiti oglase sopstvenih usluga.
            </p>
          </div>
        </div>

        {/* FORMA */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md max-w-4xl md:min-w-1/3"
        >
          <div className="flex flex-col gap-2">
            {/* RADIO BUTTONS */}
            <div>
              <p className="font-medium mb-2">Izaberite opciju:</p>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="USER"
                  checked={role === "USER"}
                  onChange={() => setRole("USER")}
                />
                Želim da koristim usluge
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="FREELANCER"
                  checked={role === "FREELANCER"}
                  onChange={() => setRole("FREELANCER")}
                />
                Želim da nudim usluge (kao samostalac)
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="COMPANY"
                  checked={role === "COMPANY"}
                  onChange={() => setRole("COMPANY")}
                />
                Želim da nudim usluge (u ime preduzeća)
              </label>
            </div>

            {/* OSNOVNI PODACI */}
            <div className="flex flex-col gap-4 py-5">
              <input
                type="text"
                placeholder="Ime"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Prezime"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Telefon"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Lozinka"
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* USLOVNO PRIKAZIVANJE */}
            {(role === "FREELANCER" || role === "COMPANY") && (
              <div className="flex flex-col border-2 border-yellow-400 bg-yellow-50 p-4 rounded space-y-3">
                <p className="font-semibold text-sm text-yellow-700">
                  PROFILNI PODACI
                </p>

                {role === "COMPANY" && (
                  <input
                    type="text"
                    placeholder="Naziv preduzeća"
                    className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                )}
                <input
                  type="text"
                  placeholder="Mesto"
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Adresa"
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

                <textarea
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none"
                  placeholder="Opis"
                  rows={7}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                {/* UPLOAD SLIKE */}
                <div className="flex items-center gap-4 my-10">
                  <label className="cursor-pointer bg-gray-200 px-4 py-2 rounded">
                    Izaberi sliku
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />
                  </label>

                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover border"
                    />
                  )}
                </div>
              </div>
            )}

            {/* ERROR i SUBMIT */}
            {err && <p className="text-red-700">{err}</p>}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-6 py-2 rounded"
              >
                {loading ? "Obrada..." : "Kreiraj nalog"}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}