"use client";

import { useState, useEffect } from "react";
import {  mockServices } from "@/mock/data";
import { FullServiceDto, FullCategoryDto } from "@/shared/types";
import Sidebar from "./Sidebar";
import HeroSection from "./HeroSection";
import CountUp from "react-countup";
import ServiceCard from "./ServiceCard";

type Props = { categories: FullCategoryDto[] }

export default function HomePageContent({ categories }: Props) {

    const sortedServices = mockServices.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); //Sortiranje oglasa od novijih ka starijim
    const [services, setServices] = useState<FullServiceDto[]>(sortedServices);
    const [search, setSearch] = useState("");
    const [categoryId, setCategoryId] = useState<number | null>(null);

    useEffect(() => {
        console.log(search);
        let data = mockServices;
        

        if (categoryId !== null) data = data.filter(d => d.category.id === categoryId);
        if (search.trim()) {
            
            data = data.filter(d => d.title.toLowerCase().normalize().includes(search.toLowerCase()));
        }
        
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setServices(data);

    }, [categoryId, search]);

    return (
        <div>
                {/* Hero sekcija */}
            <HeroSection title={"Mesto na kojem možete pronaći ili ponuditi usluge"} 
                            desc={"Brzo, lako, pouzdano, 300+ zadovoljnih korisnika"} 
                            placeholder={"Pretraži uslugu..."}
                            search={search} setSearch={setSearch} >             
            </HeroSection>

            {/* Horizontalni talas koji razdvaja HeroSection od Sidebar-a i Usluga */}
            <div className="w-full h-10 overflow-hidden bg-gray-200">
                <svg
                    className="w-full h-full"
                    viewBox="0 0 1440 40"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="none">
                    <path
                    d="M0,20 C360,0 1080,40 1440,20 L1440,40 L0,40 Z"
                    fill="#60a5fa" 
                    />
                </svg>
            </div>

            <div className="bg-linear-to-r from-blue-400 via-blue-200 to-yellow-100">
                
                <div className="mx-auto max-w-7xl">

                    {/* Brojke             za animirani brojac koriscena biblioteka: npm install react-countup */}
                    <div className="flex flex-row justify-evenly md:text-2xl pt-20  text-red-800">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold">
                            <CountUp end={230} duration={3} />    
                            </h2>
                            <p className="text-gray-500">Klijenata</p>
                        </div>
                        <div className="text-center">
                            <h2 className="text-3xl font-bold">
                            <CountUp end={20} duration={3} />
                            </h2>
                            <p className="text-gray-500">Preduzeća</p>
                        </div>
                        <div className="text-center">
                            <h2 className="text-3xl font-bold">
                            <CountUp end={50} duration={3} />
                            </h2>
                            <p className="text-gray-500">Samostalaca</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8 md:flex-row">
                        
                        {/* Sidebar */}
                        <div className="flex flex-col items-center pb-10 p-2">
                            {/* <div className="h-25"></div> */}
                            <h1 className="mb-5 text-xl pt-25 mt-5 font-semibold text-gray-800">KATEGORIJE</h1>
                            <Sidebar categoryId={categoryId} setCategoryId={setCategoryId} categories={categories} setSearch={setSearch}/>
                        </div>
                        

                        {/* Kartice usluga */}
                        <section  className="flex-1 flex flex-col items-center pb-10">
                            {/* <div id="usluge" className="h-25"></div> */}
                            <h1 id="trazi" className="mb-5 pt-25 mt-5 text-2xl font-semibold text-gray-800">USLUGE</h1>
                            {services.length === 0 ? (
                                <p className="text-center text-gray-500"> Nema usluga </p>) :
                                (
                                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full p-2">
                                        {services.map((service, id) => (
                                            <ServiceCard service={service} categories={categories} key={id}/>
                                        ))}
                                    </div>
                                )}
                        </section>
                    </div>
                </div>
            </div>
        </div>
        
    );
} 