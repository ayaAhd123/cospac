import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { VideoSection } from "@/components/sections/VideoSection";
import { Products } from "@/components/sections/Products";
import { Benefits } from "@/components/sections/Benefits";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Testimonials } from "@/components/sections/Testimonials";
import { Offer } from "@/components/sections/Offer";
import { OrderForm } from "@/components/OrderForm";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Footer } from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      <Hero />
      <VideoSection />
      <Products />
      <Benefits />
      <BeforeAfter />
      <Testimonials />
      <Offer />
    </main>
    <Footer />
    <FloatingButtons />
    <OrderForm />
  </div>
);

export default Index;
