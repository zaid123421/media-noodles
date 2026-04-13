"use client";

import { useEffect, useState } from "react";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";

interface FlipDigitProps {
  digit: string | number;
}

const FLIP_DURATION = 0.5;

function toChar(d: string | number) {
  return String(d);
}

function DigitTop({ char }: { char: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-x-0 top-0 flex h-[200%] items-center justify-center">
        <span className="select-none font-black text-[50px] leading-none text-white md:text-[80px]">
          {char}
        </span>
      </div>
    </div>
  );
}

function DigitBottom({ char }: { char: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 flex h-[200%] items-center justify-center">
        <span className="select-none font-black text-[50px] leading-none text-white md:text-[80px]">
          {char}
        </span>
      </div>
    </div>
  );
}

export function FlipDigit({ digit }: FlipDigitProps) {
  const next = toChar(digit);
  const [stable, setStable] = useState(next);
  const topControls = useAnimationControls();
  const bottomControls = useAnimationControls();
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    if (next === stable) return;

    if (reduceMotion) {
      setStable(next);
      return;
    }

    const half = FLIP_DURATION * 0.5;

    void (async () => {
      const topDone = topControls.start({
        rotateX: 90,
        transition: { duration: half, ease: "easeIn" },
      });

      const bottomDone = bottomControls.start({
        rotateX: 0,
        transition: { duration: half, ease: "easeOut", delay: half * 0.55 },
      });

      await Promise.all([topDone, bottomDone]);

      setStable(next);
      topControls.set({ rotateX: 0 });
      bottomControls.set({ rotateX: -90 });
    })();
  }, [next, stable, topControls, bottomControls, reduceMotion]);

  return (
    <div
      className="relative w-[50px] min-w-[50px] font-sans md:w-[75px] md:min-w-[75px]"
      style={{ perspective: "600px", perspectiveOrigin: "50% 50%" }}
    >
      <div className="relative flex h-[65px] w-full flex-col overflow-hidden md:h-[100px]">

        {/* ===== TOP HALF ===== */}
        <div className="relative h-1/2 w-full">
          {/* Static: new digit top — revealed when top flipper falls away */}
          <div className="absolute inset-0 z-0 bg-[#ef4444]">
            <DigitTop char={next} />
          </div>

          {/* Top flipper: old digit top — falls forward to reveal new top */}
          <motion.div
            className="absolute inset-0 z-10 bg-[#ef4444]"
            initial={{ rotateX: 0 }}
            animate={topControls}
            style={{
              transformOrigin: "bottom center",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            <DigitTop char={stable} />
          </motion.div>
        </div>

        {/* Hinge */}
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 z-50 h-[2px] -translate-y-1/2 bg-black/30"
          aria-hidden
        />

        {/* ===== BOTTOM HALF ===== */}
        <div className="relative h-1/2 w-full">
          {/* Static: old digit bottom — visible until bottom flipper covers it */}
          <div className="absolute inset-0 z-0 bg-[#b91c1c]">
            <DigitBottom char={stable} />
          </div>

          {/* Bottom flipper: new digit bottom — unfolds from behind hinge */}
          <motion.div
            className="absolute inset-0 z-10 bg-[#b91c1c]"
            initial={{ rotateX: -90 }}
            animate={bottomControls}
            style={{
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            <DigitBottom char={next} />
          </motion.div>
        </div>

      </div>
    </div>
  );
}
