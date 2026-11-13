import { Link, useNavigate, useParams } from "react-router-dom";
import { FlaskConical, PlayCircle, ShoppingBag } from "lucide-react";
import { useApp } from "../app/store";
import { INSPIRED, familyById, recipeById } from "../data/fragrances";
import { kitById } from "../data/kits";
import { accordById } from "../data/ingredients";
import { formatInr } from "../data/catalogue";
import { computeVolumes, formatMl } from "../lib/formula";
import { Notice } from "../components/ui";
import NotFoundish from "./NotFoundish";

export default function RecipePage() {
  const { id = "" } = useParams();
  const r = recipeById(id);
  const { loadBlend } = useApp();
  const nav = useNavigate();
  if (!r) return <NotFoundish what="recipe" back="/studio/recipes" />;
  const fam = familyById(r.family)!;
  const kit = kitById(r.kitId)!;
  const insp = INSPIRED.find((f) => f.recipeId === r.id);
  const vols = computeVolumes(r.blend);
  const img = insp?.image ?? fam.image;

  return (
    <div className="container section--tight">
      <nav aria-label="Breadcrumb" className="crumbs"><Link to="/studio">My Studio</Link><span aria-hidden>/</span><Link to="/studio/recipes">Recipes</Link><span aria-hidden>/</span><span aria-current="page">{r.name}</span></nav>
      <div className="fpage">
        <figure className="fpage__media"><img src={img} alt="" /></figure>
        <div className="fpage__info">
          <Link to={`/families/${fam.id}`} className="chip chip--static fpage__fam">{fam.name}</Link>
          <h1 className="fpage__name">{r.name}</h1>
          <p className="lead">{r.description}</p>
          <dl className="fpage__facts">
            <div><dt>Difficulty</dt><dd>{r.difficulty}</dd></div>
            <div><dt>Compatible kit</dt><dd><Link className="link" to={kit.id === "creator-kit-v1" ? "/kits/creator-kit-v1" : `/kits/${kit.id}`}>{kit.name}</Link> · {formatInr(kit.priceInr)}</dd></div>
            <div><dt>Suggested volume</dt><dd>{r.volumeMl} ml</dd></div>
            <div><dt>Tutorial</dt><dd>{r.tutorial ? "Guided Making in Hindi and English" : "Recipe card only"}</dd></div>
          </dl>
          <div className="row">
            <Link to={`/studio/guide/${r.id}`} className="btn"><PlayCircle size={16} aria-hidden /> Start Guided Making</Link>
            <button className="btn btn--secondary" onClick={() => { loadBlend(r.blend, r.name, r.id); nav("/lab"); }}><FlaskConical size={16} aria-hidden /> Open in Create Your Own</button>
          </div>
          {insp && <Link to={`/fragrances/${insp.id}#kit`} className="link small" style={{ marginTop: 12 }}><ShoppingBag size={13} aria-hidden /> Choose a kit for {insp.name}</Link>}
        </div>
      </div>

      <section className="section--tight" aria-labelledby="ing-h">
        <h2 id="ing-h" className="h3">Required ingredients</h2>
        <table className="formula-table" style={{ marginTop: 12 }}>
          <caption className="sr-only">Recipe ingredients, illustrative digital model</caption>
          <thead><tr><th scope="col">Accord</th><th scope="col">Share</th><th scope="col">Demo volume</th></tr></thead>
          <tbody>
            {vols.entries.map((e) => (
              <tr key={e.accordId}><th scope="row"><Link to={`/ingredients/${e.accordId}`} className="link"><span className="swatch" style={{ background: accordById(e.accordId).swatch }} /> {accordById(e.accordId).name}</Link></th><td className="num">{e.share}%</td><td className="num">{formatMl(e.cml)}</td></tr>
            ))}
          </tbody>
          <tfoot>
            <tr><th scope="row">Perfumery base</th><td /><td className="num">{formatMl(vols.baseCml)}</td></tr>
            <tr className="formula-table__total"><th scope="row">Total</th><td /><td className="num">{formatMl(vols.totalCml)}</td></tr>
          </tfoot>
        </table>
        <Notice tone="warn"><strong>Illustrative digital model.</strong> The real physical recipe, with validated amounts, is printed on the card inside your kit. Do not use these shares as a skin-use recipe.</Notice>
      </section>
    </div>
  );
}
