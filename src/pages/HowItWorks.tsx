import { Link, useNavigate } from "react-router-dom";
import { Compass } from "lucide-react";
import { useApp } from "../app/store";
import { GlossaryList, HelpList } from "../components/Glossary";
import { Notice } from "../components/ui";
import { NATURE_DISCLAIMER } from "../data/learning";
import { TOUR } from "../features/tour/Tour";

export default function HowItWorks() {
  const { setTourStep, setFlag } = useApp();
  const nav = useNavigate();
  return (
    <>
      <div className="container section--tight">
        <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link><span aria-hidden>/</span><span aria-current="page">How It Works</span></nav>
        <header className="page-head page-head--row">
          <div>
            <p className="eyebrow">How it works</p>
            <h1 className="h1">From raw ingredient to a scent concept that’s yours.</h1>
          </div>
          <div className="row">
            <button className="btn" onClick={() => { setTourStep(0); nav(TOUR[0].path); }}><Compass size={16} aria-hidden /> Replay the guided tour</button>
            <button className="btn btn--secondary" onClick={() => setFlag("welcomeSeen", false)}>Show welcome again</button>
          </div>
        </header>
        <ol className="flow" role="list">
          {[
            ["Discover", "Open the Creator Kit. Inspect botanicals — real peel, wood, petals and bark — and meet six demo fragrance accords.", "/kits/creator-kit-v1/unbox"],
            ["Learn", "Follow guided ingredient journeys and the Nature Lab simulation to understand the difference between a botanical, an extract and an accord.", "/ingredients"],
            ["Compose", "In the Perfume Lab, select accords and set their shares. The blend always totals 100% and the bottle always stays 10 ml.", "/lab"],
            ["Create", "Preview, name and save your concept. Edit it into new versions, branch variations and compare them.", "/creations"],
            ["Recreate", "Open a saved formula to see which demo accords and amounts it uses, and add them to a demo cart.", "/marketplace"],
          ].map(([t, d, to], i) => (
            <li key={t} className="flow__item">
              <span className="flow__n num">0{i + 1}</span>
              <div><h2 className="h3">{t}</h2><p className="body-2">{d}</p><Link className="link small" to={to}>Go there</Link></div>
            </li>
          ))}
        </ol>
      </div>

      <section className="section section--white" aria-labelledby="fe-h">
        <div className="container two-col">
          <div>
            <h2 id="fe-h" className="h2">The formula engine</h2>
            <div className="prose body-2" style={{ marginTop: 16 }}>
              <p>The preview is always <strong>10 ml</strong>. In this illustrative model, 20% (2 ml) is the fragrance blend and 80% (8 ml) a demo base.</p>
              <p>Accord shares are whole percentages of the blend, always summing to 100%. Because 1% = 0.02 ml, every volume is exact to two decimals; totals never drift to 9.99 or 10.01 ml.</p>
              <p><strong>Proportional mode</strong> rescales the other accords whenever you change one, and lists exactly what moved. <strong>Manual mode</strong> changes only the accord you touch; you then rebalance before previewing.</p>
              <p>This is a UI demonstration model, not a safe or universally suitable perfume recipe.</p>
            </div>
          </div>
          <div>
            <table className="formula-table">
              <caption className="eyebrow">Worked example</caption>
              <thead><tr><th scope="col">Item</th><th scope="col">Share</th><th scope="col">Volume</th></tr></thead>
              <tbody>
                <tr><th scope="row">Woody</th><td className="num">50%</td><td className="num">1.00 ml</td></tr>
                <tr><th scope="row">Citrus</th><td className="num">30%</td><td className="num">0.60 ml</td></tr>
                <tr><th scope="row">Musk</th><td className="num">20%</td><td className="num">0.40 ml</td></tr>
              </tbody>
              <tfoot>
                <tr><th scope="row">Fragrance blend</th><td className="num">100%</td><td className="num">2.00 ml</td></tr>
                <tr><th scope="row">Demo base</th><td /><td className="num">8.00 ml</td></tr>
                <tr className="formula-table__total"><th scope="row">Total</th><td /><td className="num">10.00 ml</td></tr>
              </tfoot>
            </table>
            <p className="small muted" style={{ marginTop: 8 }}>Raise Woody to 70% in Proportional mode → Citrus 18%, Musk 12% (0.36 / 0.24 ml). Total still 10.00 ml.</p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-h">
        <div className="container two-col">
          <div>
            <h2 id="faq-h" className="h2">Questions</h2>
            <div style={{ marginTop: 16 }}><HelpList /></div>
          </div>
          <div>
            <h2 className="h2">Glossary</h2>
            <div style={{ marginTop: 16 }}><GlossaryList compact /></div>
          </div>
        </div>
      </section>

      <section id="safety" className="section section--sunken" aria-labelledby="safe-h">
        <div className="container container--narrow">
          <h2 id="safe-h" className="h2">Safety and prototype boundaries</h2>
          <div className="stack" style={{ marginTop: 24, ["--stack" as string]: "12px" }}>
            <Notice tone="warn"><strong>Botanicals are exploration-only.</strong> Raw plant materials are for looking, touching and smelling. They are never added to the formula and never applied to skin.</Notice>
            <Notice tone="warn"><strong>Extraction is a simulation.</strong> {NATURE_DISCLAIMER}</Notice>
            <Notice tone="warn"><strong>No unsafe instructions.</strong> SENTYAR gives no heating, flame, burning or alcohol-handling instructions, and no extraction ratios or times.</Notice>
            <Notice tone="warn"><strong>Demo formulas are not recipes.</strong> Nothing here is presented as skin-safe, IFRA-compliant, stability-tested, long-lasting or commercially ready. A qualified perfumer and relevant specialists must validate any real formulation.</Notice>
            <Notice><strong>Demo data.</strong> Ingredients, accords, pairings, prices and kit contents are illustrative. Pairing labels are creative suggestions, not chemical compatibility data.</Notice>
          </div>
        </div>
      </section>
    </>
  );
}
