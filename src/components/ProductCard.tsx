import { useApp } from "@/contexts/AppContext";
import dark from "@/assets/product-dark-brown.jpg";
import black from "@/assets/product-black.jpg";
import type { DisplayProduct } from "@/hooks/usePublicProducts";

const fallbackImgs: Record<string, string> = { "dark-brown": dark, black };

export const ProductCard = ({ item }: { item: DisplayProduct }) => {
  const { t, setSelectedProduct, setOrderOpen, lang } = useApp();
  const img = item.imageUrl || fallbackImgs[item.id] || dark;
  const badge = item.badge?.trim();

  return (
    <article className="group bg-card rounded-3xl overflow-hidden border border-border shadow-soft hover:shadow-elegant transition-smooth hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-secondary p-2.5 md:p-3">
        <img
          src={img}
          alt={item.name}
          loading="lazy"
          width={768}
          height={768}
          className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
        />
        {badge ? (
          <span className="absolute top-3 start-3 px-2.5 py-1 rounded-full bg-gold/90 text-gold-foreground text-[10px] font-black tracking-wider">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="p-4 md:p-5 space-y-2.5 md:space-y-3">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-bold text-base md:text-lg leading-tight">{item.name}</h3>
          <div className="text-primary font-black text-lg md:text-xl whitespace-nowrap">
            {item.price}{" "}
            <span className="text-xs font-medium text-muted-foreground">{lang === "ar" ? "د.م" : "MAD"}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 min-h-10">{item.desc}</p>
        <button
          onClick={() => {
            setSelectedProduct(item.id);
            setOrderOpen(true);
          }}
          className="w-full h-11 md:h-12 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-95 transition-smooth"
        >
          {t.products.orderBtn}
        </button>
      </div>
    </article>
  );
};
