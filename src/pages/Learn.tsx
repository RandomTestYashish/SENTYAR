import { Link } from "react-router-dom";
import { LEARN, MATERIAL_KINDS, TERMS } from "../data/learn";

export default function Learn() {
  return (
    <div className="container section--tight">
      <nav aria-label="Breadcrumb" className="crumbs"><Link to="/studio">My Studio</Link><span aria-hidden>/</span><span aria-current="page">Scent learning library</span></nav>
      <header className="disc-headrow">
        <p className="eyebrow">Scent learning library · <span lang="hi">खुशबू की पाठशाला</span></p>
        <h1 className="disc-title">Know what you’re <em>smelling.</em></h1>
        <p className="lead">Simple, visual explanations of the materials and families in SENTYAR kits. Start with Oud.</p>
      </header>

      <ul role="list" className="learn-grid">
        {LEARN.map((l) => (
          <li key={l.id}>
            <Link to={`/learn/${l.id}`} className="lcard">
              <span className="lcard__img"><img src={l.image} alt="" loading="lazy" /></span>
              <span className="lcard__body">
                <strong className="lcard__name">{l.name}</strong>
                <span className="lcard__hi" lang="hi">{l.nameHi}</span>
                <span className="small body-2">{l.oneLine}</span>
                <span className="lcard__meter" aria-label={`Intensity ${l.intensity} of 5`}>{[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= l.intensity ? "on" : ""} />)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="section--tight" aria-labelledby="kinds-h">
        <h2 id="kinds-h" className="h3">Five kinds of material. <em>Never interchangeable.</em></h2>
        <ol className="kinds">
          {MATERIAL_KINDS.map((k, n) => (
            <li key={k.id} className="kind"><span className="kind__n num">{n + 1}</span><strong>{k.name}</strong><span className="small" lang="hi">{k.nameHi}</span><span className="small muted">{k.desc}</span></li>
          ))}
        </ol>
      </section>

      <section className="section--tight" aria-labelledby="terms-h">
        <h2 id="terms-h" className="h3">Words perfumers use</h2>
        <dl className="terms">
          {TERMS.map((t) => (
            <div key={t.term} className="term"><dt>{t.term}</dt><dd lang="hi">{t.hi}</dd><dd className="small muted">{t.en}</dd></div>
          ))}
        </dl>
      </section>
    </div>
  );
}
