import { useApp } from "@/contexts/AppContext";
import dark from "@/assets/product-dark-brown.jpg";
import black from "@/assets/product-black.jpg";

const imgs: Record<string, string> = { "dark-brown": dark, "black": black };

type Item = { id: string; name: string; desc: string; price: number };

export const ProductCard = ({ item }: { item: Item }) => {
  const { t, setSelectedProduct, setOrderOpen, lang } = useApp();
  return (
    <article className="group bg-card rounded-3xl overflow-hidden border border-border shadow-soft hover:shadow-elegant transition-smooth hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img src={imgs[item.id]} alt={item.name} loading="lazy" width={768} height={768} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <span className="absolute top-3 start-3 px-2.5 py-1 rounded-full bg-gold/90 text-gold-foreground text-[10px] font-black tracking-wider">BEST</span>
      </div>
      <div className="p-5 space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-bold text-lg">{item.name}</h3>
          <div className="text-primary font-black text-xl whitespace-nowrap">{item.price} <span className="text-xs font-medium text-muted-foreground">{lang === "ar" ? "د.م" : "MAD"}</span></div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
        <button onClick={() => { setSelectedProduct(item.id); setOrderOpen(true); }} className="w-full h-12 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary-glow transition-smooth">
          {t.products.orderBtn}
        </button>
      </div>
    </article>
  );
};
