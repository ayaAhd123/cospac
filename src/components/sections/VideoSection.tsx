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
          <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto pb-2 lg:pb-0">
            {rows.map(({ id, data }, i) => {
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => data.videoUrl && setActive({ id, data })}
                  className={`relative aspect-[9/16] w-full max-w-[320px] rounded-[2rem] overflow-hidden shadow-elegant group text-start ${visible ? "animate-in" : ""} animate-in-ready ${data.videoUrl ? "cursor-pointer" : "cursor-default opacity-80"}`}
                  style={{ transitionDelay: `${120 + i * 100}ms` }}
                  disabled={!data.videoUrl}
                >
                  {data.videoUrl ? (
                    <video
                      src={`${data.videoUrl}#t=0.001`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img src={videoThumb} alt="" className="w-full h-full object-cover" />
                  )}
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
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 border-0 bg-transparent overflow-hidden rounded-2xl flex items-center justify-center shadow-none">
          {active?.data.videoUrl ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl overflow-hidden">
              <video
                key={active.id}
                src={active.data.videoUrl}
                controls
                autoPlay
                className="max-w-full max-h-[90vh] shadow-2xl"
                playsInline
              />
              <button
                type="button"
                className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                onClick={() => setActive(null)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
};
