
import ContactArticle from "@/components/Contact/ContactArticle";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Header/Navbar";




export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <>{children}</>
      <ContactArticle />

      <Footer />
    </>
  );
}
