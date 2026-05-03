import { useApp } from "@/contexts/AppContext";
import { useInViewAnimate } from "@/hooks/useInViewAnimate";
import { Hourglass } from "lucide-react";

export const UsageSteps = () => {
  const { t } = useApp();
  const { ref, visible } = useInViewAnimate<HTMLElement>();
  const u = t.usage;

  return (
    <section id="usage" ref={ref} className="py-16 md:py-24 bg-gradient-soft">
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 max-w-2xl mx-auto ${visible ? "animate-in" : ""} animate-in-ready`}>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary mb-2">— {u.sub} —</p>
          <h2 className="text-3xl md:text-5xl font-display">{u.title}</h2>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="lg:hidden relative ps-8">
          <div
            className={`absolute start-3 top-2 bottom-2 w-px border-s border-dashed border-primary/40 ${visible ? "animate-in" : ""}`}
            style={{ animation: visible ? "fade-in 1s ease forwards" : undefined }}
          />
          <ol className="space-y-10">
            {u.steps.map((step, i) => (
              <li key={step.title} className={`relative ${visible ? "animate-in" : ""} animate-in-ready`} style={{ transitionDelay: `${i * 120}ms` }}>
                <span className="absolute -start-5 top-1 w-3 h-3 rounded-full bg-primary shadow-gold" />
                <div className="rounded-2xl bg-card border border-border p-4 shadow-soft">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black text-primary">0{i + 1}</span>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      {step.title}
                      {i === 2 && (
                        <Hourglass className="w-4 h-4 text-accent motion-safe:animate-pulse" aria-hidden />
                      )}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Desktop: horizontal */}
        <div className="hidden lg:block relative pt-6">
          <div
            className="absolute start-[8%] end-[8%] top-10 h-px border-t border-dashed border-primary/50 motion-safe:transition-[clip-path] motion-safe:duration-1000 ease-out"
            style={{ clipPath: visible ? "inset(0 0 0 0)" : "inset(0 100% 0 0)" }}
          />
          <ol className="grid grid-cols-4 gap-6 relative z-[1]">
            {u.steps.map((step, i) => (
              <li key={step.title} className={`text-center px-2 ${visible ? "animate-in" : ""} animate-in-ready`} style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-5 h-5 rounded-full bg-primary mx-auto mb-4 shadow-gold ring-4 ring-background" />
                <h3 className="font-bold text-lg mb-2 flex items-center justify-center gap-2">
                  {step.title}
                  {i === 2 && <Hourglass className="w-4 h-4 text-accent motion-safe:animate-pulse" aria-hidden />}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
