import Footer from "@/components/Footer";
import HomePageContent from "@/components/HomePageContent";
import Navbar from "@/components/Navbar";
import { mockCategories } from "@/mock/data";


export default function Home() {
  const categories = mockCategories;
  return (
    <div>
      <Navbar></Navbar>
    <HomePageContent categories={categories}/>
    <Footer></Footer>
    </div>
  );
}
