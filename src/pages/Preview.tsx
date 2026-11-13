import { Suspense, lazy, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, CopyPlus, Leaf, Pause, Play, RotateCcw, Save, SlidersHorizontal } from "lucide-react";
import { BottleConfigurator, type BottleConfig } from "../components/BottleConfigurator";
import { bodyById, capLabel } from "../data/bottles";
import { useApp } from "../app/store";
import { BottlePhoto, PHOTO_BOTTLES, photoBottle } from "../components/BottlePhoto";
import { Dialog, Notice } from "../components/ui";
import { accordById, botanicalById } from "../data/ingredients";
import { FORMULA_DISCLAIMER } from "../data/learning";
import { computeVolumes, formatMl, validateBlend } from "../lib/formula";
import { prefersReducedMotion } from "../lib/fly";

const Bottle3D = lazy(() => import("../features/lab/Bottle3D"));
const SUGGESTIONS = ["My Sunday", "After Hours", "Orange Woods", "Rose Affair"];

function canWebGL() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}
/** amber liquid, nudged towards the blend's own colours */
function liquidTint(swatches: { c: string; w: number }[]) {
  const amber = [204, 136, 38];
  if (!swatches.length) return "#cc8826";
  let r = 0, g = 0, b = 0, t = 0;
  swatches.forEach(({ c, w }) => { const n = parseInt(c.slice(1), 16); r += ((n >> 16) & 255) * w; g += ((n >> 8) & 255) * w; b += (n & 255) * w; t += w; });
  const mix = (a: number, x: number) => Math.round(a * 0.8 + (x / t) * 0.2);
  return `rgb(${mix(amber[0], r)}, ${mix(amber[1], g)}, ${mix(amber[2], b)})`;
}

export default function Preview() {
  const { draft, setDraftName, setBottle, setBottleConfig, saveCreation, creations, loadIntoLab, toast } = useApp();
  const [sheet, setSheet] = useState(false);
  const cfg: BottleConfig = { body: draft.bottle, cap: draft.cap ?? bodyById(draft.bottle).defaultCap, volume: draft.bottleVolume ?? bodyById(draft.bottle).volumes[0] };
  const nav = useNavigate();
  const issues = validateBlend(draft.blend);
  const valid = issues.length === 0;
  const vols = computeVolumes(draft.blend);
  const editing = draft.editingId ? creations.find((c) => c.id === draft.editingId) : undefined;
  const [ack, setAck] = useState(false);
  const [nameErr, setNameErr] = useState<string | null>(null);
  const [wearOpen, setWearOpen] = useState(false);
  const [justSaved, setJustSaved] = useState<string | null>(null);
  const [glError, setGlError] = useState<string | null>(() => (canWebGL() ? null : "WebGL isn’t available in this browser."));
  const [glReady, setGlReady] = useState(false);
  const [auto, setAuto] = useState(!prefersReducedMotion());
  const [resetKey, setResetKey] = useState(0);
  const use3D = !glError;
  const tint = useMemo(() => liquidTint(draft.blend.map((e) => ({ c: accordById(e.accordId).swatch, w: e.share }))), [draft.blend]);

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
          <div className="pv-stage">
            {use3D ? (
              <Suspense fallback={<div className="stage__loading"><span className="small muted">Preparing glass and light…</span></div>}>
                <Bottle3D concept={draft.bottle} cap={cfg.cap} volume={cfg.volume} name={draft.name || "Your creation"} tint={tint} autoRotate={auto} resetKey={resetKey}
                  onReady={() => setGlReady(true)} onError={(m) => setGlError(m)} />
                {!glReady && <div className="stage__loading"><span className="small muted">Preparing glass and light…</span></div>}
              </Suspense>
            ) : (
              <div className="pv-stage__photo"><BottlePhoto concept={draft.bottle} name={draft.name || "Your creation"} className="pv-bottle" /></div>
            )}
            {use3D && (
              <div className="pv-tools">
                <button className="icon-btn icon-btn--sm" onClick={() => setAuto((x) => !x)} aria-label={auto ? "Pause rotation" : "Resume rotation"} aria-pressed={auto}>{auto ? <Pause size={15} /> : <Play size={15} />}</button>
                <button className="icon-btn icon-btn--sm" onClick={() => setResetKey((k) => k + 1)} aria-label="Reset view"><RotateCcw size={15} /></button>
              </div>
            )}
            <p className="pv-stage__cap small"><span>{photoBottle(draft.bottle).name}</span> · {capLabel(cfg.cap)} · {cfg.volume} ml{use3D && glReady ? " · drag to turn" : ""}</p>
          </div>
          {glError && <Notice>Showing the studio photograph. {glError}</Notice>}
          <div className="pv-picker" role="radiogroup" aria-label="Bottle concept">
            {PHOTO_BOTTLES.map((b) => (
              <button key={b.id} role="radio" aria-checked={draft.bottle === b.id} className="pv-pick" onClick={() => { setBottle(b.id); setBottleConfig({ body: b.id, cap: bodyById(b.id).defaultCap, volume: bodyById(b.id).volumes.includes(cfg.volume) ? cfg.volume : bodyById(b.id).volumes[0] }); }} aria-label={b.name}>
                <BottlePhoto concept={b.id} engrave={false} className="pv-pick__img" />
                <span>{b.name.replace("The ", "")}</span>
              </button>
            ))}
          </div>
          <div className="pv-cfg">
            <p className="small"><strong>{bodyById(cfg.body).name}</strong> · {capLabel(cfg.cap)} · {cfg.volume} ml</p>
            <button className="btn btn--secondary btn--sm" onClick={() => setSheet(true)}><SlidersHorizontal size={14} aria-hidden /> Cap and size</button>
          </div>
          <BottleConfigurator open={sheet} onClose={() => setSheet(false)} value={cfg} name={draft.name || "Your creation"} onConfirm={setBottleConfig} confirmLabel="Use this bottle" />
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
