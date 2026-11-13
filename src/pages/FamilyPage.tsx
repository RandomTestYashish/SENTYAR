import { Link, useParams } from "react-router-dom";
import { ArrowRight, BookOpen, FlaskConical } from "lucide-react";
import { FAMILIES, INSPIRED, RECIPES, familyById } from "../data/fragrances";
import { accordById } from "../data/ingredients";
import { learnById } from "../data/learn";
import { FamilyTile, FragranceCard } from "../components/DiscoverCards";
import NotFoundish from "./NotFoundish";

export default function FamilyPage() {
  const { id = "" } = useParams();
  const fam = familyById(id);
  if (!fam) return <NotFoundish what="scent family" back="/discover#families" />;
  const frags = INSPIRED.filter((f) => f.family === fam.id);
  const recipes = RECIPES.filter((r) => r.family === fam.id || r.blend.some((e) => fam.accords.includes(e.accordId)));
  const learn = learnById(fam.learnId);

  return (
    <>
      <div className="container section--tight">
        <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link><span aria-hidden>/</span><Link to="/discover#families">Scent families</Link><span aria-hidden>/</span><span aria-current="page">{fam.name}</span></nav>
        <div className="famhead">
          <span className="famhead__img"><img src={fam.image} alt="" /></span>
          <div>
            <p className="eyebrow">Scent family</p>
            <h1 className="disc-title">{fam.name} <span className="famhead__hi" lang="hi">{fam.nameHi}</span></h1>
            <p className="lead">{fam.short}.{learn ? ` ${learn.oneLine}` : ""}</p>
            <div className="row" style={{ marginTop: 16 }}>
              {learn && <Link to={`/learn/${learn.id}`} className="btn btn--secondary btn--sm"><BookOpen size={14} aria-hidden /> Learn about {learn.name}</Link>}
              <Link to="/lab" className="btn btn--sm"><FlaskConical size={14} aria-hidden /> Create your own {fam.name.toLowerCase()} blend</Link>
            </div>
          </div>
        </div>

        <section className="section--tight" aria-labelledby="acc-h">
          <h2 id="acc-h" className="h3">Accords in this family</h2>
          <ul role="list" className="famaccords">
            {fam.accords.map((a) => (
              <li key={a}><Link to={`/ingredients/${a}`} className="famaccord"><span className="swatch" style={{ background: accordById(a).swatch }} /><strong>{accordById(a).name}</strong><span className="small muted">{accordById(a).descriptors.join(" · ")}</span></Link></li>
            ))}
          </ul>
        </section>

        {frags.length > 0 && (
          <section className="section--tight" aria-labelledby="fr-h">
            <h2 id="fr-h" className="h3">Inspired fragrances</h2>
            <ul role="list" className="fgrid fgrid--3">{frags.map((f) => <li key={f.id}><FragranceCard f={f} compact /></li>)}</ul>
          </section>
        )}

        <section className="section--tight" aria-labelledby="rc-h">
          <h2 id="rc-h" className="h3">Recipes to explore</h2>
          <ul role="list" className="rlist">
            {recipes.map((r) => <li key={r.id}><Link to={`/studio/recipes/${r.id}`} className="rrow"><strong>{r.name}</strong><span className="small muted">{r.description}</span><span className="badge">{r.difficulty}</span><ArrowRight size={14} aria-hidden /></Link></li>)}
          </ul>
        </section>

        <section className="section--tight" aria-labelledby="ot-h">
          <h2 id="ot-h" className="h3">Other families</h2>
          <ul role="list" className="famgrid famgrid--sm">{FAMILIES.filter((f) => f.id !== fam.id).map((f) => <li key={f.id}><FamilyTile fam={f} /></li>)}</ul>
        </section>
      </div>
    </>
  );
}
