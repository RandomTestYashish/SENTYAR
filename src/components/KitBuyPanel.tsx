// Choose a kit tier, bottle size and bottle/cap, then add to the demo cart.
// Prices are indicative presentation prices; no order or payment is taken.

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, SlidersHorizontal } from "lucide-react";
import { useApp } from "../app/store";
import { KITS, type KitId } from "../data/kits";
import { BODIES, VOLUME_EXTRA, bodyById, capLabel, configKey } from "../data/bottles";
import { formatInr, lineId } from "../data/catalogue";
import { BottleConfigurator, type BottleConfig } from "./BottleConfigurator";
import { BottlePhoto } from "./BottlePhoto";
import type { BottleVolume } from "../lib/types";

export function KitBuyPanel({ kitIds, initialKit, creationName }: { kitIds: KitId[]; initialKit?: KitId; creationName?: string }) {
  const { addToCart, toast, setCartOpen } = useApp();
  const kits = KITS.filter((k) => kitIds.includes(k.id));
  const [kitId, setKitId] = useState<KitId>(initialKit && kitIds.includes(initialKit) ? initialKit : kits[0].id);
  const kit = kits.find((k) => k.id === kitId)!;
  const firstBody = useMemo(() => BODIES.find((b) => b.volumes.some((v) => kit.sizes.includes(v)))!, [kit]);
  const [cfg, setCfg] = useState<BottleConfig>({ body: firstBody.id, cap: firstBody.defaultCap, volume: kit.sizes[0] });
  const [sheet, setSheet] = useState(false);

  const pickKit = (id: KitId) => {
    const k = kits.find((x) => x.id === id)!;
    setKitId(id);
    setCfg((c) => {
      const okBody = bodyById(c.body).volumes.some((v) => k.sizes.includes(v));
      const b = okBody ? bodyById(c.body) : BODIES.find((x) => x.volumes.some((v) => k.sizes.includes(v)))!;
      const vol = k.sizes.includes(c.volume) && b.volumes.includes(c.volume) ? c.volume : (b.volumes.find((v) => k.sizes.includes(v)) as BottleVolume);
      return { body: b.id, cap: okBody ? c.cap : b.defaultCap, volume: vol };
    });
  };
  const setVolume = (v: BottleVolume) => setCfg((c) => (bodyById(c.body).volumes.includes(v) ? { ...c, volume: v } : (() => { const b = BODIES.find((x) => x.volumes.includes(v))!; return { body: b.id, cap: b.defaultCap, volume: v }; })()));
  const price = kit.priceInr + VOLUME_EXTRA[cfg.volume];

  const add = () => {
    addToCart(lineId(`kit-${kit.id}`, cfg.volume, configKey(cfg.body, cfg.cap)));
    toast(`${kit.name}, ${cfg.volume} ml added to your demo cart`, { action: { label: "View cart", onClick: () => setCartOpen(true) } });
  };

  return (
    <div className="buy">
      <fieldset className="buy__group">
        <legend className="eyebrow">Choose a kit</legend>
        <div className="buy__kits" role="radiogroup" aria-label="Kit">
          {kits.map((k) => (
            <button key={k.id} role="radio" aria-checked={k.id === kitId} className="buy__kit" onClick={() => pickKit(k.id)}>
              <img src={k.image} alt="" />
              <span className="buy__kitname">{k.name}</span>
              <span className="small muted">{k.level} · {k.accordCount} accords</span>
              <span className="buy__price num">{formatInr(k.priceInr)}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="buy__group">
        <legend className="eyebrow">Bottle size</legend>
        <div className="seg" role="radiogroup" aria-label="Bottle size">
          {([10, 50, 100] as BottleVolume[]).map((v) => (
            <button key={v} role="radio" aria-checked={cfg.volume === v} disabled={!kit.sizes.includes(v)} onClick={() => setVolume(v)}>
              {v} ml{VOLUME_EXTRA[v] ? <span className="muted"> +{formatInr(VOLUME_EXTRA[v])}</span> : null}
            </button>
          ))}
        </div>
        {!kit.sizes.includes(100) && <p className="small muted">100 ml is available with the Advanced Creator Kit.</p>}
      </fieldset>

      <div className="buy__bottle">
        <BottlePhoto concept={cfg.body} engrave={false} className="buy__bottlethumb" />
        <div>
          <p className="buy__bottlename">{bodyById(cfg.body).name}</p>
          <p className="small muted">{capLabel(cfg.cap)} · {cfg.volume} ml</p>
        </div>
        <button className="btn btn--secondary btn--sm" onClick={() => setSheet(true)}><SlidersHorizontal size={14} aria-hidden /> Bottle and cap</button>
      </div>

      <div className="buy__foot">
        <p className="buy__total"><span className="num">{formatInr(price)}</span><span className="small muted"> indicative price</span></p>
        <button className="btn" onClick={add}><ShoppingBag size={16} aria-hidden /> Add to demo cart</button>
      </div>
      <p className="small muted">Prices are temporary presentation prices. The cart is a demo: no order or payment is taken. <Link className="link" to="/kits">Compare all kits</Link></p>

      <BottleConfigurator open={sheet} onClose={() => setSheet(false)} value={cfg} sizes={kit.sizes} name={creationName} onConfirm={setCfg} confirmLabel="Use this bottle" />
    </div>
  );
}
