import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  labelBefore: string;
  labelAfter: string;
  autoDemo?: boolean;
  beforePosX?: number;
  beforePosY?: number;
  beforeZoom?: number;
  afterPosX?: number;
  afterPosY?: number;
  afterZoom?: number;
};

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  labelBefore,
  labelAfter,
  autoDemo = true,
  beforePosX = 50,
  beforePosY = 50,
  beforeZoom = 1,
  afterPosX = 50,
  afterPosY = 50,
  afterZoom = 1,
}: Props) {
  const safeBeforePosX = Math.min(100, Math.max(0, beforePosX));
  const safeBeforePosY = Math.min(100, Math.max(0, beforePosY));
  const safeAfterPosX = Math.min(100, Math.max(0, afterPosX));
  const safeAfterPosY = Math.min(100, Math.max(0, afterPosY));
  const safeBeforeZoom = Math.min(3, Math.max(1, beforeZoom));
  const safeAfterZoom = Math.min(3, Math.max(1, afterZoom));

  const [pct, setPct] = useState(50);
  const [w, setW] = useState(0);
  const dragging = useRef(false);
  const wrap = useRef<HTMLDivElement>(null);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setW(el.offsetWidth));
    ro.observe(el);
    setW(el.offsetWidth);
    return () => ro.disconnect();
  }, []);

  const onMove = useCallback(
    (clientX: number) => {
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dir = getComputedStyle(el).direction === "rtl";
      const x = clientX - r.left;
      const ratio = dir ? 1 - x / r.width : x / r.width;
      setPct(Math.min(100, Math.max(0, ratio * 100)));
    },
    [],
  );

  useEffect(() => {
    const el = wrap.current;
    if (!el || !autoDemo || reduced) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        const start = performance.now();
        const loop = (now: number) => {
          const t = (now - start) / 2200;
          if (t <= 1) {
            const ease = 0.5 - 0.5 * Math.cos(Math.PI * t);
            setPct(50 + Math.sin(ease * Math.PI * 2) * 22);
            raf = requestAnimationFrame(loop);
          } else setPct(50);
        };
        raf = requestAnimationFrame(loop);
        io.disconnect();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [autoDemo, beforeSrc, afterSrc, reduced]);

  return (
    <div
      ref={wrap}
      className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden shadow-elegant select-none border border-border bg-card"
      onPointerDown={(e) => {
        dragging.current = true;
        onMove(e.clientX);
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        onMove(e.clientX);
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onPointerLeave={() => {
        dragging.current = false;
      }}
    >
      <img
        src={afterSrc}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{
          objectPosition: `${safeAfterPosX}% ${safeAfterPosY}%`,
          transform: `scale(${safeAfterZoom})`,
          transformOrigin: "center center",
        }}
        draggable={false}
      />

      <div className="absolute inset-y-0 start-0 overflow-hidden pointer-events-none" style={{ width: `${pct}%` }}>
        <div className="absolute inset-0 overflow-hidden" style={{ width: w || "100%" }}>
          <img
            src={beforeSrc}
            alt=""
            className="absolute start-0 top-0 h-full object-cover"
            style={{
              width: w || "100%",
              maxWidth: "none",
              objectPosition: `${safeBeforePosX}% ${safeBeforePosY}%`,
              transform: `scale(${safeBeforeZoom})`,
              transformOrigin: "center center",
            }}
            draggable={false}
          />
        </div>
      </div>

      <div
        className="absolute inset-y-0 w-0.5 bg-card z-10 shadow-md cursor-ew-resize"
        style={{ insetInlineStart: `calc(${pct}% - 1px)` }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 -translate-x-1/2 rtl:translate-x-1/2 rounded-full bg-card border-2 border-primary shadow-elegant cursor-ew-resize flex items-center justify-center text-[10px] font-black text-primary"
        style={{ insetInlineStart: `${pct}%` }}
        aria-hidden
      >
        ||
      </div>

      <div className="absolute top-3 start-3 z-[5] px-3 py-1 rounded-full bg-card/90 backdrop-blur text-xs font-bold border border-border pointer-events-none">
        {labelBefore}
      </div>
      <div className="absolute top-3 end-3 z-[5] px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold pointer-events-none">
        {labelAfter}
      </div>
    </div>
  );
}
