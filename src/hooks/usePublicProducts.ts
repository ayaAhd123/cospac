import { useEffect, useMemo, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import type { FirebaseProduct } from "@/types/rtdb";
import type { Lang } from "@/i18n/translations";
import type { TranslationTree } from "@/i18n/translations";

export type DisplayProduct = {
  id: string;
  name: string;
  desc: string;
  price: number;
  imageUrl?: string;
  badge?: string;
};

type FallbackItem = TranslationTree["products"]["items"][number];

function mapRow(id: string, p: FirebaseProduct, lang: Lang): DisplayProduct {
  return {
    id,
    name: lang === "ar" ? p.nameAr : p.nameFr,
    desc: lang === "ar" ? p.descAr : p.descFr,
    price: Number(p.price) || 0,
    imageUrl: p.imageUrl || undefined,
    badge: p.badge || undefined,
  };
}

function mapFallback(items: TranslationTree["products"]["items"]): DisplayProduct[] {
  return (items as FallbackItem[]).map((p) => ({
    id: p.id,
    name: p.name,
    desc: p.desc,
    price: Number(p.price) || 0,
    badge: undefined,
    imageUrl: undefined,
  }));
}

export function usePublicProducts(lang: Lang, fallback: TranslationTree["products"]["items"]) {
  const [rows, setRows] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const r = ref(db, "products");
    const safety = window.setTimeout(() => {
      if (alive) setLoading(false);
    }, 2500);
    const unsub = onValue(
      r,
      (snap) => {
        if (!alive) return;
        window.clearTimeout(safety);
        const val = snap.val() as Record<string, FirebaseProduct> | null;
        if (!val) {
          setRows(mapFallback(fallback));
          setLoading(false);
          return;
        }
        const list = Object.entries(val)
          .map(([id, data]) => ({ id, data }))
          .filter(({ data }) => data.active !== false)
          .map(({ id, data }) => mapRow(id, data, lang));
        setRows(list.length > 0 ? list : mapFallback(fallback));
        setLoading(false);
      },
      () => {
        if (!alive) return;
        window.clearTimeout(safety);
        setRows(mapFallback(fallback));
        setLoading(false);
      },
    );
    return () => {
      alive = false;
      window.clearTimeout(safety);
      unsub();
    };
  }, [lang, fallback]);

  const products = useMemo(() => rows, [rows]);

  return { products, loading, fromFirebase: rows.length > 0 };
}
