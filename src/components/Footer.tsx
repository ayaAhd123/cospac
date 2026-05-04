import { useApp } from "@/contexts/AppContext";
import { Instagram } from "lucide-react";

export const Footer = () => {
  const { t } = useApp();
  return (
    <footer className="bg-primary text-primary-foreground py-10 mt-10">
      <div className="container mx-auto px-4 text-center space-y-4">
        <div className="font-display font-bold text-2xl tracking-tight">COSPAC Beauty</div>
        
        <div className="flex justify-center items-center gap-4">
          <a 
            href="https://www.instagram.com/cospac_maroc/?hl=fr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary-foreground/80 transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={24} />
          </a>
        </div>

        <p className="text-xs text-primary-foreground/70">© {new Date().getFullYear()} COSPAC. {t.footer.rights}.</p>
      </div>
    </footer>
  );
};
