import heroBg from "@/assets/cospac-hero-bg.png";
import heroBrown from "@/assets/hero-box-brown.png";
import heroBlack from "@/assets/hero-box-black.png";
import ingredientsPhoto from "@/assets/ingredients-photo.png";
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
      { image: heroBg, ...t.hero.slider.slides[0] },
      { image: heroBrown, ...t.hero.slider.slides[1] },
      { image: heroBlack, ...t.hero.slider.slides[2] },
      { image: ingredientsPhoto, ...t.hero.slider.slides[3] },
    ],
    [t.hero.slider.slides],
  );

  useEffect(() => {
    if (reducedMotion || paused || slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setIdx((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, slides.length]);

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
      className="relative h-[100svh] md:h-screen overflow-hidden"
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
            rgba(0,0,0,0.55) 0%,
            rgba(0,0,0,0.2) 60%,
            rgba(0,0,0,0) 100%
          );
        }
        .hero-overlay-ltr {
          background: linear-gradient(
            to right,
            rgba(0,0,0,0.55) 0%,
            rgba(0,0,0,0.2) 60%,
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
        }
        @media (min-width: 768px) {
          .hero-slide-0 {
            background-position: left center !important;
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
              backgroundPosition: "center",
            }}
          >
            <div className={`absolute inset-0 ${isRTL ? "hero-overlay-rtl" : "hero-overlay-ltr"}`} />
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
        className={`absolute z-20 inset-y-0 flex items-center ${isRTL ? "right-0 justify-end" : "left-0 justify-start"} w-full px-6 md:px-[60px]`}
      >
        <div key={idx} className={`hero-text-anim max-w-[520px] ${isRTL ? "text-right" : "text-left"} max-md:text-center`}>
          <span className="block mb-3 text-xs tracking-[2px] uppercase text-[#C9A84C]">{slides[idx]?.badge}</span>
          <h1 className="mb-4 font-display text-white text-[30px] md:text-[52px] leading-[1.2] font-bold [text-shadow:0_2px_20px_rgba(0,0,0,0.3)]">
            {slides[idx]?.title}
          </h1>
          <p className="mb-8 text-[15px] leading-[1.6] text-white/80">{slides[idx]?.subtitle}</p>
          <div className={`flex gap-3 max-md:flex-col ${isRTL ? "md:flex-row-reverse" : ""}`}>
            <button
              type="button"
              onClick={onOrderClick}
              className="px-8 py-[13px] rounded text-sm bg-[#2C4A2E] text-[#F5F0E8] hover:bg-[#1a2e1c] transition"
            >
              {t.hero.cta}
            </button>
            <button
              type="button"
              onClick={() => scrollTo("video")}
              className="px-7 py-[13px] rounded text-sm border border-white/60 text-white bg-transparent hover:bg-white/10 transition inline-flex items-center justify-center gap-2"
            >
              <Play className="h-4 w-4" />
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
