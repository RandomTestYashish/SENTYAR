import { Link } from "react-router-dom";
import { useApp } from "../app/store";
import { Emblem, Wordmark } from "./Logo";

const COLS: { h: string; links: { to?: string; label: string; tour?: boolean }[] }[] = [
  { h: "Discover", links: [
    { to: "/discover#inspired", label: "Inspired fragrances" },
    { to: "/discover#families", label: "Scent families" },
    { to: "/kits", label: "Compare kits" },
    { to: "/prefer", label: "Taste quiz" },
  ] },
  { h: "Studio", links: [
    { to: "/studio/recipes", label: "Recipes" },
    { to: "/lab", label: "Create your own" },
    { to: "/studio/guide/azure-drift", label: "Guided Making" },
    { to: "/creations", label: "My Creations" },
    { to: "/learn", label: "Learning library" },
  ] },
  { h: "Marketplace", links: [
    { to: "/marketplace?cat=kits", label: "Kits" },
    { to: "/marketplace?cat=accords", label: "Accords" },
    { to: "/marketplace?cat=refills", label: "Refills" },
    { to: "/marketplace?cat=bottles", label: "Bottles and caps" },
  ] },
  { h: "About", links: [
    { to: "/about", label: "Our story" },
    { to: "/how-it-works", label: "How it works" },
    { label: "Guided tour", tour: true },
    { to: "/brand", label: "Brand system" },
  ] },
];

export function Footer() {
  const { setTourStep } = useApp();
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="ft">
          <div className="ft__brand">
            <Link to="/" className="ft__logo" aria-label="SENTYAR home">
              <Emblem size={40} color="#a8844f" />
              <Wordmark size="md" descriptor />
            </Link>
            <p className="small ft__tag">Discover. Learn. Create. Repeat.</p>
          </div>
          <nav aria-label="Footer" className="ft__cols">
            {COLS.map((c) => (
              <div key={c.h} className="ft__col">
                <p className="ft__h">{c.h}</p>
                <ul role="list">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      {l.tour ? <button className="footer-btn" onClick={() => setTourStep(0)}>{l.label}</button> : <Link to={l.to!}>{l.label}</Link>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="ft__bar">
          <p className="small">© 2026 SENTYAR · Prototype</p>
          <details className="ft__legal">
            <summary className="small">Prototype notice</summary>
            <p className="small">
              SENTYAR is a design prototype. Ingredients, prices, formula values and the extraction simulation are illustrative demo data.
              Nothing here is a skin-use recipe, a validated formulation or a live offer, and no orders or payments are taken. Commercial
              formulations require validation by a qualified perfumer and relevant specialists. Concept bottles are design direction, not
              finished products. SENTYAR is a working brand name; trademark and name clearance has not been completed.
            </p>
          </details>
        </div>
      </div>
    </footer>
  );
}
