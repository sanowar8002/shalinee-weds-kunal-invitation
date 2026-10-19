import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, MotionConfig } from "motion/react";
import { WEDDING_DATA } from "./data/weddingData";
import { OpeningEnvelope } from "./components/OpeningEnvelope";
import { GanpatiGate } from "./components/GanpatiGate";
import { SaveTheDateSlide } from "./components/slides/SaveTheDateSlide";
import { CarnivalSlide } from "./components/slides/CarnivalSlide";
import { MehndiSlide } from "./components/slides/MehndiSlide";
import { WeddingSlide } from "./components/slides/WeddingSlide";
import { FinaleSlide } from "./components/slides/FinaleSlide";
import { ClosingSlide } from "./components/slides/ClosingSlide";
import { AudioPlayer } from "./components/AudioPlayer";

const SLIDE_COUNT = 6;

// Color accents for the swipe down hint on each slide
const HINT_COLORS: Record<number, string> = {
  0: "#856512",
  1: "#7a1226",
  2: "#2d6a4f",
  3: "#f3e9d6",
  4: "#e7c86b",
  5: "#e7c86b",
};

const HINT_SHADOWS: Record<number, string> = {
  1: "drop-shadow(0 0 5px rgba(255,248,236,0.9))",
  2: "drop-shadow(0 0 5px rgba(240,253,244,0.9))",
  3: "drop-shadow(0 0 5px rgba(255,241,214,0.85))",
};

const SLIDE_TRANSITION = {
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1] as const,
};

// Returns smooth, GPU-accelerated vertical sliding coordinates
const getSlideAnimProps = (idx: number, currentIdx: number) => {
  const diff = idx - currentIdx;
  if (diff === 0) {
    return {
      animate: { y: "0%", opacity: 1, scale: 1 },
      transition: SLIDE_TRANSITION,
      style: {
        pointerEvents: "auto" as const,
        zIndex: 20,
        visibility: "visible" as const,
      },
    };
  } else if (diff > 0) {
    return {
      animate: { y: "100%", opacity: 0, scale: 1 },
      transition: SLIDE_TRANSITION,
      style: {
        pointerEvents: "none" as const,
        zIndex: 10,
        visibility: diff === 1 ? ("visible" as const) : ("hidden" as const),
      },
    };
  } else {
    return {
      animate: { y: "-20%", opacity: 0, scale: 0.96 },
      transition: SLIDE_TRANSITION,
      style: {
        pointerEvents: "none" as const,
        zIndex: 5,
        visibility: diff === -1 ? ("visible" as const) : ("hidden" as const),
      },
    };
  }
};

