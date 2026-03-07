import React from 'react'
import NavbarDashboard from "@/components/NavbarDashboard";
import FooterDashboard from "@/components/FooterDashboard";
import EmployeesPageContent from "@/components/EmployeesPageContent";

export default function EmployeesPage() {
  return (
    <div>
        
        <NavbarDashboard></NavbarDashboard>
        <EmployeesPageContent></EmployeesPageContent>
        <FooterDashboard></FooterDashboard>

    </div>
  )
}