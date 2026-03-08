import React from 'react'
import NavbarDashboard from "@/components/NavbarDashboard";
import FooterDashboard from "@/components/FooterDashboard";
import ProviderReservationsPageContent from "@/components/ProviderReservationsPageContent";

export default function ReservationsPage() {
  return (
    <div>
        
        <NavbarDashboard></NavbarDashboard>
        <ProviderReservationsPageContent></ProviderReservationsPageContent>
        <FooterDashboard></FooterDashboard>

    </div>
  )
}