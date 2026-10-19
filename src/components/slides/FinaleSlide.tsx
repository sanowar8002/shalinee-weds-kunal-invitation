import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { WEDDING_DATA } from "../../data/weddingData";

interface FinaleSlideProps {
  active?: boolean;
  onNext?: () => void;
}

const EASE_ROYAL: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE_ROYAL },
  },
};

// 1. Soft Light Pink Rose Petal
const LightPinkRosePetal: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden={true}>
    <defs>
      <linearGradient id="smFinalePinkPetal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff5f7" />
        <stop offset="40%" stopColor="#fbcfe8" />
        <stop offset="75%" stopColor="#f472b6" />
        <stop offset="100%" stopColor="#db2777" />
      </linearGradient>
    </defs>
    <path
      d="M16 2 C25 6 30 14 28 22 C26 28 20 31 16 30 C12 31 6 28 4 22 C2 14 7 6 16 2 Z"
      fill="url(#smFinalePinkPetal)"
      opacity="0.9"
    />
  </svg>
);

// 2. Rich Deep Red Rose Petal
const DeepRedRosePetal: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden={true}>
    <defs>
      <linearGradient id="smFinaleRedPetal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fca5a5" />
        <stop offset="35%" stopColor="#ef4444" />
        <stop offset="75%" stopColor="#be123c" />
        <stop offset="100%" stopColor="#881337" />
      </linearGradient>
    </defs>
    <path
      d="M16 2 C25 6 30 14 28 22 C26 28 20 31 16 30 C12 31 6 28 4 22 C2 14 7 6 16 2 Z"
      fill="url(#smFinaleRedPetal)"
      opacity="0.93"
    />
  </svg>
);

// Dedicated Light Pink & Red Rose Petals Falling Animation exclusively for Finale Slide
const FinaleRosePetals: React.FC = () => {
  const petals = useMemo(() => {
    const pseudoRandom = (seed: number) => {
      const s = 43758.5453 * Math.sin(seed);
      return s - Math.floor(s);
    };

    const count = 22;
    return Array.from({ length: count }, (_, i) => {
      const r1 = pseudoRandom(19.123 * (i + 1) + 1.11);
      const r2 = pseudoRandom(83.456 * (i + 1) + 2.22);
      const r3 = pseudoRandom(47.789 * (i + 1) + 3.33);
      const r4 = pseudoRandom(61.321 * (i + 1) + 4.44);

      const isPink = i % 2 === 0;
      const slotWidth = 96 / count;
      const leftPos = Math.min(96, Math.max(2, i * slotWidth + (r1 - 0.5) * slotWidth * 1.5));
      const duration = 6.2 + 3.6 * r2;
      const delay = -r3 * duration;
      const drift = `${Math.round((r4 - 0.5) * 32)}vw`;
      const rot = `${Math.round((r1 - 0.5) * 600)}deg`;
      const sizePx = Math.round(14 + 10 * r3); // 14px to 24px

      return {
        isPink,
        start: `${leftPos.toFixed(1)}%`,
        size: `${sizePx}px`,
        dur: `${duration.toFixed(2)}s`,
        delay: `${delay.toFixed(2)}s`,
        drift,
        rot,
      };
    });
  }, []);

  return (
    <div className="sm-flowers" aria-hidden={true} style={{ zIndex: 12 }}>
      {petals.map((item, idx) => (
        <span
          key={idx}
          className="sm-flower"
          style={
            {
              left: item.start,
              width: item.size,
              height: item.size,
              animationDuration: item.dur,
              animationDelay: item.delay,
              "--sm-drift": item.drift,
              "--sm-rot": item.rot,
              filter: "drop-shadow(0 2px 4px rgba(130, 20, 40, 0.22))",
            } as React.CSSProperties
          }
        >
          {item.isPink ? (
            <LightPinkRosePetal className="block h-full w-full" />
          ) : (
            <DeepRedRosePetal className="block h-full w-full" />
          )}
        </span>
      ))}
    </div>
  );
};

