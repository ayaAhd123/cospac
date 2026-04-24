import { useApp } from "@/contexts/AppContext";
import { Flame } from "lucide-react";

export const Offer = () => {
  const { t, setOrderOpen } = useApp();
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="relative max-w-4xl mx-auto rounded-[2.5rem] bg-gradient-hero text-primary-foreground p-8 md:p-14 text-center overflow-hidden shadow-elegant">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-gold/20 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-primary-glow/30 blur-2xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold text-gold-foreground text-xs font-black mb-4">
              <Flame className="w-3.5 h-3.5" /> {t.offer.tag}
            </div>
            <h2 className="text-4xl md:text-6xl mb-3 text-primary-foreground">{t.offer.title}</h2>
            <p className="text-primary-foreground/80 mb-6">{t.offer.sub}</p>
            <button onClick={() => setOrderOpen(true)} className="h-14 px-8 rounded-full bg-gold text-gold-foreground font-black shadow-gold hover:scale-105 transition-smooth">
              {t.offer.cta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
