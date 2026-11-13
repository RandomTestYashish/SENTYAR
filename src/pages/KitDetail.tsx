import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Compass, ShoppingBag } from "lucide-react";
import { useApp } from "../app/store";
import { Img, Notice } from "../components/ui";
import { Vial } from "../components/ProductThumb";
import { ToolArt } from "../components/KitItems";
import { ACCORDS, BOTANICALS } from "../data/ingredients";
import { KIT, formatInr } from "../data/catalogue";
import { TOUR } from "../features/tour/Tour";
import { KitBuyPanel } from "../components/KitBuyPanel";

export default function KitDetail() {
  const { addToCart, setCartOpen, setTourStep, toast } = useApp();
  const nav = useNavigate();
  return (
    <>
      <section className="container section--tight">
        <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link><span aria-hidden>/</span><Link to="/kits">Explore Kits</Link><span aria-hidden>/</span><span aria-current="page">Creator Kit V1</span></nav>
        <div className="kit-hero">
          <Img src="./assets/img/kit-open.jpg" alt="The SENTYAR Creator Kit opened: six amber dropper bottles with gold collars, a gold-rimmed beaker, a pipette, a spray bottle and a booklet in an ivory linen box" className="kit-hero__img" ratio="3 / 2" eager />
          <div className="kit-hero__copy">
            <p className="eyebrow">Creator Kit · V1</p>
            <h1 className="h1">{KIT.name}</h1>
            <p className="lead">{KIT.description}</p>
            <p className="price price--lg"><span className="num">{formatInr(KIT.priceInr)}</span></p>
            <p className="small muted">Indicative presentation price. Not a confirmed live offer; the kit is not for sale yet.</p>
            <div className="row" style={{ marginTop: 24 }}>
              <Link to="/kits/creator-kit-v1/unbox" className="btn">Start unboxing <ArrowRight size={16} aria-hidden /></Link>
              <button className="btn btn--secondary" onClick={() => { addToCart("kit-v1"); toast("Creator Kit added to your demo cart", { action: { label: "View cart", onClick: () => setCartOpen(true) } }); }}><ShoppingBag size={16} aria-hidden /> Add to demo cart</button>
            </div>
            <button className="link link--arrow small" style={{ marginTop: 16 }} onClick={() => { setTourStep(0); nav(TOUR[0].path); }}><Compass size={16} aria-hidden /> Take a guided tour</button>
          </div>
        </div>
      </section>

      <section className="section section--white" aria-labelledby="box">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <p className="eyebrow">In the box</p>
              <h2 id="box" className="h2">Everything laid out</h2>
            </div>
            <Link to="/kits/creator-kit-v1/unbox" className="link link--arrow">Open it interactively <ArrowRight size={16} aria-hidden /></Link>
          </div>
          <div className="flatlay">
            <ul role="list" className="flatlay__row flatlay__row--tools">
              {(["pipettes", "blotters", "sprays", "beaker", "funnel"] as const).map((id) => {
                const t = KIT.tools.find((x) => x.id === id)!;
                return <li key={id}><figure><ToolArt id={id} label={t.name} /><figcaption>{t.name}</figcaption></figure></li>;
              })}
            </ul>
            <ul role="list" className="flatlay__row flatlay__row--oils">
              <li><figure><ToolArt id="alcohol" label="Perfumery alcohol sample, 30 ml, display only" /><figcaption>Perfumery alcohol, 30 ml<br /><span className="muted">display only</span></figcaption></figure></li>
              {ACCORDS.map((a) => (
                <li key={a.id}><Link to={`/ingredients/${a.id}`} className="flatlay__link"><figure><Vial color={a.swatch} label={a.name} /><figcaption>{a.name} accord, 5 ml</figcaption></figure></Link></li>
              ))}
            </ul>
            <ul role="list" className="flatlay__row flatlay__row--rest">
              {BOTANICALS.map((b) => (
                <li key={b.id}><Link to={`/ingredients/${b.id}`} className="flatlay__link"><figure><span className="flatlay__dish"><img src={b.image} alt={b.imageAlt} /></span><figcaption>{b.name}</figcaption></figure></Link></li>
              ))}
              {(["vials", "cards", "journal", "guide", "qr"] as const).map((id) => {
                const t = KIT.tools.find((x) => x.id === id)!;
                return <li key={id}><figure><ToolArt id={id} label={t.name} /><figcaption>{t.name}</figcaption></figure></li>;
              })}
            </ul>
          </div>
          <p className="small muted" style={{ marginTop: 16 }}>Illustrations of the illustrative kit contents. Quantities are provisional; the alcohol sample is shown as a component only, with no handling instructions.</p>
        </div>
      </section>

      <section className="section section--tight fpage__buy" aria-labelledby="buy-h">
        <div className="container container--narrow">
          <h2 id="buy-h" className="h2">Choose size and <em>bottle</em></h2>
          <KitBuyPanel kitIds={["creator-kit-v1"]} />
        </div>
      </section>

      <section className="section" aria-labelledby="inc">
        <div className="container">
          <h2 id="inc" className="h2">What is included</h2>
          <p className="lead" style={{ marginTop: 8 }}>Illustrative contents. Quantities and final contents remain provisional until supplier and perfumer validation.</p>
          <div className="included">
            <div>
              <h3 className="h4">A · Fragrance accords</h3>
              <p className="small muted">Demo composition inputs</p>
              <ul role="list" className="included__vials">
                {ACCORDS.map((a) => (
                  <li key={a.id}><Link to={`/ingredients/${a.id}`}><Vial color={a.swatch} label={a.name} small /><span>{a.name}</span></Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="h4">B · Botanical exploration samples</h3>
              <p className="small muted">For smelling and learning only</p>
              <ul role="list" className="included__bots">
                {BOTANICALS.map((b) => (
                  <li key={b.id}><Link to={`/ingredients/${b.id}`}><Img src={b.image} alt={b.imageAlt} ratio="1/1" /><span>{b.name}</span></Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="h4">C · Tools and learning material</h3>
              <p className="small muted">Supporting items</p>
              <ul role="list" className="included__tools">
                {KIT.tools.map((t) => <li key={t.id}><span className="included__toolart"><ToolArt id={t.id} /></span><span><strong>{t.name}</strong><br /><span className="small muted">{t.note}</span></span></li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--white" aria-labelledby="learn">
        <div className="container two-col">
          <div>
            <h2 id="learn" className="h2">What you will learn</h2>
            <ul role="list" className="ticks">
              <li>How a raw botanical differs from a prepared extract and from a fragrance accord.</li>
              <li>How to describe what you smell with a small, useful vocabulary.</li>
              <li>What top, heart and base associations mean, and their limits.</li>
              <li>How proportions shape a blend while the bottle volume stays fixed.</li>
              <li>Why real formulations need professional validation before skin use.</li>
            </ul>
          </div>
          <div>
            <h2 className="h2">How the experience works</h2>
            <ol className="numbered">
              <li><strong>Unbox.</strong> Open the kit and inspect each compartment.</li>
              <li><strong>Explore.</strong> Smell-reference botanicals and follow the Nature Lab simulation.</li>
              <li><strong>Compose.</strong> Select accords in the Perfume Lab and set their shares.</li>
              <li><strong>Preview &amp; save.</strong> Name your 10 ml concept and keep refining it.</li>
            </ol>
          </div>
        </div>
        <div className="container" style={{ marginTop: 48 }}>
          <Notice><strong>Prototype disclaimer.</strong> This kit is a design concept. Contents, quantities, pricing and the accords' descriptions are illustrative. Raw botanicals are for exploration only and are never added to a skin perfume. Nothing in the kit is presented as skin-safe, IFRA-compliant or stability-tested.</Notice>
        </div>
      </section>
    </>
  );
}
