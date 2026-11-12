// Modular 2D signature-bottle renderer. Geometry for each concept lives in
// BOTTLES so the silhouette can be swapped without touching any page.
// Liquid colour is a constant demo amber, it does not encode scent.

import { useId } from "react";
import type { BottleConceptId } from "../lib/types";
import { Emblem } from "./Logo";

interface Geometry {
  name: string;
  tagline: string;
  body: string;
  /** y range of the inner cavity, used for fill level */
  innerTop: number;
  innerBottom: number;
  cap: (fill: string) => React.ReactNode;
  collar: { x: number; y: number; w: number; h: number };
  labelY: number;
  highlight: string;
  facets?: string[];
}


export const BOTTLES: Record<BottleConceptId, Geometry> = {
  pebble: {
    name: "The Pebble",
    tagline: "Organic sculptural · controlled asymmetry",
    body: "M62 262 C34 262 24 236 26 202 C28 162 42 124 80 108 C94 102 108 101 124 103 C160 108 178 142 178 188 C178 232 166 262 138 262 Z",
    innerTop: 112,
    innerBottom: 248,
    collar: { x: 86, y: 90, w: 30, h: 14 },
    labelY: 176,
    cap: (capFill: string) => (
      <g>
        <path d="M78 90 L124 90 L132 58 L116 30 L88 36 L74 62 Z" fill={capFill} />
        <path d="M88 36 L98 62 L74 62 Z" fill="#fff" opacity="0.06" />
        <path d="M98 62 L132 58 L116 30 L88 36 Z" fill="#fff" opacity="0.1" />
        <path d="M98 62 L124 90 L78 90 Z" fill="#000" opacity="0.25" />
        <path d="M88 36 L98 62 L132 58 M98 62 L124 90 M98 62 L78 90" stroke="#fff" strokeOpacity="0.14" strokeWidth="0.8" fill="none" />
      </g>
    ),
    highlight: "M44 214 C40 180 50 146 76 126",
  },
  facet: {
    name: "The Facet",
    tagline: "Architectural · distinctive glass planes",
    body: "M48 262 L152 262 L170 214 L170 150 L150 106 L50 106 L30 150 L30 214 Z",
    innerTop: 116,
    innerBottom: 250,
    collar: { x: 86, y: 92, w: 28, h: 14 },
    labelY: 180,
    cap: (capFill: string) => (
      <g>
        <path d="M76 92 L124 92 L130 40 L82 28 Z" fill={capFill} />
        <path d="M82 28 L130 40 L106 46 Z" fill="#fff" opacity="0.12" />
        <path d="M106 46 L124 92 L130 40 Z" fill="#000" opacity="0.3" />
      </g>
    ),
    highlight: "M40 210 L40 156 L56 120",
    facets: ["M30 150 L60 160 L60 222 L30 214", "M170 150 L140 160 L140 222 L170 214", "M60 160 L140 160 M60 222 L140 222", "M48 262 L60 222 M152 262 L140 222 M50 106 L60 160 M150 106 L140 160"],
  },
  atelier: {
    name: "The Atelier",
    tagline: "Softly sculpted classic · stepped shoulder",
    body: "M60 262 C40 262 34 250 34 230 L34 150 C34 128 46 118 66 114 L84 110 C90 109 110 109 116 110 L134 114 C154 118 166 128 166 150 L166 230 C166 250 160 262 140 262 Z",
    innerTop: 120,
    innerBottom: 250,
    collar: { x: 84, y: 94, w: 32, h: 16 },
    labelY: 182,
    cap: (capFill: string) => (
      <g>
        <rect x="74" y="34" width="52" height="60" rx="6" fill={capFill} />
        <rect x="80" y="38" width="8" height="52" rx="3" fill="#fff" opacity="0.12" />
      </g>
    ),
    highlight: "M48 236 L48 150 C48 138 54 130 64 126",
  },
};

export interface BottleProps {
  concept?: BottleConceptId;
  fill?: number; // 0..1 of the inner cavity
  name?: string;
  accents?: string[];
  showLabel?: boolean;
  className?: string;
  title?: string;
  animateFill?: boolean;
}

