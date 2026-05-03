import { useCallback, useState } from "react";

type LangCode = "ar" | "fr";

function buildUrl(text: string, from: LangCode, to: LangCode) {
  const q = encodeURIComponent(text);
  return `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${q}`;
}

function extractTranslatedText(payload: unknown): string {
  if (!Array.isArray(payload) || !Array.isArray(payload[0])) return "";
  const parts = payload[0] as unknown[];
  return parts
    .map((part) => {
      if (!Array.isArray(part)) return "";
      const first = part[0];
      return typeof first === "string" ? first : "";
    })
    .join("")
    .trim();
}

export function useAutoTranslate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const translateText = useCallback(async (text: string, from: LangCode, to: LangCode): Promise<string> => {
    const input = text.trim();
    if (!input) return "";
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(buildUrl(input, from, to));
      if (!res.ok) throw new Error("Translate request failed");
      const payload = (await res.json()) as unknown;
      const translated = extractTranslatedText(payload);
      if (!translated) throw new Error("No translation returned");
      return translated;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Translation failed";
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { translateText, loading, error, clearError };
}
