import { useState } from "react";
import { get, ref, update } from "firebase/database";
import { db } from "@/lib/firebase";
import { verifyAdminPassword } from "@/lib/adminPassword";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
    if (n1.length < 4) {
      setErr(a.weakPassword);
      return;
    }
    if (n1 !== n2) {
      setErr(a.passMismatch);
      return;
    }
    setLoading(true);
    try {
      const ok = await verifyAdminPassword(oldP);
      if (!ok) {
        setErr(a.badPassword);
        setLoading(false);
        return;
      }
      const cur = await get(ref(db, "settings"));
      const v = (cur.val() as Record<string, unknown> | null) ?? {};
      await update(ref(db, "settings"), { ...v, adminPassword: n1 });
      setOpen(false);
      setOldP("");
      setN1("");
      setN2("");
    } catch {
      setErr(a.badPassword);
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
              <Input type="password" value={oldP} onChange={(e) => setOldP(e.target.value)} className="rounded-xl mt-1" />
            </div>
            <div>
              <Label>{a.newPassword}</Label>
              <Input type="password" value={n1} onChange={(e) => setN1(e.target.value)} className="rounded-xl mt-1" />
            </div>
            <div>
              <Label>{a.confirmPassword}</Label>
              <Input type="password" value={n2} onChange={(e) => setN2(e.target.value)} className="rounded-xl mt-1" />
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
