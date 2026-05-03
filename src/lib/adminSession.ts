const KEY = "cospac-admin-session";
const REMEMBER_KEY = "cospac-admin-remember";

export type AdminSession = { ok: true; expiresAt: number };

function parse(s: string | null): AdminSession | null {
  if (!s) return null;
  try {
    const j = JSON.parse(s) as AdminSession;
    if (j?.ok && typeof j.expiresAt === "number" && j.expiresAt > Date.now()) return j;
  } catch {
    /* ignore */
  }
  return null;
}

export function getAdminSession(): AdminSession | null {
  const remembered = parse(localStorage.getItem(KEY));
  if (remembered) return remembered;
  return parse(sessionStorage.getItem(KEY));
}

export function setAdminSession(remember: boolean) {
  const expiresAt = remember ? Date.now() + 30 * 24 * 60 * 60 * 1000 : Date.now() + 24 * 60 * 60 * 1000;
  const payload = JSON.stringify({ ok: true, expiresAt } satisfies AdminSession);
  if (remember) {
    localStorage.setItem(KEY, payload);
    localStorage.setItem(REMEMBER_KEY, "1");
    sessionStorage.removeItem(KEY);
  } else {
    sessionStorage.setItem(KEY, payload);
    localStorage.removeItem(KEY);
    localStorage.removeItem(REMEMBER_KEY);
  }
}

export function clearAdminSession() {
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
  localStorage.removeItem(REMEMBER_KEY);
}
