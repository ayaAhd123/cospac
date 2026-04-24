import productImg from "@/assets/product-dark-brown.jpg";
import { useApp } from "@/contexts/AppContext";
import { ArrowRight, Play, Sparkles } from "lucide-react";

export const Hero = () => {
  const { t, setOrderOpen, lang } = useApp();
  const Arrow = lang === "ar" ? ArrowRight : ArrowRight;
  return (
    <section className="relative overflow-hidden bg-gradient-soft">
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-20 -left-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-accent/30 blur-3xl" />
      </div>
      <div className="container mx-auto px-4 py-12 md:py-20 relative">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> {t.hero.badge}
            </div>
            <h1 className="text-4xl md:text-6xl leading-[1.05] text-foreground">
              {t.hero.title}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-md">{t.hero.subtitle}</p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setOrderOpen(true)} className="group inline-flex items-center gap-2 h-14 px-7 rounded-full bg-primary text-primary-foreground font-bold shadow-elegant hover:scale-105 transition-smooth">
                {t.hero.cta} <Arrow className="w-4 h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
              </button>
              <a href="#video" className="inline-flex items-center gap-2 h-14 px-6 rounded-full bg-card border border-border font-semibold hover:bg-secondary transition-smooth">
                <Play className="w-4 h-4 fill-current" /> {t.hero.ctaSecondary}
              </a>
            </div>
            <div className="flex gap-6 pt-4 border-t border-border/50">
              {t.hero.stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl md:text-3xl font-black text-primary">{s.num}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <div className="absolute inset-0 bg-gradient-hero rounded-[2.5rem] rotate-3 opacity-20 blur-2xl" />
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-elegant animate-float">
              <img src={productImg} alt="COSPAC Beauty Macadamia" width={768} height={768} className="w-full h-full object-cover aspect-square" />
            </div>
            <div className="absolute -bottom-4 -left-4 rtl:-right-4 rtl:left-auto bg-card rounded-2xl px-5 py-3 shadow-soft border border-border">
              <div className="text-xs text-muted-foreground">⭐⭐⭐⭐⭐</div>
              <div className="text-sm font-bold">4.9/5 — 2.4k avis</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
