// Lab mixing beaker, drawn to the full 10 ml bottle:
//  - the perfumer's alcohol base (8 ml) pours in from the kit's alcohol bottle,
//  - fragrance accords (2 ml in total) sit as translucent bands above it,
//  - kit botanicals can be dropped in as a visual infusion (never counted).
// Colours are visual coding only, not scent identification.

import { useId } from "react";
import { accordById } from "../data/ingredients";
import type { AccordId, Blend, BotanicalId } from "../lib/types";
import { totalShare, computeVolumes, formatMl } from "../lib/formula";

export interface VesselProps {
  blend: Blend;
  baseAdded?: boolean;
  infusions?: BotanicalId[];
  dropKey?: number;
  dropColor?: string;
  pourKey?: number;
  highlight?: AccordId | null;
}

const IMG = "./assets/img/";
// geometry (viewBox 0 0 360 430)
const L = 92, R = 252;            // inner cavity left/right
const BOTTOM = 362;               // inner floor
const TOP_ML = 118;               // 10 ml line
const PX_PER_ML = (BOTTOM - TOP_ML) / 10;
const BASE_ML = 8, OIL_ML = 2;

const FLOAT: Record<BotanicalId, { src: string; x: number; w: number; r: number; d: number }> = {
  "orange-peel": { src: "float-zest", x: 128, w: 58, r: -12, d: 0 },
  "rose-petals": { src: "float-petal", x: 200, w: 40, r: 24, d: 1.1 },
  "cinnamon": { src: "float-cinnamon", x: 160, w: 62, r: 8, d: 0.5 },
  "cedarwood": { src: "float-cedar", x: 218, w: 44, r: -18, d: 1.7 },
};

