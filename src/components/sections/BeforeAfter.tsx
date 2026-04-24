import beforeAfter from "@/assets/before-after.jpg";
import { useApp } from "@/contexts/AppContext";

export const BeforeAfter = () => {
  const { t } = useApp();
  return (
    <section className="py-16 md:py-24 bg-gradient-soft">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl mb-2">{t.beforeAfter.title}</h2>
        <p className="text-muted-foreground mb-10">{t.beforeAfter.sub}</p>
        <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-elegant">
          <img src={beforeAfter} alt="Before and after" loading="lazy" width={1280} height={768} className="w-full" />
          <div className="absolute top-4 start-4 px-3 py-1 rounded-full bg-card/90 backdrop-blur text-xs font-bold">AVANT</div>
          <div className="absolute top-4 end-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">APRÈS</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-3/4 bg-card/80 rounded-full" />
        </div>
      </div>
    </section>
  );
};
