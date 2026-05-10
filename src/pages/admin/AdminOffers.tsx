import { useEffect, useState } from "react";
import { onValue, push, ref, remove, set } from "firebase/database";
import { db } from "@/lib/firebase";
import type { FirebaseOffer } from "@/types/rtdb";
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

type Row = { id: string; data: FirebaseOffer };

const empty: FirebaseOffer = {
  titleAr: "",
  titleFr: "",
  descAr: "",
  descFr: "",
  imageUrl: "",
  expiresAt: "",
  popup: false,
  active: true,
};

const AdminOffers = () => {
  const { t } = useApp();
  const a = t.admin;
  const [rows, setRows] = useState<Row[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FirebaseOffer>(empty);
  const [initialForm, setInitialForm] = useState<FirebaseOffer | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>("");
  const cu = useCloudinaryUpload();
  const tr = useAutoTranslate();

  useEffect(() => {
    return onValue(ref(db, "offers"), (snap) => {
      const val = snap.val() as Record<string, FirebaseOffer> | null;
      setRows(val ? Object.entries(val).map(([id, data]) => ({ id, data })) : []);
    });
  }, []);

  const startAdd = () => {
    setEditId(null);
    setForm(empty);
    setInitialForm(null);
    cu.reset();
    setSaveError("");
    setOpen(true);
  };

  const startEdit = (id: string, data: FirebaseOffer) => {
    setEditId(id);
    const normalized = { ...data, popup: !!data.popup, active: data.active !== false };
    setForm(normalized);
    setInitialForm(normalized);
    cu.reset();
    setSaveError("");
    setOpen(true);
  };

  const save = async () => {
    setSaveError("");
    const payload: FirebaseOffer = {
      ...form,
      titleFr: form.titleFr.trim() || form.titleAr.trim(),
      titleAr: form.titleAr.trim() || form.titleFr.trim(),
      descFr: form.descFr.trim() || form.descAr.trim(),
      descAr: form.descAr.trim() || form.descFr.trim(),
      imageUrl: form.imageUrl?.trim() || "",
      expiresAt: form.expiresAt || "",
      popup: !!form.popup,
      active: form.active !== false,
    };

    // If admin edited only one language, keep both sides aligned to avoid stale text on frontend.
    if (editId && initialForm) {
      const initialTitleFr = initialForm.titleFr.trim();
      const initialTitleAr = initialForm.titleAr.trim();
      const initialDescFr = initialForm.descFr.trim();
      const initialDescAr = initialForm.descAr.trim();

      const titleFrChanged = payload.titleFr !== initialTitleFr;
      const titleArChanged = payload.titleAr !== initialTitleAr;
      const descFrChanged = payload.descFr !== initialDescFr;
      const descArChanged = payload.descAr !== initialDescAr;

      if (titleFrChanged && !titleArChanged) payload.titleAr = payload.titleFr;
      if (titleArChanged && !titleFrChanged) payload.titleFr = payload.titleAr;
      if (descFrChanged && !descArChanged) payload.descAr = payload.descFr;
      if (descArChanged && !descFrChanged) payload.descFr = payload.descAr;
    }

    if (!payload.titleFr || !payload.titleAr) {
      setSaveError("Titre FR/AR requis.");
      return;
    }
    setSaving(true);
    try {
      if (editId) await set(ref(db, `offers/${editId}`), payload);
      else await push(ref(db, "offers"), payload);
      setOpen(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur lors de l'enregistrement";
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  const pickImg = async (f: File | null) => {
    if (!f) return;
    cu.setFilePreview(f);
    const url = await cu.upload(f);
    setForm((p) => ({ ...p, imageUrl: url }));
  };

  const translateArToFr = async () => {
    try {
      const [titleFr, descFr] = await Promise.all([
        tr.translateText(form.titleAr, "ar", "fr"),
        tr.translateText(form.descAr, "ar", "fr"),
      ]);
      setForm((p) => ({ ...p, titleFr: titleFr || p.titleFr, descFr: descFr || p.descFr }));
    } catch {
      /* handled in hook state */
    }
  };

  const translateFrToAr = async () => {
    try {
      const [titleAr, descAr] = await Promise.all([
        tr.translateText(form.titleFr, "fr", "ar"),
        tr.translateText(form.descFr, "fr", "ar"),
      ]);
      setForm((p) => ({ ...p, titleAr: titleAr || p.titleAr, descAr: descAr || p.descAr }));
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display">{a.offers}</h1>
        <Button className="rounded-full" onClick={startAdd}>
          {a.add}
        </Button>
      </div>
      <div className="space-y-2">
        {rows.map(({ id, data }) => (
          <div key={id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
            <div className="flex-1">
              <div className="font-semibold">{data.titleFr}</div>
              <div className="text-xs text-muted-foreground">
                {data.active === false ? a.inactive : a.active} · {data.popup ? "Popup" : "—"}
              </div>
            </div>
            <Button size="icon" variant="secondary" className="rounded-full" onClick={() => startEdit(id, data)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button size="icon" variant="destructive" className="rounded-full" onClick={() => remove(ref(db, `offers/${id}`))}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-3xl max-h-[90vh] overflow-y-auto" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{editId ? a.edit : a.add}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label>Titre FR</Label>
              <Input value={form.titleFr} onChange={(e) => setForm({ ...form, titleFr: e.target.value })} className="rounded-xl mt-1" />
            </div>
            <div>
              <Label>Titre AR</Label>
              <Input value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} className="rounded-xl mt-1" />
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
              <Label>{a.image} (opt)</Label>
              <Input type="file" accept="image/*" className="mt-1" onChange={(e) => pickImg(e.target.files?.[0] ?? null)} />
              {cu.state.uploading ? <Loader2 className="w-4 h-4 animate-spin mt-1" /> : null}
              {(cu.state.previewUrl || form.imageUrl) && <img src={cu.state.previewUrl ?? form.imageUrl} alt="" className="mt-2 rounded-xl max-h-28 border" />}
            </div>
            <div>
              <Label>{a.expires}</Label>
              <Input type="datetime-local" value={form.expiresAt?.slice(0, 16) ?? ""} onChange={(e) => setForm({ ...form, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : "" })} className="rounded-xl mt-1" />
            </div>
            <div className="flex items-center gap-2">
              <Switch id="pop" checked={!!form.popup} onCheckedChange={(c) => setForm({ ...form, popup: !!c })} />
              <Label htmlFor="pop">{a.popup}</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="act" checked={form.active !== false} onCheckedChange={(c) => setForm({ ...form, active: !!c })} />
              <Label htmlFor="act">{a.active}</Label>
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

export default AdminOffers;
