import { useCallback } from "react";
import { useApp } from "@/contexts/AppContext";

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

/** Dot-path string keys for leaf strings (e.g. admin.orders.title). For nested objects/arrays use useApp().t */
export function useTranslation() {
  const { lang, setLang, t } = useApp();
  const tk = useCallback(
    (key: string) => {
      const v = getByPath(t, key);
      if (typeof v === "string" || typeof v === "number") return String(v);
      return key;
    },
    [t],
  );
  return { t: tk, lang, setLang, translations: t };
}
