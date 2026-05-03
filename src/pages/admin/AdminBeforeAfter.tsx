import { useEffect, useState } from "react";
import { onValue, push, ref, remove, set } from "firebase/database";
import { db } from "@/lib/firebase";
import type { FirebaseBeforeAfter } from "@/types/rtdb";
import { useApp } from "@/contexts/AppContext";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";

type Row = { id: string; data: FirebaseBeforeAfter };

const empty: FirebaseBeforeAfter = {
  titleAr: "",
  titleFr: "",
  beforeUrl: "",
  afterUrl: "",
  beforePosX: 50,
  beforePosY: 50,
  beforeZoom: 1,
  afterPosX: 50,
  afterPosY: 50,
  afterZoom: 1,
};

type CropState = { x: number; y: number; zoom: number };
const clampPercent = (v: number) => Math.min(100, Math.max(0, v));

const AdminBeforeAfter = () => {
  const { t } = useApp();
  const a = t.admin;
  const [rows, setRows] = useState<Row[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FirebaseBeforeAfter>(empty);
  const [beforeCrop, setBeforeCrop] = useState<CropState>({ x: 0, y: 0, zoom: 1 });
  const [afterCrop, setAfterCrop] = useState<CropState>({ x: 0, y: 0, zoom: 1 });
  const cuB = useCloudinaryUpload();
  const cuA = useCloudinaryUpload();
  const tr = useAutoTranslate();

  useEffect(() => {
    return onValue(ref(db, "beforeAfter"), (snap) => {
      const val = snap.val() as Record<string, FirebaseBeforeAfter> | null;
      setRows(val ? Object.entries(val).map(([id, data]) => ({ id, data })) : []);
    });
  }, []);

  const startAdd = () => {
    setEditId(null);
    setForm(empty);
    setBeforeCrop({ x: 0, y: 0, zoom: 1 });
    setAfterCrop({ x: 0, y: 0, zoom: 1 });
    cuB.reset();
    cuA.reset();
    setOpen(true);
  };

  const startEdit = (id: string, data: FirebaseBeforeAfter) => {
    setEditId(id);
    const normalized = {
      ...data,
      beforePosX: data.beforePosX ?? 50,
      beforePosY: data.beforePosY ?? 50,
      beforeZoom: data.beforeZoom ?? 1,
      afterPosX: data.afterPosX ?? 50,
      afterPosY: data.afterPosY ?? 50,
      afterZoom: data.afterZoom ?? 1,
    };
    setForm(normalized);
    setBeforeCrop({ x: 0, y: 0, zoom: normalized.beforeZoom ?? 1 });
    setAfterCrop({ x: 0, y: 0, zoom: normalized.afterZoom ?? 1 });
    cuB.reset();
    cuA.reset();
    setOpen(true);
  };

  const save = async () => {
    if (editId) await set(ref(db, `beforeAfter/${editId}`), form);
    else await push(ref(db, "beforeAfter"), form);
    setOpen(false);
  };

  const uploadField = async (which: "before" | "after", f: File | null) => {
    if (!f) return;
    const cu = which === "before" ? cuB : cuA;
    cu.setFilePreview(f);
    const url = await cu.upload(f);
    setForm((p) => (which === "before" ? { ...p, beforeUrl: url } : { ...p, afterUrl: url }));
  };

  const translateArToFr = async () => {
    try {
      const titleFr = await tr.translateText(form.titleAr, "ar", "fr");
      setForm((p) => ({ ...p, titleFr: titleFr || p.titleFr }));
    } catch {
      /* handled in hook state */
    }
  };

  const translateFrToAr = async () => {
    try {
      const titleAr = await tr.translateText(form.titleFr, "fr", "ar");
      setForm((p) => ({ ...p, titleAr: titleAr || p.titleAr }));
    } catch {
      /* handled in hook state */
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display">{a.beforeAfter}</h1>
        <Button className="rounded-full" onClick={startAdd}>
          {a.add}
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {rows.map(({ id, data }) => (
          <div key={id} className="rounded-3xl border border-border bg-card p-3 flex gap-3 items-center">
            <div className="flex gap-2">
              <img
                src={data.beforeUrl}
                alt=""
                className="w-20 h-20 rounded-xl object-cover bg-secondary"
                style={{ objectPosition: `${data.beforePosX ?? 50}% ${data.beforePosY ?? 50}%` }}
              />
              <img
                src={data.afterUrl}
                alt=""
                className="w-20 h-20 rounded-xl object-cover bg-secondary"
                style={{ objectPosition: `${data.afterPosX ?? 50}% ${data.afterPosY ?? 50}%` }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{data.titleFr}</div>
              <div className="flex gap-1 mt-2">
                <Button size="icon" variant="secondary" className="rounded-full" onClick={() => startEdit(id, data)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="destructive" className="rounded-full" onClick={() => remove(ref(db, `beforeAfter/${id}`))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-3xl max-h-[90vh] overflow-y-auto">
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
              <Label>{a.before}</Label>
              <Input type="file" accept="image/*" className="mt-1" onChange={(e) => uploadField("before", e.target.files?.[0] ?? null)} />
              {cuB.state.uploading ? <Loader2 className="w-4 h-4 animate-spin mt-1" /> : null}
              {form.beforeUrl ? <img src={form.beforeUrl} alt="" className="mt-2 rounded-xl max-h-28 border" /> : null}
            </div>
            {form.beforeUrl ? (
              <div>
                <Label>Positionner image Before (cadre)</Label>
                <div className="relative mt-2 h-48 overflow-hidden rounded-xl border bg-secondary">
                  <Cropper
                    image={form.beforeUrl}
                    crop={{ x: beforeCrop.x, y: beforeCrop.y }}
                    zoom={beforeCrop.zoom}
                    aspect={16 / 10}
                    onCropChange={(crop) => setBeforeCrop((prev) => ({ ...prev, ...crop }))}
                    onZoomChange={(zoom) => {
                      setBeforeCrop((prev) => ({ ...prev, zoom }));
                      setForm((p) => ({ ...p, beforeZoom: zoom }));
                    }}
                    onCropComplete={(croppedAreaPercentages) => {
                      const centerX = clampPercent(croppedAreaPercentages.x + croppedAreaPercentages.width / 2);
                      const centerY = clampPercent(croppedAreaPercentages.y + croppedAreaPercentages.height / 2);
                      setForm((p) => ({
                        ...p,
                        beforePosX: Math.round(centerX * 100) / 100,
                        beforePosY: Math.round(centerY * 100) / 100,
                      }));
                    }}
                    showGrid={false}
                  />
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={beforeCrop.zoom}
                  onChange={(e) => {
                    const zoom = Number(e.target.value);
                    setBeforeCrop((prev) => ({ ...prev, zoom }));
                    setForm((p) => ({ ...p, beforeZoom: zoom }));
                  }}
                  className="mt-2 w-full"
                />
              </div>
            ) : null}
            <div>
              <Label>{a.after}</Label>
              <Input type="file" accept="image/*" className="mt-1" onChange={(e) => uploadField("after", e.target.files?.[0] ?? null)} />
              {cuA.state.uploading ? <Loader2 className="w-4 h-4 animate-spin mt-1" /> : null}
              {form.afterUrl ? <img src={form.afterUrl} alt="" className="mt-2 rounded-xl max-h-28 border" /> : null}
            </div>
            {form.afterUrl ? (
              <div>
                <Label>Positionner image After (cadre)</Label>
                <div className="relative mt-2 h-48 overflow-hidden rounded-xl border bg-secondary">
                  <Cropper
                    image={form.afterUrl}
                    crop={{ x: afterCrop.x, y: afterCrop.y }}
                    zoom={afterCrop.zoom}
                    aspect={16 / 10}
                    onCropChange={(crop) => setAfterCrop((prev) => ({ ...prev, ...crop }))}
                    onZoomChange={(zoom) => {
                      setAfterCrop((prev) => ({ ...prev, zoom }));
                      setForm((p) => ({ ...p, afterZoom: zoom }));
                    }}
                    onCropComplete={(croppedAreaPercentages) => {
                      const centerX = clampPercent(croppedAreaPercentages.x + croppedAreaPercentages.width / 2);
                      const centerY = clampPercent(croppedAreaPercentages.y + croppedAreaPercentages.height / 2);
                      setForm((p) => ({
                        ...p,
                        afterPosX: Math.round(centerX * 100) / 100,
                        afterPosY: Math.round(centerY * 100) / 100,
                      }));
                    }}
                    showGrid={false}
                  />
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={afterCrop.zoom}
                  onChange={(e) => {
                    const zoom = Number(e.target.value);
                    setAfterCrop((prev) => ({ ...prev, zoom }));
                    setForm((p) => ({ ...p, afterZoom: zoom }));
                  }}
                  className="mt-2 w-full"
                />
              </div>
            ) : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {a.cancel}
            </Button>
            <Button onClick={save} disabled={!form.beforeUrl || !form.afterUrl}>
              {a.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBeforeAfter;
