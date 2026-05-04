import { useApp } from "@/contexts/AppContext";
import { ProductCard } from "@/components/ProductCard";
import { usePublicProducts } from "@/hooks/usePublicProducts";
import { useInViewAnimate } from "@/hooks/useInViewAnimate";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Products = () => {
  const { t, lang } = useApp();
  const { products, loading } = usePublicProducts(lang, t.products.items);
  const { ref, visible } = useInViewAnimate<HTMLElement>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isRTL = lang === "ar";

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const move = clientWidth * 0.8;
      const scrollTo = direction === "left" ? scrollLeft - move : scrollLeft + move;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section id="products" ref={ref} className="py-16 md:py-24 bg-gradient-soft relative">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-8 md:mb-12 max-w-xl mx-auto ${visible ? "animate-in" : ""} animate-in-ready`}>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">— {t.products.sub} —</div>
          <h2 className="text-3xl md:text-5xl">{t.products.title}</h2>
          {loading ? <p className="text-sm text-muted-foreground mt-3">{t.products.loading}</p> : null}
        </div>

        <div className="relative group max-w-6xl mx-auto">
          {/* Arrows */}
          <button
            type="button"
            onClick={() => scroll(isRTL ? "right" : "left")}
            className="absolute -left-2 md:-left-12 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border border-primary/20 bg-background/80 text-primary shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hidden md:flex"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll(isRTL ? "left" : "right")}
            className="absolute -right-2 md:-right-12 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border border-primary/20 bg-background/80 text-primary shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hidden md:flex"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div 
            ref={scrollRef}
            className="flex lg:grid lg:grid-cols-3 gap-4 md:gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none pb-4 lg:pb-0 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0"
          >
            {products.map((p, i) => (
              <div
                key={p.id}
                className={`min-w-[86vw] max-w-[340px] sm:min-w-[340px] lg:min-w-0 snap-center shrink-0 lg:shrink ${visible ? "animate-in" : ""} animate-in-ready`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <ProductCard item={p} />
              </div>
            ))}
          </div>
          
          {/* Mobile indicator (larger arrows) */}
          <div className="flex justify-center gap-6 mt-4 md:hidden">
            <button 
              onClick={() => scroll("left")} 
              className="h-12 w-12 rounded-full bg-white text-[#25D366] shadow-md flex items-center justify-center border border-[#25D366]/10 active:scale-95 transition-transform"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={() => scroll("right")} 
              className="h-12 w-12 rounded-full bg-white text-[#25D366] shadow-md flex items-center justify-center border border-[#25D366]/10 active:scale-95 transition-transform"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
