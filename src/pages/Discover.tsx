import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { FAMILIES, INSPIRED } from "../data/fragrances";
import { KITS } from "../data/kits";
import { FamilyTile, FragranceCard, KitCard, KitCompare } from "../components/DiscoverCards";

export default function Discover() {
  return (
    <>
      <section className="container disc-head">
        <p className="eyebrow">Discover</p>
        <h1 className="disc-title">Find a scent you <em>love</em>, then learn to make it.</h1>
        <nav className="disc-jump" aria-label="Ways to discover">
          <a href="#inspired" className="disc-jump__item"><img src="./assets/img/frag-azure-drift.jpg" alt="" /><span><strong>Inspired fragrances</strong><span className="small muted">Start from a style you know</span></span></a>
          <a href="#families" className="disc-jump__item"><img src="./assets/img/family-oud.jpg" alt="" /><span><strong>Scent families</strong><span className="small muted">Fresh, woody, oud and more</span></span></a>
          <Link to="/lab" className="disc-jump__item"><img src="./assets/img/atelier.jpg" alt="" /><span><strong>Create your own</strong><span className="small muted">Build a blend step by step</span></span></Link>
        </nav>
      </section>

      <section id="inspired" className="section section--tight" aria-labelledby="insp-h">
        <div className="container">
          <div className="section-head section-head--split">
            <div><p className="eyebrow">Inspired by iconic fragrances</p><h2 id="insp-h" className="h2">Familiar styles, <em>your</em> bottle.</h2></div>
            <p className="small muted disc-legal">Original SENTYAR recipes inspired by a scent style. Not the original products, formulas or brands.</p>
          </div>
          <ul role="list" className="fgrid">{INSPIRED.map((f) => <li key={f.id}><FragranceCard f={f} /></li>)}</ul>
        </div>
      </section>

      <section id="families" className="section section--tight" aria-labelledby="fam-h">
        <div className="container">
          <div className="section-head"><p className="eyebrow">Explore scent families</p><h2 id="fam-h" className="h2">What do you <em>like</em> to smell?</h2></div>
          <ul role="list" className="famgrid">{FAMILIES.map((f) => <li key={f.id}><FamilyTile fam={f} /></li>)}</ul>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="kits-h">
        <div className="container">
          <div className="section-head section-head--split">
            <div><p className="eyebrow">Discover kits</p><h2 id="kits-h" className="h2">Start small, or go <em>all in.</em></h2></div>
            <Link to="/kits" className="link link--arrow">Compare in detail <ArrowRight size={16} aria-hidden /></Link>
          </div>
          <ul role="list" className="kgrid">{KITS.map((k) => <li key={k.id}><KitCard k={k} /></li>)}</ul>
          <div className="disc-compare"><KitCompare /></div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container container--narrow">
          <div className="prefer-cta">
            <Sparkles size={28} aria-hidden className="accent" />
            <h2 className="h2">Not sure? <em>Take 10 picks.</em></h2>
            <p className="lead">Choose between materials, bottles and moods, and we suggest a blend to start from.</p>
            <Link to="/prefer" className="btn">Start the taste quiz <ArrowRight size={16} aria-hidden /></Link>
          </div>
        </div>
      </section>
    </>
  );
}
