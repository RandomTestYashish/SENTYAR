import { Link, useParams } from "react-router-dom";
import { Check, PlayCircle } from "lucide-react";
import { KIT_TOOL_LABEL, kitById } from "../data/kits";
import { INSPIRED, RECIPES } from "../data/fragrances";
import { accordById } from "../data/ingredients";
import { formatInr } from "../data/catalogue";
import { KitBuyPanel } from "../components/KitBuyPanel";
import { OilBottle } from "../components/KitItems";
import NotFoundish from "./NotFoundish";

export default function KitPage() {
  const { id = "" } = useParams();
  const kit = kitById(id);
  if (!kit) return <NotFoundish what="kit" back="/kits" />;
  const recipes = RECIPES.filter((r) => r.kitId === kit.id);
  const frags = INSPIRED.filter((f) => f.kits.includes(kit.id));

  return (
    <>
      <div className="container section--tight">
        <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link><span aria-hidden>/</span><Link to="/kits">Kits</Link><span aria-hidden>/</span><span aria-current="page">{kit.name}</span></nav>
        <div className="fpage">
          <figure className="fpage__media fpage__media--wide"><img src={kit.image} alt={kit.imageAlt} /></figure>
          <div className="fpage__info">
            <p className="eyebrow">{kit.level}</p>
            <h1 className="fpage__name">{kit.name}</h1>
            <p className="lead">{kit.tagline}</p>
            <p className="fpage__price"><span className="num">{formatInr(kit.priceInr)}</span> <span className="small muted">indicative presentation price</span></p>
            <dl className="fpage__facts">
              <div><dt>You will make</dt><dd>{kit.outcome}</dd></div>
              <div><dt>Bottle sizes</dt><dd>{kit.sizes.join(" ml, ")} ml</dd></div>
              <div><dt>What it adds</dt><dd>{kit.adds}</dd></div>
              <div><dt>Tutorial</dt><dd><PlayCircle size={14} aria-hidden /> Guided Making in Hindi and English, plus a printed recipe card</dd></div>
            </dl>
          </div>
        </div>
      </div>

      <section className="section section--tight" aria-labelledby="in-h">
        <div className="container">
          <h2 id="in-h" className="h3">What’s inside</h2>
          {kit.accords === "recipe" ? (
            <p className="body-2" style={{ marginTop: 8 }}>The four accords are matched to the inspired fragrance you choose, for example:</p>
          ) : null}
          <ul role="list" className="kit-accords">
            {(kit.accords === "recipe" ? RECIPES.find((r) => r.id === "azure-drift")!.blend.map((e) => e.accordId) : kit.accords).map((a) => (
              <li key={a}><OilBottle name={accordById(a).name} color={accordById(a).swatch} className="kit-accords__img" /><span>{accordById(a).name}</span></li>
            ))}
          </ul>
          <ul role="list" className="kit-tools">
            {kit.tools.map((t) => <li key={t}><Check size={14} aria-hidden /> {KIT_TOOL_LABEL[t]}</li>)}
            {kit.botanicals && <li><Check size={14} aria-hidden /> Four botanicals to smell (exploration only)</li>}
          </ul>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="buy-h">
        <div className="container container--narrow">
          <h2 id="buy-h" className="h2">Choose size and <em>bottle</em></h2>
          <KitBuyPanel kitIds={[kit.id]} />
        </div>
      </section>

      {(recipes.length > 0 || frags.length > 0) && (
        <section className="section section--tight" aria-labelledby="mk-h">
          <div className="container">
            <h2 id="mk-h" className="h3">Recipes for this kit</h2>
            <ul role="list" className="rlist">
              {recipes.map((r) => <li key={r.id}><Link to={`/studio/recipes/${r.id}`} className="rrow"><strong>{r.name}</strong><span className="small muted">{r.description}</span><span className="badge">{r.difficulty}</span></Link></li>)}
              {frags.filter((f) => !recipes.some((r) => r.id === f.recipeId)).map((f) => <li key={f.id}><Link to={`/fragrances/${f.id}`} className="rrow"><strong>{f.name}</strong><span className="small muted">{f.profile}</span><span className="badge">Inspired</span></Link></li>)}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
