import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Plus } from "lucide-react";
import { useApp } from "../app/store";
import { Notice } from "../components/ui";
import { ProductThumb } from "../components/ProductThumb";
import { CATEGORY_NAMES, PRODUCTS, formatInr } from "../data/catalogue";
import type { ProductCategory } from "../lib/types";

const CATS: ("all" | ProductCategory)[] = ["all", "accords", "botanicals", "tools", "bottles", "packs"];

export default function Marketplace() {
  const { addToCart, cart, setCartOpen, toast, creations } = useApp();
  const [cat, setCat] = useState<(typeof CATS)[number]>("all");
  const [added, setAdded] = useState<string | null>(null);
  const list = PRODUCTS.filter((p) => cat === "all" || p.category === cat);

  return (
    <div className="container section--tight">
      <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link><span aria-hidden>/</span><span aria-current="page">Ingredient Marketplace</span></nav>
      <header className="page-head page-head--row">
        <div>
          <p className="eyebrow">Ingredient marketplace · prototype</p>
          <h1 className="h1">Materials &amp; tools</h1>
          <p className="lead">Demo catalogue for exploring how a marketplace would connect to your creations. Prices are illustrative; nothing can be ordered.</p>
        </div>
      </header>
      <Notice>All products, pack sizes and INR prices are demo data. No stock, delivery dates or shipping are shown because none exist.</Notice>

      {creations.length > 0 && (
        <div className="recreate-cta card card--pad">
          <div>
            <p className="h4">Recreate a saved formula</p>
            <p className="small body-2">Open a creation to see exactly which demo accords it uses and add them in one step.</p>
          </div>
          <Link to={`/creations/${creations[0].id}`} className="btn btn--secondary btn--sm">Recreate “{creations[0].name}”</Link>
        </div>
      )}

      <div className="tablist-underline" role="tablist" aria-label="Product categories" style={{ marginTop: 32 }}>
        {CATS.map((c) => (
          <button key={c} role="tab" aria-selected={cat === c} aria-controls="plist" onClick={() => setCat(c)}>
            {c === "all" ? "All" : CATEGORY_NAMES[c]} <span className="muted num">{c === "all" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === c).length}</span>
          </button>
        ))}
      </div>

      <ul role="list" id="plist" className="product-grid">
        {list.map((p) => {
          const inCart = cart.find((i) => i.productId === p.id)?.qty ?? 0;
          return (
            <li key={p.id} className="product card">
              <ProductThumb product={p} large />
              <div className="product__body">
                <p className="small muted">{CATEGORY_NAMES[p.category]}</p>
                <h2 className="h4">{p.name}</h2>
                {p.packSize && <p className="small muted">{p.packSize}</p>}
                <p className="small body-2">{p.description}</p>
                {p.category === "botanicals" && <p className="small"><span className="badge badge--botanical">Exploration only</span></p>}
                <div className="product__foot">
                  <p><span className="price num">{formatInr(p.priceInr)}</span> <span className="small muted">demo price</span></p>
                  <button className={`btn btn--sm ${added === p.id ? "is-added" : ""}`} onClick={() => {
                    addToCart(p.id); setAdded(p.id); window.setTimeout(() => setAdded((a) => (a === p.id ? null : a)), 1400);
                    toast(`${p.name} added to cart`, { action: { label: "View cart", onClick: () => setCartOpen(true) } });
                  }} aria-label={`Add ${p.name} to cart${inCart ? `, ${inCart} in cart` : ""}`}>
                    {added === p.id ? <><Check size={16} aria-hidden /> Added</> : <><Plus size={16} aria-hidden /> Add</>}
                  </button>
                </div>
                {inCart > 0 && <p className="small muted num">{inCart} in cart</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
