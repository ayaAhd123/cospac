import { useState } from "react";
import { get, ref, update, set } from "firebase/database";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { verifyAdminPassword } from "@/lib/adminPassword";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";

export function AdminHeaderExtras() {
  const { t } = useApp();
  const a = t.admin;
  const [open, setOpen] = useState(false);
  const [oldP, setOldP] = useState("");
  const [n1, setN1] = useState("");
  const [n2, setN2] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setErr("");
    if (n1.length < 6) {
      setErr(a.weakPassword || "Le mot de passe doit comporter au moins 6 caractères");
      return;
    }
    if (n1 !== n2) {
      setErr(a.passMismatch);
      return;
    }
    setLoading(true);
    try {
      const adminEmail = auth.currentUser?.email || ((import.meta.env.VITE_ADMIN_EMAIL as string | undefined) ?? "admin@cospac.com").trim();
      
      let authOk = false;
      if (auth.currentUser && auth.currentUser.email) {
        try {
          const credential = EmailAuthProvider.credential(auth.currentUser.email, oldP);
          await reauthenticateWithCredential(auth.currentUser, credential);
          authOk = true;
        } catch (e) {
          // Re-authentication failed, but we might still be logged in as the previous user.
          // Or the password was just wrong for Auth.
        }
      }

      const dbOk = await verifyAdminPassword(oldP);

      if (!authOk && !dbOk) {
        setErr(a.badPassword);
        setLoading(false);
        return;
      }
      
      console.log("Attempting DB update. Auth UID:", auth.currentUser?.uid);
      console.log("AdminHeader: Attempting DB update. UID:", auth.currentUser?.uid);
      await set(ref(db, "settings/adminPassword"), n1);

      if (auth.currentUser) {
        try {
          await updatePassword(auth.currentUser, n1);
        } catch (e: any) {
          if (e.code === 'auth/requires-recent-login') {
            console.warn("Could not update Auth password due to requires-recent-login, but DB updated.");
            // Si on ne peut pas mettre à jour Firebase Auth car on n'a pas le vrai mot de passe Auth,
            // on continue quand même car la DB a été mise à jour.
          } else {
            console.error("Firebase Auth update error:", e);
          }
        }
      }
      
      setOpen(false);
      setOldP("");
      setN1("");
      setN2("");
    } catch (error: any) {
      console.error("Password update error:", error);
      if (error.message?.includes("PERMISSION_DENIED")) {
        setErr("Erreur de permission : Votre compte n'a pas les droits pour modifier la base de données.");
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        setErr(a.badPassword);
      } else if (error.code === 'auth/requires-recent-login') {
        setErr("Sécurité : Veuillez vous déconnecter et vous reconnecter pour changer le mot de passe.");
      } else {
        setErr("Une erreur est survenue lors de la mise à jour.");
      }
    }
    setLoading(false);
  };

  return (
    <>
      <Button variant="secondary" size="sm" className="rounded-full hidden sm:inline-flex" onClick={() => setOpen(true)}>
        {a.changePassword}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle>{a.changePassword}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label>{a.oldPassword}</Label>
              <PasswordInput value={oldP} onChange={(e) => setOldP(e.target.value)} className="rounded-xl mt-1" />
            </div>
            <div>
              <Label>{a.newPassword}</Label>
              <PasswordInput value={n1} onChange={(e) => setN1(e.target.value)} className="rounded-xl mt-1" />
            </div>
            <div>
              <Label>{a.confirmPassword}</Label>
              <PasswordInput value={n2} onChange={(e) => setN2(e.target.value)} className="rounded-xl mt-1" />
            </div>
            {err ? <p className="text-sm text-destructive">{err}</p> : null}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {a.cancel}
            </Button>
            <Button onClick={save} disabled={loading}>
              {a.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
