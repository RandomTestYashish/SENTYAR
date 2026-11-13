import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Emblem } from "../components/Logo";

const MOVES = [
  { n: "I", t: "Discover", d: "Find a fragrance style you like, or explore a scent family.", to: "/discover" },
  { n: "II", t: "Learn", d: "Understand the materials, then watch Guided Making with your kit.", to: "/learn" },
  { n: "III", t: "Create", d: "Make it, personalise it, choose your bottle and cap.", to: "/studio" },
  { n: "IV", t: "Repeat", d: "Save the formula and reorder refills or a larger bottle.", to: "/marketplace" },
];

export default function About() {
  return (
    <>
      <section className="container section--tight about-head">
        <Emblem size={48} color="#a8844f" />
        <p className="eyebrow">About SENTYAR</p>
        <h1 className="disc-title">The personal <em>perfumery.</em></h1>
        <p className="lead">SENTYAR makes perfume-making approachable. Physical DIY kits are the product; this website helps you discover a scent, understand it, make it with confidence, save it and make it again.</p>
      </section>

      <section className="section section--tight" aria-labelledby="promise-h">
        <div className="container">
          <h2 id="promise-h" className="h2">Discover. Learn. <em>Create.</em> Repeat.</h2>
          <ol className="movements" role="list">
            {MOVES.map((m) => (
              <li key={m.n} className="movement">
                <span className="movement__n num">{m.n}</span>
                <h3 className="h3">{m.t}</h3>
                <p className="body-2">{m.d}</p>
                <Link to={m.to} className="link link--arrow small">Go <ArrowRight size={14} aria-hidden /></Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="who-h">
        <div className="container two-col">
          <div>
            <h2 id="who-h" className="h3">Who it’s for</h2>
            <p className="body-2" style={{ marginTop: 8 }}>People who love perfume and want to explore more, whether you know the brands but not the notes, or you have always wondered how perfume is made. Beginner confidence comes first, with depth for enthusiasts.</p>
          </div>
          <div>
            <h2 className="h3">How we keep it honest</h2>
            <ul className="ticks">
              <li>Inspired fragrances describe a scent style; we never copy a brand’s formula, bottle or logo.</li>
              <li>Real amounts come from a professionally reviewed recipe card in each kit.</li>
              <li>Raw botanicals and decorative add-ons are never presented as perfume ingredients.</li>
              <li>Prices on this prototype are indicative; checkout is a demo.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container row">
          <Link to="/brand" className="btn btn--secondary">Brand system</Link>
          <Link to="/how-it-works" className="btn btn--ghost">How the prototype works</Link>
        </div>
      </section>
    </>
  );
}
