import type { Product } from "../lib/types";
import { accordById } from "../data/ingredients";
import { Img } from "./ui";
import { Emblem } from "./Logo";
import { Bottle } from "./Bottle";
import { OilBottle, SprayBottle, ToolArt } from "./KitItems";

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
        {product.id.startsWith("bottle-spray") ? <SprayBottle ml={5} /> : <Bottle fill={0} showLabel={false} className="pthumb__bottle" title={product.imageAlt} />}
      </div>
    );
  }
  if (product.art) {
    return (
      <div className={`${cls} pthumb--draw`} role="img" aria-label={product.imageAlt}>
        <ToolArt id={product.art} />
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

/** Accord vial, amber 5 ml bottle with SENTYAR label (see KitItems). */
export function Vial({ color, label, small }: { color: string; label?: string; fill?: number; small?: boolean }) {
  return <OilBottle name={label ?? ""} color={color} className={`vial-svg ${small ? "vial-svg--sm" : ""}`} />;
}
