import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Box, Droplet, Check, CopyPlus, Image as ImageIcon, Pause, Play, RotateCcw, Save } from "lucide-react";
import { useApp } from "../app/store";
import { Bottle, BOTTLES } from "../components/Bottle";
import { Dialog, Notice } from "../components/ui";
import { accordById } from "../data/ingredients";
import { FORMULA_DISCLAIMER } from "../data/learning";
import { computeVolumes, formatMl, validateBlend } from "../lib/formula";
import { prefersReducedMotion } from "../lib/fly";
import { webglAvailable } from "../lib/webgl";
import type { BottleConceptId } from "../lib/types";

const Bottle3D = lazy(() => import("../features/lab/Bottle3D"));
const SUGGESTIONS = ["My Sunday", "After Hours", "Orange Woods", "Rose Affair"];
const FILL = 0.82;

export default function Preview() {
  const { draft, setDraftName, setBottle, saveCreation, creations, loadIntoLab, toast } = useApp();
  const nav = useNavigate();
  const issues = validateBlend(draft.blend);
  const valid = issues.length === 0;
  const vols = computeVolumes(draft.blend);
  const accents = useMemo(() => draft.blend.map((e) => accordById(e.accordId).swatch), [draft.blend]);
  const editing = draft.editingId ? creations.find((c) => c.id === draft.editingId) : undefined;

  const canGL = useMemo(() => webglAvailable(), []);
  const [view, setView] = useState<"3d" | "2d">(() => (canGL && !window.matchMedia("(max-width: 380px)").matches ? "3d" : "2d"));
  const [glError, setGlError] = useState<string | null>(canGL ? null : "WebGL isn’t available in this browser.");
  const [glReady, setGlReady] = useState(false);
  const [auto, setAuto] = useState(!prefersReducedMotion());
  const [resetKey, setResetKey] = useState(0);
  const [fill, setFill] = useState(0);
  const [ack, setAck] = useState(false);
  const [nameErr, setNameErr] = useState<string | null>(null);
  const [wearOpen, setWearOpen] = useState(false);
  const [justSaved, setJustSaved] = useState<string | null>(null);

  useEffect(() => { const t = window.setTimeout(() => setFill(FILL), 250); return () => clearTimeout(t); }, []);
  const use3D = view === "3d" && !glError && draft.bottle === "pebble";

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
          <div className={`stage ${use3D ? "stage--3d" : ""}`}>
            {use3D ? (
              <Suspense fallback={<div className="stage__loading"><span className="small muted">Loading 3D bottle…</span></div>}>
                <Bottle3D fill={fill} name={draft.name || "Your creation"} accents={accents} autoRotate={auto} resetKey={resetKey}
                  onError={(m) => setGlError(m)} onReady={() => setGlReady(true)} />
                {!glReady && <div className="stage__loading"><span className="small muted">Preparing glass and light…</span></div>}
              </Suspense>
            ) : (
              <Bottle concept={draft.bottle} fill={fill} name={draft.name || "Your creation"} accents={accents} className="stage__svg" />
            )}
            <div className="stage__tools">
              {use3D && <>
                <button className="icon-btn" onClick={() => setAuto((a) => !a)} aria-label={auto ? "Pause rotation" : "Resume rotation"} aria-pressed={auto}>{auto ? <Pause size={18} /> : <Play size={18} />}</button>
                <button className="icon-btn" onClick={() => setResetKey((k) => k + 1)} aria-label="Reset view"><RotateCcw size={18} /></button>
              </>}
              <button className="icon-btn" onClick={() => { setFill(0); window.setTimeout(() => setFill(FILL), 300); }} aria-label="Replay bottle filling"><Droplet size={18} /></button>
              {draft.bottle === "pebble" && canGL && !glError && (
                <div className="seg seg--sm" role="radiogroup" aria-label="Viewer">
                  <button role="radio" aria-checked={view === "3d"} onClick={() => setView("3d")}><Box size={14} aria-hidden /> 3D</button>
                  <button role="radio" aria-checked={view === "2d"} onClick={() => setView("2d")}><ImageIcon size={14} aria-hidden /> 2D</button>
                </div>
              )}
            </div>
            {use3D && glReady && <p className="stage__hint small muted">Drag to rotate</p>}
          </div>
          {glError && view === "3d" && draft.bottle === "pebble" && (
            <Notice>Showing the 2D bottle. {glError} The 2D view shows the same name, fill and label information.</Notice>
          )}
          <div className="concepts" role="radiogroup" aria-label="Bottle concept">
            {(Object.keys(BOTTLES) as BottleConceptId[]).map((k) => (
              <button key={k} role="radio" aria-checked={draft.bottle === k} className="concept-pick" onClick={() => setBottle(k)}>
                <Bottle concept={k} fill={0.6} showLabel={false} animateFill={false} title="" />
                <span>{BOTTLES[k].name}{k === "pebble" && <span className="small muted"> · recommended</span>}</span>
              </button>
            ))}
          </div>
          {draft.bottle !== "pebble" && <p className="small muted">The 3D model is built for the recommended Pebble concept; other concepts are shown in 2D.</p>}
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
              <tr><th scope="row">Demo base</th><td /><td className="num">{formatMl(vols.baseCml)}</td></tr>
              <tr className="formula-table__total"><th scope="row">Total</th><td /><td className="num">{formatMl(vols.totalCml)}</td></tr>
            </tfoot>
          </table>

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
