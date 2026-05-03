import { Moon, Sun, Globe, Menu, X } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const { lang, setLang, theme, toggleTheme, t } = useApp();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#products", label: t.nav.products },
    { href: "#benefits", label: t.nav.benefits },
    { href: "#ingredients", label: t.nav.ingredients },
    { href: "#usage", label: t.nav.usage },
    { href: "#before-after", label: t.nav.beforeAfter },
    { href: "#reviews", label: t.nav.reviews },
  ];

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground font-black text-sm">C</div>
          <span className="font-display font-bold text-xl tracking-tight">
            COSPAC<span className="text-primary"> Beauty</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="font-medium text-muted-foreground hover:text-primary transition-smooth">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang(lang === "fr" ? "ar" : "fr")}
            className="h-9 px-3 rounded-full bg-secondary hover:bg-accent transition-smooth flex items-center gap-1.5 text-xs font-bold"
          >
            <Globe className="w-3.5 h-3.5" /> {lang === "fr" ? "AR" : "FR"}
          </button>
          <button
            onClick={toggleTheme}
            aria-label="theme"
            className="relative h-9 w-9 rounded-full bg-secondary hover:bg-accent transition-smooth flex items-center justify-center active:scale-95"
          >
            <Moon
              className={`absolute inset-0 m-auto w-4 h-4 motion-safe:transition-all motion-safe:duration-300 ${theme === "light" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-75"}`}
            />
            <Sun
              className={`absolute inset-0 m-auto w-4 h-4 motion-safe:transition-all motion-safe:duration-300 ${theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75"}`}
            />
          </button>
          <button onClick={() => setOpen(!open)} className="lg:hidden h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border/50 px-4 py-4 space-y-3 bg-background max-h-[70vh] overflow-y-auto">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-sm font-medium py-2">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
