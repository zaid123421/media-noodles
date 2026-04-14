"use client";

import { useEffect, useRef, useState } from "react";

export function EmailBeamBorderInput() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      setDims({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w, h } = dims;
  const inset = 2;
  const rw = w - inset * 2;
  const rh = h - inset * 2;
  const r = rh / 2;

  return (
    <div ref={wrapRef} className="email-beam-border w-full min-w-0 flex-1">
      {w > 0 && h > 0 && (
        <svg
          className="pointer-events-none absolute inset-0 overflow-visible"
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          aria-hidden
        >
          <rect
            x={inset}
            y={inset}
            width={rw}
            height={rh}
            rx={r}
            ry={r}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2.5"
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray="16 84"
            className="email-beam-border__stroke"
          />
        </svg>
      )}
      <input
        type="email"
        name="email"
        placeholder="Enter Email"
        autoComplete="email"
        className="email-beam-border__input"
      />
    </div>
  );
}
