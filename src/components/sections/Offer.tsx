import { useEffect, useMemo, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import { useApp } from "@/contexts/AppContext";
import type { FirebaseOffer } from "@/types/rtdb";
import { Flame } from "lucide-react";
import { useInViewAnimate } from "@/hooks/useInViewAnimate";

function isActiveOffer(o: FirebaseOffer) {
  if (o.active === false) return false;
  if (!o.expiresAt) return true;
  const ex = new Date(o.expiresAt).getTime();
  return !Number.isFinite(ex) || ex > Date.now();
}

function pickOfferText(offer: FirebaseOffer, lang: "ar" | "fr", field: "title" | "desc") {
  const ar = (field === "title" ? offer.titleAr : offer.descAr)?.trim() ?? "";
  const fr = (field === "title" ? offer.titleFr : offer.descFr)?.trim() ?? "";
  return lang === "ar" ? ar || fr : fr || ar;
}

export const Offer = () => {
  const { t, lang, goToProductsSection } = useApp();
  const [rows, setRows] = useState<Array<{ id: string; data: FirebaseOffer }>>([]);
  const { ref: secRef, visible } = useInViewAnimate<HTMLElement>();

  useEffect(() => {
    const r = ref(db, "offers");
    return onValue(r, (snap) => {
      const val = snap.val() as Record<string, FirebaseOffer> | null;
      if (!val) {
        setRows([]);
        return;
      }
      setRows(Object.entries(val).map(([id, data]) => ({ id, data })));
    });
  }, []);

  const activeByStatus = useMemo(() => rows.filter(({ data }) => data.active !== false), [rows]);
  const activeByDate = useMemo(() => rows.filter(({ data }) => isActiveOffer(data)), [rows]);
  const active = activeByDate.length > 0 ? activeByDate : activeByStatus;

  const title = (o: FirebaseOffer) => pickOfferText(o, lang, "title");
  const desc = (o: FirebaseOffer) => pickOfferText(o, lang, "desc");

  if (active.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div
          className={`flex gap-6 pb-2 ${
            active.length > 1
              ? "overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0"
              : "justify-center overflow-visible px-0"
          }`}
        >
        {active.map(({ id, data }, i) => (
          <div
            key={id}
            ref={i === 0 ? secRef : undefined}
            className={`relative min-w-[min(100%,920px)] rounded-[2.5rem] bg-gradient-hero text-primary-foreground p-8 md:p-14 text-center overflow-hidden shadow-elegant border border-white/10 ${active.length > 1 ? "snap-center shrink-0" : "shrink"} ${visible ? "animate-in" : ""} animate-in-ready`}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-gold/20 blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-primary-glow/30 blur-2xl" />
            <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center text-center md:text-start rtl:md:text-end">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold text-gold-foreground text-xs font-black mb-4">
                  <Flame className="w-3.5 h-3.5" /> {t.offer.tag}
                </div>
                <h2 className="whitespace-pre-line text-3xl md:text-5xl mb-3 text-primary-foreground font-display">{title(data)}</h2>
                <p className="whitespace-pre-line text-primary-foreground/85 text-sm md:text-base leading-relaxed">{desc(data)}</p>
              </div>
              {data.imageUrl ? (
                <div className="mx-auto md:mx-0 max-w-xs rounded-3xl overflow-hidden border border-white/20 shadow-elegant">
                  <img src={data.imageUrl} alt="" className="w-full h-40 object-cover" loading="lazy" />
                </div>
              ) : null}
              <div className="md:col-span-2 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={goToProductsSection} className="h-12 px-8 rounded-full bg-gold text-gold-foreground font-black shadow-gold hover:scale-105 transition-smooth">
                  {t.offer.cta}
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </section>
  );
};
