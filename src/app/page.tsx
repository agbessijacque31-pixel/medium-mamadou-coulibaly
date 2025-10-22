import AboutSection from "@/components/Acceuille/AboutSection";
import DerniersRituelsSection from "@/components/Acceuille/DerniersRituelsSection";
import HeroSection from "@/components/Acceuille/HeroSection";
import ServicesSection from "@/components/Acceuille/ServicesSection";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Header/Navbar";
import { getLastRituels } from "@/lib/getArticles";
import { ArticleDTO } from "../../types/articles-type";
import CategoryHighlight from "@/components/Acceuille/CategoryHighlight";
import { services } from "@/components/MenuLinks/menuLinks";

export const revalidate = 60;


export default async function Home() {
  const derniersRituels: ArticleDTO[] = await getLastRituels();

  return (
    <>
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <DerniersRituelsSection rituels={derniersRituels} />
      <CategoryHighlight
        imageSrc="/image/coulibaly-mamadou.jpg"
        imageAlt="Un marabout en tenue traditionnelle"
        title="Domaines d'Intervention et Catégories"
        categories={services}
      />
      <Footer />
    </>
  );
}
