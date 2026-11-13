import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, Plus } from "lucide-react";
import { useApp } from "../app/store";
import { Notice } from "../components/ui";
import { ProductThumb } from "../components/ProductThumb";
import { CATEGORY_NAMES, PRODUCTS, formatInr, lineId } from "../data/catalogue";
import type { BottleVolume, Product, ProductCategory } from "../lib/types";

const CATS: ("all" | ProductCategory)[] = ["all", "kits", "accords", "refills", "bottles", "caps", "tools", "botanicals", "accessories", "packs"];
// legacy duplicates that exist only so older carts keep resolving
const HIDDEN = new Set(["kit-v1", "bottle-pebble-10", "bottle-spray-5"]);

export default function Marketplace() {
  const { creations } = useApp();
  const [params, setParams] = useSearchParams();
  const initial = params.get("cat") as ProductCategory | null;
  const [cat, setCat] = useState<(typeof CATS)[number]>(initial && CATS.includes(initial) ? initial : "all");
  const visible = PRODUCTS.filter((p) => !HIDDEN.has(p.id));
  const list = visible.filter((p) => cat === "all" || p.category === cat);
  const pick = (c: (typeof CATS)[number]) => { setCat(c); setParams(c === "all" ? {} : { cat: c }, { replace: true }); };

  return (
    <div className="container section--tight">
      <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link><span aria-hidden>/</span><span aria-current="page">Marketplace</span></nav>
      <header className="disc-headrow">
        <p className="eyebrow">Marketplace</p>
        <h1 className="disc-title">Kits, accords and <em>refills.</em></h1>
        <p className="lead">Everything to make, refill and present your creations. Pick a pack size where it is offered.</p>
      </header>
      <Notice>Prices are indicative presentation prices and the cart is a demo. No stock, delivery dates, shipping or payments are shown because none exist yet.</Notice>

      {creations.length > 0 && (
        <div className="recreate-cta card card--pad">
          <div>
            <p className="h4">Reorder from a saved creation</p>
            <p className="small body-2">Open a creation to see which accords it uses and add refills in the size you need.</p>
          </div>
          <Link to={`/creations/${creations[0].id}#reorder`} className="btn btn--secondary btn--sm">Reorder “{creations[0].name}”</Link>
        </div>
      )}

      <div className="tablist-underline" role="tablist" aria-label="Product categories" style={{ marginTop: 32 }}>
        {CATS.map((c) => (
          <button key={c} role="tab" aria-selected={cat === c} aria-controls="plist" onClick={() => pick(c)}>
            {c === "all" ? "All" : CATEGORY_NAMES[c]} <span className="muted num">{c === "all" ? visible.length : visible.filter((p) => p.category === c).length}</span>
          </button>
        ))}
      </div>

      <ul role="list" id="plist" className="product-grid">
        {list.map((p) => <ProductCard key={p.id} p={p} />)}
      </ul>
    </div>
  );
}

function ProductCard({ p }: { p: Product }) {
  const { addToCart, cart, setCartOpen, toast } = useApp();
  const [size, setSize] = useState<BottleVolume | undefined>(p.sizes?.[0].ml);
  const [added, setAdded] = useState(false);
  const id = lineId(p.id, size);
  const price = p.sizes?.find((s) => s.ml === size)?.priceInr ?? p.priceInr;
  const inCart = cart.filter((i) => i.productId.split("#")[0] === id).reduce((a, i) => a + i.qty, 0);
  const decor = p.category === "accessories";
  return (
    <li className="product card">
      <ProductThumb product={p} large />
      <div className="product__body">
        <p className="small muted">{CATEGORY_NAMES[p.category]}</p>
        <h2 className="h4">{p.name}</h2>
        <p className="small body-2">{p.description}</p>
        {p.use && <p className="small"><span className="muted">For: </span>{p.use}</p>}
        {p.category === "botanicals" && <p className="small"><span className="badge badge--botanical">Exploration only</span></p>}
        {p.status && <p className={`small ${decor || p.category === "botanicals" ? "product__warn" : "muted"}`}>{p.status}</p>}
        {p.sizes && p.sizes.length > 1 ? (
          <div className="seg seg--sm product__sizes" role="radiogroup" aria-label={`${p.name} pack size`}>
            {p.sizes.map((s) => <button key={s.ml} role="radio" aria-checked={size === s.ml} onClick={() => setSize(s.ml)}>{s.ml} ml</button>)}
          </div>
        ) : p.packSize ? <p className="small muted">{p.sizes ? `${p.sizes[0].ml} ml` : p.packSize}</p> : null}
        <div className="product__foot">
          <p><span className="price num">{formatInr(price)}</span> <span className="small muted">indicative</span></p>
          <button className="btn btn--sm" onClick={() => {
            addToCart(id); setAdded(true); window.setTimeout(() => setAdded(false), 1400);
            toast(`${p.name}${size ? `, ${size} ml` : ""} added to cart`, { action: { label: "View cart", onClick: () => setCartOpen(true) } });
          }} aria-label={`Add ${p.name}${size ? ` ${size} ml` : ""} to cart${inCart ? `, ${inCart} in cart` : ""}`}>
            {added ? <><Check size={16} aria-hidden /> Added</> : <><Plus size={16} aria-hidden /> Add</>}
          </button>
        </div>
        {inCart > 0 && <p className="small muted num">{inCart} in cart</p>}
      </div>
    </li>
  );
}
