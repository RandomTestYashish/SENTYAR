import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, CopyPlus, Leaf, Save } from "lucide-react";
import { useApp } from "../app/store";
import { BottlePhoto, PHOTO_BOTTLES, photoBottle } from "../components/BottlePhoto";
import { Dialog, Notice } from "../components/ui";
import { accordById, botanicalById } from "../data/ingredients";
import { FORMULA_DISCLAIMER } from "../data/learning";
import { computeVolumes, formatMl, validateBlend } from "../lib/formula";
import { prefersReducedMotion } from "../lib/fly";

const SUGGESTIONS = ["My Sunday", "After Hours", "Orange Woods", "Rose Affair"];

export default function Preview() {
  const { draft, setDraftName, setBottle, saveCreation, creations, loadIntoLab, toast } = useApp();
  const nav = useNavigate();
  const issues = validateBlend(draft.blend);
  const valid = issues.length === 0;
  const vols = computeVolumes(draft.blend);
  const editing = draft.editingId ? creations.find((c) => c.id === draft.editingId) : undefined;
  const [ack, setAck] = useState(false);
  const [nameErr, setNameErr] = useState<string | null>(null);
  const [wearOpen, setWearOpen] = useState(false);
  const [justSaved, setJustSaved] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // pointer tilt: the bottle turns towards the cursor, light sweeps across the glass
  useEffect(() => {
    const el = stageRef.current; if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--ry", `${(x * 22).toFixed(2)}deg`); el.style.setProperty("--rx", `${(-y * 10).toFixed(2)}deg`);
        el.style.setProperty("--sx", `${((x + 0.5) * 100).toFixed(1)}%`); el.classList.add("is-live");
      });
    };
    const leave = () => { el.style.setProperty("--ry", "0deg"); el.style.setProperty("--rx", "0deg"); el.classList.remove("is-live"); };
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", leave);
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); cancelAnimationFrame(raf); };
  }, [valid]);

  if (!valid) {
    return (
      <div className="container section empty">
        <p className="eyebrow">Preview</p>
        <h1 className="h2">Your perfume concept isn’t ready yet</h1>
        <p>{issues[0]?.code === "empty" ? "There are no accords in your blend. Add at least one in the Perfume Lab." : "Your blend doesn’t total 100%. Rebalance it in the Perfume Lab, then come back."}</p>
        <Link to="/lab" className="btn"><ArrowLeft size={16} aria-hidden /> Back to the Lab</Link>
      </div>
    );
  }

  const doSave = (asNew = false) => {
    if (!draft.name.trim()) { setNameErr("Give your creation a name before saving."); document.getElementById("cname")?.focus(); return; }
    if (!ack) { document.getElementById("ack")?.focus(); toast("Please confirm you understand this is a demo concept.", { tone: "warn" }); return; }
    const c = saveCreation({ asNew });
    if (c) {
      setJustSaved(c.id);
      toast(`Saved “${c.name}”, version ${c.formulaVersion}`, { tone: "success", action: { label: "View", onClick: () => nav(`/creations/${c.id}`) } });
    }
  };

  return (
    <div className="container section--tight preview">
      <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link><span aria-hidden>/</span><Link to="/lab">Perfume Lab</Link><span aria-hidden>/</span><span aria-current="page">Preview</span></nav>

      <div className="preview__grid">
        <section className="preview__stage" aria-labelledby="stage-h">
          <h2 id="stage-h" className="sr-only">Bottle preview</h2>
          <div className="pv-stage" ref={stageRef}>
            <div className="pv-stage__glow" aria-hidden />
            <div className="pv-stage__turn" key={draft.bottle}>
              <BottlePhoto concept={draft.bottle} name={draft.name || "Your creation"} className="pv-bottle" />
              <span className="pv-sheen" aria-hidden />
            </div>
            <div className="pv-stage__shadow" aria-hidden />
            <p className="pv-stage__cap small"><span>{photoBottle(draft.bottle).name}</span> · {photoBottle(draft.bottle).style} · 10 ml</p>
          </div>
          <div className="pv-picker" role="radiogroup" aria-label="Bottle concept">
            {PHOTO_BOTTLES.map((b) => (
              <button key={b.id} role="radio" aria-checked={draft.bottle === b.id} className="pv-pick" onClick={() => setBottle(b.id)} aria-label={b.name}>
                <BottlePhoto concept={b.id} engrave={false} className="pv-pick__img" />
                <span>{b.name.replace("The ", "")}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="preview__info" aria-labelledby="concept-h">
          <p className="eyebrow">Your fragrance concept</p>
          <h1 id="concept-h" className="h2">{draft.name || "Name your creation"}</h1>
          <p className="body-2 small">{editing ? `Editing “${editing.name}” · saved as version ${editing.formulaVersion}` : "Not saved yet"}</p>

          <div className="field" style={{ marginTop: 24 }}>
            <label htmlFor="cname">Name</label>
            <input id="cname" className="input" value={draft.name} maxLength={40} placeholder="e.g. Orange Woods" aria-invalid={!!nameErr}
              aria-describedby={nameErr ? "cname-err" : "cname-hint"}
              onChange={(e) => { setDraftName(e.target.value); setNameErr(null); }} />
            {nameErr ? <p id="cname-err" className="field-error">{nameErr}</p> : <p id="cname-hint" className="field-hint">Up to 40 characters. Try one of these:</p>}
            <div className="row row--tight">
              {SUGGESTIONS.map((s) => <button key={s} className="chip" onClick={() => { setDraftName(s); setNameErr(null); }}>{s}</button>)}
            </div>
          </div>

          <table className="formula-table">
            <caption className="eyebrow">Blend · fixed 10 ml demo volume</caption>
            <thead><tr><th scope="col">Accord</th><th scope="col">Share</th><th scope="col">Demo volume</th></tr></thead>
            <tbody>
              {vols.entries.map((e) => (
                <tr key={e.accordId}>
                  <th scope="row"><span className="swatch" style={{ background: accordById(e.accordId).swatch }} /> {accordById(e.accordId).name}</th>
                  <td className="num">{e.share}%</td>
                  <td className="num">{formatMl(e.cml)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr><th scope="row">Fragrance blend</th><td className="num">100%</td><td className="num">{formatMl(vols.fragranceCml)}</td></tr>
              <tr><th scope="row">Perfumer’s alcohol base</th><td /><td className="num">{formatMl(vols.baseCml)}</td></tr>
              <tr className="formula-table__total"><th scope="row">Total</th><td /><td className="num">{formatMl(vols.totalCml)}</td></tr>
            </tfoot>
          </table>

          {draft.infusions.length > 0 && (
            <p className="small muted pv-infusion"><Leaf size={13} aria-hidden /> Visual infusion: {draft.infusions.map((b) => botanicalById(b).name.toLowerCase()).join(", ")}. Shown in the beaker, not counted in the formula.</p>
          )}
          <Notice tone="warn">{FORMULA_DISCLAIMER}</Notice>
          <label className="ack">
            <input id="ack" type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
            <span className="small">I understand this is a demo concept, not a skin-use recipe.</span>
          </label>
          <button className="link small" onClick={() => setWearOpen(true)}>Can I make and wear this?</button>

          <div className="preview__actions">
            <Link to="/lab" className="btn btn--secondary"><ArrowLeft size={16} aria-hidden /> Edit blend</Link>
            {editing ? (
              <>
                <button className="btn" onClick={() => doSave(false)}><Save size={16} aria-hidden /> Save as version {editing.formulaVersion + 1}</button>
                <button className="btn btn--ghost" onClick={() => doSave(true)}>Save as new</button>
              </>
            ) : (
              <button className="btn" onClick={() => doSave(false)}><Save size={16} aria-hidden /> Save creation</button>
            )}
          </div>
          {justSaved && (
            <div className="saved-note" role="status">
              <Check size={18} aria-hidden />
              <div>
                <p><strong>Saved to My Creations.</strong> It will still be here after a refresh.</p>
                <div className="row row--tight" style={{ marginTop: 8 }}>
                  <Link to={`/creations/${justSaved}`} className="btn btn--sm">View creation</Link>
                  <button className="btn btn--secondary btn--sm" onClick={() => { const c = creations.find((x) => x.id === justSaved); if (c) { loadIntoLab(c, "variation"); nav("/lab"); } }}><CopyPlus size={16} aria-hidden /> Create variation</button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      <Dialog open={wearOpen} onClose={() => setWearOpen(false)} title="Can I make and wear this?"
        footer={<button className="btn btn--sm" onClick={() => setWearOpen(false)}>Understood</button>}>
        <div className="stack">
          <Notice tone="danger"><strong>No, not from this preview.</strong> SENTYAR’s formula is a UI demonstration with illustrative accords and a demo base.</Notice>
          <p className="body-2">A wearable perfume needs real, documented materials, concentrations set within applicable safety limits (for example IFRA standards where relevant), compatibility and stability testing, and validation by a qualified perfumer and safety assessor.</p>
          <p className="body-2">You can save this concept, compare variations and use it as a brief for a professional.</p>
        </div>
      </Dialog>
    </div>
  );
}
