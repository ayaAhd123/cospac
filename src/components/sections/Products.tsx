import { useApp } from "@/contexts/AppContext";
import { ProductCard } from "@/components/ProductCard";

export const Products = () => {
  const { t } = useApp();
  return (
    <section id="products" className="py-16 md:py-24 bg-gradient-soft">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 max-w-xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-3">— {t.products.sub} —</div>
          <h2 className="text-3xl md:text-5xl">{t.products.title}</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {t.products.items.map((p) => <ProductCard key={p.id} item={p} />)}
        </div>
      </div>
    </section>
  );
};
