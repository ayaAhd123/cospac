import { useEffect, useState } from "react";
import { onValue, push, ref, remove, set } from "firebase/database";
import { db } from "@/lib/firebase";
import type { FirebaseVideo } from "@/types/rtdb";
import { useApp } from "@/contexts/AppContext";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { useAutoTranslate } from "@/hooks/useAutoTranslate";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Pencil, Trash2 } from "lucide-react";

type Row = { id: string; data: FirebaseVideo };

const empty: FirebaseVideo = { titleAr: "", titleFr: "", videoUrl: "", thumbnailUrl: "" };
const CLOUD_NAME = "dlqsbm1a2";
const UPLOAD_PRESET = "COSPAC";
const FOLDER = "samples/ecommerce";

const AdminVideos = () => {
  const { t } = useApp();
  const a = t.admin;
  const [rows, setRows] = useState<Row[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FirebaseVideo>(empty);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState<string | null>(null);
  const cu = useCloudinaryUpload();
  const tr = useAutoTranslate();

  useEffect(() => {
    return onValue(ref(db, "videos"), (snap) => {
      const val = snap.val() as Record<string, FirebaseVideo> | null;
      setRows(val ? Object.entries(val).map(([id, data]) => ({ id, data })) : []);
    });
  }, []);

  const startAdd = () => {
    setEditId(null);
    setForm(empty);
    cu.reset();
    setVideoUploadError(null);
    setVideoUploading(false);
    setOpen(true);
  };

  const startEdit = (id: string, data: FirebaseVideo) => {
    setEditId(id);
    setForm({ ...data });
    cu.reset();
    setVideoUploadError(null);
    setVideoUploading(false);
    setOpen(true);
  };

  const save = async () => {
    if (editId) await set(ref(db, `videos/${editId}`), form);
    else await push(ref(db, "videos"), form);
    setOpen(false);
  };

  const pickVideo = async (f: File | null) => {
    if (!f) return;
    setVideoUploadError(null);
    setVideoUploading(true);
    try {
      const body = new FormData();
      body.append("file", f);
      body.append("upload_preset", UPLOAD_PRESET);
      body.append("folder", FOLDER);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {
        method: "POST",
        body,
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const msg = (errJson as { error?: { message?: string } })?.error?.message ?? res.statusText;
        throw new Error(msg || "Upload video failed");
      }

      const data = (await res.json()) as { secure_url?: string };
      if (!data.secure_url) throw new Error("No video URL returned");
      setForm((p) => ({ ...p, videoUrl: data.secure_url }));
    } catch (e) {
      setVideoUploadError(e instanceof Error ? e.message : "Upload video failed");
    } finally {
      setVideoUploading(false);
    }
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
        <h1 className="text-2xl font-bold font-display">{a.videos}</h1>
        <Button className="rounded-full" onClick={startAdd}>
          {a.add}
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map(({ id, data }) => (
          <div key={id} className="rounded-3xl border border-border bg-card overflow-hidden">
            <div className="aspect-video bg-secondary relative">
              {data.thumbnailUrl ? <img src={data.thumbnailUrl} alt="" className="w-full h-full object-cover" /> : null}
              <div className="absolute top-2 end-2 flex gap-1">
                <Button size="icon" variant="secondary" className="rounded-full" onClick={() => startEdit(id, data)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="destructive" className="rounded-full" onClick={() => remove(ref(db, `videos/${id}`))}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-3 text-sm font-semibold line-clamp-2">{data.titleFr}</div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-3xl">
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
              <Label>{a.videoUrl}</Label>
              <Input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} className="rounded-xl mt-1" />
            </div>
            <div>
              <Label>Fichier vidéo (mobile: galerie/caméra)</Label>
              <Input type="file" accept="video/*" capture="environment" className="mt-1" onChange={(e) => pickVideo(e.target.files?.[0] ?? null)} />
              {videoUploadError ? <p className="text-xs text-destructive mt-1">{videoUploadError}</p> : null}
              {videoUploading ? (
                <p className="text-xs flex items-center gap-1 mt-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Upload vidéo...
                </p>
              ) : null}
              {form.videoUrl ? <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{form.videoUrl}</p> : null}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {a.cancel}
            </Button>
            <Button onClick={save} disabled={!form.videoUrl || videoUploading}>
              {a.save}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminVideos;
