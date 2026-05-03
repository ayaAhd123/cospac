import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import type { SiteSettings } from "@/types/rtdb";

const defaults: SiteSettings = {
  whatsappNumber: "212606068853",
  phoneNumber: "+212 606-068853",
};

/** Numéros obsolètes (placeholder ou ancienne saisie) → remplacés par `defaults`. */
const LEGACY_PHONE_DIGITS = new Set(["212600000000", "212607218410"]);

function digitsOnly(s: string | undefined): string {
  return (s ?? "").replace(/\D/g, "");
}

function mergeSiteSettings(v: SiteSettings | null): SiteSettings {
  const merged: SiteSettings = { ...defaults, ...(v ?? {}) };
  const wa = digitsOnly(merged.whatsappNumber);
  const ph = digitsOnly(merged.phoneNumber);
  if (!wa || LEGACY_PHONE_DIGITS.has(wa)) merged.whatsappNumber = defaults.whatsappNumber;
  if (!ph || LEGACY_PHONE_DIGITS.has(ph)) merged.phoneNumber = defaults.phoneNumber;
  return merged;
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const r = ref(db, "settings");
    const unsub = onValue(
      r,
      (snap) => {
        const v = snap.val() as SiteSettings | null;
        setSettings(mergeSiteSettings(v));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, []);

  return { settings, loading };
}
