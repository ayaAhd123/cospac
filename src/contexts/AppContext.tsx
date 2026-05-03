import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { translations, Lang, type TranslationTree } from "@/i18n/translations";
import { scrollToSection } from "@/lib/utils";

const LANG_STORAGE_KEY = "cospac-lang";
const THEME_STORAGE_KEY = "cospac-theme";
const DEFAULT_LANG: Lang = "ar";
const DEFAULT_THEME: "light" | "dark" = "light";

const isLang = (value: string | null): value is Lang => value === "fr" || value === "ar";
const isTheme = (value: string | null): value is "light" | "dark" =>
  value === "light" || value === "dark";

type Theme = "light" | "dark";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  langOpacity: number;
  t: TranslationTree;
  theme: Theme;
  toggleTheme: () => void;
  selectedProduct: string | null;
  setSelectedProduct: (id: string | null) => void;
  orderOpen: boolean;
  closeOrderForm: () => void;
  goToProductsSection: () => void;
  openOrderFormForProduct: (productId: string) => void;
};

const AppCtx = createContext<Ctx | null>(null);

function readInitialTheme(): Theme {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (isTheme(storedTheme)) return storedTheme;
  return DEFAULT_THEME;
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    const storedLang = localStorage.getItem(LANG_STORAGE_KEY);
    return isLang(storedLang) ? storedLang : DEFAULT_LANG;
  });
  const [langOpacity, setLangOpacity] = useState(1);
  const [theme, setTheme] = useState<Theme>(() => readInitialTheme());
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [orderOpen, setOrderOpen] = useState(false);
  const langRef = useRef(lang);
  langRef.current = lang;

  const closeOrderForm = useCallback(() => {
    setOrderOpen(false);
    setSelectedProduct(null);
  }, []);

  const goToProductsSection = useCallback(() => {
    setOrderOpen(false);
    setSelectedProduct(null);
    window.requestAnimationFrame(() => scrollToSection("products"));
  }, []);

  const openOrderFormForProduct = useCallback((productId: string) => {
    setSelectedProduct(productId);
    setOrderOpen(true);
  }, []);

  const setLang = useCallback((newLang: Lang) => {
    if (newLang === langRef.current) return;
    setLangOpacity(0);
    window.setTimeout(() => {
      setLangState(newLang);
      window.requestAnimationFrame(() => setLangOpacity(1));
    }, 200);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const t = translations[lang] ?? translations[DEFAULT_LANG];

  return (
    <AppCtx.Provider
      value={{
        lang,
        setLang,
        langOpacity,
        t,
        theme,
        toggleTheme: () => setTheme((th) => (th === "light" ? "dark" : "light")),
        selectedProduct,
        setSelectedProduct,
        orderOpen,
        closeOrderForm,
        goToProductsSection,
        openOrderFormForProduct,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
};

export const useApp = () => {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used within AppProvider");
  return c;
};
