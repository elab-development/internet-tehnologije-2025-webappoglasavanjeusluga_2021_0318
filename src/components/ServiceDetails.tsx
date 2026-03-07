
"use client";

import React from "react";
import CalendarForBooking from "@/components/CalendarForBooking";
import Footer from "@/components/Footer";
import FooterDashboard from "@/components/FooterDashboard";
import Navbar from "@/components/Navbar";
import NavbarDashboard from "@/components/NavbarDashboard";
import ProfileCard from "@/components/ProfileCard";
import Image from "next/image";
import { RatingStars } from "@/components/RatingStars";
import { useAuth } from "@/components/AuthProvider"; 
import {ServiceDetailsDto} from "@/shared/types.ts"

interface Props {
  service: ServiceDetailsDto; 
}

export default function ServiceDetails({ service }: Props) {
  const { user } = useAuth();

  const profile = service.profile;
  const mode = profile.companyName ? "company" : "freelancer";

  return (
    <div className="bg-linear-to-r from-blue-400 via-blue-200 to-yellow-100">
      {/* Navbar zavisi od role */}
      {user?.role === "FREELANCER" || user?.role === "COMPANY" ? <NavbarDashboard /> : <Navbar />}

      <div className="py-5 px-5 mx-auto max-w-6xl">
        <div className="flex gap-1 justify-between">
          <div>
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

        <div className="border border-gray-400 bg-gray-100 mt-3 p-2 gap-1">
          <p className="font-semibold text-sm bg-gray-300 pl-1 py-2 mb-3 text-center">
            OSNOVNI PODACI
          </p>
          <div className="flex flex-col xl:flex-row">
            <div className="xl:w-1/2 py-3">
              <h1>
                <i className="text-gray-500">Usluga:</i> {service.title}
              </h1>
              <p>
                <i className="text-gray-500">Kategorija:</i> {service.category.name}
              </p>
              <p>
                <i className="text-gray-500">Kreirana:</i>{" "}
                {new Date(service.createdAt).toLocaleDateString("sr-RS")}
              </p>
            </div>

            <div className="xl:w-1/2 py-3">
              <p>
                <i className="text-gray-500">Pružalac: </i>
                {   mode==="company"
                  ? profile.companyName
                  : `${profile.firstName} ${profile.lastName}`}
              </p>
              <p>
                <i className="text-gray-500">Mesto:</i> {profile.city}
              </p>
              <p>
                <i className="text-gray-500">Adresa:</i> {profile.address}
              </p>
              <p>
                <i className="text-gray-500">Telefon:</i> {profile.user.phone}
              </p>
              <p>
                <i className="text-gray-500">Pružalac od:</i>{" "}
                {new Date(profile.user.createdAt).toLocaleDateString("sr-RS")}
              </p>
            </div>
          </div>

          <hr className="border-gray-300" />
          <p className="py-5">
            <i className="text-gray-500">Opis:</i> <br className="mb-2" />
            {service.description}
          </p>
        </div>
        
          <CalendarForBooking
            mode={mode}
            appointments={service.appointments}
            availabilities={service.availabilities}
            serviceId={service.id}
          />
       

        <div className="bg-gray-300 pt-2 pb-2 px-5 rounded-sm border border-gray-400 mt-7">
          <p className="font-semibold text-sm bg-gray-200 pl-1 py-2 mb-3 text-center">
            RECENZIJE
          </p>
          {service.reviews.length === 0 ? (
            <p className="text-gray-700 px-2 text-center">Nema recenzija</p>
          ) : (
            <div className="flex flex-col gap-3">
              {service.reviews.map((review, id) => (
                <div key={id} className="bg-gray-100 p-2 m-1">
                  <div className="flex justify-between">
                    <h1>
                      {review.user?.firstName + " " + review.user?.lastName}
                    </h1>
                    <p className="text-sm text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("sr-RS")}
                    </p>
                  </div>
                  <hr className="border-gray-400 my-1" />
                  <p className="text-gray-400 pb-1">
                    <i>Usluga:</i> {review.service?.title}
                  </p>
                  <p className="pb-1">{review.comment}</p>
                  <RatingStars rating={review.rating} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer zavisi od role */}
      {user?.role === "FREELANCER" || user?.role === "COMPANY" ? <FooterDashboard /> : <FooterDashboard />}
    </div>
  );
}