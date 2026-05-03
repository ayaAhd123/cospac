import { useApp } from "@/contexts/AppContext";
import { useInViewAnimate } from "@/hooks/useInViewAnimate";
import { useEffect, useState } from "react";

type ColumnKind = "countSuffix" | "percent" | "infinity";

type BenefitsColumn = {
  kind: ColumnKind;
  title: string;
  desc: string;
  target?: number;
  suffixFr?: string;
  suffixAr?: string;
};

function useStatValue(col: BenefitsColumn, lang: "fr" | "ar", active: boolean): string {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (col.kind === "infinity") return;
    if (col.kind === "percent" && col.target === 0) {
      setN(0);
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setN(col.target ?? 0);
      return;
    }
    const target = col.target ?? 0;
    const start = performance.now();
    const dur = 1500;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - (1 - t) ** 2;
      setN(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, col.kind, col.target]);

  if (col.kind === "infinity") return "∞";
  if (col.kind === "countSuffix") {
    const suf = lang === "ar" ? col.suffixAr ?? "" : col.suffixFr ?? "";
    return `${n}${suf}`;
  }
  if (col.kind === "percent") return `${n}%`;
  return "0%";
}

export const Benefits = () => {
  const { t, lang } = useApp();
  const { ref, visible } = useInViewAnimate<HTMLElement>();
  const columns = t.benefits.columns;

  return (
    <section
      id="benefits"
      ref={ref}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className="bg-[#F5F0E8] px-10 py-20 text-center dark:bg-[#0F1A0F]"
    >
      <style>{`
        @keyframes benefits-fade-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes benefits-accent-w {
          from { width: 0; opacity: 0.6; }
          to { width: 28px; opacity: 1; }
        }
        @keyframes benefits-inf {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .benefits-col-on {
          animation: benefits-fade-up 0.6s ease-out both;
        }
        .benefits-accent-on {
          animation: benefits-accent-w 0.4s ease-out both;
        }
        .benefits-inf-on {
          animation: benefits-inf 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          .benefits-col-on,
          .benefits-accent-on,
          .benefits-inf-on {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .benefits-accent-on { width: 28px !important; }
        }
      `}</style>

      <div className="mx-auto max-w-6xl">
        <h2 className="mb-10 font-display text-[26px] font-bold leading-tight text-[#1a2e1c] dark:text-[#E8E4D9] md:mb-14 md:text-[36px]">
          {t.benefits.title}
        </h2>

        <div className="grid grid-cols-2 gap-y-8 md:grid-cols-4 md:gap-y-0">
          {columns.map((col, i) => (
            <BenefitColumn key={i} col={col} index={i} lang={lang} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
};

function BenefitColumn({
  col,
  index,
  lang,
  visible,
}: {
  col: BenefitsColumn;
  index: number;
  lang: "fr" | "ar";
  visible: boolean;
}) {
  const statText = useStatValue(col, lang, visible);
  const fadeDelay = index * 150;
  const accentDelay = fadeDelay + 600 + 300;

  const mobileVert =
    index % 2 === 0
      ? `max-md:border-e max-md:border-[rgba(201,168,76,0.3)] dark:max-md:border-[rgba(201,168,76,0.2)]`
      : "";
  const mobileHoriz =
    index < 2
      ? `max-md:border-b max-md:border-[rgba(201,168,76,0.3)] dark:max-md:border-[rgba(201,168,76,0.2)]`
      : "";
  const desktopVert =
    index < 3
      ? `md:border-e md:border-[rgba(201,168,76,0.3)] dark:md:border-[rgba(201,168,76,0.2)]`
      : "";

  return (
    <div
      className={`group relative flex flex-col items-center gap-[10px] px-6 py-4 md:px-8 md:py-0 ${mobileVert} ${mobileHoriz} ${desktopVert} md:border-b-0 transition-colors duration-300 ease-out hover:border-[rgba(201,168,76,0.55)] dark:hover:border-[rgba(201,168,76,0.45)] ${visible ? "benefits-col-on" : "translate-y-10 opacity-0"}`}
      style={visible ? { animationDelay: `${fadeDelay}ms` } : undefined}
    >
      <div
        className={`font-display text-[40px] font-bold leading-none text-[#C9A84C] transition-transform duration-300 ease-out md:text-[52px] group-hover:scale-[1.08] motion-reduce:group-hover:scale-100 ${col.kind === "infinity" && visible ? "benefits-inf-on inline-block" : ""}`}
        style={col.kind === "infinity" && visible ? { animationDelay: `${fadeDelay}ms` } : undefined}
      >
        {col.kind === "infinity" ? "∞" : statText}
      </div>

      <h3 className="text-center font-sans text-base font-bold text-[#1a2e1c] dark:text-[#E8E4D9]">{col.title}</h3>
      <p className="max-w-[160px] text-center text-xs leading-[1.6] text-[#8a9e8c] dark:text-[#5a6e5c]">{col.desc}</p>

      <div
        className={`mt-2 h-0.5 rounded-sm bg-[#C9A84C] transition-[width] duration-300 ease-out group-hover:w-[50px] motion-reduce:group-hover:w-7 ${visible ? "benefits-accent-on" : "w-0 opacity-0"}`}
        style={visible ? { animationDelay: `${accentDelay}ms` } : undefined}
      />
    </div>
  );
}
