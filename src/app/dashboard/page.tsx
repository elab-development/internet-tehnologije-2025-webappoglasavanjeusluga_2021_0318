import NavbarDashboard from "@/components/NavbarDashboard";
import FooterDashboard from "@/components/FooterDashboard";

export default function About() {
  return (
    <div className="bg-linear-to-r from-blue-400 via-blue-200 to-yellow-100">
        <NavbarDashboard></NavbarDashboard>
        <p className="text-center text-3xl">Dasboard stranica</p>
        <FooterDashboard></FooterDashboard>
    </div>
  )
}
