import { useApp } from "@/contexts/AppContext";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type TouchEventHandler } from "react";

export const Hero = () => {
  const { t, lang, goToProductsSection } = useApp();
  const isRTL = lang === "ar";
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const slides = useMemo(
    () => [
      { image: "/IMG_6138.PNG", ...t.hero.slider.slides[0] },
      { image: "/WhatsApp Image 2026-05-06 at 21.48.40.jpeg", ...t.hero.slider.slides[1] },
    ],
    [t.hero.slider.slides],
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setIdx((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const next = () => setIdx((prev) => (prev + 1) % slides.length);
  const prev = () => setIdx((prev) => (prev - 1 + slides.length) % slides.length);

  const onOrderClick = () => {
    goToProductsSection();
  };

  const onTouchStart: TouchEventHandler<HTMLElement> = (e) => {
    touchStartX.current = e.changedTouches[0]?.clientX ?? null;
  };
  const onTouchEnd: TouchEventHandler<HTMLElement> = (e) => {
    if (touchStartX.current === null) return;
    const delta = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(delta) < 50) return;
    if (delta < 0) next();
    else prev();
    touchStartX.current = null;
  };

  return (
    <section
      id="hero"
      className="relative h-[60svh] md:h-screen overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <style>{`
        .hero-slide {
          transition: opacity 1.2s ease;
        }
        .hero-overlay-rtl {
          background: linear-gradient(
            to left,
            rgba(0,0,0,0.4) 0%,
            rgba(0,0,0,0.1) 60%,
            rgba(0,0,0,0) 100%
          );
        }
        .hero-overlay-ltr {
          background: linear-gradient(
            to right,
            rgba(0,0,0,0.4) 0%,
            rgba(0,0,0,0.1) 60%,
            rgba(0,0,0,0) 100%
          );
        }
        @keyframes hero-text-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .hero-text-anim {
          animation: hero-text-in 0.7s ease-out both;
          animation-delay: 0.3s;
        }
        .hero-btn-premium {
          background: linear-gradient(180deg, #5D3A1A 0%, #3D2611 100%);
          border: 2px solid #C9A84C;
          color: #C9A84C;
          font-weight: bold;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
          box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        }
        .hero-btn-premium:hover {
          filter: brightness(1.2);
          transform: translateY(-1px);
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-slide, .hero-text-anim {
            transition: none !important;
            animation: none !important;
          }
        }
        @media (max-width: 767px) {
          .hero-mobile-hide {
            display: none;
          }
          .hero-slide-0 {
            background-position: 80% center !important;
          }
          .hero-slide-1 {
            background-position: center !important;
          }
        }
        @media (min-width: 768px) {
          .hero-slide-0 {
            background-position: center !important;
          }
        }
      `}</style>
      <div className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`hero-slide absolute inset-0 hero-slide-${i}`}
            style={{
              opacity: i === idx ? 1 : 0,
              backgroundImage: `url("${slide.image}")`,
              backgroundSize: "cover",
              backgroundPosition: i === 0 ? "80% center" : "center",
            }}
          >
            <div className={`absolute inset-0 ${isRTL ? "hero-overlay-rtl" : "hero-overlay-ltr"} bg-black/10`} />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="hero-mobile-hide absolute left-4 top-1/2 z-30 -translate-y-1/2 h-11 w-11 rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-[4px] hover:bg-white/30 transition"
        onClick={prev}
        aria-label="Previous slide"
      >
        <ChevronLeft className="mx-auto h-5 w-5" />
      </button>
      <button
        type="button"
        className="hero-mobile-hide absolute right-4 top-1/2 z-30 -translate-y-1/2 h-11 w-11 rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-[4px] hover:bg-white/30 transition"
        onClick={next}
        aria-label="Next slide"
      >
        <ChevronRight className="mx-auto h-5 w-5" />
      </button>

      <div
        className={`absolute z-20 inset-0 flex items-center ${idx === 0 ? (isRTL ? "justify-end" : "justify-start") : (isRTL ? "right-0 justify-end" : "left-0 justify-start")} w-full px-6 md:px-[80px]`}
      >
        <div key={idx} className={`hero-text-anim w-full md:max-w-[520px] ${idx === 0 ? "text-right" : (isRTL ? "text-right" : "text-left")} max-md:text-center`}>
          {slides[idx]?.badge && (
            <span className="block mb-2 text-sm md:text-base tracking-[1px] font-medium text-white/90">{slides[idx]?.badge}</span>
          )}
          {slides[idx]?.title && (
            <h1 className="mb-4 font-display text-white text-[28px] md:text-[56px] leading-[1.1] font-bold [text-shadow:0_2px_15px_rgba(0,0,0,0.5)] whitespace-pre-line">
              {slides[idx]?.title}
            </h1>
          )}
          
          {idx === 0 && <div className="w-full h-[1px] bg-gradient-to-l from-[#C9A84C]/80 via-[#C9A84C]/20 to-transparent mb-6 max-md:mx-auto max-md:w-2/3" />}

          {slides[idx]?.subtitle && (
            <p className="mb-8 text-[14px] md:text-[18px] leading-[1.6] text-white/90 font-medium">{slides[idx]?.subtitle}</p>
          )}
          
          <div className={`flex gap-3 max-md:flex-col ${isRTL ? "md:flex-row-reverse" : ""}`}>
            <button
              type="button"
              onClick={onOrderClick}
              className={`px-8 md:px-10 py-[12px] md:py-[15px] rounded-full text-sm md:text-base transition-all duration-300 ${idx === 0 ? "hero-btn-premium" : "bg-[#2C4A2E] text-white hover:bg-[#1a2e1c]"}`}
            >
              {t.hero.cta}
            </button>
            <button
              type="button"
              onClick={() => scrollTo("video")}
              className="px-6 md:px-8 py-[12px] md:py-[15px] rounded-full text-sm md:text-base border border-white/40 text-white bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all inline-flex items-center justify-center gap-2"
            >
              <Play className="h-4 w-4 fill-current" />
              {t.hero.ctaSecondary}
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-24 left-1/2 z-20 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            className={`h-2 w-2 rounded-full border border-white transition-all duration-300 ${
              i === idx ? "bg-white scale-125" : "bg-transparent"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

    </section>
  );
};
