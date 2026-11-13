import { Link } from "react-router-dom";
import { BookOpen, FlaskConical, GraduationCap, Library, PlayCircle, ScrollText, Sparkles } from "lucide-react";
import { useApp } from "../app/store";
import { RECIPES } from "../data/fragrances";
import { BottlePhoto } from "../components/BottlePhoto";

const TILES = [
  { to: "/studio/recipes", icon: ScrollText, t: "Explore recipes", d: "Curated starting points with the kit you need.", img: "./assets/img/frag-golden-hour.jpg" },
  { to: "/lab", icon: FlaskConical, t: "Create your own", d: "Pick a family, choose accords, adjust and save.", img: "./assets/img/atelier.jpg" },
  { to: `/studio/guide/${RECIPES[0].id}`, icon: PlayCircle, t: "Guided Making", d: "A step-by-step demonstration of using your kit.", img: "./assets/img/kit-inspired.jpg" },
  { to: "/learn", icon: GraduationCap, t: "Scent learning library", d: "What is oud? What does 'base note' mean?", img: "./assets/img/family-oud.jpg" },
  { to: "/ingredients", icon: Library, t: "Ingredient library", d: "Every accord and botanical in the kits.", img: "./assets/img/family-amber.jpg" },
  { to: "/how-it-works", icon: BookOpen, t: "Tutorials and manuals", d: "How the kit, the formula and the bottle work.", img: "./assets/img/kit-open.jpg" },
];

export default function Studio() {
  const { creations } = useApp();
  return (
    <div className="container section--tight">
      <header className="disc-headrow">
        <p className="eyebrow">My Studio</p>
        <h1 className="disc-title">Explore. Learn. <em>Create.</em> Save.</h1>
        <p className="lead">Pick a recipe or start from scratch, watch how it’s made with your kit, and keep every creation here to refine or reorder.</p>
      </header>

      <section className="studio-mine" aria-labelledby="mine-h">
        <div className="section-head section-head--split">
          <h2 id="mine-h" className="h3">My creations</h2>
          <Link to="/creations" className="link link--arrow small">{creations.length ? `All ${creations.length}` : "Open"}</Link>
        </div>
        {creations.length === 0 ? (
          <div className="studio-empty">
            <Sparkles size={20} aria-hidden className="accent" />
            <p className="body-2">No creations yet. Start from a recipe or create your own; it will appear here.</p>
            <Link to="/lab" className="btn btn--sm">Create your own</Link>
          </div>
        ) : (
          <ul role="list" className="studio-cr">
            {creations.slice(0, 4).map((c) => (
              <li key={c.id}><Link to={`/creations/${c.id}`} className="studio-cr__item"><BottlePhoto concept={c.appearance.bottle} name={c.name} className="studio-cr__img" /><strong>{c.name}</strong><span className="small muted">v{c.formulaVersion}{c.bottleVolumeMl ? ` · ${c.bottleVolumeMl} ml` : ""}</span></Link></li>
            ))}
          </ul>
        )}
      </section>

      <ul role="list" className="studio-tiles">
        {TILES.map(({ to, icon: Icon, t, d, img }) => (
          <li key={t}>
            <Link to={to} className="stile">
              <span className="stile__img"><img src={img} alt="" loading="lazy" /></span>
              <span className="stile__body"><Icon size={18} aria-hidden className="accent" /><strong>{t}</strong><span className="small muted">{d}</span></span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
