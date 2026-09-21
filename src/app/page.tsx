import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import CourtMatrix from "@/components/CourtMatrix";
import Engineering from "@/components/Engineering";
import Assembly from "@/components/Assembly";
import Services from "@/components/Services";
import QuoteForm from "@/components/QuoteForm";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <CourtMatrix />
      <Engineering />
      <Assembly />
      <Services />
      <QuoteForm />
      <Gallery />
      <Footer />
    </>
  );
}
