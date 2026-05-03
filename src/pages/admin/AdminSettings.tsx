import { useEffect, useState } from "react";
import { get, onValue, ref, update } from "firebase/database";
import { db } from "@/lib/firebase";
import { useApp } from "@/contexts/AppContext";
import { verifyAdminPassword } from "@/lib/adminPassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    if (p1.length < 4) {
      setMsg(a.weakPassword);
      return;
    }
    if (p1 !== p2) {
      setMsg(a.passMismatch);
      return;
    }
    const ok = await verifyAdminPassword(cur);
    if (!ok) {
      setMsg(a.badPassword);
      return;
    }
    const base = await get(ref(db, "settings"));
    const v = (base.val() as Record<string, unknown> | null) ?? {};
    await update(ref(db, "settings"), { ...v, adminPassword: p1 });
    setP1("");
    setP2("");
    setCur("");
    setMsg(a.save);
    window.setTimeout(() => setMsg(""), 2000);
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
          <Input type="password" value={cur} onChange={(e) => setCur(e.target.value)} className="rounded-xl mt-1" />
        </div>
        <div>
          <Label>{a.newPassword}</Label>
          <Input type="password" value={p1} onChange={(e) => setP1(e.target.value)} className="rounded-xl mt-1" />
        </div>
        <div>
          <Label>{a.confirmPassword}</Label>
          <Input type="password" value={p2} onChange={(e) => setP2(e.target.value)} className="rounded-xl mt-1" />
        </div>
        <Button className="rounded-full" variant="secondary" onClick={savePassword}>
          {a.save}
        </Button>
      </div>
      {msg ? <p className="text-sm text-primary font-medium">{msg}</p> : null}
    </div>
  );
};

export default AdminSettings;
