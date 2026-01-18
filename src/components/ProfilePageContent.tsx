"use client"
import { useState } from "react";
import ProfileCard from "./ProfileCard";
import { FullUserDto, Profile } from "@/shared/types";
import { mockCategories, mockReviews, mockServices, mockUsers } from "@/mock/data";
import ServiceCard from "./ServiceCard";
import { RatingStars } from "./RatingStars";

type Props = {
    profile: Profile;
}

export default function ProfilePageContent({profile}: Props) {
        //podaci za prikaz svih usluga na profulu
        const services = mockServices.filter((s)=>s.user.id===profile.user.id);
        const serviceCount = services.length;
        const categories = mockCategories;

        const user = mockUsers.find((u) => u.id === profile.user.id)!;
        const users: FullUserDto[] = [user];

        const [activeTab, setActiveTab] = useState<string>("usluge");

        const reviews = mockReviews.filter((r) => r.service.user.id===profile.user.id);

        let sumOfRatings = 0;
        const reviewCount = reviews.length;
        reviews.map((r) => sumOfRatings=sumOfRatings + r.rating);
        const averageRating = sumOfRatings/reviewCount;

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto">
        <div className="min-w-80 mx-auto my-3">
            <ProfileCard profile={profile} users={users} extend={true} serviceCount={serviceCount} averageRating={averageRating}></ProfileCard>
        </div>
         <div className="w-full p-5">
            {/* Tabovi */}
            <div className="flex gap-6 border-b pl-5 mx-2 border-gray-400">
                <button
                onClick={() => setActiveTab("usluge")}
                className={`pb-2 transition-all ${
                    activeTab === "usluge"
                    ? "border-b-2 border-black font-medium text-black"
                    : "text-gray-500 hover:text-black"
                }`}
                >
                Usluge
                </button>

                <button
                onClick={() => setActiveTab("recenzije")}
                className={`pb-2 transition-all ${
                    activeTab === "recenzije"
                    ? "border-b-2 border-black font-medium text-black"
                    : "text-gray-500 hover:text-black"
                }`}
                >
                Recenzije
                </button>
            </div>

            {/* Sadrzaj u okviru tabova */}
            <div className="mt-6">
                {activeTab === "usluge" && (
                <div>
                    {/* Usluge */}
                    {services.length===0 ? (
                        <p className="text-gray-700 px-10">Nema usluga</p>
                    ):(
                        <div  className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3  p-2 max-w-4xl">
                            {services.map((service, id) =>(<ServiceCard service={service} categories={categories} key={id}></ServiceCard>))}  
                        </div>   
                    )
                    }
                    
                </div> 
                )}

                {activeTab === "recenzije" && (
                <div>
                    {/* Recenzije */}
                    {reviews.length===0 ? (
                            <p className="text-gray-700 px-10">Nema recenzija</p>
                          ):(
                            <div>
                            {reviews.map((review, id) =>(
                              <div key={id} className="bg-gray-100 p-2 m-5">
                                <div className="flex justify-between">
                                    <h1>{review.user.firstName+" "+review.user.lastName}</h1> 
                                    <p className="text-sm text-gray-400">{review.createdAt.toLocaleDateString("sr-RS")}</p>
                                </div>
                                <hr className="border-gray-400 pb-2"/>
                                <p className="text-gray-400 pb-2"><i>Usluga:</i> {review.service.title}</p>
                                <p className="pb-2">{review.comment}</p>
                                <RatingStars  rating={review.rating} ></RatingStars>
                              </div>
                            ))}
                            </div>
                          )}
                </div>
                )}
            </div>
        </div>
    </div>
  )
}
