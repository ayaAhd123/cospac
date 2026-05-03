import { useApp } from "@/contexts/AppContext";
import { useInViewAnimate } from "@/hooks/useInViewAnimate";
import productImg from "@/assets/ingredients-photo.png";
import { Leaf, Sprout, Flower2, Sparkles } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";

const icons = [Leaf, Sprout, Flower2, Sparkles];

function ingredientItemStyle(
  index: number,
  hoveredIdx: number | null,
  reducedMotion: boolean,
): CSSProperties {
  if (reducedMotion) {
    return { transition: "none" };
  }
  const isHovered = hoveredIdx === index;

  let transform = "scale(1) translateX(0px)";
  let zIndex = 1;
  let opacity = 1;
  let boxShadow: string | undefined;

  if (hoveredIdx !== null) {
    if (isHovered) {
      transform = "scale(1.35) translateX(0px)";
      zIndex = 10;
      boxShadow = "0 24px 48px rgba(0,0,0,0.45)";
    } else {
      zIndex = 1;
      opacity = 0.6;
    }
  }

  const inHover = hoveredIdx !== null;
  const transition = inHover
    ? isHovered
      ? "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease, opacity 0.4s ease"
      : "opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease"
    : "transform 0.35s ease, opacity 0.35s ease, box-shadow 0.35s ease";

  return {
    transform,
    zIndex,
    opacity,
    boxShadow,
    transition,
    willChange: "transform",
  };
}

export const Ingredients = () => {
  const { t, lang } = useApp();
  const { ref, visible } = useInViewAnimate<HTMLElement>();
  const ing = t.ingredients;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const onEnter = (i: number) => {
    if (!isMobile) setHoveredIdx(i);
  };
  const onLeave = () => {
    if (!isMobile) setHoveredIdx(null);
  };
  const onTap = (i: number) => {
    if (!isMobile) return;
    setHoveredIdx((prev) => (prev === i ? null : i));
  };

  return (
    <section id="ingredients" ref={ref} className="overflow-visible py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className={`mx-auto mb-12 max-w-2xl text-center ${visible ? "animate-in" : ""} animate-in-ready`}>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">— {ing.sub} —</p>
          <h2 className="font-display text-3xl md:text-5xl">{ing.title}</h2>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <ul className="relative order-2 space-y-4 overflow-visible lg:order-none rtl:lg:order-2">
            {ing.items.map((item, i) => {
              const Icon = icons[i % icons.length];
              return (
                <li
                  key={item.name}
                  className={`ing-pack cursor-pointer rounded-2xl border-2 border-gold bg-card p-4 shadow-soft motion-reduce:transition-none ${visible ? "animate-in" : ""} animate-in-ready`}
                  style={ingredientItemStyle(i, hoveredIdx, reducedMotion)}
                  onMouseEnter={() => onEnter(i)}
                  onMouseLeave={onLeave}
                  onClick={() => onTap(i)}
                  role={isMobile ? "button" : undefined}
                  tabIndex={isMobile ? 0 : undefined}
                  onKeyDown={
                    isMobile
                      ? (e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            onTap(i);
                          }
                        }
                      : undefined
                  }
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary pointer-events-none">
                      <Icon className="h-6 w-6" aria-hidden />
                    </span>
                    <span className="pointer-events-none font-semibold leading-snug text-foreground">{item.name}</span>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className={`relative order-1 lg:order-none rtl:lg:order-1 ${visible ? "animate-in" : ""} animate-in-ready`} style={{ transitionDelay: "120ms" }}>
            <div className="mx-auto max-w-md overflow-hidden rounded-[2rem] border border-border shadow-elegant lg:ms-auto lg:me-0 rtl:lg:ms-0 rtl:lg:me-auto">
              <img src={productImg} alt="" className="aspect-square w-full object-cover" width={768} height={768} loading="lazy" />
            </div>
          </div>
        </div>

        <ul className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2">
          {ing.benefits.map((line, i) => (
            <li
              key={line}
              className={`flex gap-3 rounded-2xl border border-border/60 bg-secondary/60 p-4 ${visible ? "animate-in" : ""} animate-in-ready`}
              style={{ transitionDelay: `${400 + i * 100}ms` }}
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-gold text-gold">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                  <path d="M3 8l3.5 3.5L13 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-sm leading-relaxed md:text-base">{line}</span>
            </li>
          ))}
        </ul>

        <div
          className={`mx-auto mt-12 max-w-4xl rounded-3xl bg-gradient-hero px-6 py-8 text-center text-lg font-semibold text-primary-foreground shadow-elegant md:text-xl ${visible ? "animate-in" : ""} animate-in-ready`}
          style={{ transitionDelay: "700ms" }}
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          {ing.cta}
        </div>
      </div>
    </section>
  );
};