export function Bottle({ concept = "pebble", fill = 0.72, name, accents = [], showLabel = true, className, title, animateFill = true }: BottleProps) {
  const g = BOTTLES[concept];
  const uidRaw = useId().replace(/:/g, "");
  const id = (s: string) => `${s}-${uidRaw}`;
  const level = Math.max(0, Math.min(1, fill));
  const cavity = g.innerBottom - g.innerTop;
  const liquidTop = g.innerBottom - cavity * level;

  return (
    <svg viewBox="0 0 200 280" className={className} role="img" aria-label={title ?? `${g.name} bottle concept${name ? ` labelled ${name}` : ""}, ${Math.round(level * 100)}% filled`}>
      <defs>
        <linearGradient id={id("cap")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a3733" />
          <stop offset="0.5" stopColor="#151413" />
          <stop offset="1" stopColor="#050505" />
        </linearGradient>
        <linearGradient id={id("glass")} x1="0" x2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="0.18" stopColor="#f3efe8" stopOpacity="0.35" />
          <stop offset="0.7" stopColor="#ece6dc" stopOpacity="0.25" />
          <stop offset="1" stopColor="#c8c0b4" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id={id("liquid")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2c57c" />
          <stop offset="0.45" stopColor="#d39a48" />
          <stop offset="1" stopColor="#9a6424" />
        </linearGradient>
        <radialGradient id={id("glow")} cx="0.4" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#fff3d6" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff3d6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("collar")} x1="0" x2="1">
          <stop offset="0" stopColor="#8c7150" />
          <stop offset="0.45" stopColor="#e3cfae" />
          <stop offset="1" stopColor="#8c7150" />
        </linearGradient>
        <clipPath id={id("inner")}>
          <path d={g.body} transform="translate(100 185) scale(0.86 0.88) translate(-100 -185)" />
        </clipPath>
        <filter id={id("shadow")} x="-30%" y="-10%" width="160%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* contact shadow */}
      <ellipse cx="100" cy="266" rx="74" ry="7" fill="#20170c" opacity="0.18" filter={`url(#${id("shadow")})`} />
      {/* liquid caustic on surface */}
      {level > 0 && <ellipse cx="112" cy="268" rx="52" ry="5" fill="#d39a48" opacity="0.18" filter={`url(#${id("shadow")})`} />}

      {/* glass body */}
      <path d={g.body} fill={`url(#${id("glass")})`} stroke="#5f574b" strokeOpacity="0.32" strokeWidth="1.2" />

      {/* liquid */}
      <g clipPath={`url(#${id("inner")})`}>
        <rect
          x="0" y={liquidTop} width="200" height={280 - liquidTop}
          fill={`url(#${id("liquid")})`}
          style={animateFill ? { transition: "y var(--t-pour) var(--ease-out), height var(--t-pour) var(--ease-out)" } : undefined}
        />
        <rect x="0" y={liquidTop} width="200" height={280 - liquidTop} fill={`url(#${id("glow")})`} style={animateFill ? { transition: "y var(--t-pour) var(--ease-out), height var(--t-pour) var(--ease-out)" } : undefined} />
        {level > 0.02 && (
          <g style={animateFill ? { transition: "transform var(--t-pour) var(--ease-out)" } : undefined} transform={`translate(0 ${liquidTop})`}>
            {/* meniscus: bright upper rim and darker curve */}
            <ellipse cx="100" cy="0" rx="90" ry="4.5" fill="#f7d9a0" opacity="0.9" />
            <path d="M8 0 Q100 6 192 0" stroke="#fff6e0" strokeWidth="1.2" fill="none" opacity="0.9" />
          </g>
        )}
      </g>

      {/* thick-glass base and inner wall */}
      <path d={g.body} fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="5" transform="translate(100 185) scale(0.93 0.94) translate(-100 -185)" />
      {g.facets?.map((d) => <path key={d} d={d} fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="1" />)}
      {g.facets?.map((d) => <path key={`s${d}`} d={d} fill="none" stroke="#5f574b" strokeOpacity="0.16" strokeWidth="0.8" transform="translate(1 1)" />)}

      {/* specular highlights */}
      <path d={g.highlight} stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.85" />
      <path d={g.highlight} stroke="#fff" strokeWidth="12" strokeLinecap="round" fill="none" opacity="0.18" />

      {/* label */}
      {showLabel && (
        <g transform={`translate(100 ${g.labelY})`}>
          <rect x="-34" y="-30" width="68" height="62" rx="2" fill="#fbfaf7" opacity="0.94" stroke="#b89972" strokeOpacity="0.55" strokeWidth="0.6" />
          <foreignObject x="-30" y="-27" width="60" height="18">
            <div style={{ display: "grid", placeItems: "center", color: "#0b0b0b" }}>
              <Emblem size={16} stroke={4} />
            </div>
          </foreignObject>
          <text x="0" y="0" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="7.4" letterSpacing="2.2" fill="#0b0b0b">SENTYAR</text>
          <text x="0" y="11" textAnchor="middle" fontFamily="var(--font-serif)" fontStyle="italic" fontSize="7" fill="#34312d">
            {(name || "Your creation").slice(0, 18)}
          </text>
          <g transform={`translate(${-((accents.length - 1) * 6) / 2} 19)`}>
            {accents.slice(0, 6).map((c, i) => (
              <circle key={i} cx={i * 6} cy="0" r="1.8" fill={c} />
            ))}
          </g>
          <text x="0" y="28" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="3.6" letterSpacing="0.8" fill="#57534d">10 ML · DEMO CONCEPT</text>
        </g>
      )}

      {/* neck + collar */}
      <rect x={g.collar.x + 3} y={g.collar.y + g.collar.h - 2} width={g.collar.w - 6} height="10" fill="#efe9df" opacity="0.7" />
      <rect x={g.collar.x} y={g.collar.y} width={g.collar.w} height={g.collar.h} rx="1.5" fill={`url(#${id("collar")})`} />
      {g.cap(`url(#${id("cap")})`)}
    </svg>
  );
}