export const FinaleSlide: React.FC<FinaleSlideProps> = ({
  active = false,
  onNext,
}) => {
  const [showModal, setShowModal] = useState(false);

  const venueList = WEDDING_DATA.events.map((ev) => ({
    label: ev.title,
    date: `${ev.date} · ${ev.time}`,
    place: ev.venue,
    href: ev.mapHref,
  }));

  return (
    <section className="sm-slide relative h-full w-full overflow-hidden bg-[#faede1] select-none flex flex-col justify-between">
      {/* Royal Arch Watercolor Background with Couple in Mandap */}
      <img
        src={WEDDING_DATA.media.finale.sky}
        alt="Kunal & Shalinee Wedding Ceremony"
        className="absolute inset-0 h-full w-full object-cover object-top pointer-events-none select-none z-0"
        aria-hidden={true}
      />

      {/* Light Pink & Red Rose Petals Falling Animation exclusively on this slide */}
      <FinaleRosePetals />

      {/* Text Inside The Arch — Perfectly centered in arch void, below chandelier and above couple */}
      <motion.div
        className="relative z-20 mx-auto w-full max-w-[270px] sm:max-w-[320px] px-2 pt-[24.5vh] sm:pt-[25vh] md:pt-[24vh] flex flex-col items-center text-center"
        initial="hidden"
        animate={active ? "visible" : "hidden"}
        variants={{
          visible: {
            transition: { staggerChildren: 0.06, delayChildren: 0.15 },
          },
        }}
      >
        {/* Invitation Kicker — perfectly below chandelier ornament */}
        <motion.p
          variants={fadeVariant}
          className="font-['Jacques_Francois',_Georgia,_serif] text-[#3e131b] text-[11px] sm:text-[13px] md:text-[14px] tracking-[0.06em] leading-snug drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]"
        >
          Awaiting for your gracious presence
        </motion.p>

        {/* Small Golden Diamond Line */}
        <motion.div
          variants={fadeVariant}
          className="flex items-center justify-center gap-2 my-0.5 text-[#b5892b] text-[8px]"
          aria-hidden={true}
        >
          <span className="w-8 sm:w-10 h-[1px] bg-gradient-to-r from-transparent to-[#b5892b]" />
          <span>◆</span>
          <span className="w-8 sm:w-10 h-[1px] bg-gradient-to-l from-transparent to-[#b5892b]" />
        </motion.div>

        {/* Bride Name in Elegant Great Vibes Calligraphy */}
        <motion.h2
          variants={fadeVariant}
          className="font-['Great_Vibes',_cursive] text-[#7a1322] text-[1.85rem] sm:text-[2.2rem] md:text-[2.5rem] font-normal leading-none my-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)] tracking-normal"
        >
          {WEDDING_DATA.bride.name}
        </motion.h2>

        {/* Bride Parents — 2 clean centered lines preventing pillar overlap */}
        <motion.div
          variants={fadeVariant}
          className="font-['Jacques_Francois',_Georgia,_serif] uppercase tracking-[0.08em] text-[8px] sm:text-[9.5px] text-[#4a1820] font-medium leading-[1.3] max-w-[240px] sm:max-w-[270px] mx-auto mt-0.5"
        >
          <p>D/O MR. VIDYASAGAR MAHASETH</p>
          <p className="text-[7.5px] sm:text-[9px] text-[#4a1820]/85">&amp; MRS. ANJU KUMARI</p>
        </motion.div>

        {/* weds Flanked by Florets */}
        <motion.div
          variants={fadeVariant}
          className="flex items-center justify-center gap-2 my-0.5"
          aria-hidden={true}
        >
          <span className="text-[#c9a227] text-[9px]">❖</span>
          <span className="font-['Great_Vibes',_cursive] text-lg sm:text-xl text-[#7a1322] font-semibold italic px-1 leading-none">
            weds
          </span>
          <span className="text-[#c9a227] text-[9px]">❖</span>
        </motion.div>

        {/* Groom Name in Elegant Great Vibes Calligraphy */}
        <motion.h2
          variants={fadeVariant}
          className="font-['Great_Vibes',_cursive] text-[#7a1322] text-[1.85rem] sm:text-[2.2rem] md:text-[2.5rem] font-normal leading-none my-0.5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)] tracking-normal"
        >
          {WEDDING_DATA.groom.name}
        </motion.h2>

        {/* Groom Parents — 2 clean centered lines preventing pillar overlap */}
        <motion.div
          variants={fadeVariant}
          className="font-['Jacques_Francois',_Georgia,_serif] uppercase tracking-[0.08em] text-[8px] sm:text-[9.5px] text-[#4a1820] font-medium leading-[1.3] max-w-[240px] sm:max-w-[270px] mx-auto mt-0.5"
        >
          <p>S/O MR. SUBODH KUMAR SAH</p>
          <p className="text-[7.5px] sm:text-[9px] text-[#4a1820]/85">&amp; MRS. BABY DEVI</p>
        </motion.div>

        {/* VENUES & MAP Pill Button — fits well above the mandap & couple */}
        <motion.button
          variants={fadeVariant}
          type="button"
          onClick={() => setShowModal(true)}
          className="mt-2.5 sm:mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-gradient-to-r from-[#fffcf2] via-[#faf0d7] to-[#f4e4bf] border border-[#cfab4d] shadow-[0_3px_10px_rgba(180,135,40,0.22)] hover:scale-105 active:scale-95 transition-all text-[#4a131c] cursor-pointer"
          aria-label="View Venues and Map"
        >
          <svg
            viewBox="0 0 24 24"
            width="13"
            height="13"
            fill="#b5892b"
            stroke="#4a131c"
            strokeWidth="1.2"
            aria-hidden={true}
          >
            <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
          </svg>
          <span className="font-['Jacques_Francois',_Georgia,_serif] font-bold text-[9px] sm:text-[10.5px] tracking-[0.18em] text-[#4a131c] uppercase">
            VENUES &amp; MAP
          </span>
        </motion.button>
      </motion.div>

      {/* Bottom Center Circular Down Arrow Button */}
      {onNext && (
        <motion.button
          type="button"
          onClick={onNext}
          className="sm-cv-down-btn"
          style={{
            background: "rgba(62, 19, 27, 0.9)",
            border: "2px solid rgba(201, 162, 39, 0.9)",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.4)",
          }}
          aria-label="Next slide"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden={true}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.button>
      )}

      {/* Venues Modal Dialog */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="sm-ty-modal fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="sm-ty-card relative w-full max-w-md rounded-2xl border border-[#c9a227]/50 bg-[#fbf6ec] p-6 shadow-2xl text-center"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.3, ease: EASE_ROYAL }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute top-3 right-3 text-2xl text-[#7a1322] hover:text-[#4a131c] p-2 leading-none cursor-pointer"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                ×
              </button>

              <p className="sm-caps text-xs tracking-[0.28em] text-[#9c7a17] uppercase mb-4">
                Wedding Venues
              </p>

              <div className="flex flex-col gap-3">
                {venueList.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center rounded-xl border border-[#c9a227]/30 bg-[#f7eedc] p-3 text-[#4d0d16] transition-all hover:border-[#c9a227] hover:bg-[#f3e5ca] hover:scale-[1.01]"
                  >
                    <span className="font-['Great_Vibes',_cursive] text-3xl text-[#7a1322]">
                      {item.label}
                    </span>
                    <span className="text-[11px] font-semibold text-[#8f2b38] tracking-wider my-0.5">
                      {item.date}
                    </span>
                    <span className="font-serif text-xs text-[#4d0d16]/90 max-w-xs">
                      {item.place}
                    </span>
                    <span className="mt-1.5 text-[10px] tracking-widest text-[#9c7a17] font-semibold uppercase">
                      Open in Google Maps ↗
                    </span>
                  </a>
                ))}
              </div>

              {/* Contact Information in Modal */}
              <div className="mt-4 pt-3 border-t border-[#c9a227]/30 flex flex-col items-center">
                <span className="text-[10px] tracking-widest text-[#9c7a17] font-semibold uppercase mb-1.5">
                  For Inquiries &amp; Assistance
                </span>
                <a
                  href="tel:9472131587"
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f3e5ca] border border-[#cfab4d] text-[#4a131c] font-semibold text-xs tracking-wider hover:bg-[#eadebe] transition-colors"
                >
                  <span className="w-4 h-4 rounded-full bg-[#a8821a] flex items-center justify-center text-white">
                    <svg viewBox="0 0 24 24" width="9" height="9" fill="currentColor">
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.44-5.15-3.75-6.59-6.59l1.97-1.57c.28-.27.36-.66.25-1.02A11.36 11.36 0 0 1 8.57 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.58c0-.55-.45-1-.99-1.04z" />
                    </svg>
                  </span>
                  <span>9472131587</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