export function Vessel({ blend, baseAdded = false, infusions = [], dropKey = 0, dropColor = "#c98f3e", pourKey = 0, highlight }: VesselProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = (s: string) => `${s}${uid}`;
  const total = totalShare(blend);
  const vols = computeVolumes(blend);

  const baseTop = baseAdded ? BOTTOM - BASE_ML * PX_PER_ML : BOTTOM;
  let y = baseTop;
  const bands = blend.map((e) => {
    const h = (e.share / 100) * OIL_ML * PX_PER_ML;
    y -= h;
    return { ...e, y, h, color: accordById(e.accordId).swatch };
  });
  const surface = y;
  const filled = baseAdded || blend.length > 0;
  const totalMl = (blend.length ? vols.fragranceCml : 0) / 100 + (baseAdded ? BASE_ML : 0);
  const oilsMid = (baseTop + surface) / 2;
  const summary = filled
    ? `Mixing beaker: ${baseAdded ? "8.00 ml perfumer's alcohol base" : "no base yet"}${blend.length ? `, ${blend.map((b) => `${accordById(b.accordId).name} ${b.share}%`).join(", ")} (${formatMl(vols.fragranceCml)}, blend total ${total}%)` : ", no accords"}${infusions.length ? `, with ${infusions.length} botanical${infusions.length > 1 ? "s" : ""} as a visual infusion` : ""}. ${totalMl.toFixed(2)} ml in total.`
    : "Empty mixing beaker.";

  return (
    <svg viewBox="0 0 360 430" className="vessel" role="img" aria-label={summary}>
      <defs>
        <linearGradient id={id("glass")} x1="0" x2="1">
          <stop offset="0" stopColor="#e9dfcf" stopOpacity="0.75" />
          <stop offset="0.05" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="0.93" stopColor="#f3ebde" stopOpacity="0.2" />
          <stop offset="1" stopColor="#cbbca4" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id={id("body")} x1="0" x2="1">
          <stop offset="0" stopColor="#3a2410" stopOpacity="0.22" />
          <stop offset="0.16" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="0.42" stopColor="#ffffff" stopOpacity="0.26" />
          <stop offset="0.75" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="1" stopColor="#3a2410" stopOpacity="0.24" />
        </linearGradient>
        <linearGradient id={id("base")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbf1dc" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ecdcbc" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id={id("band")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="0.4" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id={id("stream")} x1="0" x2="1">
          <stop offset="0" stopColor="#ead9b6" stopOpacity="0.4" />
          <stop offset="0.5" stopColor="#fffaf0" stopOpacity="0.98" />
          <stop offset="1" stopColor="#ead9b6" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id={id("glow")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#f2c27a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f2c27a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("shadow")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#3b2a12" stopOpacity="0.3" />
          <stop offset="1" stopColor="#3b2a12" stopOpacity="0" />
        </radialGradient>
        <clipPath id={id("inner")}>
          <path d={`M${L} 92 V${BOTTOM - 22} C${L} ${BOTTOM - 6} ${L + 12} ${BOTTOM} ${L + 28} ${BOTTOM} H${R - 28} C${R - 12} ${BOTTOM} ${R} ${BOTTOM - 6} ${R} ${BOTTOM - 22} V92 Z`} />
        </clipPath>
        <filter id={id("soft")} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" /></filter>
        <filter id={id("edge")} x="-5%" y="-80%" width="110%" height="260%"><feGaussianBlur stdDeviation="1.4" /></filter>
      </defs>

      {/* floor */}
      <ellipse cx="172" cy="392" rx="122" ry="20" fill={`url(#${id("shadow")})`} />
      {filled && <ellipse cx="172" cy="390" rx="112" ry="16" fill={`url(#${id("glow")})`} filter={`url(#${id("soft")})`} />}

      {/* pour stream from the alcohol bottle */}
      {pourKey > 0 && (
        <g key={`pour-${pourKey}`} className="vessel__pour">
          <rect x="168" y="0" width="8" height={BOTTOM - BASE_ML * PX_PER_ML} rx="4" fill={`url(#${id("stream")})`} />
        </g>
      )}

      {/* contents */}
      <g clipPath={`url(#${id("inner")})`}>
        {/* base: perfumer's alcohol */}
        <rect className="vessel__band" x={L - 4} width={R - L + 8} y={baseTop} height={BOTTOM - baseTop + 4} fill={`url(#${id("base")})`} />
        {baseAdded && Array.from({ length: 9 }, (_, i) => (
          <circle key={i} className="vessel__bubble" cx={L + 18 + ((i * 37) % (R - L - 30))} cy={BOTTOM - 10} r={1.2 + (i % 3) * 0.6} fill="#fff" opacity="0.8" style={{ animationDelay: `${i * 0.7}s` }} />
        ))}

        {/* accords */}
        {bands.map((b, i) => (
          <g key={b.accordId} opacity={highlight && highlight !== b.accordId ? 0.4 : 1}>
            <rect x={L - 4} width={R - L + 8} y={b.y} height={b.h + 0.6} fill={b.color} opacity="0.88" className="vessel__band" />
            <rect x={L - 4} width={R - L + 8} y={b.y} height={b.h + 0.6} fill={`url(#${id("band")})`} className="vessel__band" />
            {i > 0 && <rect x={L} width={R - L} y={b.y + b.h - 1.2} height="2.4" fill={bands[i - 1].color} opacity="0.55" filter={`url(#${id("edge")})`} className="vessel__band" />}
          </g>
        ))}
        {baseAdded && blend.length > 0 && <rect className="vessel__band" x={L} width={R - L} y={baseTop - 1.5} height="3" fill={bands[0].color} opacity="0.45" filter={`url(#${id("edge")})`} />}

        {filled && <rect x={L - 4} y={surface} width={R - L + 8} height={BOTTOM - surface + 4} fill={`url(#${id("body")})`} className="vessel__band" />}
        {filled && (
          <g className="vessel__surface" style={{ transform: `translateY(${surface}px)` }}>
            <ellipse cx="172" cy="0" rx={(R - L) / 2} ry="5" fill="#fff8ea" opacity="0.6" />
            <path d={`M${L} 0 Q172 9 ${R} 0`} stroke="#fffaf0" strokeOpacity="0.95" strokeWidth="1.4" fill="none" />
          </g>
        )}

        {/* botanicals: a visual infusion, suspended in the liquid */}
        {infusions.map((bid, k) => {
          const f = FLOAT[bid];
          const top = filled ? surface + 26 : BOTTOM - 70;
          const span = Math.max(10, BOTTOM - 40 - top);
          const yy = top + ((k * 61) % span);
          return (
            <g key={bid} className="vessel__float" style={{ ["--fy" as string]: `${yy}px`, animationDelay: `${f.d}s` }}>
              <image href={`${IMG}${f.src}.webp`} x={f.x - f.w / 2} y={-f.w / 2} width={f.w} height={f.w} transform={`rotate(${f.r} ${f.x} 0)`} opacity={filled ? 0.92 : 1} />
            </g>
          );
        })}

        {dropKey > 0 && (
          <g key={dropKey}>
            <ellipse className="vessel__ripple" cx="172" cy={surface} rx="10" ry="2.5" fill="none" stroke="#fff" strokeWidth="1.4" />
            <path className="vessel__drop" d="M172 30 C168 38 166 42 166 46 A6 6 0 0 0 178 46 C178 42 176 38 172 30 Z" fill={dropColor} style={{ ["--drop-to" as string]: `${surface - 50}px` }} />
          </g>
        )}
      </g>

      {/* crystal glass */}
      <path
        d={`M84 70 C76 68 70 64 66 58 C72 56 80 57 86 60 L268 60 C272 60 274 63 274 66 L270 72 V${BOTTOM - 14} C270 ${BOTTOM + 8} 254 ${BOTTOM + 18} 232 ${BOTTOM + 18} H112 C90 ${BOTTOM + 18} 74 ${BOTTOM + 8} 74 ${BOTTOM - 14} V72 Z`}
        fill={`url(#${id("glass")})`} stroke="#bfb4a2" strokeOpacity="0.75" strokeWidth="1.2"
      />
      <path d={`M${L} 92 V${BOTTOM - 22} C${L} ${BOTTOM - 6} ${L + 12} ${BOTTOM} ${L + 28} ${BOTTOM} H${R - 28} C${R - 12} ${BOTTOM} ${R} ${BOTTOM - 6} ${R} ${BOTTOM - 22} V92`} fill="none" stroke="#cfc4b1" strokeOpacity="0.55" strokeWidth="1" />
      <ellipse cx="174" cy="64" rx="96" ry="5" fill="none" stroke="#fff" strokeWidth="2" opacity="0.9" />
      <path d="M66 58 C72 56 80 57 86 60 L268 60" fill="none" stroke="#bfb4a2" strokeOpacity="0.8" strokeWidth="1.2" />
      <path d={`M96 ${BOTTOM + 6} Q172 ${BOTTOM + 14} 248 ${BOTTOM + 6}`} stroke="#ffffff" strokeOpacity="0.9" strokeWidth="2" fill="none" />
      <path d={`M106 ${BOTTOM + 12} Q172 ${BOTTOM + 18} 238 ${BOTTOM + 12}`} stroke="#d8ccb8" strokeOpacity="0.7" strokeWidth="1" fill="none" />

      {/* gilt graduations, 0 to 10 ml */}
      <g>
        {Array.from({ length: 21 }, (_, k) => {
          const ty = BOTTOM - k * 0.5 * PX_PER_ML;
          const major = k % 4 === 0;
          return <line key={k} x1="98" x2={major ? 116 : k % 2 === 0 ? 110 : 105} y1={ty} y2={ty} stroke="#a8844f" strokeWidth={major ? 1.5 : 0.9} />;
        })}
        {[2, 4, 6, 8, 10].map((ml) => (
          <text key={ml} x="120" y={BOTTOM - ml * PX_PER_ML + 4} fontSize="10.5" fontFamily="var(--font-serif)" fill="#85663a">{ml}{ml === 10 ? " ml" : ""}</text>
        ))}
      </g>

      {/* highlights */}
      <path d={`M88 80 V${BOTTOM - 20}`} stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
      <path d={`M264 82 V${BOTTOM - 24}`} stroke="#a89a85" strokeOpacity="0.22" strokeWidth="3" />
      <path d="M244 100 V190" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

      {/* layer tags on the right: oils and base */}
      {blend.length > 0 && (
        <g className="vessel__tag" style={{ transform: `translateY(${oilsMid}px)` }}>
          <line x1={R + 22} x2={R + 30} y1="0" y2="0" stroke="#c4a877" />
          <text x={R + 34} y="3.5" fontSize="10" fontFamily="var(--font-sans)" fill="#6e675e">oils {formatMl(vols.fragranceCml)}</text>
        </g>
      )}
      {baseAdded && (
        <g className="vessel__tag" style={{ transform: `translateY(${(baseTop + BOTTOM) / 2}px)` }}>
          <line x1={R + 22} x2={R + 30} y1="0" y2="0" stroke="#c4a877" />
          <text x={R + 34} y="3.5" fontSize="10" fontFamily="var(--font-sans)" fill="#6e675e">base 8.00 ml</text>
        </g>
      )}

      {/* live total at the surface */}
      <g className="vessel__callout" style={{ transform: `translateY(${filled ? surface : TOP_ML}px)` }}>
        <circle cx={R + 2} cy="0" r="3.6" fill="#a0783e" stroke="#fff" strokeWidth="1.2" />
        <line x1={R + 6} x2="292" y1="0" y2="0" stroke="#a0783e" strokeWidth="1" />
        <rect x="292" y="-13" width="64" height="26" rx="13" fill="#fdf2dd" stroke="#ecd7b0" />
        <text x="324" y="4.5" textAnchor="middle" fontSize="11.5" fontFamily="var(--font-sans)" fontWeight="500" fill="#14110d">{filled ? `${totalMl.toFixed(2)} ml` : "10 ml"}</text>
      </g>
    </svg>
  );
}
