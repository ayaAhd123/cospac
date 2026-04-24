import { useApp } from "@/contexts/AppContext";

export const Benefits = () => {
  const { t } = useApp();
  return (
    <section id="benefits" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-5xl text-center mb-12">{t.benefits.title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {t.benefits.items.map((b, i) => (
            <div key={i} className="bg-card rounded-3xl p-6 text-center border border-border hover:shadow-elegant hover:-translate-y-1 transition-smooth">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-soft flex items-center justify-center text-3xl">{b.icon}</div>
              <h3 className="font-bold mb-2">{b.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
