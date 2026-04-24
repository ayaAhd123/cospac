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
    { href: "#reviews", label: t.nav.reviews },
  ];

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-hero flex items-center justify-center text-primary-foreground font-black text-sm">C</div>
          <span className="font-bold text-lg tracking-tight">COSPAC<span className="text-primary"> Beauty</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-smooth">{l.label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={() => setLang(lang === "fr" ? "ar" : "fr")} className="h-9 px-3 rounded-full bg-secondary hover:bg-accent transition-smooth flex items-center gap-1.5 text-xs font-bold">
            <Globe className="w-3.5 h-3.5" /> {lang === "fr" ? "AR" : "FR"}
          </button>
          <button onClick={toggleTheme} aria-label="theme" className="h-9 w-9 rounded-full bg-secondary hover:bg-accent transition-smooth flex items-center justify-center">
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button onClick={() => setOpen(!open)} className="md:hidden h-9 w-9 rounded-full bg-secondary flex items-center justify-center">
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border/50 px-4 py-4 space-y-3 bg-background">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-sm font-medium py-2">{l.label}</a>
          ))}
        </div>
      )}
    </header>
  );
};
