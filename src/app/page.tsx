import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import TickerTape from "@/components/TickerTape";
import Hero from "@/components/Hero";
import About from "@/components/About";
import LiveMarkets from "@/components/LiveMarkets";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const CryptoCoins = dynamic(() => import("@/components/CryptoCoins"), {
  ssr: false,
});
const Preloader = dynamic(() => import("@/components/Preloader"), {
  ssr: false,
});

export default function Home() {
  return (
    <>
      <Preloader />
      <CryptoCoins />
      <Navbar />
      <TickerTape />
      {/* Spacer: navbar (80/96px) + ticker tape (72/56px) */}
      <div className="pt-[152px] sm:pt-[136px] md:pt-[152px]">
        <Hero />
        <About />
        <LiveMarkets />
        <Services />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
}