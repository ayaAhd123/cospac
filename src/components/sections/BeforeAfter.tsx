import { useEffect, useState, useRef } from "react";
import { onValue, ref as dbRef } from "firebase/database";
import { db } from "@/lib/firebase";
import { useApp } from "@/contexts/AppContext";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import type { FirebaseBeforeAfter } from "@/types/rtdb";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const BeforeAfter = () => {
  const { t, lang, goToProductsSection } = useApp();
  const [rows, setRows] = useState<Array<{ id: string; data: FirebaseBeforeAfter }>>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isRTL = lang === "ar";

  useEffect(() => {
    const r = dbRef(db, "beforeAfter");
    const unsub = onValue(r, (snap) => {
      const val = snap.val() as Record<string, FirebaseBeforeAfter> | null;
      if (!val) {
        setRows([]);
        setLoading(false);
        return;
      }
      setRows(
        Object.entries(val).map(([id, data]) => ({
          id,
          data,
        })),
      );
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const move = clientWidth * 0.8;
      const scrollTo = direction === "left" ? scrollLeft - move : scrollLeft + move;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const labelBefore = t.beforeAfter.labelBefore;
  const labelAfter = t.beforeAfter.labelAfter;

  if (loading) {
    return (
      <section id="before-after" className="py-16 md:py-24 bg-gradient-soft">
        <div className="container mx-auto px-4 text-center text-muted-foreground">{t.beforeAfter.loading}</div>
      </section>
    );
  }

  if (rows.length === 0) return null;

  return (
    <section id="before-after" className="py-16 md:py-24 bg-gradient-soft overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl mb-2">{t.beforeAfter.title}</h2>
        <p className="text-muted-foreground mb-5 max-w-2xl mx-auto">{t.beforeAfter.sub}</p>
        <button
          type="button"
          onClick={goToProductsSection}
          className="mb-10 h-12 px-8 rounded-full bg-primary text-primary-foreground font-bold shadow-elegant hover:scale-[1.02] transition-smooth"
        >
          {t.hero.cta}
        </button>

        <div className="relative group max-w-6xl mx-auto">
          {/* Arrows */}
          {rows.length > 1 && (
            <>
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
            </>
          )}

          <div
            ref={scrollRef}
            className={`flex gap-6 pb-4 scrollbar-hide ${
              rows.length > 1
                ? "overflow-x-auto snap-x snap-mandatory -mx-4 px-4 md:mx-auto md:px-0"
                : "justify-center overflow-visible px-0"
            }`}
          >
            {rows.map(({ id, data }) => {
              const title = lang === "ar" ? data.titleAr : data.titleFr;
              return (
                <div key={id} className={`min-w-[min(100%,780px)] ${rows.length > 1 ? "snap-center shrink-0" : "shrink"}`}>
                  {title ? <h3 className="text-lg font-semibold mb-4">{title}</h3> : null}
                  <BeforeAfterSlider
                    beforeSrc={data.beforeUrl}
                    afterSrc={data.afterUrl}
                    labelBefore={labelBefore}
                    labelAfter={labelAfter}
                    beforePosX={data.beforePosX}
                    beforePosY={data.beforePosY}
                    beforeZoom={data.beforeZoom}
                    afterPosX={data.afterPosX}
                    afterPosY={data.afterPosY}
                    afterZoom={data.afterZoom}
                  />
                </div>
              );
            })}
          </div>

          {/* Mobile indicator (subtle arrows) */}
          {rows.length > 1 && (
            <div className="flex justify-center gap-4 mt-4 md:hidden">
              <button onClick={() => scroll("left")} className="p-2 text-primary/50"><ChevronLeft size={20} /></button>
              <button onClick={() => scroll("right")} className="p-2 text-primary/50"><ChevronRight size={20} /></button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
