import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Img } from "../components/ui";
import { KIT, formatInr } from "../data/catalogue";

export default function Kits() {
  return (
    <div className="container section">
      <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link><span aria-hidden>/</span><span aria-current="page">Explore Kits</span></nav>
      <header className="page-head">
        <p className="eyebrow">Explore Kits</p>
        <h1 className="h1">Kits</h1>
        <p className="lead">Each kit is a curated starting point: real materials to explore, demo accords to compose with, and the tools to keep notes.</p>
      </header>
      <div className="kit-list">
        <article className="kit-card card">
          <Img src="./assets/img/kit-open.jpg" alt="The SENTYAR Creator Kit opened to show vials, beaker, pipette and booklet" ratio="604 / 311" />
          <div className="kit-card__body">
            <div className="row row--between">
              <h2 className="h3">{KIT.name}</h2>
              <span className="badge badge--demo">Prototype</span>
            </div>
            <p className="body-2">{KIT.description}</p>
            <ul role="list" className="kit-card__facts small">
              <li><strong>6</strong> demo fragrance accords</li>
              <li><strong>4</strong> botanical exploration samples</li>
              <li><strong>9</strong> tools &amp; learning items</li>
            </ul>
            <p className="price"><span className="num">{formatInr(KIT.priceInr)}</span> <span className="small muted">prototype / demo pricing — not a live offer</span></p>
            <div className="row">
              <Link to="/kits/creator-kit-v1" className="btn">View kit <ArrowRight size={16} aria-hidden /></Link>
              <Link to="/kits/creator-kit-v1/unbox" className="btn btn--secondary">Open interactively</Link>
            </div>
          </div>
        </article>
        <aside className="kit-list__note card card--pad">
          <p className="eyebrow">More kits</p>
          <p className="h4" style={{ marginTop: 8 }}>Only one kit exists in this prototype.</p>
          <p className="small body-2" style={{ marginTop: 8 }}>Future themed kits (for example a citrus or woods study) would appear here once their contents are validated with suppliers and a perfumer.</p>
          <Link to="/marketplace" className="link link--arrow small" style={{ marginTop: 16 }}>Browse individual demo ingredients <ArrowRight size={14} aria-hidden /></Link>
        </aside>
      </div>
    </div>
  );
}
