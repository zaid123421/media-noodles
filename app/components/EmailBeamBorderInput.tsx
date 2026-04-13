"use client";

import { useId } from "react";

/**
 * Pill-shaped email field with a short red "beam" stroke that travels along the perimeter (SVG dash animation).
 */
export function EmailBeamBorderInput() {
  const uid = useId().replace(/:/g, "");
  const filterId = `email-beam-glow-${uid}`;

  return (
    <div className="email-beam-border w-full min-w-0 flex-1">
      <svg
        className="email-beam-border__svg pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 400 80"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <filter
            id={filterId}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Moving segment — pathLength=100 so dash units are % of perimeter */}
        <rect
          x="2"
          y="2"
          width="396"
          height="76"
          rx="38"
          ry="38"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2.5"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="16 88"
          className="email-beam-border__stroke"
          filter={`url(#${filterId})`}
        />
      </svg>
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
