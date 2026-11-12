import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";
import { Emblem, EmblemMonogram, EmblemNegative, Lockup, Wordmark } from "../components/Logo";
import { Bottle, BOTTLES } from "../components/Bottle";
import { Img } from "../components/ui";
import type { BottleConceptId } from "../lib/types";

const COLORS = [
  ["Bone", "#F8F6F2", "Canvas"], ["Linen", "#E9E4DC", "Surfaces"], ["Stone", "#C8C0B4", "Borders"],
  ["Graphite", "#34312D", "Secondary ink"], ["Ink", "#0B0B0B", "Type, CTAs, packaging"], ["Champagne", "#B89972", "Foil accent"],
];

const RATIONALE: Record<BottleConceptId, string> = {
  pebble: "Recommended. A recognisable, softly asymmetric silhouette with a flat stable base, a single parting line and a standard 15 mm neck, mouldable in two-part tooling. The faceted stone cap becomes the signature. Front plane is calm enough for a label.",
  facet: "Strong shelf presence and crisp refraction, but many planes raise mould cost, risk visible sink marks, and label placement is constrained to one face.",
  atelier: "The most manufacturable and comfortable to grip, with a stepped shoulder detail, but closest to familiar classic bottles, so less ownable.",
};

export default function Brand() {
  return (
    <>
      <div className="container section--tight">
        <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link><span aria-hidden>/</span><span aria-current="page">Brand system</span></nav>
        <header className="page-head">
          <p className="eyebrow">Brand system · design exploration</p>
          <h1 className="h1">SENTYAR identity</h1>
          <p className="lead">Working brand name and direction for this prototype. Trademark, company-name and domain clearance have not been completed, so no ® or ™ is used.</p>
        </header>
      </div>

      <section className="section--tight container" aria-labelledby="lc-h">
        <h2 id="lc-h" className="h2">Emblem concepts</h2>
        <div className="brand-grid brand-grid--3">
          <figure className="brand-tile brand-tile--selected">
            <Emblem size={120} stroke={2.2} />
            <figcaption><strong>1 · Four-petal emblem, integrated S</strong><span className="badge badge--ink"><Check size={12} aria-hidden /> Selected</span><p className="small body-2">Petal bases frame the S; its terminals reach toward the side petals so the letter reads as part of the flower.</p></figcaption>
          </figure>
          <figure className="brand-tile">
            <EmblemNegative size={120} />
            <figcaption><strong>2 · Negative-space S</strong><p className="small body-2">The S is carved from where solid petals meet. Bold at small sizes, but heavier than the quiet-luxury tone.</p></figcaption>
          </figure>
          <figure className="brand-tile">
            <EmblemMonogram size={120} />
            <figcaption><strong>3 · Monogram with leaf outline</strong><p className="small body-2">Most restrained. Elegant, but the botanical story is weaker.</p></figcaption>
          </figure>
        </div>
      </section>

      <section className="section--tight container" aria-labelledby="lk-h">
        <h2 id="lk-h" className="h2">Lockups</h2>
        <div className="brand-grid brand-grid--lockups">
          <figure className="brand-tile brand-tile--wide"><Lockup size="xl" /><figcaption className="small muted">Primary lockup · emblem + wordmark + descriptor</figcaption></figure>
          <figure className="brand-tile"><Emblem size={96} /><figcaption className="small muted">Standalone emblem</figcaption></figure>
          <figure className="brand-tile"><Wordmark size="lg" /><figcaption className="small muted">Wordmark only</figcaption></figure>
          <figure className="brand-tile brand-tile--ink"><Lockup size="md" inverse /><figcaption className="small">One-colour reversed</figcaption></figure>
          <figure className="brand-tile brand-tile--ink"><span style={{ color: "#B89972" }}><Emblem size={96} stroke={2} /></span><figcaption className="small">Champagne foil / emboss</figcaption></figure>
        </div>
        <p className="small muted" style={{ marginTop: 16 }}>Wordmark note: currently set in Cormorant Garamond with custom tracking and optical centring. A final logo should be redrawn as custom letterforms by a type designer before launch.</p>
      </section>

      <section className="section--tight container" aria-labelledby="sz-h">
        <h2 id="sz-h" className="h2">In use &amp; at size</h2>
        <div className="brand-grid brand-grid--uses">
          <figure className="brand-tile"><div className="row" style={{ alignItems: "end", gap: 24 }}><Emblem size={16} stroke={4.5} /><Emblem size={24} stroke={3.6} /><Emblem size={32} stroke={3} /></div><figcaption className="small muted">Favicon 16 / 24 / 32 px, stroke thickens at small sizes</figcaption></figure>
          <figure className="brand-tile"><div className="cap-disc"><Emblem size={56} stroke={2.6} color="#B89972" /></div><figcaption className="small muted">Bottle cap top (foil)</figcaption></figure>
          <figure className="brand-tile"><div className="label-mock"><Emblem size={28} stroke={3} /><Wordmark size="sm" /><span className="serif-italic">Orange Woods</span><span className="eyebrow" style={{ fontSize: 9 }}>10 ml · demo concept</span></div><figcaption className="small muted">Bottle label</figcaption></figure>
          <figure className="brand-tile brand-tile--ink"><div className="lid-mock"><Emblem size={44} stroke={2.2} color="#E9E4DC" /><Wordmark size="sm" /><span className="eyebrow" style={{ color: "#B9B2A7" }}>Creator kit</span></div><figcaption className="small">Kit lid</figcaption></figure>
          <figure className="brand-tile"><div className="card-mock"><span className="eyebrow">Botanical</span><span className="h4">Cedarwood</span><Emblem size={20} stroke={3.4} /></div><figcaption className="small muted">Ingredient card</figcaption></figure>
          <figure className="brand-tile"><div className="hdr-mock"><Emblem size={24} stroke={3} /><Wordmark size="sm" /></div><figcaption className="small muted">Website header</figcaption></figure>
        </div>
      </section>

      <section className="section--tight container" aria-labelledby="rules-h">
        <h2 id="rules-h" className="h2">Rules</h2>
        <div className="brand-grid brand-grid--3">
          <figure className="brand-tile"><div className="clearspace"><Emblem size={88} /></div><figcaption className="small"><strong>Clear space</strong> = one petal length on all sides.</figcaption></figure>
          <figure className="brand-tile"><div className="row" style={{ gap: 24, alignItems: "end" }}><Emblem size={16} stroke={4.5} /><Wordmark size="sm" /></div><figcaption className="small"><strong>Minimum size</strong>: emblem 16 px, wordmark 80 px wide.</figcaption></figure>
          <figure className="brand-tile"><div className="row" style={{ gap: 16 }}><span style={{ color: "#0B0B0B" }}><Emblem size={48} /></span><span style={{ color: "#B89972" }}><Emblem size={48} /></span><span className="brand-ink-dot"><Emblem size={48} color="#F8F6F2" /></span></div><figcaption className="small"><strong>Monochrome only</strong>: ink, champagne or bone.</figcaption></figure>
        </div>
        <h3 className="h4" style={{ marginTop: 32 }}>Incorrect use</h3>
        <div className="brand-grid brand-grid--4">
          <figure className="brand-tile brand-tile--wrong"><div style={{ transform: "scaleX(1.5)" }}><Emblem size={56} /></div><figcaption className="small"><X size={14} aria-hidden /> Don’t stretch</figcaption></figure>
          <figure className="brand-tile brand-tile--wrong"><span style={{ color: "#3f8a3a" }}><Emblem size={56} /></span><figcaption className="small"><X size={14} aria-hidden /> Don’t recolour green</figcaption></figure>
          <figure className="brand-tile brand-tile--wrong"><span className="wordmark wordmark--md"><span className="wordmark__name">SENTYAR<sup style={{ fontSize: "0.4em" }}>®</sup></span></span><figcaption className="small"><X size={14} aria-hidden /> Don’t add ® before registration</figcaption></figure>
          <figure className="brand-tile brand-tile--wrong"><div style={{ transform: "rotate(22deg)", filter: "drop-shadow(3px 3px 0 #d78a42)" }}><Emblem size={56} /></div><figcaption className="small"><X size={14} aria-hidden /> Don’t rotate or add effects</figcaption></figure>
        </div>
      </section>

      <section className="section section--white" aria-labelledby="bt-h">
        <div className="container">
          <h2 id="bt-h" className="h2">Signature bottle: <em>three directions</em></h2>
          <p className="lead" style={{ marginTop: 8 }}>Geometry is modular (see <code>BOTTLES</code> in <code>src/components/Bottle.tsx</code>), so the chosen silhouette can change without rebuilding pages.</p>
          <div className="brand-grid brand-grid--3" style={{ marginTop: 32 }}>
            {(Object.keys(BOTTLES) as BottleConceptId[]).map((k) => (
              <figure key={k} className={`brand-tile brand-tile--bottle ${k === "pebble" ? "brand-tile--selected" : ""}`}>
                <Bottle concept={k} fill={0.72} name="Signature" accents={["#D9973F", "#8A6A4E"]} animateFill={false} />
                <figcaption>
                  <strong>{BOTTLES[k].name}</strong> {k === "pebble" && <span className="badge badge--ink"><Check size={12} aria-hidden /> Recommended</span>}
                  <p className="small muted">{BOTTLES[k].tagline}</p>
                  <p className="small body-2">{RATIONALE[k]}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section--tight container" aria-labelledby="tk-h">
        <h2 id="tk-h" className="h2">Tokens</h2>
        <div className="swatches">
          {COLORS.map(([n, hex, use]) => (
            <div key={n} className="swatch-tile"><span style={{ background: hex }} /><strong>{n}</strong><span className="small muted num">{hex}</span><span className="small muted">{use}</span></div>
          ))}
        </div>
        <div className="type-specimen">
          <p className="display">Display: Cormorant 500</p>
          <p className="h1">Heading 1</p>
          <p className="h2">Heading 2</p>
          <p className="h3">Heading 3 <span className="serif-italic">with italic emphasis</span></p>
          <p className="lead">Lead: Inter 400, for introductions and supporting copy.</p>
          <p>Body: Inter 400 / 16 px / 1.6. Ingredient names and UI stay highly readable.</p>
          <p className="eyebrow">Label: Inter 600 · 12 px · 0.16em</p>
        </div>
        <div className="spacing-scale" aria-label="Spacing scale">
          {[4, 8, 16, 24, 32, 40, 48, 64, 80, 96, 128].map((s) => <div key={s}><span style={{ width: s, height: s }} /><span className="small num muted">{s}</span></div>)}
        </div>
      </section>

      <section className="section--tight container" aria-labelledby="ref-h">
        <h2 id="ref-h" className="h2">Reference</h2>
        <p className="body-2" style={{ marginTop: 8 }}>The approved concept board is the art-direction anchor. Photographs in this prototype are cropped from it (with the ® mark removed) and used as concept imagery, not as product photography.</p>
        <div className="brand-grid brand-grid--4" style={{ marginTop: 24 }}>
          {["tex-matte", "tex-glass", "tex-stone", "tex-foil"].map((t) => <Img key={t} src={`./assets/img/${t}.jpg`} alt={`Material texture: ${t.replace("tex-", "")}`} ratio="1/1" />)}
        </div>
        <Img src="./assets/img/emboss.jpg" alt="The S-flower emblem blind-embossed and traced in champagne foil on ivory board" ratio="268 / 311" className="emboss-img" />
      </section>
    </>
  );
}
