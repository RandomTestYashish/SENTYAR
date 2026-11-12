// Photographic SENTYAR bottles (same set as the home carousel). The glass is
// shot clean; the emblem, wordmark and the creation's own name are engraved
// live on top, so every bottle carries identical branding.

import { useId, type CSSProperties } from "react";
import { EMBLEM_PATH } from "./Logo";
import type { BottleConceptId } from "../lib/types";

type Label = { cx: number; cy: number; w: number };
export type PhotoBottle = { id: BottleConceptId; name: string; style: string; img: string; label: Label };

export const PHOTO_BOTTLES: PhotoBottle[] = [
  { id: "pebble", name: "The Signature", style: "Cushioned crystal", img: "bclean-signature", label: { cx: 0.5, cy: 0.555, w: 0.4 } },
  { id: "orb", name: "The Orb", style: "Modern minimal", img: "bclean-orb", label: { cx: 0.5, cy: 0.615, w: 0.3 } },
  { id: "facet", name: "The Facet", style: "Architectural", img: "bclean-facet", label: { cx: 0.5, cy: 0.585, w: 0.26 } },
  { id: "fluid", name: "The Fluid", style: "Organic sculptural", img: "bclean-fluid", label: { cx: 0.505, cy: 0.615, w: 0.28 } },
  { id: "atelier", name: "The Atelier", style: "Classic sculpted", img: "bclean-atelier", label: { cx: 0.5, cy: 0.6, w: 0.3 } },
  { id: "column", name: "The Column", style: "Pure vertical", img: "bclean-column", label: { cx: 0.5, cy: 0.5, w: 0.125 } },
  { id: "pearl", name: "The Pearl", style: "Romantic", img: "bclean-pearl", label: { cx: 0.5, cy: 0.6, w: 0.34 } },
];
export const photoBottle = (id: BottleConceptId) => PHOTO_BOTTLES.find((b) => b.id === id) ?? PHOTO_BOTTLES[0];

const W = 1000, H = 1500;

export function BottlePhoto({ concept = "pebble", name, className = "", engrave = true, style }: { concept?: BottleConceptId; name?: string; className?: string; engrave?: boolean; style?: CSSProperties }) {
  const b = photoBottle(concept);
  const fid = `eng${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const lw = b.label.w * W, cx = b.label.cx * W, cy = b.label.cy * H;
  const em = lw * 0.36, fs = lw * 0.15;
  const label = (name ?? "").trim();
  const nameSize = fs * 0.78;
  const blockH = em + fs * 0.5 + fs + (label ? nameSize * 1.5 : 0);
  const top = cy - blockH / 2;
  const nameY = top + em + fs * 0.5 + fs * 1.05 + nameSize;
  // shrink long names to the label width instead of overflowing the glass
  const estName = label.length * nameSize * 0.48;
  const fitName = estName > lw ? lw : undefined;
  const wordW = fs * 7 * 0.92;

  return (
    <div className={`bphoto ${className}`} style={style} role="img" aria-label={`${b.name} bottle${label ? `, engraved “${label}”` : ""}`}>
      <img src={`./assets/img/${b.img}.webp`} alt="" draggable={false} />
      {engrave && (
        <svg viewBox={`0 0 ${W} ${H}`} className="bphoto__engrave" aria-hidden>
          <defs>
            <filter id={fid} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy={lw * 0.004} stdDeviation={lw * 0.01} floodColor="#502806" floodOpacity="0.35" />
            </filter>
          </defs>
          <g fill="rgba(255,249,236,0.94)" filter={`url(#${fid})`}>
            <path d={EMBLEM_PATH} fillRule="evenodd" transform={`translate(${cx - em / 2} ${top}) scale(${em / 100})`} />
            <text x={cx + fs * 0.15} y={top + em + fs * 0.5 + fs * 0.8} textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontWeight="500" fontSize={fs}
              letterSpacing={fs * 0.3} textLength={wordW > lw ? lw : undefined} lengthAdjust="spacingAndGlyphs">SENTYAR</text>
            {label && (
              <text key={label} className="bphoto__name" x={cx} y={nameY} textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize={nameSize}
                textLength={fitName} lengthAdjust="spacingAndGlyphs">{label}</text>
            )}
          </g>
        </svg>
      )}
    </div>
  );
}
