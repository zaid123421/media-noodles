"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SQUARE_SIZE = 16;
/** Cursor image (`public/cursors/my-pointer.png`) — 24×24. */
const CURSOR_WIDTH = 24;
const CURSOR_HEIGHT = 24;
/** Hotspot: click point from top-left of the cursor image (tip of arrow). */
const HOTSPOT_X = 16;
const HOTSPOT_Y = 0;
/** Bottom edge of the arrow shape within the cursor image (for placing the square below). */
const ARROW_SHAPE_BOTTOM_Y = 12;
/** Pixels between arrow bottom and square top. */
const SQUARE_GAP_BELOW_ARROW = 2;
const LERP = 0.22;

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

const BODY_CLASS = "custom-cursor-active";

export function CustomCursor() {
  const mouse = useRef({ x: 0, y: 0 });
  const square = useRef({ x: 0, y: 0 });
  const squareInitialized = useRef(false);

  const squareRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  /** Force-hide native cursor on interactive elements (UA + Tailwind preflight beat inherited cursor). */
  useEffect(() => {
    document.body.classList.add(BODY_CLASS);
    const styleId = "custom-cursor-hide-native-lock";
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.textContent =
        "body.custom-cursor-active,body.custom-cursor-active *{cursor:none!important}";
      document.head.appendChild(styleEl);
    }
    return () => {
      document.body.classList.remove(BODY_CLASS);
      document.getElementById(styleId)?.remove();
    };
  }, []);

  const tick = useCallback(() => {
    const mx = mouse.current.x;
    const my = mouse.current.y;
    const cursorTop = my - HOTSPOT_Y;
    const tx = mx - SQUARE_SIZE / 2;
    const ty =
      cursorTop + ARROW_SHAPE_BOTTOM_Y + SQUARE_GAP_BELOW_ARROW;

    if (!squareInitialized.current) {
      square.current.x = tx;
      square.current.y = ty;
      squareInitialized.current = true;
    } else {
      square.current.x += (tx - square.current.x) * LERP;
      square.current.y += (ty - square.current.y) * LERP;
    }

    const sq = squareRef.current;
    const cur = cursorRef.current;
    if (sq) {
      sq.style.transform = `translate3d(${square.current.x}px, ${square.current.y}px, 0)`;
    }
    if (cur) {
      cur.style.transform = `translate3d(${mx - HOTSPOT_X}px, ${my - HOTSPOT_Y}px, 0)`;
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
      squareInitialized.current = false;
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
      {/* Red square: below cursor */}
      <div
        ref={squareRef}
        className="fixed left-0 top-0 will-change-transform"
        style={{
          width: SQUARE_SIZE,
          height: SQUARE_SIZE,
          backgroundColor: "#ff0000",
          zIndex: 1,
        }}
      />
      {/* Custom pointer image: on top */}
      <div
        ref={cursorRef}
        className="fixed left-0 top-0 will-change-transform"
        style={{ zIndex: 2 }}
      >
        <img
          src="/cursors/my-pointer.png"
          width={CURSOR_WIDTH}
          height={CURSOR_HEIGHT}
          alt=""
          draggable={false}
          className="block select-none -rotate-12"
        />
      </div>
    </div>
  );
}