export default function App() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isHaldiOpen, setIsHaldiOpen] = useState(false);
  const [isEnvelopeClosed, setIsEnvelopeClosed] = useState(true);
  const [ganpatiRevealed, setGanpatiRevealed] = useState(false);
  const [readyForDeck, setReadyForDeck] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showIdleHint, setShowIdleHint] = useState(false);

  const lastNavTime = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userStartedAudio = useRef(false);

  // Play audio helper
  const startAudio = useCallback(() => {
    setGanpatiRevealed(true);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.6;
      audio
        .play()
        .then(() => {
          setIsPlayingAudio(true);
          userStartedAudio.current = true;
        })
        .catch(() => {
          // Autoplay policy might require second interaction
        });
    }
  }, []);

  const toggleAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio
        .play()
        .then(() => {
          setIsPlayingAudio(true);
          userStartedAudio.current = true;
        })
        .catch(() => {});
    } else {
      audio.pause();
      setIsPlayingAudio(false);
    }
  }, []);

  // Handle visibility & focus pause/resume
  useEffect(() => {
    const handlePause = () => {
      if (userStartedAudio.current && audioRef.current) {
        audioRef.current.pause();
        setIsPlayingAudio(false);
      }
    };
    const handleResume = () => {
      if (userStartedAudio.current && !document.hidden && audioRef.current) {
        audioRef.current
          .play()
          .then(() => setIsPlayingAudio(true))
          .catch(() => {});
      }
    };
    const handleVisibility = () => {
      if (document.hidden) handlePause();
      else handleResume();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handlePause);
    window.addEventListener("focus", handleResume);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handlePause);
      window.removeEventListener("focus", handleResume);
    };
  }, []);

  // Slide navigation with debouncing
  const changeSlide = useCallback((direction: number) => {
    setSlideIndex((curr) => {
      const next = Math.min(SLIDE_COUNT - 1, Math.max(0, curr + direction));
      if (next === 0) {
        setIsHaldiOpen(false);
      }
      if (next === 1 && curr >= 2) {
        setIsHaldiOpen(true);
      }
      return next;
    });
  }, []);

  const navigateDeck = useCallback(
    (direction: number) => {
      if (isEnvelopeClosed || !readyForDeck) return;
      const now = Date.now();
      if (now - lastNavTime.current < 750) return;

      // Haldi slide gate logic: scrolling or swiping down opens the Haldi doors instead of skipping to Wedding!
      if (slideIndex === 1 && !isHaldiOpen) {
        if (direction > 0) {
          lastNavTime.current = now;
          setIsHaldiOpen(true);
          return;
        } else if (direction < 0) {
          lastNavTime.current = now;
          changeSlide(-1);
          return;
        }
      }

      lastNavTime.current = now;
      changeSlide(direction);
    },
    [changeSlide, isEnvelopeClosed, readyForDeck, slideIndex, isHaldiOpen]
  );

  // Prevent background scroll
  useEffect(() => {
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, []);

  // Global mouse wheel, touch and keyboard listeners
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 25) return;
      const now = Date.now();
      if (now - lastNavTime.current < 780) return;
      navigateDeck(e.deltaY > 0 ? 1 : -1);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowDown" ||
        e.key === "PageDown" ||
        e.key === " "
      ) {
        e.preventDefault();
        navigateDeck(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        navigateDeck(-1);
      }
    };

    let startY = 0;
    let startX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaY = startY - e.changedTouches[0].clientY;
      const deltaX = startX - e.changedTouches[0].clientX;
      if (Math.abs(deltaY) > 35 && Math.abs(deltaY) > Math.abs(deltaX) * 1.2) {
        navigateDeck(deltaY > 0 ? 1 : -1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [navigateDeck]);

  // Idle hint timer
  useEffect(() => {
    setShowIdleHint(false);
    if (isEnvelopeClosed || !readyForDeck) return;

    const timer = window.setTimeout(() => {
      setShowIdleHint(true);
    }, 2800);

    return () => window.clearTimeout(timer);
  }, [slideIndex, isEnvelopeClosed, readyForDeck]);

  const showHint =
    showIdleHint &&
    !isEnvelopeClosed &&
    readyForDeck &&
    slideIndex >= 1 &&
    slideIndex <= SLIDE_COUNT - 2 &&
    !(slideIndex === 1 && isHaldiOpen) &&
    slideIndex !== 2 &&
    slideIndex !== 3 &&
    slideIndex !== 4; // Mehndi, Wedding, and Finale slides have their own bottom center buttons

  const hintColor = HINT_COLORS[slideIndex] || "#7c0f1c";
  const hintFilter = HINT_SHADOWS[slideIndex];

  return (
    <MotionConfig reducedMotion="user">
      <div className="sm-root">
        {/* Background Royal Temple Watercolor for STD Slide */}
        <motion.div
          className="sm-templebg"
          aria-hidden={true}
          initial={false}
          animate={{
            opacity: slideIndex === 0 ? 1 : 0,
            y: slideIndex === 0 ? "0%" : "-20%",
          }}
          transition={SLIDE_TRANSITION}
        >
          <img
            src={WEDDING_DATA.media.opening.templeWatercolor}
            alt=""
          />
        </motion.div>

        {/* Slide Deck Layers */}
        <div className="sm-deck">
          {/* Slide 0: Save the Date */}
          <motion.div
            className="sm-layer"
            initial={false}
            {...getSlideAnimProps(0, slideIndex)}
            aria-hidden={slideIndex !== 0}
          >
            <SaveTheDateSlide
              active={slideIndex === 0 && !isEnvelopeClosed && readyForDeck}
              onNext={() => navigateDeck(1)}
            />
          </motion.div>

          {/* Slide 1: Haldi Celebration */}
          <motion.div
            className="sm-layer"
            initial={false}
            {...getSlideAnimProps(1, slideIndex)}
            aria-hidden={slideIndex !== 1}
          >
            <CarnivalSlide
              active={slideIndex === 1 && !isEnvelopeClosed && readyForDeck}
              isOpen={isHaldiOpen}
              onOpen={() => setIsHaldiOpen(true)}
              onNext={() => navigateDeck(1)}
            />
          </motion.div>

          {/* Slide 2: Mehndi & Sangeet Celebration */}
          <motion.div
            className="sm-layer"
            initial={false}
            {...getSlideAnimProps(2, slideIndex)}
            aria-hidden={slideIndex !== 2}
          >
            <MehndiSlide
              active={slideIndex === 2 && !isEnvelopeClosed && readyForDeck}
              onNext={() => navigateDeck(1)}
            />
          </motion.div>

          {/* Slide 3: Wedding */}
          <motion.div
            className="sm-layer"
            initial={false}
            {...getSlideAnimProps(3, slideIndex)}
            aria-hidden={slideIndex !== 3}
          >
            <WeddingSlide
              active={slideIndex === 3 && !isEnvelopeClosed && readyForDeck}
              onNext={() => navigateDeck(1)}
            />
          </motion.div>

          {/* Slide 4: Finale & Lineage */}
          <motion.div
            className="sm-layer"
            initial={false}
            {...getSlideAnimProps(4, slideIndex)}
            aria-hidden={slideIndex !== 4}
          >
            <FinaleSlide
              active={slideIndex === 4 && !isEnvelopeClosed && readyForDeck}
              onNext={() => navigateDeck(1)}
            />
          </motion.div>

          {/* Slide 5: Closing Namaste Slide */}
          <motion.div
            className="sm-layer"
            initial={false}
            {...getSlideAnimProps(5, slideIndex)}
            aria-hidden={slideIndex !== 5}
          >
            <ClosingSlide
              active={slideIndex === 5 && !isEnvelopeClosed && readyForDeck}
              onRestart={() => setSlideIndex(0)}
            />
          </motion.div>

          {/* Swipe Down Floating Indicator */}
          <motion.button
            type="button"
            onClick={() => navigateDeck(1)}
            aria-label="Swipe to next chapter"
            className="sm-hint"
            initial={false}
            animate={{ opacity: showHint ? 0.85 : 0 }}
            transition={{ duration: 0.4 }}
            style={{
              pointerEvents: showHint ? "auto" : "none",
              color: hintColor,
              filter: hintFilter || undefined,
            }}
          >
            <span className="sm-hint-label sm-caps">
              {slideIndex === 1 && !isHaldiOpen ? "Tap to open" : "Swipe down"}
            </span>
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              aria-hidden={true}
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </div>

        {/* Slide Progress Dots (Left / Top) */}
        {!isEnvelopeClosed && readyForDeck && (
          <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2">
            {[0, 1, 2, 3, 4, 5].map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const now = Date.now();
                  if (now - lastNavTime.current < 450) return;
                  lastNavTime.current = now;
                  if (idx === 1 && slideIndex !== 1) {
                    setIsHaldiOpen(false);
                  }
                  setSlideIndex(idx);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  slideIndex === idx
                    ? "w-7 bg-[#c9a227] shadow-md shadow-[#c9a227]/40"
                    : "w-2.5 bg-[#4d0d16]/30 hover:bg-[#c9a227]/60"
                }`}
              />
            ))}
          </div>
        )}

        {/* Ganpati Gate Opening Video Portal */}
        <GanpatiGate
          reveal={ganpatiRevealed}
          onFinishAction={() => setReadyForDeck(true)}
        />

        {/* 3D Wax Seal Envelope Entrance */}
        <OpeningEnvelope
          onOpenAction={() => setIsEnvelopeClosed(false)}
          onStartAction={startAudio}
        />

        {/* Floating Audio Soundtrack Controller */}
        {!isEnvelopeClosed && (
          <AudioPlayer
            audioRef={audioRef}
            isPlaying={isPlayingAudio}
            onTogglePlay={toggleAudio}
          />
        )}

        {/* Background Wedding Music Audio Element */}
        <audio
          ref={audioRef}
          src={WEDDING_DATA.media.opening.song}
          loop
          preload="auto"
        />
      </div>
    </MotionConfig>
  );
}
