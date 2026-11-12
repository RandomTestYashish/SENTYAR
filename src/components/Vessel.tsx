// Lab mixing beaker. Bands show each accord's share of the 2 ml fragrance
// allocation; colours are visual coding only, not scent identification.
// Crystal glass with a poured lip, gilt graduations, translucent layered
// liquid with soft band edges, and a live millilitre callout at the surface.

import { useId } from "react";
import { accordById } from "../data/ingredients";
import type { AccordId, Blend } from "../lib/types";
import { totalShare, computeVolumes, formatMl } from "../lib/formula";

export interface VesselProps {
  blend: Blend;
  dropKey?: number;
  dropColor?: string;
  highlight?: AccordId | null;
}

// geometry (viewBox 0 0 340 420)
const L = 86, R = 254;          // inner cavity left/right
const BOTTOM = 352;             // inner floor
const TARGET = 132;             // 2.00 ml line
const SCALE = (BOTTOM - TARGET) / 100;

export function Vessel({ blend, dropKey = 0, dropColor = "#c98f3e", highlight }: VesselProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (s: string) => `${s}${uid}`;
  const total = totalShare(blend);
  const vols = computeVolumes(blend);
  let y = BOTTOM;
  const bands = blend.map((e) => {
    const h = e.share * SCALE;
    y -= h;
    return { ...e, y, h, color: accordById(e.accordId).swatch };
  });
  const surface = blend.length ? y : BOTTOM;
  const calloutY = blend.length ? surface : TARGET;
  const calloutText = blend.length ? formatMl(vols.fragranceCml) : "2 ml";
  const summary = blend.length
    ? `Mixing beaker holding ${blend.map((b) => `${accordById(b.accordId).name} ${b.share}%`).join(", ")}. Blend total ${total}%, ${formatMl(vols.fragranceCml)}.`
    : "Empty mixing beaker. No accords selected.";

  return (
    <svg viewBox="0 0 340 420" className="vessel" role="img" aria-label={summary}>
      <defs>
        <linearGradient id={id("glass")} x1="0" x2="1">
          <stop offset="0" stopColor="#e9dfcf" stopOpacity="0.75" />
          <stop offset="0.05" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="0.93" stopColor="#f3ebde" stopOpacity="0.2" />
          <stop offset="1" stopColor="#cbbca4" stopOpacity="0.7" />
        </linearGradient>
        {/* lighten the centre of the liquid, deepen the walls: reads as a cylinder */}
        <linearGradient id={id("body")} x1="0" x2="1">
          <stop offset="0" stopColor="#3a2410" stopOpacity="0.28" />
          <stop offset="0.16" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="0.42" stopColor="#ffffff" stopOpacity="0.26" />
          <stop offset="0.75" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="1" stopColor="#3a2410" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id={id("band")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.32" />
          <stop offset="0.35" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.06" />
        </linearGradient>
        <radialGradient id={id("glow")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f2c27a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f2c27a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("shadow")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#3b2a12" stopOpacity="0.3" />
          <stop offset="1" stopColor="#3b2a12" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("gold")} x1="0" x2="1">
          <stop offset="0" stopColor="#8a6936" /><stop offset="0.5" stopColor="#c9a46a" /><stop offset="1" stopColor="#8a6936" />
        </linearGradient>
        <clipPath id={id("inner")}>
          <path d={`M${L} 84 V${BOTTOM - 22} C${L} ${BOTTOM - 6} ${L + 12} ${BOTTOM} ${L + 28} ${BOTTOM} H${R - 28} C${R - 12} ${BOTTOM} ${R} ${BOTTOM - 6} ${R} ${BOTTOM - 22} V84 Z`} />
        </clipPath>
        <filter id={id("soft")} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" /></filter>
        <filter id={id("edge")} x="-5%" y="-50%" width="110%" height="200%"><feGaussianBlur stdDeviation="1.6" /></filter>
      </defs>

      {/* floor: warm caustic glow and contact shadow */}
      <ellipse cx="170" cy="380" rx="120" ry="20" fill={`url(#${id("shadow")})`} />
      {blend.length > 0 && <ellipse cx="170" cy="378" rx="110" ry="16" fill={`url(#${id("glow")})`} filter={`url(#${id("soft")})`} />}

      {/* liquid */}
      <g clipPath={`url(#${id("inner")})`}>
        {bands.map((b, i) => (
          <g key={b.accordId} className="vessel__band" opacity={highlight && highlight !== b.accordId ? 0.4 : 1}>
            <rect x={L - 4} width={R - L + 8} y={b.y} height={b.h + 0.6} fill={b.color} opacity="0.86" className="vessel__band" />
            <rect x={L - 4} width={R - L + 8} y={b.y} height={b.h + 0.6} fill={`url(#${id("band")})`} className="vessel__band" />
            {i < bands.length - 1 && <rect x={L} width={R - L} y={b.y - 1.5} height="3" fill={bands[i + 1].color} opacity="0.5" filter={`url(#${id("edge")})`} className="vessel__band" />}
          </g>
        ))}
        {blend.length > 0 && <rect x={L - 4} y={surface} width={R - L + 8} height={BOTTOM - surface + 4} fill={`url(#${id("body")})`} className="vessel__band" />}
        {blend.length > 0 && (
          <g className="vessel__surface" style={{ transform: `translateY(${surface}px)` }}>
            <ellipse cx="170" cy="0" rx={(R - L) / 2} ry="5" fill="#fff8ea" opacity="0.55" />
            <path d={`M${L} 0 Q170 9 ${R} 0`} stroke="#fffaf0" strokeOpacity="0.9" strokeWidth="1.4" fill="none" />
          </g>
        )}
        {dropKey > 0 && (
          <g key={dropKey}>
            <ellipse className="vessel__ripple" cx="170" cy={surface} rx="10" ry="2.5" fill="none" stroke="#fff" strokeWidth="1.4" />
            <path className="vessel__drop" d="M170 30 C166 38 164 42 164 46 A6 6 0 0 0 176 46 C176 42 174 38 170 30 Z" fill={dropColor} style={{ ["--drop-to" as string]: `${surface - 50}px` }} />
          </g>
        )}
      </g>

      {/* crystal glass: thick walls, heavy base, poured lip */}
      <path
        d={`M78 62 C70 60 64 56 60 50 C66 48 74 49 80 52 L262 52 C266 52 268 55 268 58 L264 64 V${BOTTOM - 14} C264 ${BOTTOM + 8} 248 ${BOTTOM + 18} 226 ${BOTTOM + 18} H114 C92 ${BOTTOM + 18} 76 ${BOTTOM + 8} 76 ${BOTTOM - 14} V64 Z`}
        fill={`url(#${id("glass")})`} stroke="#bfb4a2" strokeOpacity="0.75" strokeWidth="1.2"
      />
      {/* inner wall line */}
      <path d={`M${L} 84 V${BOTTOM - 22} C${L} ${BOTTOM - 6} ${L + 12} ${BOTTOM} ${L + 28} ${BOTTOM} H${R - 28} C${R - 12} ${BOTTOM} ${R} ${BOTTOM - 6} ${R} ${BOTTOM - 22} V84`} fill="none" stroke="#cfc4b1" strokeOpacity="0.55" strokeWidth="1" />
      {/* rim */}
      <ellipse cx="172" cy="56" rx="94" ry="5" fill="none" stroke="#fff" strokeWidth="2" opacity="0.9" />
      <path d="M60 50 C66 48 74 49 80 52 L262 52" fill="none" stroke="#bfb4a2" strokeOpacity="0.8" strokeWidth="1.2" />
      {/* heavy base */}
      <path d={`M90 ${BOTTOM + 6} Q170 ${BOTTOM + 14} 250 ${BOTTOM + 6}`} stroke="#ffffff" strokeOpacity="0.9" strokeWidth="2" fill="none" />
      <path d={`M100 ${BOTTOM + 12} Q170 ${BOTTOM + 18} 240 ${BOTTOM + 12}`} stroke="#d8ccb8" strokeOpacity="0.7" strokeWidth="1" fill="none" />

      {/* gilt graduations on the left wall */}
      <g>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => {
          const ty = BOTTOM - (k / 8) * (BOTTOM - TARGET); // every 0.25 ml
          const major = k % 4 === 0;
          return <line key={k} x1="92" x2={major ? 112 : 104} y1={ty} y2={ty} stroke="#a8844f" strokeWidth={major ? 1.6 : 1} />;
        })}
        <line x1="92" x2="92" y1={TARGET} y2={BOTTOM} stroke="#a8844f" strokeWidth="1" opacity="0.6" />
        <text x="116" y={TARGET + 4} fontSize="11" fontFamily="var(--font-serif)" fill="#85663a">2 ml</text>
        <text x="116" y={(TARGET + BOTTOM) / 2 + 4} fontSize="11" fontFamily="var(--font-serif)" fill="#85663a">1 ml</text>
      </g>

      {/* glass highlights */}
      <path d={`M82 72 V${BOTTOM - 20}`} stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
      <path d={`M98 96 V220`} stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
      <path d={`M258 74 V${BOTTOM - 24}`} stroke="#a89a85" strokeOpacity="0.22" strokeWidth="3" />
      <path d={`M246 90 V180`} stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

      {/* live callout at the liquid surface */}
      <g className="vessel__callout" style={{ transform: `translateY(${calloutY}px)` }}>
        <circle cx={R + 2} cy="0" r="3.6" fill="#a0783e" stroke="#fff" strokeWidth="1.2" />
        <line x1={R + 6} x2="284" y1="0" y2="0" stroke="#a0783e" strokeWidth="1" />
        <rect x="284" y="-13" width="52" height="26" rx="13" fill="#fdf2dd" stroke="#ecd7b0" />
        <text x="310" y="4.5" textAnchor="middle" fontSize="11.5" fontFamily="var(--font-sans)" fontWeight="500" fill="#14110d">{calloutText}</text>
      </g>
    </svg>
  );
}
