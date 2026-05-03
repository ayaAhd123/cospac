import { useApp } from "@/contexts/AppContext";
import { ProductCard } from "@/components/ProductCard";
import { usePublicProducts } from "@/hooks/usePublicProducts";
import { useInViewAnimate } from "@/hooks/useInViewAnimate";

export const Products = () => {
  const { t, lang } = useApp();
  const { products, loading } = usePublicProducts(lang, t.products.items);
  const { ref, visible } = useInViewAnimate<HTMLElement>();

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section id="products" ref={ref} className="py-16 md:py-24 bg-gradient-soft">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 max-w-xl mx-auto ${visible ? "animate-in" : ""} animate-in-ready`}>
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">— {t.products.sub} —</div>
          <h2 className="text-3xl md:text-5xl">{t.products.title}</h2>
          {loading ? <p className="text-sm text-muted-foreground mt-3">{t.products.loading}</p> : null}
        </div>
        <div className="flex lg:grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none pb-2 lg:pb-0 -mx-4 px-4 lg:mx-auto lg:px-0">
          {products.map((p, i) => (
            <div
              key={p.id}
              className={`min-w-[min(100%,320px)] sm:min-w-[340px] lg:min-w-0 snap-center shrink-0 lg:shrink ${visible ? "animate-in" : ""} animate-in-ready`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <ProductCard item={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
