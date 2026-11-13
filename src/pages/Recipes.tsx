import { useState } from "react";
import { Link } from "react-router-dom";
import { PlayCircle } from "lucide-react";
import { FAMILIES, INSPIRED, RECIPES, familyById, type FamilyId } from "../data/fragrances";
import { kitById } from "../data/kits";
import { accordById } from "../data/ingredients";

export default function Recipes() {
  const [fam, setFam] = useState<FamilyId | "all">("all");
  const list = RECIPES.filter((r) => fam === "all" || r.family === fam);
  return (
    <div className="container section--tight">
      <nav aria-label="Breadcrumb" className="crumbs"><Link to="/studio">My Studio</Link><span aria-hidden>/</span><span aria-current="page">Recipes</span></nav>
      <header className="disc-headrow">
        <p className="eyebrow">Explore recipes</p>
        <h1 className="disc-title">Guided <em>starting points.</em></h1>
        <p className="lead">Each recipe names the kit it needs. Shares shown are an illustrative digital model; the physical amounts are on the recipe card in your kit.</p>
      </header>
      <div className="chips-row" role="group" aria-label="Filter by family">
        <button className="chip" aria-pressed={fam === "all"} onClick={() => setFam("all")}>All</button>
        {FAMILIES.filter((f) => RECIPES.some((r) => r.family === f.id)).map((f) => <button key={f.id} className="chip" aria-pressed={fam === f.id} onClick={() => setFam(f.id)}>{f.name}</button>)}
      </div>
      <ul role="list" className="recipe-grid">
        {list.map((r) => {
          const img = INSPIRED.find((f) => f.recipeId === r.id)?.image ?? familyById(r.family)!.image;
          return (
            <li key={r.id}>
              <Link to={`/studio/recipes/${r.id}`} className="rcard">
                <span className="rcard__img"><img src={img} alt="" loading="lazy" /></span>
                <span className="rcard__body">
                  <span className="rcard__top"><span className="small accent-text">{familyById(r.family)!.name}</span><span className="badge">{r.difficulty}</span></span>
                  <strong className="rcard__name">{r.name}</strong>
                  <span className="small body-2">{r.description}</span>
                  <span className="rcard__bar" aria-hidden>{r.blend.map((e) => <span key={e.accordId} style={{ flex: e.share, background: accordById(e.accordId).swatch }} />)}</span>
                  <span className="small muted">{r.blend.map((e) => accordById(e.accordId).name).join(" · ")}</span>
                  <span className="rcard__foot small"><span>{kitById(r.kitId)!.name} · {r.volumeMl} ml</span>{r.tutorial && <span className="accent-text"><PlayCircle size={13} aria-hidden /> Tutorial</span>}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
