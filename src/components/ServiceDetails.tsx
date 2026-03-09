"use client";

import React, { useState } from "react";
import CalendarForBooking from "@/components/CalendarForBooking";
import FooterDashboard from "@/components/FooterDashboard";
import Navbar from "@/components/Navbar";
import NavbarDashboard from "@/components/NavbarDashboard";
import ProfileCard from "@/components/ProfileCard";
import Image from "next/image";
import { RatingStars } from "@/components/RatingStars";
import { useAuth } from "@/components/AuthProvider"; 
import { ServiceDetailsDto } from "@/shared/types.ts";
import { useRouter } from "next/navigation";

interface Props {
  service: ServiceDetailsDto; 
}

export default function ServiceDetails({ service }: Props) {
  const { user } = useAuth();
  const router = useRouter();

  const profile = service.profile;
  const mode = profile.companyName ? "company" : "freelancer";

  const [rating, setRating] = useState(0);               
  const [comment, setComment] = useState("");             
  const [loading, setLoading] = useState(false);    

  const handleDelete = async () => {
    const confirmed = confirm("Da li ste sigurni da želite da obrišete uslugu?");
    if (!confirmed) return;

    const res = await fetch(`/api/services/${service.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/dashboard"); 
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || "Greška pri brisanju");
    }
  };

  
  const handleAddReview = async () => {
  if (!rating || !user) return;

  setLoading(true);
  try {
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating,
        comment,
        userId: user.id,           
        serviceId: service.id,     
        profileId: service.profile.id, 
      }),
    });

    if (response.ok) {
      setRating(0);
      setComment("");
      router.refresh();
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-linear-to-r from-blue-400 via-blue-200 to-yellow-100">
      {user?.role === "FREELANCER" || user?.role === "COMPANY" ? <NavbarDashboard /> : <Navbar />}

      <div className="py-4 px-5 mx-auto max-w-6xl">
        <div className="flex gap-1 justify-between">
          <div>
            {(user?.role === "FREELANCER" || user?.role === "COMPANY") && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-400 hover:bg-red-500 text-white px-4 text-xl mb-3 rounded py-1"
              >
                Obriši uslugu
              </button>
            )}
            <h1 className="text-xl md:text-2xl font-bold mb-4">{service.title}</h1>
            <Image
              src="https://picsum.photos/700/500"
              width={700}
              height={500}
              alt="Slika usluge"
            />
            <p className="font-semibold text-base md:text-xl py-3">
              Cena: {service.price} rsd
            </p>
          </div>
          <div className="sm:pt-10">
            <ProfileCard profile={profile} />
          </div>
        </div>

        {/* Detalji (skraćeno radi preglednosti) */}
        <div className="border border-gray-400 bg-gray-100 mt-3 p-2 gap-1">
          <p className="font-semibold text-sm bg-gray-300 pl-1 py-2 mb-3 text-center uppercase">Osnovni podaci</p>
          <div className="flex flex-col xl:flex-row">
            <div className="xl:w-1/2 py-3">
              <p><i className="text-gray-500">Usluga:</i> {service.title}</p>
              <p><i className="text-gray-500">Kategorija:</i> {service.category.name}</p>
            </div>
            <div className="xl:w-1/2 py-3">
              <p><i className="text-gray-500">Mesto:</i> {profile.city}</p>
              <p><i className="text-gray-500">Telefon:</i> {profile.user.phone}</p>
            </div>
          </div>
          <hr className="border-gray-300" />
          <p className="py-5"><i className="text-gray-500">Opis:</i> <br/> {service.description}</p>
        </div>
        
        <CalendarForBooking
          mode={mode}
          appointments={service.appointments}
          availabilities={service.availabilities}
          serviceId={service.id}
        />

        {/* FORMA ZA RECENZIJU */}
        {user?.role === "USER" && (
          <div className="bg-gray-100 p-4 mt-6 rounded border border-gray-300">
            <h2 className="font-semibold mb-2">Ostavite recenziju</h2>
            <div className="flex gap-1 text-2xl mb-2 cursor-pointer">
              {[1,2,3,4,5].map((n) => (
                <span
                  key={n}
                  onClick={() => setRating(n)}
                  className={n <= rating ? "text-yellow-400" : "text-gray-400"}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              className="w-full border p-2 rounded mb-2"
              placeholder="Napišite vaše iskustvo..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              onClick={handleAddReview}
              disabled={loading}
              className={`bg-black text-white px-4 py-2 rounded ${loading ? "opacity-50" : "hover:bg-gray-800"}`}
            >
              {loading ? "Slanje..." : "Postavi recenziju"}
            </button>
          </div>
        )}

        {/* PRIKAZ RECENZIJA */}
        <div className="bg-gray-300 pt-2 pb-2 px-5 rounded-sm border border-gray-400 mt-7">
          <p className="font-semibold text-sm bg-gray-200 pl-1 py-2 mb-3 text-center uppercase">Recenzije</p>
          {service.reviews.length === 0 ? (
            <p className="text-gray-700 px-2 text-center py-4">Nema recenzija</p>
          ) : (
            <div className="flex flex-col gap-3">
              {service.reviews.map((review, idx) => (
                <div key={idx} className="bg-gray-100 p-2 m-1 rounded shadow-sm">
                  <div className="flex justify-between">
                    <h1 className="font-bold">{review.user?.firstName} {review.user?.lastName}</h1>
                    <p className="text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString("sr-RS")}</p>
                  </div>
                  <hr className="border-gray-400 my-1" />
                  <p className="pb-1">{review.comment}</p>
                  <RatingStars rating={review.rating} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <FooterDashboard />
    </div>
  );
}