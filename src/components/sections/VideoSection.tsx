import { Play } from "lucide-react";
import { useState } from "react";
import videoThumb from "@/assets/video-thumb.jpg";
import { useApp } from "@/contexts/AppContext";

export const VideoSection = () => {
  const { t } = useApp();
  const [playing, setPlaying] = useState(false);
  return (
    <section id="video" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl mb-2">{t.video.title}</h2>
        <p className="text-muted-foreground mb-10">{t.video.sub}</p>
        <div className="relative max-w-sm mx-auto aspect-[9/16] rounded-[2rem] overflow-hidden shadow-elegant group cursor-pointer" onClick={() => setPlaying(true)}>
          <img src={videoThumb} alt="Video preview" loading="lazy" width={768} height={1280} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          {!playing && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
              <button aria-label="play" className="absolute inset-0 flex items-center justify-center">
                <span className="w-20 h-20 rounded-full bg-card/95 flex items-center justify-center shadow-elegant animate-pulse-ring">
                  <Play className="w-8 h-8 fill-primary text-primary translate-x-0.5" />
                </span>
              </button>
            </>
          )}
          {playing && (
            <div className="absolute inset-0 bg-primary flex items-center justify-center text-primary-foreground p-8 text-center">
              <p className="text-sm">▶ Vidéo TikTok placeholder<br/>(Intégrer iframe ici)</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
