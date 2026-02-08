import Footer from "@/components/Footer";
import HomePageContent from "@/components/HomePageContent";
import Navbar from "@/components/Navbar";


export default async function Home() {

  const res = await fetch("http://localhost:3000/api/categories", {cache: "no-store",});
  const categories = await res.json();

  return (
    <div>
      <Navbar></Navbar>
      <HomePageContent categories={categories}/>
      <Footer></Footer>
    </div>
  );
}