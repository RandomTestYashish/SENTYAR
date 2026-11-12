import type { Product } from "../lib/types";
import { accordById } from "../data/ingredients";
import { Img } from "./ui";
import { Emblem } from "./Logo";
import { Bottle } from "./Bottle";

/** Product visual: photo where we have one, otherwise a drawn vial/tool tile. */
export function ProductThumb({ product, large }: { product: Product; large?: boolean }) {
  const cls = `pthumb ${large ? "pthumb--lg" : ""}`;
  if (product.image) return <Img src={product.image} alt={product.imageAlt} className={cls} />;
  if (product.accordId) {
    const a = accordById(product.accordId);
    return (
      <div className={`${cls} pthumb--draw`} role="img" aria-label={product.imageAlt}>
        <Vial color={a.swatch} label={a.name} />
      </div>
    );
  }
  if (product.category === "bottles") {
    return (
      <div className={`${cls} pthumb--draw`} role="img" aria-label={product.imageAlt}>
        <Bottle fill={0} showLabel={false} className="pthumb__bottle" title={product.imageAlt} />
      </div>
    );
  }
  return (
    <div className={`${cls} pthumb--draw pthumb--tool`} role="img" aria-label={product.imageAlt}>
      <Emblem size={large ? 56 : 28} stroke={2.6} />
      <span>{product.name}</span>
    </div>
  );
}

export function Vial({ color, label, fill = 0.7, small }: { color: string; label?: string; fill?: number; small?: boolean }) {
  const top = 34 + (1 - fill) * 70;
  return (
    <svg viewBox="0 0 60 120" className={`vial-svg ${small ? "vial-svg--sm" : ""}`} aria-hidden>
      <rect x="18" y="4" width="24" height="22" rx="2" fill="#141312" />
      <rect x="20" y="6" width="4" height="18" rx="1" fill="#fff" opacity="0.14" />
      <rect x="16" y="24" width="28" height="6" fill="#b89972" />
      <path d="M14 30 H46 V108 C46 113 42 116 37 116 H23 C18 116 14 113 14 108 Z" fill="#fff" fillOpacity="0.55" stroke="#5f574b" strokeOpacity="0.35" />
      <clipPath id={`vc-${color.slice(1)}`}><path d="M17 33 H43 V107 C43 111 40 113 36 113 H24 C20 113 17 111 17 107 Z" /></clipPath>
      <g clipPath={`url(#vc-${color.slice(1)})`}>
        <rect x="10" y={top} width="40" height="90" fill={color} opacity="0.85" />
        <rect x="10" y={top} width="40" height="2" fill="#fff" opacity="0.5" />
      </g>
      <rect x="19" y="56" width="22" height="26" fill="#fbfaf7" />
      {label && <text x="30" y="72" textAnchor="middle" fontSize="6" fontFamily="var(--font-serif)" fill="#0b0b0b">{label.slice(0, 7)}</text>}
      <path d="M18 36 V104" stroke="#fff" strokeWidth="2" opacity="0.7" strokeLinecap="round" />
    </svg>
  );
}
