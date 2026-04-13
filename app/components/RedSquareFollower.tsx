"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SQUARE_SIZE = 12;
const LERP = 0.05;
/** Distance below the OS pointer hotspot so the square sits under the arrow tip */
const OFFSET_BELOW_TIP = 10;

export function useFinePointer() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const sync = () => setFine(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return fine;
}

export function RedSquareFollower() {
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const initialized = useRef(false);
  const squareRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  const tick = useCallback(() => {
    const tx = mouse.current.x - SQUARE_SIZE / 6;
    const ty = mouse.current.y + OFFSET_BELOW_TIP;

    if (!initialized.current) {
      pos.current.x = tx;
      pos.current.y = ty;
      initialized.current = true;
    } else {
      pos.current.x += (tx - pos.current.x) * LERP;
      pos.current.y += (ty - pos.current.y) * LERP;
    }

    const el = squareRef.current;
    if (el) {
      el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
    }
  }, []);

  useEffect(() => {
    let rafId = 0;

    const loop = () => {
      tick();
      rafId = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (layerRef.current) {
        layerRef.current.style.opacity = "1";
      }
    };

    const hide = () => {
      initialized.current = false;
      if (layerRef.current) {
        layerRef.current.style.opacity = "0";
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", hide);
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", hide);
      cancelAnimationFrame(rafId);
    };
  }, [tick]);

  return (
    <div
      ref={layerRef}
      className="pointer-events-none fixed inset-0 z-[9999] opacity-0"
      aria-hidden
    >
      <div
        ref={squareRef}
        className="fixed left-0 top-0 will-change-transform"
        style={{
          width: SQUARE_SIZE,
          height: SQUARE_SIZE,
          backgroundColor: "#ff0000",
        }}
      />
    </div>
  );
}
