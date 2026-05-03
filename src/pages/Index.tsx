import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { VideoSection } from "@/components/sections/VideoSection";
import { Products } from "@/components/sections/Products";
import { Benefits } from "@/components/sections/Benefits";
import { Ingredients } from "@/components/sections/Ingredients";
import { UsageSteps } from "@/components/sections/UsageSteps";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Testimonials } from "@/components/sections/Testimonials";
import { Offer } from "@/components/sections/Offer";
import { OrderForm } from "@/components/OrderForm";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Footer } from "@/components/Footer";
import { OfferPopup } from "@/components/OfferPopup";
import { useApp } from "@/contexts/AppContext";

const Index = () => {
  const { langOpacity } = useApp();
  return (
    <div className="min-h-screen bg-background">
      <div className="motion-safe:transition-opacity motion-safe:duration-200" style={{ opacity: langOpacity }}>
        <Navbar />
        <main className="max-md:pb-32">
          <Hero />
          <VideoSection />
          <BeforeAfter />
          <Benefits />
          <Ingredients />
          <UsageSteps />
          <Products />
          <Offer />
          <Testimonials />
        </main>
        <Footer />
        <OfferPopup />
      </div>
      <FloatingButtons />
      <OrderForm />
    </div>
  );
};

export default Index;
