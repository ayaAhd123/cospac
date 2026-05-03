import { get, ref } from "firebase/database";
import { db } from "@/lib/firebase";

/** Mot de passe principal (modifiable via VITE_ADMIN_PASSWORD ou Firebase `settings.adminPassword`). */
const APP_ADMIN_PASSWORD = "cospac1212+*+";

export async function verifyAdminPassword(input: string): Promise<boolean> {
  if (!input) return false;

  const env = import.meta.env.VITE_ADMIN_PASSWORD;
  if (typeof env === "string" && env.trim().length > 0 && input === env.trim()) return true;

  if (input === APP_ADMIN_PASSWORD) return true;

  let dbPwd: string | undefined;
  try {
    const snap = await get(ref(db, "settings"));
    const v = snap.val() as { adminPassword?: string } | null;
    dbPwd = typeof v?.adminPassword === "string" ? v.adminPassword : undefined;
  } catch {
    dbPwd = undefined;
  }
  if (dbPwd && dbPwd.length > 0 && input === dbPwd) return true;

  return false;
}
