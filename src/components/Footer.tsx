import { useApp } from "@/contexts/AppContext";

export const Footer = () => {
  const { t } = useApp();
  return (
    <footer className="bg-primary text-primary-foreground py-10 mt-10">
      <div className="container mx-auto px-4 text-center space-y-3">
        <div className="font-display font-bold text-2xl tracking-tight">COSPAC Beauty</div>
        <p className="text-xs text-primary-foreground/70">© {new Date().getFullYear()} COSPAC. {t.footer.rights}.</p>
      </div>
    </footer>
  );
};
