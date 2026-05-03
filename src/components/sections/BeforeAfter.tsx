import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import { useApp } from "@/contexts/AppContext";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import type { FirebaseBeforeAfter } from "@/types/rtdb";

export const BeforeAfter = () => {
  const { t, lang, setOrderOpen } = useApp();
  const [rows, setRows] = useState<Array<{ id: string; data: FirebaseBeforeAfter }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const r = ref(db, "beforeAfter");
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
    <section id="before-after" className="py-16 md:py-24 bg-gradient-soft">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl mb-2">{t.beforeAfter.title}</h2>
        <p className="text-muted-foreground mb-5 max-w-2xl mx-auto">{t.beforeAfter.sub}</p>
        <button
          type="button"
          onClick={() => setOrderOpen(true)}
          className="mb-10 h-12 px-8 rounded-full bg-primary text-primary-foreground font-bold shadow-elegant hover:scale-[1.02] transition-smooth"
        >
          {t.hero.cta}
        </button>
        <div
          className={`flex gap-6 max-w-6xl mx-auto pb-2 ${
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
      </div>
    </section>
  );
};
