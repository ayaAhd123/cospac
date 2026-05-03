import { Star } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useInViewAnimate } from "@/hooks/useInViewAnimate";

export const Testimonials = () => {
  const { t } = useApp();
  const { ref, visible } = useInViewAnimate<HTMLElement>();
  return (
    <section id="reviews" ref={ref} className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl md:text-5xl text-center mb-12 ${visible ? "animate-in" : ""} animate-in-ready`}>{t.testimonials.title}</h2>
        <div className="flex md:grid md:grid-cols-3 gap-5 max-w-5xl mx-auto overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          {t.testimonials.items.map((r, i) => (
            <figure
              key={i}
              className={`min-w-[min(100%,320px)] md:min-w-0 snap-center shrink-0 md:shrink bg-card rounded-3xl p-6 border border-border shadow-soft ${visible ? "animate-in" : ""} animate-in-ready`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex gap-0.5 mb-3 text-gold">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <blockquote className="text-sm leading-relaxed mb-4">"{r.text}"</blockquote>
              <figcaption className="text-xs font-bold text-muted-foreground">— {r.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
