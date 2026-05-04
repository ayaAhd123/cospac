import { MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useInViewAnimate } from "@/hooks/useInViewAnimate";
import { useRef } from "react";

import review1 from "@/assets/reviews/whatsapp-review-1.jpg";
import review2 from "@/assets/reviews/whatsapp-review-2.jpg";
import review3 from "@/assets/reviews/whatsapp-review-3.jpg";
import review4 from "@/assets/reviews/whatsapp-review-4.jpg";
import review5 from "@/assets/reviews/whatsapp-review-5.jpg";

const reviews = [
  { img: review1 },
  { img: review2 },
  { img: review3 },
  { img: review4 },
  { img: review5 },
];

export const Testimonials = () => {
  const { t, lang } = useApp();
  const { ref, visible } = useInViewAnimate<HTMLElement>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isRTL = lang === "ar";

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const move = clientWidth * 0.8;
      const scrollTo = direction === "left" ? scrollLeft - move : scrollLeft + move;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section id="reviews" ref={ref} className="py-16 md:py-24 bg-[#F8F9FA] overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl md:text-5xl text-center mb-4 font-display font-bold ${visible ? "animate-in" : ""} animate-in-ready`}>
          {t.testimonials.title}
        </h2>
        <p className={`text-center text-muted-foreground mb-12 max-w-2xl mx-auto ${visible ? "animate-in" : ""} animate-in-ready`} style={{ transitionDelay: "100ms" }}>
          {lang === "ar" 
            ? "آراء حقيقية من عملائنا عبر واتساب. ثقتكم هي سر نجاحنا."
            : "Avis réels de nos clients sur WhatsApp. Votre confiance est notre priorité."
          }
        </p>
        
        <div className="relative group max-w-7xl mx-auto">
          {/* Arrows */}
          <button
            type="button"
            onClick={() => scroll(isRTL ? "right" : "left")}
            className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white text-[#25D366] shadow-xl flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hidden md:flex border border-[#25D366]/10"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => scroll(isRTL ? "left" : "right")}
            className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white text-[#25D366] shadow-xl flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hidden md:flex border border-[#25D366]/10"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-hide px-4 -mx-4 md:px-0 md:mx-0"
          >
            {reviews.map((r, i) => (
              <div
                key={i}
                className={`min-w-[85%] md:min-w-[calc(33.333%-16px)] snap-center group relative bg-white rounded-3xl overflow-hidden border border-border shadow-elegant hover:shadow-xl transition-all duration-500 ${visible ? "animate-in" : ""} animate-in-ready`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {/* WhatsApp Badge */}
                <div className="absolute top-4 right-4 z-10 bg-[#25D366] text-white p-1.5 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle size={18} fill="currentColor" />
                </div>
                
                {/* Image Container */}
                <div className="p-3 bg-[#E9EDEF]/30 h-full flex flex-col">
                  <div className="relative flex-1 bg-white rounded-2xl overflow-hidden border border-[#25D366]/10 shadow-inner min-h-[300px] flex items-center justify-center">
                    <img 
                      src={r.img} 
                      alt="WhatsApp Review" 
                      className="max-w-full max-h-full object-contain bg-[#E9EDEF]/10"
                      loading="lazy"
                    />
                    
                    {/* Subtle WhatsApp-style overlay on hover */}
                    <div className="absolute inset-0 bg-[#25D366]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                  
                  {/* Real Review Indicator */}
                  <div className="mt-3 flex items-center justify-center gap-2">
                     <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#25D366]/20 to-transparent" />
                     <span className="text-[10px] uppercase tracking-wider text-[#25D366] font-bold">Verified Review</span>
                     <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#25D366]/20 to-transparent" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile indicator (larger arrows) */}
          <div className="flex justify-center gap-6 mt-6 md:hidden">
            <button 
              onClick={() => scroll("left")} 
              className="h-12 w-12 rounded-full bg-white text-[#25D366] shadow-md flex items-center justify-center border border-[#25D366]/10 active:scale-95 transition-transform"
            >
              <ChevronLeft size={28} />
            </button>
            <button 
              onClick={() => scroll("right")} 
              className="h-12 w-12 rounded-full bg-white text-[#25D366] shadow-md flex items-center justify-center border border-[#25D366]/10 active:scale-95 transition-transform"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        .shadow-elegant {
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.08);
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};
