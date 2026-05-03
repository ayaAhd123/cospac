import productBrown from "@/assets/hero-box-brown.png";
import productBlack from "@/assets/hero-box-black.png";
import { useApp } from "@/contexts/AppContext";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useEffect, useMemo, useState } from "react";

/** Tracé SVG de la vague (bord centre + bord extérieur colonne texte, miroir). */
const HERO_WAVE_PATH_D =
  "M 30 0 Q 58 100 32 200 Q 6 300 34 400 Q 62 500 30 600 Q 4 700 36 800 Q 60 900 28 1000 Q 8 1100 32 1200 L 100 1200 L 100 0 Z";

/** Courbe seule (contour) pour dessiner la vague sur le bord extérieur. */
const HERO_WAVE_EDGE_D =
  "M 30 0 Q 58 100 32 200 Q 6 300 34 400 Q 62 500 30 600 Q 4 700 36 800 Q 60 900 28 1000 Q 8 1100 32 1200";

export const Hero = () => {
  const { t, lang } = useApp();
  const magnetic = useMagnetic(0.18);
  const [hoveredBox, setHoveredBox] = useState<"box1" | "box2" | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const isRTL = lang === "ar";
  const decorNuts = useMemo(
    () => [
      { top: "10%", left: "8%", size: 20 },
      { top: "22%", left: "38%", size: 30 },
      { top: "14%", right: "10%", size: 45 },
      { top: "44%", left: "16%", size: 30 },
      { top: "58%", right: "18%", size: 20 },
      { top: "72%", left: "30%", size: 45 },
      { top: "80%", right: "8%", size: 30 },
    ],
    [],
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");
    const sync = () => setIsTablet(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onOrderClick = () => {
    scrollTo("products");
  };

  return (
    <section className="hero-section-root relative min-h-[100svh] overflow-x-visible bg-background md:min-h-screen md:overflow-x-hidden">
      <style>{`
        .hero-left {
          background: radial-gradient(ellipse at 60% 80%, #3d6641, #2c4a2e);
        }
        .dark .hero-left {
          background: #ffffff;
        }
        .hero-product-card {
          animation: heroCardRise 0.8s ease-out forwards;
          opacity: 0;
          transform: translateY(60px);
        }
        .hero-product-card--1 {
          animation-delay: 0.2s;
        }
        .hero-product-card--2 {
          animation-delay: 0.4s;
        }
        .hero-pack {
          will-change: transform;
          cursor: pointer;
        }
        .hero-fade-1 {
          animation: heroFadeUp 0.7s ease-out both;
          animation-delay: 0.1s;
        }
        .hero-fade-2 {
          animation: heroFadeUp 0.7s ease-out both;
          animation-delay: 0.2s;
        }
        .hero-fade-3 {
          animation: heroFadeUp 0.7s ease-out both;
          animation-delay: 0.3s;
        }
        .hero-fade-4 {
          animation: heroFadeUp 0.7s ease-out both;
          animation-delay: 0.4s;
        }
        @keyframes heroCardRise {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-product-card,
          .hero-fade-1,
          .hero-fade-2,
          .hero-fade-3,
          .hero-fade-4,
          .hero-pack {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }

        .hero-inner-grid {
          container-type: inline-size;
        }

        /* Mobile (spec max 768px) ; 767px pour rester aligné avec le breakpoint md Tailwind */
        @media (max-width: 767px) {
          .hero-section-root {
            min-height: 82svh;
            padding-bottom: 60px;
          }
          .hero-inner-grid {
            min-height: 82svh;
            grid-template-columns: 40% 60%;
          }
          .hero-left {
            min-height: 82svh;
          }
          /* Centrer la pile verticalement dans la colonne verte (comme ref. visuelle), pas collée en bas */
          .hero-product-row {
            left: 8px;
            right: 8px;
            top: 50%;
            bottom: auto;
            width: auto;
            transform: translateY(-50%);
            transform-origin: center center;
            justify-content: center;
            gap: 20px;
          }
          .hero-product-card--1 {
            transform: translateY(-6px);
          }
          .hero-product-card--2 {
            transform: translateY(10px);
          }
        }

        /* Tablette : même positionnement que desktop, sans transition sur les box */
        @media (min-width: 768px) and (max-width: 1023px) {
          .hero-product-row {
            left: 50%;
            right: auto;
            top: auto;
            width: max-content;
            bottom: 2.25rem;
            transform: translateX(-50%) scale(0.82);
            transform-origin: bottom center;
          }
          .hero-pack {
            transition: none !important;
          }
        }
        /* Mobile uniquement: transitions/animations off */
        @media (max-width: 767px) {
          .hero-product-card,
          .hero-fade-1,
          .hero-fade-2,
          .hero-fade-3,
          .hero-fade-4 {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .hero-pack {
            transition: none !important;
          }
        }
        @media (min-width: 1024px) {
          .hero-product-row {
            left: 50%;
            right: auto;
            top: auto;
            width: max-content;
            bottom: 2.25rem;
            transform: translateX(-50%) scale(0.82);
            transform-origin: bottom center;
          }
        }
        @media (min-width: 1024px) {
          @supports (width: 1cqw) {
            .hero-product-row {
              transform: translateX(-50%) scale(0.82);
            }
          }
        }
      `}</style>
      <div
        className="hero-inner-grid relative isolate grid min-h-[100svh] grid-cols-[45%_55%] md:min-h-screen md:grid-cols-2"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="hero-left relative z-0 min-h-[100svh] overflow-hidden md:min-h-screen md:overflow-visible">
          {decorNuts.map((nut, idx) => (
            <span
              key={idx}
              className="absolute rounded-full border border-[#C9A84C]/40 bg-[#d6b77a]/20 opacity-10 max-md:opacity-[0.08] md:opacity-20"
              style={{
                top: nut.top,
                left: "left" in nut ? nut.left : undefined,
                right: "right" in nut ? nut.right : undefined,
                width: `${nut.size}px`,
                height: `${nut.size}px`,
              }}
            />
          ))}

          <div className="hero-edition-badge absolute top-3 left-1/2 z-[1] -translate-x-1/2 rounded-[20px] border border-[#C9A84C] bg-[rgba(201,168,76,0.15)] px-2 py-[2px] text-[9px] leading-tight text-[#f5e2a4] md:top-5 md:px-3 md:py-1 md:text-[11px]">
            {isRTL ? "إصدار الماكاداميا" : "Édition Macadamia"}
          </div>

          <div
            dir="ltr"
            className="hero-product-row absolute flex flex-col items-center overflow-visible md:flex-row md:justify-center md:bottom-6 md:items-end md:gap-8"
          >
            <div className="hero-product-card hero-product-card--1 overflow-visible">
              <ProductPack
                boxId="box1"
                variant="black"
                shade="1.0 NATURAL BLACK"
                image={productBrown}
                hoveredBox={hoveredBox}
                setHoveredBox={setHoveredBox}
                isMobile={isMobile}
                isTablet={isTablet}
              />
            </div>
            <div className="hero-product-card hero-product-card--2 overflow-visible">
              <ProductPack
                boxId="box2"
                variant="brown"
                shade="2.0 DARK BROWN"
                image={productBlack}
                hoveredBox={hoveredBox}
                setHoveredBox={setHoveredBox}
                isMobile={isMobile}
                isTablet={isTablet}
              />
            </div>
          </div>
        </div>

        {/* Vague couture vert / crème : au-dessus du vert (z-0), sous la cellule crème (z-20) — la crème ne recouvre que sa moitié de grille */}
        <svg
          className={`pointer-events-none absolute left-1/2 top-0 z-[15] h-full w-[4.25rem] origin-center -translate-x-1/2 sm:w-20 md:w-24 ${isRTL ? "scale-x-[-1]" : ""}`}
          viewBox="0 0 100 1200"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d={HERO_WAVE_PATH_D} fill="#F5F0E8" className="dark:fill-[#0F1A0F]" />
        </svg>

        <div
          className="relative z-20 flex min-h-[100svh] min-w-0 flex-col justify-between gap-0 overflow-visible bg-[#F5F0E8] px-3 py-4 ltr:max-md:pl-4 rtl:max-md:pr-4 dark:bg-[#0F1A0F] md:min-h-screen md:justify-center md:gap-4 md:px-10 md:py-12"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {/* Vague bord extérieur (colonne texte) : même forme que le centre, miroir + léger trait doré pour la lisibilité sur fond crème */}
          <svg
            className="pointer-events-none absolute end-0 top-0 z-[5] block h-full w-[4.25rem] sm:w-20 md:w-24"
            viewBox="0 0 100 1200"
            preserveAspectRatio="none"
            aria-hidden
          >
            <g transform="translate(100,0) scale(-1,1)">
              <path d={HERO_WAVE_PATH_D} fill="#F5F0E8" className="dark:fill-[#0F1A0F]" />
              <path
                d={HERO_WAVE_EDGE_D}
                fill="none"
                stroke="rgba(201,168,76,0.42)"
                strokeWidth="1.35"
                vectorEffect="nonScalingStroke"
                className="dark:stroke-[rgba(201,168,76,0.28)]"
              />
            </g>
          </svg>

          <div className="relative z-20 flex min-h-0 flex-1 flex-col items-center justify-center gap-2 text-center md:flex-none md:items-stretch md:justify-center md:gap-3 md:text-start rtl:md:text-end">
            <div className="hero-fade-1 inline-flex w-fit max-w-full items-center justify-center gap-1 rounded-[20px] border border-[#C9A84C] bg-[rgba(201,168,76,0.12)] px-2 py-0.5 text-[9px] text-[#C9A84C] md:justify-start md:gap-1.5 md:px-3 md:py-1 md:text-[11px] rtl:md:justify-end">
              <Sparkles className="h-2.5 w-2.5 shrink-0 md:h-3 md:w-3" /> {t.hero.badge}
            </div>
            <h1 className="hero-fade-2 w-full font-display text-[20px] font-bold leading-[1.3] text-[#1a2e1c] md:text-[clamp(0.8rem,calc(0.85rem+1vw),2.625rem)] md:leading-[1.2] dark:text-[#E8E4D9]">
              {t.hero.title}
            </h1>
            <p className="hero-fade-3 line-clamp-3 w-full overflow-hidden text-[10px] leading-[1.5] text-[#5a6e5c] md:line-clamp-none md:text-[clamp(0.65rem,calc(0.6rem+0.25vw),0.875rem)] md:leading-[1.55] dark:text-[#8a9e8c]">
              {t.hero.subtitle}
            </p>

            <div
              className={`hero-fade-4 flex w-full max-w-full flex-col gap-1.5 md:flex-row md:max-w-none md:gap-3 ${isRTL ? "md:flex-row-reverse" : ""}`}
            >
              <button
                ref={magnetic.ref}
                onMouseMove={magnetic.onMouseMove}
                onMouseLeave={magnetic.onMouseLeave}
                onClick={onOrderClick}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-[20px] bg-[#2C4A2E] px-3 py-2 text-[11px] font-semibold text-[#F5F0E8] transition duration-200 ease-out hover:scale-[1.02] hover:bg-[#1a2e1c] md:w-auto md:flex-1 md:rounded-[25px] md:px-7 md:py-3 md:text-[14px] md:gap-2"
              >
                {t.hero.cta} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </button>
              <button
                onClick={() => scrollTo("video")}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-[20px] border border-[#2C4A2E] bg-transparent px-3 py-2 text-[11px] text-[#2C4A2E] transition duration-200 ease-out hover:bg-[rgba(44,74,46,0.08)] dark:border-[#C9A84C] dark:text-[#C9A84C] dark:hover:bg-[rgba(201,168,76,0.08)] md:w-auto md:flex-1 md:rounded-[25px] md:px-5 md:py-3 md:text-[14px] md:gap-2"
              >
                <span className="grid h-4 w-4 place-items-center rounded-full border border-current text-[8px]">
                  <Play className="h-2.5 w-2.5 fill-current" />
                </span>
                {t.hero.ctaSecondary}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

function ProductPack({
  boxId,
  variant,
  shade,
  image,
  hoveredBox,
  setHoveredBox,
  isMobile,
  isTablet,
}: {
  boxId: "box1" | "box2";
  variant: "brown" | "black";
  shade: string;
  image: string;
  hoveredBox: "box1" | "box2" | null;
  setHoveredBox: (v: "box1" | "box2" | null) => void;
  isMobile: boolean;
  isTablet: boolean;
}) {
  const boxBg = variant === "brown" ? "#1a2e1c" : "#0d1a0e";
  const dotBg = variant === "brown" ? "#4a2c1a" : "#111111";

  const isHovered = hoveredBox === boxId;

  let transform = "scale(1) translateX(0px)";
  let zIndex = boxId === "box1" ? 2 : 1;
  let opacity = 1;
  let boxShadow: string | undefined;

  if (isMobile) {
    if (hoveredBox === "box1" && boxId === "box1") transform = "scale(1.04) translateX(0px)";
    else if (hoveredBox === "box2" && boxId === "box2") transform = "scale(1.04) translateX(0px)";
    else if (hoveredBox !== null && hoveredBox !== boxId) opacity = 0.75;
  } else if (hoveredBox === "box1") {
    if (boxId === "box1") {
      transform = "scale(1.35) translateX(0px)";
      zIndex = 10;
      boxShadow = "0 24px 48px rgba(0,0,0,0.45)";
    } else {
      zIndex = 1;
      opacity = 0.6;
    }
  } else if (hoveredBox === "box2") {
    if (boxId === "box2") {
      transform = "scale(1.35) translateX(-60px)";
      zIndex = 10;
      boxShadow = "0 24px 48px rgba(0,0,0,0.45)";
    } else {
      zIndex = 1;
      opacity = 0.6;
    }
  }

  const inHoverState = hoveredBox !== null;
  const transition = isTablet
    ? "none"
    : inHoverState
      ? isHovered
        ? "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease, opacity 0.4s ease"
        : "opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease"
      : "transform 0.35s ease, opacity 0.35s ease, box-shadow 0.35s ease";

  const onPointerEnter = () => {
    if (!isMobile) setHoveredBox(boxId);
  };
  const onPointerLeave = () => {
    if (!isMobile) setHoveredBox(null);
  };
  const onBoxClick = () => {
    if (!isMobile) return;
    setHoveredBox((prev) => (prev === boxId ? null : boxId));
  };

  return (
    <div
      className="hero-pack w-full max-w-[min(182px,calc(45vw-2px))] shrink-0 overflow-visible rounded-lg border border-[#C9A84C] p-1.5 md:w-[256px] md:max-w-none md:min-h-[535px] md:rounded-[10px] md:p-3.5"
      style={{
        background: boxBg,
        transform,
        opacity,
        zIndex,
        boxShadow,
        transition,
      }}
      onMouseEnter={onPointerEnter}
      onMouseLeave={onPointerLeave}
      onClick={onBoxClick}
      role={isMobile ? "button" : undefined}
      tabIndex={isMobile ? 0 : undefined}
      onKeyDown={
        isMobile
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onBoxClick();
              }
            }
          : undefined
      }
    >
      <img
        src={image}
        alt="COSPAC product"
        className="pointer-events-none mb-1 h-[min(152px,37vw)] w-full rounded-md object-contain opacity-95 md:mb-3 md:h-[405px] md:rounded"
      />
      <div className="text-center font-display text-[6px] leading-tight text-[#C9A84C] md:text-[9px]">COSPAC</div>
      <div className="text-center text-[5px] leading-tight tracking-wide text-[#C9A84C]/70 md:text-[6px] md:tracking-[2px]">BEAUTY</div>
      <div className="my-0.5 border-t border-[rgba(201,168,76,0.35)] md:my-1" />
      <div className="text-center text-[5px] leading-tight text-white/85 md:text-[6px]">MACADAMIA BUBBLE DYE</div>
      <div className="mx-auto mt-0.5 w-full max-w-[95%] rounded-sm bg-[#C9A84C] px-0.5 py-px text-center text-[5px] font-bold leading-tight text-[#1a2e1c] md:mt-1 md:max-w-full md:rounded-[4px] md:px-1.5 md:py-0.5 md:text-[6px]">
        {shade}
      </div>
      <div className="mx-auto mt-1 h-[9px] w-[9px] shrink-0 rounded-full border border-white/30 md:mt-2 md:h-[20px] md:w-[20px]" style={{ background: dotBg }} />
    </div>
  );
}

