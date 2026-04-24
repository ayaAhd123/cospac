import { Star } from "lucide-react";
import { useApp } from "@/contexts/AppContext";

export const Testimonials = () => {
  const { t } = useApp();
  return (
    <section id="reviews" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl text-center mb-12">{t.testimonials.title}</h2>
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {t.testimonials.items.map((r, i) => (
            <figure key={i} className="bg-card rounded-3xl p-6 border border-border shadow-soft">
              <div className="flex gap-0.5 mb-3 text-gold">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
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
