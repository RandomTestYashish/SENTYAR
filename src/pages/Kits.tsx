import { Link } from "react-router-dom";
import { KITS } from "../data/kits";
import { KitCard, KitCompare } from "../components/DiscoverCards";

export default function Kits() {
  return (
    <div className="container section--tight">
      <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link><span aria-hidden>/</span><Link to="/discover">Discover</Link><span aria-hidden>/</span><span aria-current="page">Kits</span></nav>
      <header className="disc-headrow">
        <p className="eyebrow">Discover kits</p>
        <h1 className="disc-title">Four kits. <em>One</em> way of making.</h1>
        <p className="lead">Every kit includes the perfumery base, a printed recipe card and Guided Making. Bigger kits add more accords, tools and bottle sizes.</p>
      </header>
      <ul role="list" className="kgrid">{KITS.map((k) => <li key={k.id}><KitCard k={k} /></li>)}</ul>
      <section className="section--tight" aria-labelledby="cmp-h">
        <h2 id="cmp-h" className="h3" style={{ marginBottom: 16 }}>What each kit adds</h2>
        <KitCompare />
        <p className="small muted" style={{ marginTop: 12 }}>Indicative presentation prices. Contents and prices are configurable and not yet final.</p>
      </section>
      <section className="section--tight" aria-labelledby="addon-h">
        <h2 id="addon-h" className="h3">Optional add-ons</h2>
        <p className="body-2" style={{ maxWidth: "60ch", marginTop: 6 }}>Gift boxes, trays and display pieces are sold separately in the Marketplace. They are decorative and never part of a perfume formula.</p>
        <Link to="/marketplace?cat=accessories" className="link link--arrow small" style={{ marginTop: 10 }}>Browse add-ons</Link>
      </section>
    </div>
  );
}
