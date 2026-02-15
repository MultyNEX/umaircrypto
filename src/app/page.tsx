import Navbar from "@/components/Navbar";
import TickerTape from "@/components/TickerTape";
import Hero from "@/components/Hero";
import About from "@/components/About";
import LiveMarkets from "@/components/LiveMarkets";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Payment from "@/components/Payment";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <TickerTape />
      {/* Spacer: navbar (64/80px) + ticker tape (56/50px) */}
      <div className="pt-[120px] md:pt-[130px]">
        <Hero />
        <About />
        <LiveMarkets />
        <Services />
        <HowItWorks />
        <Testimonials />
        <Payment />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
}
