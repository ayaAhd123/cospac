import { Play, X } from "lucide-react";
import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "@/lib/firebase";
import videoThumb from "@/assets/video-thumb.jpg";
import { useApp } from "@/contexts/AppContext";
import type { FirebaseVideo } from "@/types/rtdb";
import { useInViewAnimate } from "@/hooks/useInViewAnimate";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export const VideoSection = () => {
  const { t, lang } = useApp();
  const [rows, setRows] = useState<Array<{ id: string; data: FirebaseVideo }>>([]);
  const [active, setActive] = useState<{ id: string; data: FirebaseVideo } | null>(null);
  const { ref: secRef, visible } = useInViewAnimate<HTMLElement>();

  useEffect(() => {
    const r = ref(db, "videos");
    return onValue(r, (snap) => {
      const val = snap.val() as Record<string, FirebaseVideo> | null;
      if (!val) {
        setRows([]);
        return;
      }
      setRows(
        Object.entries(val).map(([id, data]) => ({
          id,
          data,
        })),
      );
    });
  }, []);

  const titleFor = (v: FirebaseVideo) => (lang === "ar" ? v.titleAr : v.titleFr);

  return (
    <section id="video" ref={secRef} className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className={`text-3xl md:text-4xl mb-2 ${visible ? "animate-in" : ""} animate-in-ready`}>{t.video.title}</h2>
        <p className={`text-muted-foreground mb-10 ${visible ? "animate-in" : ""} animate-in-ready`} style={{ transitionDelay: "80ms" }}>
          {t.video.sub}
        </p>

        {rows.length === 0 ? null : (
          <div className="flex lg:grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none pb-2 lg:pb-0 -mx-4 px-4 lg:mx-auto lg:px-0">
            {rows.map(({ id, data }, i) => {
              const thumb = data.thumbnailUrl || videoThumb;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => data.videoUrl && setActive({ id, data })}
                  className={`relative aspect-[9/16] min-w-[min(88vw,320px)] lg:min-w-0 max-w-sm mx-auto w-full rounded-[2rem] overflow-hidden shadow-elegant group text-start snap-center shrink-0 lg:shrink ${visible ? "animate-in" : ""} animate-in-ready ${data.videoUrl ? "cursor-pointer" : "cursor-default opacity-80"}`}
                  style={{ transitionDelay: `${120 + i * 100}ms` }}
                  disabled={!data.videoUrl}
                >
                  <img src={thumb} alt="" loading="lazy" width={768} height={1280} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
                  <div className="absolute bottom-0 inset-x-0 p-4 text-start">
                    <p className="text-white font-bold text-sm drop-shadow-md">{titleFor(data)}</p>
                  </div>
                  {data.videoUrl ? (
                    <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="w-20 h-20 rounded-full bg-card/95 flex items-center justify-center shadow-elegant motion-safe:animate-pulse-ring">
                        <Play className="w-8 h-8 fill-primary text-primary translate-x-0.5 rtl:-translate-x-0.5" />
                      </span>
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-[100vw] md:max-w-4xl w-full p-0 border-0 bg-black overflow-hidden rounded-none md:rounded-2xl">
          <button
            type="button"
            className="absolute top-3 end-3 z-20 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
            onClick={() => setActive(null)}
            aria-label={t.video.close}
          >
            <X className="w-5 h-5" />
          </button>
          {active?.data.videoUrl ? (
            <div className="aspect-video w-full bg-black">
              <video key={active.id} src={active.data.videoUrl} controls className="w-full h-full" playsInline />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
};
