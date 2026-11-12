import { Link } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";
import { useApp } from "../app/store";
import { Emblem, Wordmark } from "../components/Logo";
import { Img, SectionHead } from "../components/ui";
import { Bottle } from "../components/Bottle";
import { Vessel } from "../components/Vessel";
import { BOTANICALS, accordById } from "../data/ingredients";
import { KIT, formatInr } from "../data/catalogue";
import { DEFAULT_BLEND, computeVolumes, formatMl } from "../lib/formula";
import { TOUR } from "../features/tour/Tour";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { creations, setTourStep } = useApp();
  const nav = useNavigate();
  const latest = creations[0];
  const vols = computeVolumes(DEFAULT_BLEND);
  const startTour = () => { setTourStep(0); nav(TOUR[0].path); };

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero__grid">
          <div className="hero__copy">
            <div className="hero__mark">
              <Emblem size={44} stroke={2.2} />
              <Wordmark size="md" descriptor />
            </div>
            <h1 className="display hero__title">Craft your<br />signature scent.</h1>
            <p className="lead">
              Discover real botanical materials, understand the art of fragrance, and compose a personal scent concept —
              guided step by step, from raw ingredient to finished bottle.
            </p>
            <div className="row hero__ctas">
              <Link to="/kits/creator-kit-v1" className="btn">Explore the Kit <ArrowRight size={16} aria-hidden /></Link>
              <Link to="/lab" className="btn btn--secondary">Enter the Lab</Link>
            </div>
            <button className="link link--arrow small" onClick={startTour}><Compass size={16} aria-hidden /> New here? Take a guided tour</button>
          </div>
          <figure className="hero__media">
            <Img src="./assets/img/hero-stilllife.jpg" alt="A sculpted SENTYAR glass bottle with amber liquid and a faceted black cap, set on stone among cedarwood, a halved orange, cinnamon sticks, a rose petal and a white blossom" eager ratio="546 / 490" />
            <figcaption className="small muted">Concept still life — bottle and labelling are design direction, not a finished product.</figcaption>
          </figure>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section--white" aria-labelledby="how-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow">How it works</p>
              <h2 id="how-title" className="h2">Three movements, one creation.</h2>
            </div>
            <Link to="/how-it-works" className="link link--arrow">The full guide <ArrowRight size={16} aria-hidden /></Link>
          </div>
          <ol className="movements" role="list">
            {[
              { n: "01", t: "Discover", d: "Open the Creator Kit. Meet four real botanicals and six demo fragrance accords — and learn what separates them.", to: "/kits/creator-kit-v1/unbox", cta: "Open the kit" },
              { n: "02", t: "Experiment", d: "Follow an educational extraction simulation in the Nature Lab, then compose a blend in the Perfume Lab.", to: "/nature-lab", cta: "Visit the Nature Lab" },
              { n: "03", t: "Create", d: "Preview a fixed 10 ml concept, name it, save it and come back to refine variations.", to: "/lab", cta: "Start creating" },
            ].map((m) => (
              <li key={m.n} className="movement">
                <span className="movement__n num">{m.n}</span>
                <h3 className="h3">{m.t}</h3>
                <p className="body-2">{m.d}</p>
                <Link to={m.to} className="link link--arrow small">{m.cta} <ArrowRight size={14} aria-hidden /></Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* KIT */}
      <section className="kit-band" aria-labelledby="kit-title">
        <div className="container kit-band__grid">
          <Img src="./assets/img/kit-open.jpg" alt="The SENTYAR Creator Kit: a matte black box with amber vials, a measuring beaker, pipette, two larger bottles and an ingredients booklet, beside a black gift box tied with ribbon" className="kit-band__img" ratio="604 / 311" />
          <div className="kit-band__copy">
            <p className="eyebrow">The Creator Kit</p>
            <h2 id="kit-title" className="h2">Everything to begin, in one black box.</h2>
            <p>Six fragrance accords, four botanical exploration samples, tools and a formula journal — designed for a first, unhurried evening of discovery.</p>
            <p className="kit-band__price"><span className="num">{formatInr(KIT.priceInr)}</span> <span className="badge badge--demo" style={{ color: "var(--text-inverse-2)", background: "transparent", borderColor: "rgb(255 255 255 / .3)" }}>Prototype price</span></p>
            <div className="row">
              <Link to="/kits/creator-kit-v1" className="btn btn--light">View the kit</Link>
              <Link to="/kits/creator-kit-v1/unbox" className="btn btn--outline-light">Open it interactively</Link>
            </div>
          </div>
        </div>
      </section>

      {/* INGREDIENTS */}
      <section className="section" aria-labelledby="ing-title">
        <div className="container">
          <SectionHead eyebrow="Signature ingredients" title={<span id="ing-title">Real materials you can hold.</span>}
            lead="Peel, wood, petals and bark — inspected, smelled and understood before anything is composed. Botanicals are for exploration; accords carry the composition." />
          <ul role="list" className="ing-strip">
            {BOTANICALS.map((b) => (
              <li key={b.id}>
                <Link to={`/ingredients/${b.id}`} className="ing-tile">
                  <Img src={b.image} alt={b.imageAlt} ratio="1 / 1" />
                  <span className="ing-tile__name">{b.name.replace("Dried ", "")}</span>
                  <span className="small muted">{b.descriptors.slice(0, 2).join(" · ")}</span>
                  <span className="small ing-tile__rel">Related: {accordById(b.relatedAccord).name} accord</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="row" style={{ marginTop: 32 }}>
            <Link to="/ingredients" className="btn btn--secondary">All ten ingredients</Link>
          </div>
        </div>
      </section>

      {/* LAB */}
      <section className="section section--white" aria-labelledby="lab-title">
        <div className="container lab-teaser">
          <div className="lab-teaser__visual" aria-hidden>
            <Vessel blend={DEFAULT_BLEND} />
          </div>
          <div className="lab-teaser__copy">
            <p className="eyebrow">The Perfume Lab</p>
            <h2 id="lab-title" className="h2">Compose with proportions, not guesswork.</h2>
            <p className="lead">Choose accords and set their shares. The bottle stays at 10 ml — raising one accord changes its share, never the volume — and every recalculation is shown.</p>
            <table className="mini-formula">
              <caption className="sr-only">Example demo composition</caption>
              <tbody>
                {vols.entries.map((e) => (
                  <tr key={e.accordId}>
                    <th scope="row"><span className="swatch" style={{ background: accordById(e.accordId).swatch }} /> {accordById(e.accordId).name}</th>
                    <td className="num">{e.share}%</td>
                    <td className="num">{formatMl(e.cml)}</td>
                  </tr>
                ))}
                <tr className="mini-formula__base"><th scope="row">Demo base</th><td className="num">80% of bottle</td><td className="num">{formatMl(vols.baseCml)}</td></tr>
                <tr className="mini-formula__total"><th scope="row">Total preview</th><td /><td className="num">{formatMl(vols.totalCml)}</td></tr>
              </tbody>
            </table>
            <p className="small muted">Illustrative demo model — not a skin-use recipe.</p>
            <Link to="/lab" className="btn">Enter the Lab <ArrowRight size={16} aria-hidden /></Link>
          </div>
        </div>
      </section>

      {/* CREATIONS */}
      <section className="section" aria-labelledby="cr-title">
        <div className="container creations-teaser">
          <div>
            <p className="eyebrow">My Creations</p>
            <h2 id="cr-title" className="h2">Save it. Revisit it. Recreate it.</h2>
            <p className="lead">Every creation keeps its formula, its versions and its variations. Open one to compare, refine — or see which demo accords you would need to make it again.</p>
            <div className="row" style={{ marginTop: 24 }}>
              {latest ? (
                <Link to={`/creations/${latest.id}`} className="btn">Open “{latest.name}”</Link>
              ) : (
                <Link to="/lab" className="btn">Create your first</Link>
              )}
              <Link to="/creations" className="btn btn--secondary">My Creations</Link>
            </div>
          </div>
          <div className="creations-teaser__bottles" aria-hidden>
            <Bottle concept="atelier" fill={0.55} name="My Sunday" accents={["#D9973F", "#B9AFA3"]} />
            <Bottle concept="pebble" fill={0.72} name={latest?.name ?? "Orange Woods"} accents={(latest?.blend ?? DEFAULT_BLEND).map((e) => accordById(e.accordId).swatch)} />
            <Bottle concept="facet" fill={0.6} name="After Hours" accents={["#8A6A4E", "#8C3F25"]} />
          </div>
        </div>
      </section>
    </>
  );
}
