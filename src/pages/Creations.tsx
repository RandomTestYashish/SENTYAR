import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Columns2, Copy, CopyPlus, FlaskConical, Pencil, Trash2, X } from "lucide-react";
import { useApp } from "../app/store";
import { Bottle } from "../components/Bottle";
import { ConfirmDialog, Notice } from "../components/ui";
import { accordById } from "../data/ingredients";
import { compareBlends } from "../lib/formula";
import { scentProfile, PROFILE_MIN_CREATIONS } from "../lib/profile";
import type { Creation } from "../lib/types";

export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });

export default function Creations() {
  const { creations, loadIntoLab, duplicateCreation, deleteCreation, toast } = useApp();
  const nav = useNavigate();
  const [compare, setCompare] = useState<string[]>([]);
  const [confirmDel, setConfirmDel] = useState<Creation | null>(null);
  const profile = scentProfile(creations);
  const toggleCompare = (id: string) => setCompare((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id].slice(-2)));
  const A = creations.find((c) => c.id === compare[0]);
  const B = creations.find((c) => c.id === compare[1]);

  return (
    <div className="container section--tight">
      <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link><span aria-hidden>/</span><span aria-current="page">My Creations</span></nav>
      <header className="page-head page-head--row">
        <div>
          <p className="eyebrow">My Creations</p>
          <h1 className="h1">Your scent library</h1>
          <p className="lead">Saved on this device. Open one to see its versions, compare variations or recreate it.</p>
        </div>
        <Link to="/lab" className="btn"><FlaskConical size={16} aria-hidden /> New creation</Link>
      </header>

      {creations.length === 0 ? (
        <div className="empty card">
          <span className="empty-icon"><FlaskConical size={22} aria-hidden /></span>
          <h2 className="h3">No creations yet</h2>
          <p>Compose a blend in the Perfume Lab, preview it and save it — it will appear here and stay after a refresh.</p>
          <div className="row" style={{ justifyContent: "center" }}>
            <Link to="/lab" className="btn">Enter the Lab</Link>
            <Link to="/kits/creator-kit-v1/unbox" className="btn btn--secondary">Open the kit first</Link>
          </div>
        </div>
      ) : (
        <>
          <p className="small muted" style={{ marginBottom: 16 }}><Columns2 size={14} aria-hidden style={{ display: "inline", verticalAlign: "-2px" }} /> Select two creations to compare them.</p>
          <ul role="list" className="creation-grid">
            {creations.map((c) => {
              const parent = c.parentId ? creations.find((x) => x.id === c.parentId) : undefined;
              const picked = compare.includes(c.id);
              return (
                <li key={c.id} className={`creation card ${picked ? "is-picked" : ""}`}>
                  <Link to={`/creations/${c.id}`} className="creation__visual" aria-label={`Open ${c.name}`}>
                    <Bottle concept={c.appearance.bottle} fill={0.82} name={c.name} accents={c.blend.map((e) => accordById(e.accordId).swatch)} animateFill={false} />
                  </Link>
                  <div className="creation__body">
                    <h2 className="h4"><Link to={`/creations/${c.id}`} className="creation__title">{c.name}</Link></h2>
                    <p className="small muted">v{c.formulaVersion} · updated {fmtDate(c.updatedAt)}{parent ? <> · variation of “{parent.name}”</> : null}</p>
                    <div className="blend-bar" aria-label={c.blend.map((e) => `${accordById(e.accordId).name} ${e.share}%`).join(", ")} role="img">
                      {c.blend.map((e) => <span key={e.accordId} style={{ width: `${e.share}%`, background: accordById(e.accordId).swatch }} />)}
                    </div>
                    <p className="small">{c.blend.map((e) => `${accordById(e.accordId).name} ${e.share}%`).join(" · ")}</p>
                    <div className="creation__actions">
                      <button className="btn btn--secondary btn--xs" onClick={() => { loadIntoLab(c, "edit"); nav("/lab"); }}><Pencil size={14} aria-hidden /> Edit</button>
                      <button className="btn btn--secondary btn--xs" onClick={() => { loadIntoLab(c, "variation"); nav("/lab"); }}><CopyPlus size={14} aria-hidden /> Variation</button>
                      <button className="btn btn--ghost btn--xs" onClick={() => { const d = duplicateCreation(c.id); if (d) toast(`Duplicated as “${d.name}”`); }}><Copy size={14} aria-hidden /> Duplicate</button>
                      <label className="compare-check btn btn--ghost btn--xs">
                        <input type="checkbox" checked={picked} onChange={() => toggleCompare(c.id)} /> Compare
                      </label>
                      <button className="icon-btn icon-btn--sm" onClick={() => setConfirmDel(c)} aria-label={`Delete ${c.name}`}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {compare.length > 0 && (
            <section className="compare card card--pad" aria-labelledby="cmp-h" aria-live="polite">
              <div className="row row--between">
                <h2 id="cmp-h" className="h3">Compare</h2>
                <button className="btn btn--ghost btn--sm" onClick={() => setCompare([])}><X size={16} aria-hidden /> Clear</button>
              </div>
              {A && B ? <Comparison a={A} b={B} /> : <p className="body-2">Select one more creation to compare with “{A?.name}”.</p>}
            </section>
          )}
        </>
      )}

      <section className="section--tight profile" aria-labelledby="prof-h">
        <h2 id="prof-h" className="h2">Your scent profile</h2>
        <p className="body-2" style={{ marginTop: 8 }}>Based only on your own saved demo formulas — patterns, not personality.</p>
        {!profile.enough ? (
          <div className="card card--pad" style={{ marginTop: 16 }}>
            <p className="h4">Create a few fragrances to discover your pattern</p>
            <p className="small body-2">Save at least {PROFILE_MIN_CREATIONS} creations and this section will show your most-used accords and frequent pairings.</p>
          </div>
        ) : (
          <div className="profile__grid">
            <div className="card card--pad">
              <p className="eyebrow">Most-used accords</p>
              <ul role="list" className="bars">
                {profile.families.map((f) => (
                  <li key={f.accordId}>
                    <span className="bars__label">{accordById(f.accordId).name}</span>
                    <span className="bars__track"><span style={{ width: `${f.weight}%`, background: accordById(f.accordId).swatch }} /></span>
                    <span className="small num muted">{f.weight}% · in {f.count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card card--pad">
              <p className="eyebrow">Frequent pairings</p>
              {profile.pairs.length ? (
                <ul role="list" className="ticks">{profile.pairs.map((p) => <li key={p.a + p.b}>{accordById(p.a).name} + {accordById(p.b).name} <span className="muted small">· {p.count} creations</span></li>)}</ul>
              ) : <p className="small body-2">No pairing appears in two or more creations yet.</p>}
            </div>
            <div className="card card--pad">
              <p className="eyebrow">To explore next</p>
              {profile.suggestions.length ? (
                <ul role="list" className="ticks">{profile.suggestions.map((s) => <li key={s.accordId}><Link className="link" to={`/ingredients/${s.accordId}`}>{accordById(s.accordId).name}</Link> <span className="small muted">— an illustrative suggested pairing with {accordById(s.because).name}</span></li>)}</ul>
              ) : <p className="small body-2">You’ve already tried the suggested pairings for your top accord.</p>}
            </div>
          </div>
        )}
      </section>

      <ConfirmDialog open={confirmDel !== null} onClose={() => setConfirmDel(null)} danger
        title="Delete this creation?" confirmLabel="Delete"
        body={<>“{confirmDel?.name}” and its version history will be removed from this device. You can undo right after deleting.</>}
        onConfirm={() => { if (confirmDel) { deleteCreation(confirmDel.id); setCompare((c) => c.filter((x) => x !== confirmDel.id)); } }} />
    </div>
  );
}

export function Comparison({ a, b }: { a: Creation; b: Creation }) {
  const rows = compareBlends(a.blend, b.blend);
  const changed = rows.filter((r) => r.delta !== 0);
  return (
    <div>
      <table className="cmp-table">
        <thead><tr><th scope="col">Accord</th><th scope="col">{a.name} <span className="muted small">v{a.formulaVersion}</span></th><th scope="col">{b.name} <span className="muted small">v{b.formulaVersion}</span></th><th scope="col">Change</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.accordId} className={r.delta ? "is-changed" : ""}>
              <th scope="row"><span className="swatch" style={{ background: accordById(r.accordId).swatch }} /> {accordById(r.accordId).name}</th>
              <td className="num">{r.a ? `${r.a}%` : "—"}</td>
              <td className="num">{r.b ? `${r.b}%` : "—"}</td>
              <td className="num">{r.delta === 0 ? "No change" : r.a === 0 ? "Added" : r.b === 0 ? "Removed" : `${r.delta > 0 ? "+" : ""}${r.delta} pts`}</td>
            </tr>
          ))}
        </tbody>
        <tfoot><tr><th scope="row">Total</th><td className="num">100% · 10 ml</td><td className="num">100% · 10 ml</td><td /></tr></tfoot>
      </table>
      <Notice className="cmp-summary">
        {changed.length === 0 ? "These two formulas are identical." : <>What changed: {changed.map((r) => `${accordById(r.accordId).name} ${r.a === 0 ? "added" : r.b === 0 ? "removed" : r.delta > 0 ? `up ${r.delta} points` : `down ${-r.delta} points`}`).join("; ")}. Bottle volume is 10 ml in both.</>}
      </Notice>
      <Link to={`/creations/${b.id}`} className="link link--arrow small" style={{ marginTop: 12 }}>Open “{b.name}” <ArrowRight size={14} aria-hidden /></Link>
    </div>
  );
}
