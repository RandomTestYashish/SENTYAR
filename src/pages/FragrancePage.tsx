import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowRight, BookOpen, PlayCircle } from "lucide-react";
import { familyById, inspiredById, recipeById, INSPIRED } from "../data/fragrances";
import { accordById } from "../data/ingredients";
import { Intensity, FragranceCard } from "../components/DiscoverCards";
import { KitBuyPanel } from "../components/KitBuyPanel";
import NotFoundish from "./NotFoundish";

export default function FragrancePage() {
  const { id = "" } = useParams();
  const f = inspiredById(id);
  const loc = useLocation();
  useEffect(() => { if (loc.hash === "#kit") window.setTimeout(() => document.getElementById("kit")?.scrollIntoView({ behavior: "smooth" }), 200); }, [loc.hash, id]);
  if (!f) return <NotFoundish what="fragrance" back="/discover" />;
  const fam = familyById(f.family)!;
  const recipe = recipeById(f.recipeId)!;

  return (
    <>
      <div className="container section--tight">
        <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link><span aria-hidden>/</span><Link to="/discover">Discover</Link><span aria-hidden>/</span><span aria-current="page">{f.name}</span></nav>
        <div className="fpage">
          <figure className="fpage__media"><img src={f.image} alt={f.imageAlt} /></figure>
          <div className="fpage__info">
            <Link to={`/families/${fam.id}`} className="chip chip--static fpage__fam">{fam.name} · <span lang="hi">{fam.nameHi}</span></Link>
            <h1 className="fpage__name">{f.name}</h1>
            {f.inspiration && <p className="fpage__insp">{f.inspiration}. <span className="muted">Inspiration only; not the original product, formula or brand.</span></p>}
            <p className="lead">{f.profile}</p>
            <dl className="fpage__facts">
              <div><dt>Intensity</dt><dd><Intensity level={f.intensity} /><span className="small muted">{f.intensityNote}</span></dd></div>
              <div><dt>What you will make</dt><dd>{f.makes}</dd></div>
              <div><dt>Included accords</dt><dd className="fpage__accords">{recipe.blend.map((e) => (
                <Link key={e.accordId} to={`/ingredients/${e.accordId}`} className="fpage__accord"><span className="swatch" style={{ background: accordById(e.accordId).swatch }} />{accordById(e.accordId).name}</Link>
              ))}</dd></div>
            </dl>
            <div className="row">
              <Link to={`/studio/recipes/${recipe.id}`} className="btn btn--secondary btn--sm"><BookOpen size={14} aria-hidden /> Explore recipe</Link>
              <Link to={`/studio/guide/${recipe.id}`} className="btn btn--ghost btn--sm"><PlayCircle size={14} aria-hidden /> Watch how it’s made</Link>
            </div>
          </div>
        </div>
      </div>

      <section id="kit" className="section section--tight fpage__buy" aria-labelledby="kit-h">
        <div className="container container--narrow">
          <p className="eyebrow">Make it yourself</p>
          <h2 id="kit-h" className="h2">Choose your <em>kit</em></h2>
          <KitBuyPanel kitIds={f.kits} creationName={f.name} />
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="more-h">
        <div className="container">
          <div className="section-head section-head--split"><h2 id="more-h" className="h3">More inspired fragrances</h2><Link to="/discover#inspired" className="link link--arrow small">See all <ArrowRight size={14} aria-hidden /></Link></div>
          <ul role="list" className="fgrid fgrid--3">{INSPIRED.filter((x) => x.id !== f.id).slice(0, 3).map((x) => <li key={x.id}><FragranceCard f={x} compact /></li>)}</ul>
        </div>
      </section>
    </>
  );
}
