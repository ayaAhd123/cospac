import { useEffect, useMemo, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import { useApp } from "@/contexts/AppContext";
import type { FirebaseOffer } from "@/types/rtdb";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const COOKIE = "cospac_offer_popup_dismiss";
const DAY = 24 * 60 * 60 * 1000;

function readDismissed(): boolean {
  try {
    const v = localStorage.getItem(COOKIE);
    if (!v) return false;
    const ts = parseInt(v, 10);
    return Number.isFinite(ts) && Date.now() - ts < DAY;
  } catch {
    return false;
  }
}

function writeDismissed() {
  localStorage.setItem(COOKIE, String(Date.now()));
}

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

export const OfferPopup = () => {
  const { t, lang, setOrderOpen } = useApp();
  const [offer, setOffer] = useState<FirebaseOffer | null>(null);
  const [open, setOpen] = useState(false);

  const title = useMemo(() => (offer ? pickOfferText(offer, lang, "title") : ""), [offer, lang]);
  const desc = useMemo(() => (offer ? pickOfferText(offer, lang, "desc") : ""), [offer, lang]);

  useEffect(() => {
    const r = ref(db, "offers");
    return onValue(r, (snap) => {
      const val = snap.val() as Record<string, FirebaseOffer> | null;
      if (!val) {
        setOffer(null);
        return;
      }
      const popupOne = Object.values(val).find((o) => !!o.popup && isActiveOffer(o));
      setOffer(popupOne ?? null);
    });
  }, []);

  useEffect(() => {
    if (!offer || readDismissed()) return;
    const tmr = window.setTimeout(() => setOpen(true), 3000);
    return () => window.clearTimeout(tmr);
  }, [offer]);

  const close = () => {
    writeDismissed();
    setOpen(false);
  };

  if (!offer) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-w-md rounded-3xl border-border bg-card p-0 overflow-hidden shadow-elegant">
        <button type="button" className="absolute top-3 end-3 z-10 w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-accent" onClick={close} aria-label={t.offer.popupClose}>
          <X className="w-4 h-4" />
        </button>
        {offer.imageUrl ? <img src={offer.imageUrl} alt="" className="w-full h-40 object-cover" /> : null}
        <div className="p-6 space-y-3 text-center">
          <h3 className="whitespace-pre-line text-2xl font-display font-bold">{title}</h3>
          <p className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">{desc}</p>
          <div className="flex flex-col gap-2 pt-2">
            <button type="button" className="h-12 rounded-full bg-primary text-primary-foreground font-bold" onClick={() => { setOrderOpen(true); close(); }}>
              {t.offer.popupCta}
            </button>
            <button type="button" className="text-xs text-muted-foreground underline-offset-2 hover:underline" onClick={close}>
              {t.offer.popupClose}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
