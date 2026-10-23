import React, { useMemo } from "react";
import { motion } from "motion/react";
import { WEDDING_DATA } from "../../data/weddingData";
import fallbackNamasteImg from "../../assets/images/namaste_watercolor_card_1792233087050.jpg";

interface ClosingSlideProps {
  active?: boolean;
  onRestart?: () => void;
}

// 1. Soft Light Pink Rose Petal
const LightPinkRosePetal: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden={true}>
    <defs>
      <linearGradient id="smClosingPinkPetal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff5f7" />
        <stop offset="40%" stopColor="#fbcfe8" />
        <stop offset="75%" stopColor="#f472b6" />
        <stop offset="100%" stopColor="#db2777" />
      </linearGradient>
    </defs>
    <path
      d="M16 2 C25 6 30 14 28 22 C26 28 20 31 16 30 C12 31 6 28 4 22 C2 14 7 6 16 2 Z"
      fill="url(#smClosingPinkPetal)"
      opacity="0.9"
    />
  </svg>
);

// 2. Rich Deep Red Rose Petal
const DeepRedRosePetal: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden={true}>
    <defs>
      <linearGradient id="smClosingRedPetal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fca5a5" />
        <stop offset="35%" stopColor="#ef4444" />
        <stop offset="75%" stopColor="#be123c" />
        <stop offset="100%" stopColor="#881337" />
      </linearGradient>
    </defs>
    <path
      d="M16 2 C25 6 30 14 28 22 C26 28 20 31 16 30 C12 31 6 28 4 22 C2 14 7 6 16 2 Z"
      fill="url(#smClosingRedPetal)"
      opacity="0.93"
    />
  </svg>
);

// Falling Red and Pink Rose Petals animation matching FinaleSlide
const ClosingRosePetals: React.FC = () => {
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
    <div className="sm-flowers" aria-hidden={true} style={{ zIndex: 18 }}>
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

export const ClosingSlide: React.FC<ClosingSlideProps> = ({
  active = false,
  onRestart,
}) => {
  return (
    <section className="sm-slide relative h-full w-full overflow-hidden bg-[#faede1] select-none flex flex-col justify-between">
      {/* Background Poster: Namaste - Please Join Us in Celebrating Our Wedding */}
      <img
        src={WEDDING_DATA.media.closing.image || fallbackNamasteImg}
        onError={(e) => {
          if (e.currentTarget.src !== fallbackNamasteImg) {
            e.currentTarget.src = fallbackNamasteImg;
          }
        }}
        alt="Namaste - Please Join Us in Celebrating Our Wedding"
        className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none select-none z-0"
        aria-hidden={true}
        referrerPolicy="no-referrer"
      />

      {/* Red & Pink Falling Rose Petals */}
      <ClosingRosePetals />

      {/* Spacer */}
      <div className="flex-1 pointer-events-none" />

      {/* Bottom Bar with Replay */}
      {onRestart && (
        <div className="relative z-20 w-full bg-[#1e0509]/95 backdrop-blur-xs py-2.5 px-4 flex items-center justify-center border-t border-[#c9a227]/30">
          <button
            type="button"
            onClick={onRestart}
            aria-label="Replay Wedding Invitation"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#c9a227]/25 border border-[#c9a227]/60 text-[#fdf7e8] text-[10px] sm:text-[11px] tracking-widest uppercase font-medium hover:bg-[#c9a227]/40 active:scale-95 transition-all cursor-pointer"
          >
            <span>↺</span>
            <span>Replay</span>
          </button>
        </div>
      )}
    </section>
  );
};
