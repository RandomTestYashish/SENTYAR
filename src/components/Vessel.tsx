// Lab mixing vessel. Bands show each accord's share of the 2 ml fragrance
// allocation; colours are visual coding only, not scent identification.

import { accordById } from "../data/ingredients";
import type { AccordId, Blend } from "../lib/types";
import { totalShare } from "../lib/formula";

export interface VesselProps {
  blend: Blend;
  dropKey?: number;
  dropColor?: string;
  highlight?: AccordId | null;
}

const TOP = 78;
const BOTTOM = 318;
const HEIGHT = BOTTOM - TOP; // cavity
const FULL = 0.78; // 100 % blend fills to this proportion of the cavity

export function Vessel({ blend, dropKey = 0, dropColor = "#c98f3e", highlight }: VesselProps) {
  const total = totalShare(blend);
  const scale = (HEIGHT * FULL) / 100;
  let y = BOTTOM;
  const bands = blend.map((e) => {
    const h = e.share * scale;
    y -= h;
    return { ...e, y, h, color: accordById(e.accordId).swatch };
  });
  const surface = y;
  const targetY = BOTTOM - 100 * scale;
  const summary = blend.length
    ? `Mixing vessel holding ${blend.map((b) => `${accordById(b.accordId).name} ${b.share}%`).join(", ")}. Blend total ${total}%.`
    : "Empty mixing vessel. No accords selected.";

  return (
    <svg viewBox="0 0 260 360" className="vessel" role="img" aria-label={summary}>
      <defs>
        <linearGradient id="v-glass" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="0.2" stopColor="#f4f0ea" stopOpacity="0.4" />
          <stop offset="0.8" stopColor="#eae4da" stopOpacity="0.35" />
          <stop offset="1" stopColor="#cfc7ba" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="v-sheen" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.12" />
        </linearGradient>
        <clipPath id="v-inner">
          <path d="M66 70 L66 300 C66 314 76 322 90 322 L170 322 C184 322 194 314 194 300 L194 70 Z" />
        </clipPath>
        <filter id="v-blur"><feGaussianBlur stdDeviation="5" /></filter>
      </defs>

      <ellipse cx="130" cy="336" rx="92" ry="8" fill="#20170c" opacity="0.16" filter="url(#v-blur)" />

      {/* glass */}
      <path d="M58 54 L58 302 C58 320 72 332 92 332 L168 332 C188 332 202 320 202 302 L202 54" fill="url(#v-glass)" stroke="#5f574b" strokeOpacity="0.35" strokeWidth="1.3" />
      <path d="M50 54 C50 48 56 46 62 48 L58 54 Z M210 54 C210 48 204 46 198 48 L202 54 Z" fill="#e8e2d8" stroke="#5f574b" strokeOpacity="0.3" />

      {/* liquid bands */}
      <g clipPath="url(#v-inner)">
        {bands.map((b) => (
          <rect
            key={b.accordId}
            x="40" width="180" y={b.y} height={b.h + 0.5}
            fill={b.color}
            opacity={highlight && highlight !== b.accordId ? 0.45 : 0.92}
            className="vessel__band"
          />
        ))}
        {blend.length > 0 && <rect x="40" y={surface} width="180" height={BOTTOM - surface} fill="url(#v-sheen)" className="vessel__band" />}
        {blend.length > 0 && (
          <g className="vessel__surface" style={{ transform: `translateY(${surface}px)` }}>
            <ellipse cx="130" cy="0" rx="66" ry="4" fill="#fff" opacity="0.35" />
            <path d="M64 0 Q130 7 196 0" stroke="#fff" strokeOpacity="0.8" strokeWidth="1.2" fill="none" />
          </g>
        )}
        {dropKey > 0 && (
          <g key={dropKey}>
            <ellipse className="vessel__ripple" cx="130" cy={surface} rx="10" ry="2.5" fill="none" stroke="#fff" strokeWidth="1.4" />
            <path className="vessel__drop" d="M130 20 C126 28 124 32 124 36 A6 6 0 0 0 136 36 C136 32 134 28 130 20 Z" fill={dropColor} style={{ ["--drop-to" as string]: `${surface - 40}px` }} />
          </g>
        )}
      </g>

      {/* target line for 100 % */}
      <g>
        <line x1="58" x2="72" y1={targetY} y2={targetY} stroke="#0b0b0b" strokeWidth="1" />
        <line x1="188" x2="202" y1={targetY} y2={targetY} stroke="#0b0b0b" strokeWidth="1" />
        <text x="212" y={targetY + 4} fontSize="10" fontFamily="var(--font-sans)" fill="#57534d">2 ml</text>
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="58" x2="66" y1={BOTTOM - 100 * scale * f} y2={BOTTOM - 100 * scale * f} stroke="#0b0b0b" strokeOpacity="0.4" />
        ))}
      </g>

      {/* highlights */}
      <path d="M70 70 L70 292" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      <path d="M78 80 L78 200" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M192 74 L192 300" stroke="#5f574b" strokeOpacity="0.12" strokeWidth="3" />
    </svg>
  );
}
