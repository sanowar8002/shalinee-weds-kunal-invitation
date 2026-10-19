import React, { useMemo } from "react";

interface FlowerProps {
  className?: string;
}

// 1. Golden Yellow Marigold Blossom (Genda Phool)
export const YellowMarigold: React.FC<FlowerProps> = ({ className = "" }) => (
  <svg viewBox="-50 -50 100 100" className={className} aria-hidden={true}>
    <defs>
      <radialGradient id="smYmPetal" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#fff9db" />
        <stop offset="35%" stopColor="#fde047" />
        <stop offset="75%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#ca8a04" />
      </radialGradient>
      <radialGradient id="smYmCore" cx="45%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="60%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#c2410c" />
      </radialGradient>
    </defs>
    {/* Outer Petals */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <ellipse
        key={`out-${i}`}
        cx="0"
        cy="-26"
        rx="12"
        ry="20"
        fill="url(#smYmPetal)"
        transform={`rotate(${angle})`}
        opacity="0.96"
      />
    ))}
    {/* Inner Petals */}
    {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle, i) => (
      <ellipse
        key={`in-${i}`}
        cx="0"
        cy="-16"
        rx="9"
        ry="15"
        fill="url(#smYmPetal)"
        transform={`rotate(${angle})`}
      />
    ))}
    {/* Saffron Center Core */}
    <circle cx="0" cy="0" r="10" fill="url(#smYmCore)" />
    <circle cx="0" cy="0" r="4.5" fill="#fef08a" opacity="0.7" />
  </svg>
);

// 2. White Jasmine Blossom (Mogra Phool)
export const WhiteJasmine: React.FC<FlowerProps> = ({ className = "" }) => (
  <svg viewBox="-40 -40 80 80" className={className} aria-hidden={true}>
    <defs>
      <radialGradient id="smWjPetal" cx="45%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="65%" stopColor="#fdfcf9" />
        <stop offset="100%" stopColor="#f0eae0" />
      </radialGradient>
      <radialGradient id="smWjCore" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="70%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#ca8a04" />
      </radialGradient>
    </defs>
    {/* 5 Petals */}
    {[0, 72, 144, 216, 288].map((angle, i) => (
      <path
        key={`wj-${i}`}
        d="M 0,0 C -9,-12 -13,-24 0,-33 C 13,-24 9,-12 0,0 Z"
        fill="url(#smWjPetal)"
        stroke="#e8decb"
        strokeWidth="0.5"
        transform={`rotate(${angle})`}
        opacity="0.97"
      />
    ))}
    {/* Golden pollen core */}
    <circle cx="0" cy="0" r="5.5" fill="url(#smWjCore)" />
    <circle cx="0" cy="0" r="2.5" fill="#ffffff" opacity="0.8" />
  </svg>
);

// 3. Falling Yellow Marigold Petal
export const YellowPetal: React.FC<FlowerProps> = ({ className = "" }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden={true}>
    <defs>
      <linearGradient id="smYpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff9db" />
        <stop offset="35%" stopColor="#fde047" />
        <stop offset="80%" stopColor="#eab308" />
        <stop offset="100%" stopColor="#ca8a04" />
      </linearGradient>
    </defs>
    <path
      d="M16 2 C25 6 30 14 28 22 C26 28 20 31 16 30 C12 31 6 28 4 22 C2 14 7 6 16 2 Z"
      fill="url(#smYpGrad)"
      opacity="0.93"
    />
  </svg>
);

// 4. Falling White Jasmine / Rose Petal
export const WhitePetal: React.FC<FlowerProps> = ({ className = "" }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden={true}>
    <defs>
      <linearGradient id="smWpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="55%" stopColor="#fdfcf8" />
        <stop offset="85%" stopColor="#f4ede2" />
        <stop offset="100%" stopColor="#e4d6c0" />
      </linearGradient>
    </defs>
    <path
      d="M16 2 C24 5 29 13 28 21 C27 27 21 30 16 30 C11 30 5 27 4 21 C3 13 8 5 16 2 Z"
      fill="url(#smWpGrad)"
      stroke="#e5dbcc"
      strokeWidth="0.5"
      opacity="0.94"
    />
  </svg>
);

type FlowerType = "yellow-flower" | "white-flower" | "yellow-petal" | "white-petal";

interface FlowerPetalsProps {
  count?: number;
}

export const FlowerPetals: React.FC<FlowerPetalsProps> = ({ count = 16 }) => {
  const petals = useMemo(() => {
    const pseudoRandom = (seed: number) => {
      const s = 43758.5453 * Math.sin(seed);
      return s - Math.floor(s);
    };

    const types: FlowerType[] = [
      "yellow-flower",
      "white-flower",
      "yellow-petal",
      "white-petal",
    ];

    const total = count * 2; // e.g. 32 falling items

    return Array.from({ length: total }, (_, i) => {
      const r1 = pseudoRandom(12.9898 * (i + 1) + 1.23);
      const r2 = pseudoRandom(78.233 * (i + 1) + 2.45);
      const r3 = pseudoRandom(37.719 * (i + 1) + 3.67);
      const r4 = pseudoRandom(94.673 * (i + 1) + 4.89);

      const type = types[i % types.length];
      const isFullFlower = type === "yellow-flower" || type === "white-flower";

      // Spread evenly across 2% to 98% with pseudo-random jitter
      const slotWidth = 96 / total;
      const leftPos = Math.min(96, Math.max(2, i * slotWidth + (r1 - 0.5) * slotWidth * 1.5));

      // Natural durations between 5.8s and 9.5s
      const duration = 5.8 + 3.7 * r2;
      // Staggered negative delay so flowers are immediately in mid-flight
      const delay = -r3 * duration;
      // Gentle horizontal drift
      const drift = `${Math.round((r4 - 0.5) * 36)}vw`;
      // Spin rotation
      const rot = `${Math.round((r1 - 0.5) * 640)}deg`;

      // Size
      const sizePx = isFullFlower
        ? Math.round(20 + 12 * r3) // 20px - 32px
        : Math.round(14 + 8 * r3);  // 14px - 22px

      return {
        type,
        start: `${leftPos.toFixed(1)}%`,
        size: `${sizePx}px`,
        dur: `${duration.toFixed(2)}s`,
        delay: `${delay.toFixed(2)}s`,
        drift,
        rot,
      };
    });
  }, [count]);

  return (
    <div className="sm-flowers" aria-hidden={true}>
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
            } as React.CSSProperties
          }
        >
          {item.type === "yellow-flower" && <YellowMarigold className="block h-full w-full" />}
          {item.type === "white-flower" && <WhiteJasmine className="block h-full w-full" />}
          {item.type === "yellow-petal" && <YellowPetal className="block h-full w-full" />}
          {item.type === "white-petal" && <WhitePetal className="block h-full w-full" />}
        </span>
      ))}
    </div>
  );
};
