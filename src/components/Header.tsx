import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FlaskConical, Menu, ShoppingBag, X } from "lucide-react";
import { useApp } from "../app/store";
import { Emblem, Wordmark } from "./Logo";

/** Four primary destinations; each owns the sub-routes listed in `match`. */
const NAV = [
  { to: "/discover", label: "Discover", match: ["/discover", "/fragrances", "/families", "/kits", "/prefer"] },
  { to: "/studio", label: "Studio", match: ["/studio", "/lab", "/creations", "/learn", "/ingredients", "/how-it-works", "/nature-lab"] },
  { to: "/marketplace", label: "Marketplace", match: ["/marketplace"] },
  { to: "/about", label: "About", match: ["/about", "/brand"] },
];

export function Header() {
  const { cart, setCartOpen, draft } = useApp();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();
  const count = cart.reduce((a, i) => a + i.qty, 0);

  useEffect(() => setOpen(false), [loc.pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  const inLab = loc.pathname.startsWith("/lab");
  const hasDraft = draft.blend.length > 0;

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="container site-header__bar">
        <Link to="/" className="brand-link" aria-label="SENTYAR home">
          <Emblem size={30} stroke={3} />
          <Wordmark size="sm" />
        </Link>
        <nav aria-label="Primary" className="site-nav">
          <ul role="list">
            {NAV.map((n) => (
              <li key={n.to}><Link to={n.to} className={`nav-link ${n.match.some((m) => loc.pathname.startsWith(m)) ? "is-active" : ""}`} aria-current={n.match.some((m) => loc.pathname.startsWith(m)) ? "page" : undefined}>{n.label}</Link></li>
            ))}
          </ul>
        </nav>
        <div className="site-header__actions">
          {hasDraft && !inLab && (
            <Link to="/lab" className="btn btn--ghost btn--sm hide-sm resume-link" title="Return to your current blend">
              <FlaskConical size={16} aria-hidden /> Current blend
            </Link>
          )}
          <button className="icon-btn" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}>
            <ShoppingBag size={20} />
            {count > 0 && <span className="count-dot num" aria-hidden>{count}</span>}
          </button>
          <Link to="/lab" className="btn btn--sm header-cta">Start Creating</Link>
          <button className="icon-btn menu-btn" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      <div id="mobile-nav" className={`mobile-nav ${open ? "is-open" : ""}`} hidden={!open}>
        <nav aria-label="Mobile" className="container">
          <ul role="list">
            {NAV.map((n) => (
              <li key={n.to}><Link to={n.to} className={`mobile-link ${n.match.some((m) => loc.pathname.startsWith(m)) ? "is-active" : ""}`}>{n.label}</Link></li>
            ))}
            <li><NavLink to="/creations" className="mobile-link mobile-link--sub">My Creations</NavLink></li>
            <li><NavLink to="/kits" className="mobile-link mobile-link--sub">Compare kits</NavLink></li>
          </ul>
          <Link to="/lab" className="btn btn--block" style={{ marginTop: 24 }}>Start Creating</Link>
        </nav>
      </div>
    </header>
  );
}
