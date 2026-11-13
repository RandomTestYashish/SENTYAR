import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Trash2 } from "lucide-react";
import { useApp } from "../app/store";
import { Img } from "../components/ui";
import { Vial } from "../components/ProductThumb";
import { GlossaryList } from "../components/Glossary";
import { ACCORDS, BOTANICALS, CATEGORY_EXPLAIN, CATEGORY_LABEL, ROLE_LABEL, botanicalById, ingredientById } from "../data/ingredients";

export default function Ingredients() {
  const { notes, deleteNote } = useApp();
  return (
    <>
      <div className="container section--tight">
        <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link><span aria-hidden>/</span><span aria-current="page">Ingredients</span></nav>
        <header className="page-head">
          <p className="eyebrow">Ingredient library</p>
          <h1 className="h1">Ten ingredients, two kinds.</h1>
          <p className="lead">Botanicals are raw materials you explore with your senses. Accords are composed impressions you blend in the lab. Each has a guided, eight-step learning journey.</p>
        </header>
      </div>

      <section className="container section--tight" aria-labelledby="bot-h">
        <div className="cat-head">
          <span className="badge badge--botanical"><Leaf size={12} aria-hidden /> {CATEGORY_LABEL.botanical}</span>
          <h2 id="bot-h" className="h2">Botanical exploration materials</h2>
          <p className="body-2">{CATEGORY_EXPLAIN.botanical}</p>
        </div>
        <ul role="list" className="ing-grid">
          {BOTANICALS.map((b) => (
            <li key={b.id}>
              <Link to={`/ingredients/${b.id}`} className="ing-card card card-link">
                <Img src={b.image} alt={b.imageAlt} ratio="4 / 3" />
                <div className="ing-card__body">
                  <p className="h4">{b.name}</p>
                  <p className="small muted">{b.materialType}{b.botanicalName ? ` · ${b.botanicalName}` : ""}</p>
                  <p className="small body-2">{b.descriptors.join(" · ")}</p>
                  <p className="small"><span className="muted">Formula:</span> No, exploration only</p>
                  <span className="link link--arrow small">Start learning <ArrowRight size={14} aria-hidden /></span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container section--tight" aria-labelledby="acc-h">
        <div className="cat-head">
          <span className="badge badge--accord">{CATEGORY_LABEL.accord}</span>
          <h2 id="acc-h" className="h2">Fragrance accords</h2>
          <p className="body-2">{CATEGORY_EXPLAIN.accord}</p>
        </div>
        <ul role="list" className="ing-grid ing-grid--3">
          {ACCORDS.map((a) => (
            <li key={a.id}>
              <Link to={`/ingredients/${a.id}`} className="ing-card ing-card--accord card card-link">
                <div className="ing-card__vial"><Vial color={a.swatch} label={a.name} /></div>
                <div className="ing-card__body">
                  <p className="h4">{a.name}</p>
                  <p className="small muted">{a.family} · {ROLE_LABEL[a.role]} (illustrative)</p>
                  <p className="small body-2">{a.profile}</p>
                  <p className="small"><span className="muted">Formula:</span> Yes, demo input{a.relatedBotanical && <> · Related botanical: {botanicalById(a.relatedBotanical).name}</>}</p>
                  <span className="link link--arrow small">Start learning <ArrowRight size={14} aria-hidden /></span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container section--tight" aria-labelledby="ext-h">
        <div className="card card--pad extract-note">
          <span className="badge badge--warn">{CATEGORY_LABEL.extract}</span>
          <h2 id="ext-h" className="h3" style={{ marginTop: 12 }}>And extracts?</h2>
          <p className="body-2">An extract is what an extraction process produces from a botanical. SENTYAR shows extraction only as an educational simulation in the <Link className="link" to="/nature-lab">Nature Lab</Link>. No extract here is approved for skin use.</p>
        </div>
      </section>

      <section className="section section--white" aria-labelledby="disc-h">
        <div className="container two-col">
          <div>
            <h2 id="disc-h" className="h2">Your discoveries</h2>
            <p className="body-2" style={{ marginTop: 8 }}>Notes saved from ingredient journeys and the Nature Lab. They are kept separately from your formulas.</p>
            {notes.length === 0 ? (
              <div className="empty" style={{ padding: "40px 0", justifyItems: "start", textAlign: "left" }}>
                <p className="h4">No discovery notes yet</p>
                <p>Finish a guided ingredient journey or a Nature Lab experiment and save what you noticed.</p>
                <Link to="/ingredients/orange-peel" className="btn btn--sm">Start with orange peel</Link>
              </div>
            ) : (
              <ul role="list" className="notes">
                {notes.map((n) => {
                  const ing = ingredientById(n.ingredientId);
                  return (
                    <li key={n.id} className="note">
                      <div>
                        <p className="note__title">{ing?.name ?? n.ingredientId} <span className="small muted">· {n.source === "nature-lab" ? "Nature Lab" : "Ingredient journey"} · {new Date(n.createdAt).toLocaleDateString()}</span></p>
                        {n.descriptors.length > 0 && <p className="small">{n.descriptors.join(", ")}</p>}
                        {n.text && <p className="small body-2">“{n.text}”</p>}
                      </div>
                      <button className="icon-btn icon-btn--sm" onClick={() => deleteNote(n.id)} aria-label={`Delete note about ${ing?.name ?? "ingredient"}`}><Trash2 size={16} /></button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div>
            <h2 className="h2">Glossary</h2>
            <div style={{ marginTop: 16 }}><GlossaryList compact /></div>
          </div>
        </div>
      </section>
    </>
  );
}
