import { useEffect, useState } from "react";
import { onValue, push, ref, remove, set } from "firebase/database";
import { db } from "@/lib/firebase";
import type { FirebaseProduct } from "@/types/rtdb";
import { useApp } from "@/contexts/AppContext";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Trash2 } from "lucide-react";

type Row = { id: string; data: FirebaseProduct };

const empty: FirebaseProduct = {
  nameAr: "",
  nameFr: "",
  price: 0,
  descAr: "",
  descFr: "",
  imageUrl: "",
  badge: "",
  active: true,
};

const AdminProducts = () => {
  const { t } = useApp();
  const a = t.admin;
  const [rows, setRows] = useState<Row[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FirebaseProduct>(empty);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>("");
  const cu = useCloudinaryUpload();
  const tr = useAutoTranslate();

  useEffect(() => {
    return onValue(ref(db, "products"), (snap) => {
      const val = snap.val() as Record<string, FirebaseProduct> | null;
      setRows(val ? Object.entries(val).map(([id, data]) => ({ id, data })) : []);
    });
  }, []);

  const startAdd = () => {
    setEditId(null);
    setForm(empty);
    cu.reset();
    setSaveError("");
    setOpen(true);
  };

  const startEdit = (id: string, data: FirebaseProduct) => {
    setEditId(id);
    setForm({ ...data });
    cu.reset();
    setSaveError("");
    setOpen(true);
  };

  const save = async () => {
    setSaveError("");
    const nameFr = form.nameFr.trim() || form.nameAr.trim();
    const nameAr = form.nameAr.trim() || form.nameFr.trim();
    if (!nameFr || !nameAr) {
      setSaveError("Nom FR/AR requis.");
      return;
    }
    const payload = {
      ...form,
      nameFr,
      nameAr,
      descFr: form.descFr.trim() || form.descAr.trim(),
      descAr: form.descAr.trim() || form.descFr.trim(),
      badge: (form.badge ?? "").trim().toUpperCase(),
      price: Number(form.price) || 0,
    };
    setSaving(true);
    try {
      if (editId) await set(ref(db, `products/${editId}`), payload);
      else await push(ref(db, "products"), payload);
      setOpen(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur lors de l'enregistrement";
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  const pickFile = async (f: File | null) => {
    if (!f) return;
    cu.setFilePreview(f);
    const url = await cu.upload(f);
    setForm((p) => ({ ...p, imageUrl: url }));
  };

  const translateArToFr = async () => {
    try {
      const [nameFr, descFr] = await Promise.all([
        tr.translateText(form.nameAr, "ar", "fr"),
        tr.translateText(form.descAr, "ar", "fr"),
      ]);
      setForm((p) => ({ ...p, nameFr: nameFr || p.nameFr, descFr: descFr || p.descFr }));
    } catch {
      /* handled in hook state */
    }
  };

  const translateFrToAr = async () => {
    try {
      const [nameAr, descAr] = await Promise.all([
        tr.translateText(form.nameFr, "fr", "ar"),
        tr.translateText(form.descFr, "fr", "ar"),
      ]);
      setForm((p) => ({ ...p, nameAr: nameAr || p.nameAr, descAr: descAr || p.descAr }));
    } catch {
      /* handled in hook state */
    }
  };

  const translateDescArToFr = async () => {
    try {
      const descFr = await tr.translateText(form.descAr, "ar", "fr");
      setForm((p) => ({ ...p, descFr: descFr || p.descFr }));
    } catch {
      /* handled in hook state */
    }
  };

  const translateDescFrToAr = async () => {
    try {
      const descAr = await tr.translateText(form.descFr, "fr", "ar");
      setForm((p) => ({ ...p, descAr: descAr || p.descAr }));
    } catch {
      /* handled in hook state */
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold font-display">{a.products}</h1>
        <Button className="rounded-full" onClick={startAdd}>
          {a.add}
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map(({ id, data }) => (
          <div key={id} className="rounded-3xl border border-border bg-card overflow-hidden flex flex-col">
            <div className="aspect-square bg-secondary relative">
              {data.imageUrl ? <img src={data.imageUrl} alt="" className="w-full h-full object-cover" /> : null}
              <div className="absolute top-2 end-2 flex gap-1">
                <Button size="icon" variant="secondary" className="rounded-full" onClick={() => startEdit(id, data)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="destructive" className="rounded-full" onClick={() => remove(ref(db, `products/${id}`))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 flex-1 space-y-1">
              <div className="font-bold">{data.nameFr}</div>
              <div className="text-sm text-muted-foreground">{data.price} MAD</div>
              <div className="text-xs">{data.active === false ? a.inactive : a.active}</div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-3xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{editId ? a.edit : a.add}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Nom FR</Label>
                <Input value={form.nameFr} onChange={(e) => setForm({ ...form, nameFr: e.target.value })} className="rounded-xl mt-1" />
              </div>
              <div>
                <Label>Nom AR</Label>
                <Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} className="rounded-xl mt-1" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" className="rounded-full" onClick={translateArToFr} disabled={tr.loading}>
                AR → FR
              </Button>
              <Button type="button" variant="outline" className="rounded-full" onClick={translateFrToAr} disabled={tr.loading}>
                FR → AR
              </Button>
              {tr.error ? <p className="text-xs text-destructive">{tr.error}</p> : null}
            </div>
            <div>
              <Label>{a.price}</Label>
              <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="rounded-xl mt-1" />
            </div>
            <div>
              <Label>Desc FR</Label>
              <Textarea value={form.descFr} onChange={(e) => setForm({ ...form, descFr: e.target.value })} className="rounded-xl mt-1" rows={3} />
            </div>
            <div>
              <Label>Desc AR</Label>
              <Textarea value={form.descAr} onChange={(e) => setForm({ ...form, descAr: e.target.value })} className="rounded-xl mt-1" rows={3} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" className="rounded-full" onClick={translateDescArToFr} disabled={tr.loading}>
                Traduire desc AR → FR
              </Button>
              <Button type="button" variant="outline" className="rounded-full" onClick={translateDescFrToAr} disabled={tr.loading}>
                Traduire desc FR → AR
              </Button>
            </div>
            <div>
              <Label>{a.badge}</Label>
              <Input value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value as FirebaseProduct["badge"] })} className="rounded-xl mt-1" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.active !== false} onCheckedChange={(c) => setForm({ ...form, active: !!c })} id="act" />
              <Label htmlFor="act">{a.active}</Label>
            </div>
            <div>
              <Label>{a.image}</Label>
              <Input type="file" accept="image/*" className="mt-1" onChange={(e) => pickFile(e.target.files?.[0] ?? null)} />
              {cu.state.error ? <p className="text-xs text-destructive mt-1">{cu.state.error}</p> : null}
              {(cu.state.previewUrl || form.imageUrl) && (
                <img src={cu.state.previewUrl ?? form.imageUrl} alt="" className="mt-2 rounded-xl max-h-40 object-cover border border-border" />
              )}
              {cu.state.uploading ? (
                <p className="text-xs flex items-center gap-1 mt-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> …
                </p>
              ) : null}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {a.cancel}
            </Button>
            <Button onClick={save} disabled={saving}>
              {a.save}
            </Button>
          </DialogFooter>
          {saveError ? <p className="text-xs text-destructive">{saveError}</p> : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;
