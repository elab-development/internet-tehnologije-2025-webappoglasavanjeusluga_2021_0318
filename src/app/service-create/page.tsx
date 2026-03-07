import React from 'react'
import NavbarDashboard from "@/components/NavbarDashboard";
import FooterDashboard from "@/components/FooterDashboard";
import FormService from "@/components/FormService";

export default function CreateServicePage() {
  return (
    <div>
        <NavbarDashboard />
        <FormService></FormService>
        <FooterDashboard />
    </div>
  )
}
