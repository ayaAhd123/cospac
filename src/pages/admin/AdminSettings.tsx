import { useEffect, useState } from "react";
import { get, onValue, ref, update, set } from "firebase/database";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { verifyAdminPassword } from "@/lib/adminPassword";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";

const AdminSettings = () => {
  const { t } = useApp();
  const a = t.admin;
  const [wa, setWa] = useState("");
  const [ph, setPh] = useState("");
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [cur, setCur] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    return onValue(ref(db, "settings"), (snap) => {
      const v = snap.val() as { whatsappNumber?: string; phoneNumber?: string } | null;
      setWa(v?.whatsappNumber ?? "");
      setPh(v?.phoneNumber ?? "");
    });
  }, []);

  const saveContact = async () => {
    const base = await get(ref(db, "settings"));
    const v = (base.val() as Record<string, unknown> | null) ?? {};
    await update(ref(db, "settings"), { ...v, whatsappNumber: wa, phoneNumber: ph });
    setMsg(a.save);
    window.setTimeout(() => setMsg(""), 2000);
  };

  const savePassword = async () => {
    setMsg("");
    if (p1.length < 6) {
      setMsg(a.weakPassword || "Le mot de passe doit comporter au moins 6 caractères");
      return;
    }
    if (p1 !== p2) {
      setMsg(a.passMismatch);
      return;
    }
    
    try {
      const adminEmail = auth.currentUser?.email || ((import.meta.env.VITE_ADMIN_EMAIL as string | undefined) ?? "admin@cospac.com").trim();
      
      let authOk = false;
      if (auth.currentUser && auth.currentUser.email) {
        try {
          const credential = EmailAuthProvider.credential(auth.currentUser.email, cur);
          await reauthenticateWithCredential(auth.currentUser, credential);
          authOk = true;
        } catch (e) {
          // Re-authentication failed
        }
      }

      const dbOk = await verifyAdminPassword(cur);

      if (!authOk && !dbOk) {
        setMsg(a.badPassword);
        return;
      }
      
      console.log("AdminSettings: Attempting DB update. UID:", auth.currentUser?.uid);
      await set(ref(db, "settings/adminPassword"), p1);

      if (auth.currentUser) {
        try {
          await updatePassword(auth.currentUser, p1);
        } catch (e: any) {
          if (e.code === 'auth/requires-recent-login') {
            console.warn("Could not update Auth password due to requires-recent-login, but DB updated.");
          } else {
            console.error("Firebase Auth update error:", e);
          }
        }
      }
      
      setP1("");
      setP2("");
      setCur("");
      setMsg(a.save);
      window.setTimeout(() => setMsg(""), 2000);
    } catch (error: any) {
      console.error("Password update error:", error);
      const errStr = String(error);
      if (errStr.includes("PERMISSION_DENIED") || error.code === 'PERMISSION_DENIED') {
        setMsg("ERREUR DE PERMISSION : Votre base de données Firebase bloque la modification du mot de passe. Vous devez changer les 'Rules' dans votre console Firebase.");
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        setMsg(a.badPassword);
      } else if (error.code === 'auth/requires-recent-login') {
        setMsg("SÉCURITÉ : Veuillez vous déconnecter et vous reconnecter pour pouvoir changer le mot de passe.");
      } else {
        setMsg("Une erreur est survenue : " + (error.message || errStr));
      }
    }
  };

  return (
    <div className="max-w-lg space-y-8">
      <h1 className="text-2xl font-bold font-display">{a.settings}</h1>
      <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
        <div>
          <Label>{a.whatsapp}</Label>
          <Input value={wa} onChange={(e) => setWa(e.target.value)} className="rounded-xl mt-1" placeholder="212XXXXXXXXX" />
        </div>
        <div>
          <Label>{a.phone}</Label>
          <Input value={ph} onChange={(e) => setPh(e.target.value)} className="rounded-xl mt-1" />
        </div>
        <Button className="rounded-full" onClick={saveContact}>
          {a.save}
        </Button>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
        <h2 className="font-semibold">{a.adminPass}</h2>
        <div>
          <Label>{a.oldPassword}</Label>
          <PasswordInput value={cur} onChange={(e) => setCur(e.target.value)} className="rounded-xl mt-1" />
        </div>
        <div>
          <Label>{a.newPassword}</Label>
          <PasswordInput value={p1} onChange={(e) => setP1(e.target.value)} className="rounded-xl mt-1" />
        </div>
        <div>
          <Label>{a.confirmPassword}</Label>
          <PasswordInput value={p2} onChange={(e) => setP2(e.target.value)} className="rounded-xl mt-1" />
        </div>
        {msg ? <p className="text-sm text-destructive font-bold p-3 bg-destructive/10 rounded-xl">{msg}</p> : null}
        <Button className="rounded-full w-full py-6 text-lg" variant="secondary" onClick={savePassword}>
          {a.save}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
