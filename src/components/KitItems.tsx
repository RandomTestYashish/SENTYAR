// Drawn kit objects (original SVG, SENTYAR style): pipette, blotters, spray
// bottle, measuring beaker, funnel, perfumery alcohol sample, accord oil
// bottle, mixing vial, cards, journal, guide, QR card.
// All share one light source (upper left) and the same glass treatment.

import type { ReactNode } from "react";
import { Emblem } from "./Logo";

const GLASS = "#ffffff";
const EDGE = "#5f574b";

function Svg({ children, label, vb = "0 0 100 160", className = "kit-svg" }: { children: ReactNode; label?: string; vb?: string; className?: string }) {
  return (
    <svg viewBox={vb} className={className} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {children}
    </svg>
  );
}

export function Pipette({ label }: { label?: string }) {
  return (
    <Svg label={label}>
      <rect x="42" y="6" width="16" height="30" rx="8" fill={GLASS} fillOpacity="0.7" stroke={EDGE} strokeOpacity="0.4" />
      <path d="M44 36 H56 V128 L51 152 H49 L44 128 Z" fill={GLASS} fillOpacity="0.6" stroke={EDGE} strokeOpacity="0.4" />
      {[60, 76, 92, 108].map((y, i) => (
        <g key={y}>
          <line x1="44" x2={i % 2 ? 49 : 52} y1={y} y2={y} stroke={EDGE} strokeOpacity="0.7" />
          {i % 2 === 0 && <text x="58" y={y + 3} fontSize="7" fontFamily="var(--font-sans)" fill={EDGE}>{3 - i / 2}ml</text>}
        </g>
      ))}
      <path d="M46 40 V124" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function Blotters({ label }: { label?: string }) {
  return (
    <Svg label={label} vb="0 0 120 160">
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${12 + i * 18} ${8 + (i % 2) * 4}) rotate(${-6 + i * 3} 10 70)`}>
          <path d="M0 0 H18 V136 L9 146 L0 136 Z" fill="#fff" stroke="#c8c0b4" />
        </g>
      ))}
    </Svg>
  );
}

export function SprayBottle({ label, ml = 10 }: { label?: string; ml?: number }) {
  return (
    <Svg label={label} vb="0 0 100 160">
      <rect x="38" y="6" width="24" height="10" rx="2" fill="#141312" />
      <rect x="36" y="16" width="28" height="22" rx="2" fill="url(#ks-gold)" />
      <defs>
        <linearGradient id="ks-gold" x1="0" x2="1"><stop offset="0" stopColor="#8c7150" /><stop offset="0.45" stopColor="#e3cfae" /><stop offset="1" stopColor="#8c7150" /></linearGradient>
        <linearGradient id="ks-glass" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.95" /><stop offset="0.5" stopColor="#f3efe8" stopOpacity="0.5" /><stop offset="1" stopColor="#d8d0c4" stopOpacity="0.8" /></linearGradient>
      </defs>
      <rect x="16" y="38" width="68" height="112" rx="6" fill="url(#ks-glass)" stroke={EDGE} strokeOpacity="0.4" />
      <rect x="20" y="132" width="60" height="14" rx="3" fill="#fff" stroke={EDGE} strokeOpacity="0.2" />
      <line x1="50" y1="38" x2="50" y2="138" stroke={EDGE} strokeOpacity="0.35" />
      <path d="M24 46 V126" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <text x="50" y="96" textAnchor="middle" fontSize="6.5" fontFamily="var(--font-sans)" fill={EDGE} letterSpacing="1">{ml} ML · EMPTY</text>
    </Svg>
  );
}

export function Beaker({ label }: { label?: string }) {
  return (
    <Svg label={label} vb="0 0 100 160">
      <path d="M22 30 H76 L80 24 H84 L78 34 V140 C78 146 74 150 68 150 H32 C26 150 22 146 22 140 Z" fill={GLASS} fillOpacity="0.55" stroke={EDGE} strokeOpacity="0.45" />
      {[2, 4, 6, 8, 10].map((v) => {
        const y = 140 - v * 10;
        return (
          <g key={v}>
            <line x1="56" x2="66" y1={y} y2={y} stroke={EDGE} strokeOpacity="0.7" />
            <text x="69" y={y + 2.5} fontSize="7" fontFamily="var(--font-sans)" fill={EDGE}>{v === 10 ? "10ml" : v}</text>
          </g>
        );
      })}
      <path d="M28 40 V138" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    </Svg>
  );
}

export function Funnel({ label }: { label?: string }) {
  return (
    <Svg label={label} vb="0 0 100 160">
      <path d="M20 60 H80 L62 98 V130 H38 V98 Z" fill="#f4f1ec" stroke="#c8c0b4" />
      <ellipse cx="50" cy="60" rx="30" ry="7" fill="#fbfaf7" stroke="#c8c0b4" />
      <ellipse cx="50" cy="60" rx="10" ry="3" fill="#e2ddd4" />
      <path d="M38 102 H62" stroke="#c8c0b4" />
    </Svg>
  );
}

export function AlcoholBottle({ label }: { label?: string }) {
  return (
    <Svg label={label} vb="0 0 100 160">
      <rect x="34" y="8" width="32" height="24" rx="3" fill="#fbfaf7" stroke="#c8c0b4" />
      <rect x="30" y="30" width="40" height="8" rx="2" fill="#efebe4" stroke="#c8c0b4" />
      <path d="M22 44 C22 38 26 36 32 36 H68 C74 36 78 38 78 44 V146 C78 150 76 152 72 152 H28 C24 152 22 150 22 146 Z" fill={GLASS} fillOpacity="0.6" stroke={EDGE} strokeOpacity="0.4" />
      <rect x="26" y="60" width="48" height="84" fill="#fff" />
      <text x="50" y="76" textAnchor="middle" fontSize="6.4" fontFamily="var(--font-sans)" fontWeight="600" fill="#0b0b0b" letterSpacing="0.6">PERFUMERY</text>
      <text x="50" y="85" textAnchor="middle" fontSize="6.4" fontFamily="var(--font-sans)" fontWeight="600" fill="#0b0b0b" letterSpacing="0.6">ALCOHOL</text>
      <text x="50" y="104" textAnchor="middle" fontSize="5.6" fontFamily="var(--font-sans)" fill="#57534d">demo component</text>
      <text x="50" y="112" textAnchor="middle" fontSize="5.6" fontFamily="var(--font-sans)" fill="#57534d">display only</text>
      <line x1="34" x2="66" y1="124" y2="124" stroke="#b89972" />
      <text x="50" y="136" textAnchor="middle" fontSize="6.4" fontFamily="var(--font-sans)" fill="#0b0b0b">30 ml</text>
      <path d="M25 46 V142" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}

/** Amber accord bottle with black cap and SENTYAR label — the kit's accord vials. */
export function OilBottle({ name, color, ml = 5, label, className = "kit-svg" }: { name: string; color: string; ml?: number; label?: string; className?: string }) {
  const id = `ob-${name.replace(/\W/g, "")}`;
  return (
    <Svg label={label} vb="0 0 100 160" className={className}>
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          <stop offset="0" stopColor="#7a4a1c" />
          <stop offset="0.35" stopColor="#b5732e" />
          <stop offset="0.7" stopColor="#6a3c14" />
          <stop offset="1" stopColor="#3f230b" />
        </linearGradient>
      </defs>
      <rect x="30" y="6" width="40" height="34" rx="3" fill="#141312" />
      {[12, 18, 24, 30].map((y) => <line key={y} x1="30" x2="70" y1={y} y2={y} stroke="#fff" strokeOpacity="0.08" />)}
      <rect x="33" y="8" width="5" height="30" rx="2" fill="#fff" opacity="0.12" />
      <path d="M34 40 H66 V46 C80 50 84 56 84 64 V146 C84 150 81 152 77 152 H23 C19 152 16 150 16 146 V64 C16 56 20 50 34 46 Z" fill={`url(#${id})`} />
      <rect x="20" y="70" width="60" height="70" fill="#fbfaf7" />
      <rect x="20" y="70" width="60" height="4" fill={color} />
      <g transform="translate(50 86)"><foreignObject x="-6" y="-6" width="12" height="12"><div style={{ color: "#0b0b0b", display: "grid", placeItems: "center" }}><Emblem size={11} stroke={5} /></div></foreignObject></g>
      <text x="50" y="104" textAnchor="middle" fontSize="10.5" fontFamily="var(--font-serif)" fontWeight="600" fill="#0b0b0b">{name}</text>
      <text x="50" y="114" textAnchor="middle" fontSize="5" fontFamily="var(--font-sans)" fill="#57534d" letterSpacing="0.8">DEMO ACCORD</text>
      <line x1="34" x2="66" y1="122" y2="122" stroke={color} strokeWidth="1.2" />
      <text x="50" y="133" textAnchor="middle" fontSize="7" fontFamily="var(--font-sans)" fill="#0b0b0b">{ml} ml</text>
      <path d="M21 58 V66 M21 142 V146" stroke="#fff" strokeOpacity="0.5" strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

export function MixingVials({ label }: { label?: string }) {
  return (
    <Svg label={label} vb="0 0 120 160">
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${14 + i * 32} 20)`}>
          <rect x="4" y="0" width="20" height="16" rx="2" fill="#141312" />
          <path d="M2 16 H26 V124 C26 130 22 132 18 132 H10 C6 132 2 130 2 124 Z" fill={GLASS} fillOpacity="0.6" stroke={EDGE} strokeOpacity="0.4" />
          <path d="M6 22 V120" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ))}
    </Svg>
  );
}

export function PaperItem({ kind, label }: { kind: "cards" | "journal" | "guide" | "qr"; label?: string }) {
  if (kind === "journal") {
    return (
      <Svg label={label} vb="0 0 120 160">
        <rect x="18" y="14" width="86" height="132" rx="3" fill="#e9e4dc" stroke="#c8c0b4" />
        <rect x="18" y="14" width="10" height="132" fill="#d8d0c4" />
        <g transform="translate(62 64)"><foreignObject x="-12" y="-12" width="24" height="24"><div style={{ display: "grid", placeItems: "center", color: "#8c7150" }}><Emblem size={22} stroke={3} /></div></foreignObject></g>
        <text x="62" y="98" textAnchor="middle" fontSize="8" fontFamily="var(--font-serif)" fill="#34312d" letterSpacing="1.5">FORMULA</text>
        <text x="62" y="108" textAnchor="middle" fontSize="8" fontFamily="var(--font-serif)" fill="#34312d" letterSpacing="1.5">JOURNAL</text>
      </Svg>
    );
  }
  if (kind === "qr") {
    const cells = [0, 1, 2, 3, 4, 5, 6].flatMap((r) => [0, 1, 2, 3, 4, 5, 6].map((c) => ({ r, c, on: (r * 3 + c * 5 + r * c) % 3 === 0 || (r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2) })));
    return (
      <Svg label={label} vb="0 0 120 160">
        <rect x="16" y="20" width="88" height="120" rx="4" fill="#fbfaf7" stroke="#c8c0b4" />
        {cells.filter((x) => x.on).map(({ r, c }) => <rect key={`${r}-${c}`} x={32 + c * 8} y={36 + r * 8} width="8" height="8" fill="#0b0b0b" />)}
        <text x="60" y="114" textAnchor="middle" fontSize="7" fontFamily="var(--font-sans)" fill="#34312d" letterSpacing="1">SCAN FOR</text>
        <text x="60" y="124" textAnchor="middle" fontSize="7" fontFamily="var(--font-sans)" fill="#34312d" letterSpacing="1">TUTORIAL</text>
      </Svg>
    );
  }
  const title = kind === "cards" ? "CEDARWOOD" : "SAFETY";
  const sub = kind === "cards" ? "botanical" : "& handling";
  return (
    <Svg label={label} vb="0 0 120 160">
      {kind === "cards" && <rect x="30" y="16" width="70" height="104" rx="3" fill="#f1eee8" stroke="#c8c0b4" transform="rotate(8 65 68)" />}
      <rect x="22" y="26" width="70" height="104" rx="3" fill="#fbfaf7" stroke="#c8c0b4" />
      <text x="57" y="62" textAnchor="middle" fontSize="7" fontFamily="var(--font-sans)" fill="#0b0b0b" letterSpacing="1.4">{title}</text>
      <text x="57" y="74" textAnchor="middle" fontSize="8" fontFamily="var(--font-serif)" fontStyle="italic" fill="#57534d">{sub}</text>
      <line x1="38" x2="76" y1="88" y2="88" stroke="#b89972" />
      {[96, 102, 108].map((y) => <line key={y} x1="34" x2="80" y1={y} y2={y} stroke="#c8c0b4" />)}
    </Svg>
  );
}

/** Map a kit tool id to its drawing. */
export function ToolArt({ id, label }: { id: string; label?: string }) {
  switch (id) {
    case "vials": return <MixingVials label={label} />;
    case "pipettes": return <Pipette label={label} />;
    case "blotters": return <Blotters label={label} />;
    case "sprays": return <SprayBottle label={label} />;
    case "beaker": return <Beaker label={label} />;
    case "funnel": return <Funnel label={label} />;
    case "alcohol": return <AlcoholBottle label={label} />;
    case "cards": return <PaperItem kind="cards" label={label} />;
    case "journal": return <PaperItem kind="journal" label={label} />;
    case "guide": return <PaperItem kind="guide" label={label} />;
    case "qr": return <PaperItem kind="qr" label={label} />;
    default: return null;
  }
}
