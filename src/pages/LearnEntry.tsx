import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, FlaskConical, ShieldCheck } from "lucide-react";
import { LEARN, learnById } from "../data/learn";
import { accordById } from "../data/ingredients";
import { recipeById } from "../data/fragrances";
import NotFoundish from "./NotFoundish";

export default function LearnEntry() {
  const { id = "" } = useParams();
  const l = learnById(id);
  const [lang, setLang] = useState<"hi" | "en">("en");
  if (!l) return <NotFoundish what="topic" back="/learn" />;
  const others = LEARN.filter((x) => x.id !== l.id).slice(0, 4);

  return (
    <div className="container section--tight">
      <nav aria-label="Breadcrumb" className="crumbs"><Link to="/studio">My Studio</Link><span aria-hidden>/</span><Link to="/learn">Learning library</Link><span aria-hidden>/</span><span aria-current="page">{l.name}</span></nav>

      <div className="lhero">
        <span className="lhero__img"><img src={l.image} alt={l.imageAlt} /></span>
        <div className="lhero__body">
          <p className="eyebrow">{l.kind === "material" ? "Material" : "Scent family"}</p>
          <h1 className="disc-title">{l.name} <span className="famhead__hi" lang="hi">{l.nameHi}</span></h1>
          <p className="lead" lang={lang}>{lang === "hi" ? l.oneLineHi : l.oneLine}</p>
          <div className="lhero__scent">{l.scent.map((s) => <span key={s} className="chip chip--static">{s}</span>)}</div>
          <div className="lmeter">
            <span className="eyebrow">Intensity</span>
            <span className="lmeter__bar" aria-label={`Intensity ${l.intensity} of 5`}>{[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= l.intensity ? "on" : ""} />)}</span>
            <span className="small body-2">{l.intensityNote}</span>
          </div>
          <div className="seg seg--sm" role="radiogroup" aria-label="Headings language" style={{ marginTop: 12 }}>
            <button role="radio" aria-checked={lang === "en"} onClick={() => setLang("en")}>English</button>
            <button role="radio" aria-checked={lang === "hi"} onClick={() => setLang("hi")} lang="hi">हिंदी</button>
          </div>
        </div>
      </div>

      <div className="lbody">
        <div className="lsections">
          {l.sections.map((s, n) => (
            <section key={s.h} className="lsec" aria-labelledby={`ls-${n}`}>
              <span className="lsec__n num" aria-hidden>{String(n + 1).padStart(2, "0")}</span>
              <div>
                <h2 id={`ls-${n}`} className="lsec__h" lang={lang === "hi" && s.hHi ? "hi" : "en"}>{lang === "hi" && s.hHi ? s.hHi : s.h}</h2>
                <p className="body-2">{s.body}</p>
              </div>
            </section>
          ))}
          <div className="notice"><ShieldCheck size={18} aria-hidden /><span><strong>Safety and sourcing.</strong> {l.safety}</span></div>
        </div>

        <aside className="lside">
          <div className="lside__box">
            <p className="eyebrow">Related accords</p>
            <ul role="list" className="lside__list">
              {l.related.map((a) => <li key={a}><Link to={`/ingredients/${a}`} className="famaccord"><span className="swatch" style={{ background: accordById(a).swatch }} /><strong>{accordById(a).name}</strong><ArrowRight size={13} aria-hidden /></Link></li>)}
            </ul>
          </div>
          {l.recipes.length > 0 && (
            <div className="lside__box">
              <p className="eyebrow">Recipes that use it</p>
              <ul role="list" className="lside__list">
                {l.recipes.map((r) => recipeById(r) && <li key={r}><Link to={`/studio/recipes/${r}`} className="famaccord"><FlaskConical size={14} aria-hidden className="accent" /><strong>{recipeById(r)!.name}</strong><ArrowRight size={13} aria-hidden /></Link></li>)}
              </ul>
            </div>
          )}
          <details className="disclosure lside__src">
            <summary>Editorial source notes</summary>
            <div><ul>{l.sources.map((s) => <li key={s} className="small">{s}</li>)}</ul><p className="small muted">Internal notes for fact-checking before launch.</p></div>
          </details>
        </aside>
      </div>

      <section className="section--tight" aria-labelledby="more-h">
        <h2 id="more-h" className="h3">Keep exploring</h2>
        <ul role="list" className="learn-grid learn-grid--sm">
          {others.map((o) => <li key={o.id}><Link to={`/learn/${o.id}`} className="lcard"><span className="lcard__img"><img src={o.image} alt="" loading="lazy" /></span><span className="lcard__body"><strong className="lcard__name">{o.name}</strong><span className="small body-2">{o.oneLine}</span></span></Link></li>)}
        </ul>
      </section>
    </div>
  );
}
