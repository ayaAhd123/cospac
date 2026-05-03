import { Phone, MessageCircle } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const FloatingButtons = () => {
  const { t, lang } = useApp();
  const { settings } = useSiteSettings();
  const wa = (settings.whatsappNumber ?? "212606068853").replace(/\D/g, "");
  const tel = settings.phoneNumber ?? "+212 606-068853";
  const telHref = tel.replace(/\s/g, "");
  const prefill = encodeURIComponent(t.floating.whatsappPrefill as string);
  const waHref = `https://wa.me/${wa}?text=${prefill}`;
  const scrollToProducts = () => {
    const products = document.getElementById("products");
    if (products) products.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-background via-background to-transparent pt-8">
        <button type="button" onClick={scrollToProducts} className="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold shadow-elegant">
          🛒 {t.sticky}
        </button>
      </div>
      <div className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] start-4 z-30 flex flex-col gap-2 md:bottom-6 md:start-auto md:end-4">
        <a
          href={waHref}
          aria-label={t.floating.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="w-[52px] h-[52px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-elegant hover:scale-110 transition-smooth motion-safe:animate-pulse-ring"
        >
          <MessageCircle className="w-6 h-6 fill-current" />
        </a>
        <Tooltip>
          <TooltipTrigger asChild>
            <a href={`tel:${telHref}`} aria-label={t.floating.call} className="w-[52px] h-[52px] rounded-full bg-card border border-border text-primary flex items-center justify-center shadow-soft hover:scale-110 transition-smooth">
              <Phone className="w-5 h-5" />
            </a>
          </TooltipTrigger>
          <TooltipContent side={lang === "ar" ? "left" : "right"}>
            <p className="text-xs font-mono">{tel}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  );
};
