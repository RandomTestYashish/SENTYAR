import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useApp } from "../app/store";
import { formatInr, productById } from "../data/catalogue";
import { Dialog, Notice } from "./ui";
import { ProductThumb } from "./ProductThumb";

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, setQty, removeFromCart, clearCart } = useApp();
  const lines = cart.map((i) => ({ ...i, product: productById(i.productId) })).filter((l) => l.product);
  const subtotal = lines.reduce((a, l) => a + l.qty * l.product!.priceInr, 0);
  const close = () => setCartOpen(false);

  return (
    <Dialog open={cartOpen} onClose={close} title={`Your demo cart${lines.length ? ` (${lines.reduce((a, l) => a + l.qty, 0)})` : ""}`} variant="drawer"
      footer={lines.length ? (
        <div className="cart-foot">
          <div className="row row--between"><span>Subtotal</span><strong className="num">{formatInr(subtotal)}</strong></div>
          <p className="small muted">Demo prices only. No order is placed and no payment is collected in this prototype. Shipping and availability are not modelled.</p>
          <div className="row">
            <button className="btn btn--secondary btn--sm" onClick={clearCart}>Clear cart</button>
            <Link to="/marketplace" className="btn btn--sm" onClick={close}>Continue browsing</Link>
          </div>
        </div>
      ) : undefined}>
      {lines.length === 0 ? (
        <div className="empty" style={{ padding: "48px 8px" }}>
          <span className="empty-icon"><ShoppingBag size={22} aria-hidden /></span>
          <h3 className="h3">Your cart is empty</h3>
          <p>Browse demo accords, botanical samples and tools, or open a saved creation to see what it would take to recreate it.</p>
          <Link to="/marketplace" className="btn btn--sm" onClick={close}>Browse the marketplace</Link>
        </div>
      ) : (
        <>
          <Notice>Prototype cart, items are saved on this device only.</Notice>
          <ul role="list" className="cart-lines">
            {lines.map(({ product: p, qty }) => (
              <li key={p!.id} className="cart-line">
                <ProductThumb product={p!} />
                <div className="cart-line__info">
                  <p className="cart-line__name">{p!.name}</p>
                  <p className="small muted">{p!.packSize} · <span className="num">{formatInr(p!.priceInr)}</span> demo</p>
                  <div className="qty" role="group" aria-label={`Quantity for ${p!.name}`}>
                    <button className="icon-btn icon-btn--sm" onClick={() => setQty(p!.id, qty - 1)} aria-label={`Decrease ${p!.name} quantity`} disabled={qty <= 1}><Minus size={14} /></button>
                    <span className="num" aria-live="polite">{qty}</span>
                    <button className="icon-btn icon-btn--sm" onClick={() => setQty(p!.id, qty + 1)} aria-label={`Increase ${p!.name} quantity`} disabled={qty >= 20}><Plus size={14} /></button>
                  </div>
                </div>
                <div className="cart-line__end">
                  <strong className="num">{formatInr(qty * p!.priceInr)}</strong>
                  <button className="icon-btn icon-btn--sm" onClick={() => removeFromCart(p!.id)} aria-label={`Remove ${p!.name} from cart`}><Trash2 size={16} /></button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Dialog>
  );
}
