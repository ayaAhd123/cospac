import { Phone, MessageCircle } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export const FloatingButtons = () => {
  const { setOrderOpen, t } = useApp();
  return (
    <>
      {/* Sticky CTA mobile */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 p-3 bg-gradient-to-t from-background via-background to-transparent pt-8">
        <button onClick={() => setOrderOpen(true)} className="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold shadow-elegant">
          🛒 {t.sticky}
        </button>
      </div>
      {/* WhatsApp & Call */}
      <div className="fixed bottom-24 md:bottom-6 end-4 z-30 flex flex-col gap-2.5">
        <a href="https://wa.me/212600000000" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"
          className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-elegant hover:scale-110 transition-smooth animate-pulse-ring">
          <MessageCircle className="w-6 h-6 fill-current" />
        </a>
        <a href="tel:+212600000000" aria-label="Appel" className="w-[52px] h-[52px] rounded-full bg-card border border-border text-primary flex items-center justify-center shadow-soft hover:scale-110 transition-smooth">
          <Phone className="w-5 h-5" />
        </a>
      </div>
    </>
  );
};
