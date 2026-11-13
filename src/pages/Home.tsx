import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useApp } from "../app/store";
import { Emblem } from "../components/Logo";
import { HeroCarousel } from "../features/hero/HeroCarousel";
import { FragranceCard, KitCard } from "../components/DiscoverCards";
import { INSPIRED } from "../data/fragrances";
import { KITS } from "../data/kits";
import { Img, SectionHead } from "../components/ui";
import { BOTANICALS, accordById } from "../data/ingredients";
import { TOUR } from "../features/tour/Tour";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { creations, setTourStep } = useApp();
  const nav = useNavigate();
  const latest = creations[0];
  const startTour = () => { setTourStep(0); nav(TOUR[0].path); };

  return (
    <>
      {/* HERO */}
      <HeroCarousel />
      <section className="hero hero--facts" aria-label="At a glance">
        <div className="container">
          <div className="hero-facts">
            <div><strong className="num">10 ml</strong><span>Fixed bottle</span></div>
            <div><strong className="num">4</strong><span>Kits from ₹399</span></div>
            <div><strong className="num">10</strong><span>Fragrance accords</span></div>
            <div><strong className="num">9</strong><span>Scent families</span></div>
          </div>
          <div className="hero-after">
            <p className="small muted">Concept bottles. Silhouettes and labelling are design direction, not finished products.</p>
            <div className="hero-after__links">
              <button className="link small" onClick={startTour}>New here? Take a guided tour</button>
              <Link to="/prefer" className="link small">Find your taste in 10 picks</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="ribbon" aria-hidden>
        <div className="ribbon__track">
          {[0, 1].map((k) => (
            <span key={k}>
              {["Oud", "Aquatic", "Orange peel", "Cedarwood", "Rose", "Amber", "Vanilla", "Aromatic", "Musk", "Cinnamon"].map((w) => <span key={w}>{w}</span>)}
            </span>
          ))}
        </div>
      </div>

      {/* DISCOVER */}
      <section className="section section--white" aria-labelledby="disc-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow">Discover fragrances</p>
              <h2 id="disc-title" className="h2">Start from a scent you <em>already love.</em></h2>
            </div>
            <Link to="/discover" className="link link--arrow">Everything to discover <ArrowRight size={16} aria-hidden /></Link>
          </div>
          <nav className="disc-jump" aria-label="Ways to discover">
            <Link to="/discover#inspired" className="disc-jump__item"><img src="./assets/img/frag-sable-storm.jpg" alt="" /><span><strong>Inspired by iconic fragrances</strong><span className="small muted">Familiar styles, original SENTYAR recipes</span></span></Link>
            <Link to="/discover#families" className="disc-jump__item"><img src="./assets/img/family-amber.jpg" alt="" /><span><strong>Explore scent families</strong><span className="small muted">Fresh, aquatic, woody, oud, amber…</span></span></Link>
            <Link to="/lab" className="disc-jump__item"><img src="./assets/img/atelier.jpg" alt="" /><span><strong>Create your own</strong><span className="small muted">Build a blend, step by step</span></span></Link>
          </nav>
          <ul role="list" className="fgrid home-fgrid">{INSPIRED.slice(0, 4).map((f) => <li key={f.id}><FragranceCard f={f} compact /></li>)}</ul>
        </div>
      </section>

      {/* KITS */}
      <section className="section" aria-labelledby="kit-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow">Choose your kit</p>
              <h2 id="kit-title" className="h2">From a ₹399 first try to the <em>full studio.</em></h2>
            </div>
            <Link to="/kits" className="link link--arrow">Compare kits <ArrowRight size={16} aria-hidden /></Link>
          </div>
          <ul role="list" className="kgrid">{KITS.map((k) => <li key={k.id}><KitCard k={k} /></li>)}</ul>
          <p className="small muted" style={{ marginTop: 12 }}>Indicative presentation prices.</p>
        </div>
      </section>

      {/* INGREDIENTS */}
      <section className="section" aria-labelledby="ing-title">
        <div className="container">
          <SectionHead eyebrow="Signature ingredients" title={<span id="ing-title">Real materials <em>you can hold.</em></span>}
            lead="Peel, wood, petals and bark: inspected, smelled and understood before anything is composed. Botanicals are for exploration; accords carry the composition." />
          <ul role="list" className="ing-strip">
            {BOTANICALS.map((b) => (
              <li key={b.id}>
                <Link to={`/ingredients/${b.id}`} className="ing-tile">
                  <Img src={b.image} alt={b.imageAlt} ratio="1 / 1" />
                  <span className="ing-tile__name">{b.name.replace("Dried r", "R").replace("Dried o", "O")}</span>
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

      {/* LEARN TO MAKE IT */}
      <section className="section section--white" aria-labelledby="lab-title">
        <div className="container lab-teaser">
          <figure className="lab-teaser__photo">
            <Img src="./assets/img/atelier.jpg" alt="A perfumer's white marble worktable: a pipette releases a drop of golden oil into a gold-rimmed beaker among amber dropper bottles, blotters and dried rose petals" ratio="3 / 2" />
          </figure>
          <div className="lab-teaser__copy">
            <p className="eyebrow">Learn how to make it</p>
            <h2 id="lab-title" className="h2">Follow along, <em>step by step.</em></h2>
            <p className="lead">Guided Making shows which vial to pick, how to use the dropper, when to add the base and how to bottle it, in Hindi or English.</p>
            <ul className="ticks">
              <li>Animated demonstration with chapters, pause and replay</li>
              <li>Subtitles and optional narration</li>
              <li>"I am stuck" help on every step</li>
            </ul>
            <div className="row">
              <Link to={`/studio/guide/${INSPIRED[0].recipeId}`} className="btn">Watch Guided Making <ArrowRight size={16} aria-hidden /></Link>
              <Link to="/learn/oud" className="link small">What is oud?</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CREATIONS */}
      <section className="section" aria-labelledby="cr-title">
        <div className="container creations-teaser">
          <div>
            <p className="eyebrow">My Creations</p>
            <h2 id="cr-title" className="h2">Save it. Revisit it. <em>Recreate it.</em></h2>
            <p className="lead">Every creation keeps its formula, its versions and its variations. Open one to compare, refine, or see which demo accords you would need to make it again.</p>
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
            <img src="./assets/img/bottle-atelier.jpg" alt="" loading="lazy" />
            <img src="./assets/img/bottle-orb.jpg" alt="" loading="lazy" />
            <img src="./assets/img/bottle-facet.jpg" alt="" loading="lazy" />
          </div>
        </div>
      </section>

      {/* PREFER */}
      <section className="section section--white" aria-labelledby="pf-title">
        <div className="container container--narrow">
          <div className="prefer-cta">
            <Emblem size={44} stroke={2.2} color="#a8844f" />
            <p className="eyebrow">Prefer</p>
            <h2 id="pf-title" className="h2">Not sure where to <em>begin?</em></h2>
            <p className="lead">Ten quick picks between materials, bottles and moods. We read your taste and load a suggested blend straight into the Lab.</p>
            <Link to="/prefer" className="btn">Start the taste quiz <ArrowRight size={16} aria-hidden /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
