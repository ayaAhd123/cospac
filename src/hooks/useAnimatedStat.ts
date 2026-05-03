import { useEffect, useRef, useState } from "react";

function parseStat(raw: string): { target: number; suffix: string; prefix: string } {
  const s = raw.trim();
  const m = s.match(/^(\D*)([\d.]+)(.*)$/);
  if (!m) return { target: 0, suffix: "", prefix: s };
  const prefix = m[1] ?? "";
  const num = parseFloat(m[2] ?? "0");
  const suffix = m[3] ?? "";
  return { target: Number.isFinite(num) ? num : 0, suffix, prefix };
}

export function useAnimatedStat(displayValue: string, durationMs = 1400, enabled = true) {
  const [shown, setShown] = useState(displayValue);
  const raf = useRef<number>();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!enabled || reduced) {
      setShown(displayValue);
      return;
    }
    const { target, suffix, prefix } = parseStat(displayValue);
    if (target === 0 && !/\d/.test(displayValue)) {
      setShown(displayValue);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - (1 - t) ** 3;
      const val = Math.round(target * eased);
      setShown(`${prefix}${val}${suffix}`);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [displayValue, durationMs, enabled]);

  return shown;
}
