import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, Lang } from "@/data/translations";

type T = (typeof translations)[Lang];

export type Order = {
  id: string;
  name: string;
  phone: string;
  city: string;
  product: string;
  quantity: number;
  status: "pending" | "confirmed" | "delivered";
  createdAt: string;
};

type Theme = "light" | "dark";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: T;
  theme: Theme;
  toggleTheme: () => void;
  orders: Order[];
  addOrder: (o: Omit<Order, "id" | "status" | "createdAt">) => void;
  updateStatus: (id: string, s: Order["status"]) => void;
  selectedProduct: string | null;
  setSelectedProduct: (id: string | null) => void;
  orderOpen: boolean;
  setOrderOpen: (b: boolean) => void;
};

const AppCtx = createContext<Ctx | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem("lang") as Lang) || "fr");
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("theme") as Theme) || "light");
  const [orders, setOrders] = useState<Order[]>(() => {
    try { return JSON.parse(localStorage.getItem("orders") || "[]"); } catch { return []; }
  });
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [orderOpen, setOrderOpen] = useState(false);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("lang", lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => { localStorage.setItem("orders", JSON.stringify(orders)); }, [orders]);

  const addOrder: Ctx["addOrder"] = (o) => {
    setOrders((prev) => [
      { ...o, id: crypto.randomUUID(), status: "pending", createdAt: new Date().toISOString() },
      ...prev,
    ]);
  };
  const updateStatus = (id: string, s: Order["status"]) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: s } : o)));

  return (
    <AppCtx.Provider value={{
      lang, setLang: setLangState, t: translations[lang],
      theme, toggleTheme: () => setTheme(theme === "light" ? "dark" : "light"),
      orders, addOrder, updateStatus,
      selectedProduct, setSelectedProduct, orderOpen, setOrderOpen,
    }}>
      {children}
    </AppCtx.Provider>
  );
};

export const useApp = () => {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used within AppProvider");
  return c;
};
