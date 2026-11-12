import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight, Check, Info, Leaf, Minus, Plus, RotateCcw, Scale, Undo2, X } from "lucide-react";
import { useApp } from "../app/store";
import { Vessel } from "../components/Vessel";
import { Dialog, Notice } from "../components/ui";
import { GlossaryButton, HelpList } from "../components/Glossary";
import {
  ACCORDS, BOTANICALS, PAIRING_LABEL, ROLE_LABEL, accordById, botanicalById, pairing,
} from "../data/ingredients";
import { FORMULA_DISCLAIMER } from "../data/learning";
import { FormulaInputError, MAX_ACCORDS, computeVolumes, formatMl, totalShare, validateBlend } from "../lib/formula";
import { flyTo } from "../lib/fly";
import type { AccordId, BotanicalId } from "../lib/types";

export default function Lab() {
  const s = useApp();
  const { draft, addToBlend, removeFromBlend, undo, undoStack, resetBlend, clearBlend, balance, setMode, lastChanges, creations, startNewDraft } = s;
  const nav = useNavigate();
  const [dropKey, setDropKey] = useState(0);
  const [dropColor, setDropColor] = useState("#c98f3e");
  const [hover, setHover] = useState<AccordId | null>(null);
  const [blocked, setBlocked] = useState<BotanicalId | null>(null);
  const [info, setInfo] = useState<AccordId | null>(null);
  const vesselRef = useRef<HTMLDivElement>(null);

  const issues = validateBlend(draft.blend);
  const valid = issues.length === 0;
  const total = totalShare(draft.blend);
  const vols = computeVolumes(draft.blend);
  const editing = draft.editingId ? creations.find((c) => c.id === draft.editingId) : undefined;
  const parent = draft.parentId ? creations.find((c) => c.id === draft.parentId) : undefined;

  const add = (id: AccordId) => {
    const src = document.querySelector(`[data-accord-add="${id}"]`);
    if (addToBlend(id)) {
      flyTo(src, vesselRef.current, { color: accordById(id).swatch });
      setDropColor(accordById(id).swatch);
      window.setTimeout(() => setDropKey((k) => k + 1), 380);
    }
  };

  const pairs = useMemo(() => {
    const out: { a: AccordId; b: AccordId; kind: ReturnType<typeof pairing> }[] = [];
    draft.blend.forEach((x, i) => draft.blend.slice(i + 1).forEach((y) => out.push({ a: x.accordId, b: y.accordId, kind: pairing(x.accordId, y.accordId) })));
    return out;
  }, [draft.blend]);

  const previewBlockReason = issues[0]?.code === "empty" ? "Add at least one accord to preview." : issues[0]?.code === "unbalanced" ? `Blend totals ${total}%, rebalance to 100% to preview.` : issues.length ? "Fix the highlighted values to preview." : "";

  return (
    <div className="lab-page">
      <div className="container lab-head">
        <div>
          <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link><span aria-hidden>/</span><span aria-current="page">Perfume Lab</span></nav>
          <h1 className="h2" style={{ marginTop: 8 }}>Perfume Lab</h1>
        </div>
        <div className="row row--tight">
          <GlossaryButton />
          <Link to="/nature-lab" className="btn btn--ghost btn--sm"><Leaf size={16} aria-hidden /> Nature Lab</Link>
        </div>
      </div>

      {(editing || parent) && (
        <div className="container">
          <div className="editing-bar">
            <span className="small">
              {editing ? <>Editing <strong>“{editing.name}”</strong> · version {editing.formulaVersion}. Saving creates version {editing.formulaVersion + 1}; earlier versions stay in its history.</> :
                <>Variation of <strong>“{parent!.name}”</strong>. Saving creates a new creation linked to the original.</>}
            </span>
            <button className="btn btn--ghost btn--xs" onClick={startNewDraft}>Start a new blend instead</button>
          </div>
        </div>
      )}

      <div className="container lab">
        {/* LEFT, tray */}
        <section className="lab__tray" aria-labelledby="tray-h">
          <div className="row row--between">
            <h2 id="tray-h" className="eyebrow">Fragrance accords</h2>
            <span className="small muted num">{draft.blend.length}/{MAX_ACCORDS}</span>
          </div>
          <ul role="list" className="accord-list">
            {ACCORDS.map((a) => {
              const entry = draft.blend.find((e) => e.accordId === a.id);
              return (
                <li key={a.id} className={`accord-row ${entry ? "is-in" : ""}`} onMouseEnter={() => setHover(a.id)} onMouseLeave={() => setHover(null)}>
                  <span className="accord-row__swatch" style={{ background: a.swatch }} aria-hidden />
                  <div className="accord-row__text">
                    <span className="accord-row__name">{a.name}</span>
                    <span className="accord-row__desc">{a.descriptors.join(" · ")}</span>
                  </div>
                  <button className="icon-btn icon-btn--sm" onClick={() => setInfo(a.id)} aria-label={`About the ${a.name} accord`}><Info size={16} /></button>
                  {entry ? (
                    <button className="accord-row__btn is-in" onClick={() => removeFromBlend(a.id)} aria-label={`Remove ${a.name} from blend (currently ${entry.share}%)`}>
                      <Check size={14} aria-hidden className="when-idle" /><X size={14} aria-hidden className="when-hover" /><span className="num">{entry.share}%</span>
                    </button>
                  ) : (
                    <button data-accord-add={a.id} className="accord-row__btn" onClick={() => add(a.id)} disabled={draft.blend.length >= MAX_ACCORDS} aria-label={`Add ${a.name} accord to blend`}>
                      <Plus size={14} aria-hidden /> Add
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="bot-block">
            <h2 className="eyebrow">Botanical samples</h2>
            <p className="small muted">Exploration only, they never go into the formula.</p>
            <ul role="list" className="bot-list">
              {BOTANICALS.map((b) => (
                <li key={b.id}>
                  <button className="bot-pill" onClick={() => setBlocked(b.id)} aria-label={`${b.name}, exploration only. Learn why it cannot be added`}>
                    <img src={b.image} alt="" />
                    <span>{b.name.replace("Dried r", "R").replace("Dried o", "O")}</span>
                    <Leaf size={14} aria-hidden className="muted" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CENTRE, vessel */}
        <section className="lab__vessel" aria-labelledby="vessel-h">
          <h2 id="vessel-h" className="sr-only">Mixing vessel</h2>
          <div className="vessel-wrap" ref={vesselRef}>
            <Vessel blend={draft.blend} dropKey={dropKey} dropColor={dropColor} highlight={hover} />
            {draft.blend.length === 0 && (
              <div className="vessel-empty">
                <p className="h4">The vessel is empty</p>
                <p className="small body-2">Add accords from the tray, or start from the demo composition.</p>
                <button className="btn btn--sm" onClick={resetBlend}>Use demo composition</button>
              </div>
            )}
          </div>
          <p className="vessel-caption small muted">Fragrance blend: <strong className="num">{formatMl(vols.fragranceCml)}</strong> of the 2.00 ml allocation · colours are visual coding only</p>
        </section>

        {/* RIGHT, formula */}
        <section className="lab__formula" aria-labelledby="formula-h">
          <div className="row row--between">
            <h2 id="formula-h" className="h4">Formula</h2>
            <span className="badge badge--demo">Demo formula</span>
          </div>

          <fieldset className="mode">
            <legend className="sr-only">When I change one accord</legend>
            <div className="seg" role="radiogroup" aria-label="Adjustment mode">
              <button role="radio" aria-checked={draft.mode === "proportional"} onClick={() => setMode("proportional")}>Proportional</button>
              <button role="radio" aria-checked={draft.mode === "manual"} onClick={() => setMode("manual")}>Manual</button>
            </div>
            <p className="small muted">{draft.mode === "proportional" ? "Changing one accord rescales the others so the blend stays at 100%." : "Only the accord you change moves. Rebalance to 100% before previewing."}</p>
          </fieldset>

          {draft.blend.length === 0 ? (
            <div className="formula-empty">
              <p className="h4">No accords selected</p>
              <p className="small body-2">Your perfume concept isn’t ready yet. Add two or three accords to begin, for example Woody, Citrus and Musk.</p>
            </div>
          ) : (
            <ul role="list" className="shares">
              {draft.blend.map((e) => (
                <ShareRow key={e.accordId} id={e.accordId} share={e.share} cml={vols.entries.find((v) => v.accordId === e.accordId)!.cml}
                  invalid={issues.some((i) => "accordId" in i && i.accordId === e.accordId)} />
              ))}
            </ul>
          )}

          {lastChanges.length > 1 && (
            <div className="recalc" aria-live="polite">
              <p className="small"><strong>Recalculated</strong> to keep the bottle at 10 ml:</p>
              <ul role="list">
                {lastChanges.map((c) => (
                  <li key={c.accordId} className="small num">{accordById(c.accordId).name} {c.from}% → {c.to}%</li>
                ))}
              </ul>
            </div>
          )}

          <div className={`total-row ${valid ? "is-ok" : draft.blend.length ? "is-bad" : ""}`}>
            <span>Blend total</span>
            <strong className="num">{total}%</strong>
            {valid ? <span className="small"><Check size={14} aria-hidden /> Balanced</span> : draft.blend.length > 0 && <span className="small"><AlertTriangle size={14} aria-hidden /> {total < 100 ? `${100 - total}% unallocated` : `${total - 100}% over`}</span>}
          </div>
          {issues[0]?.code === "unbalanced" && (
            <div className="row row--tight">
              <button className="btn btn--sm" onClick={() => balance("proportional")}><Scale size={16} aria-hidden /> Rebalance proportionally</button>
              <button className="btn btn--secondary btn--sm" onClick={() => balance("even")}>Split evenly</button>
            </div>
          )}

          <table className="comp-table">
            <caption className="sr-only">Composition summary</caption>
            <tbody>
              <tr><th scope="row">Fragrance blend <span className="muted">(20%)</span></th><td className="num">{formatMl(vols.fragranceCml)}</td></tr>
              <tr><th scope="row">Demo base <span className="muted">(80%)</span></th><td className="num">{formatMl(vols.baseCml)}</td></tr>
              <tr className="comp-table__total"><th scope="row">Total preview</th><td className="num">{draft.blend.length ? formatMl(vols.totalCml) : "0.00 ml"}</td></tr>
            </tbody>
          </table>

          {pairs.length > 0 && (
            <div className="pairs">
              <p className="eyebrow">Pairing notes</p>
              <ul role="list">
                {pairs.map((p) => (
                  <li key={`${p.a}-${p.b}`} className="small">
                    <span className={`pair-tag pair-tag--${p.kind}`}>{PAIRING_LABEL[p.kind]}</span> {accordById(p.a).name} + {accordById(p.b).name}
                  </li>
                ))}
              </ul>
              <p className="small muted">Illustrative creative suggestions, not validated compatibility data. Professional review required for any real formulation.</p>
            </div>
          )}

          <details className="disclosure explain">
            <summary>How the formula works<Plus size={18} aria-hidden /></summary>
            <div>
              <p>The preview bottle is always <strong>10 ml</strong>. In this illustrative model, <strong>20% (2 ml)</strong> is the fragrance blend and <strong>80% (8 ml)</strong> is a demo base.</p>
              <p style={{ marginTop: 8 }}>Accord shares are whole percentages of the 2 ml blend and always total 100%. Each 1% equals 0.02 ml, so volumes are exact, you will never see 9.99 or 10.01 ml.</p>
              <p style={{ marginTop: 8 }}>Example: Woody 50% = 1.00 ml · Citrus 30% = 0.60 ml · Musk 20% = 0.40 ml · Base 8.00 ml · Total 10.00 ml.</p>
            </div>
          </details>
          <div className="lab-help">
            <p className="eyebrow" style={{ margin: "16px 0 4px" }}>Learn more</p>
            <HelpList />
          </div>
        </section>
      </div>

      {/* BOTTOM BAR */}
      <div className="lab-bar" role="region" aria-label="Formula status and actions">
        <div className="container lab-bar__inner">
          <div className="lab-bar__status">
            <span className="badge badge--demo hide-sm">Demo, not a skin-use recipe</span>
            <span className="small num"><span className="muted">Blend</span> {formatMl(vols.fragranceCml)}</span>
            <span className="small num"><span className="muted">Base</span> {formatMl(vols.baseCml)}</span>
            <span className="small num"><strong>Total {draft.blend.length ? formatMl(vols.totalCml) : "0.00 ml"}</strong></span>
          </div>
          <div className="lab-bar__actions">
            <button className="icon-btn" onClick={undo} disabled={!undoStack.length} aria-label="Undo last change" title="Undo"><Undo2 size={18} /></button>
            <button className="icon-btn" onClick={resetBlend} aria-label="Reset to demo composition" title="Reset to demo composition"><RotateCcw size={18} /></button>
            {draft.blend.length > 0 && <button className="icon-btn hide-sm" onClick={clearBlend} aria-label="Clear blend" title="Clear blend"><X size={18} /></button>}
            <button className="btn" disabled={!valid} aria-describedby={!valid ? "preview-why" : undefined} onClick={() => nav("/lab/preview")}>
              Preview <ArrowRight size={16} aria-hidden />
            </button>
          </div>
        </div>
        {!valid && <p id="preview-why" className="container small lab-bar__why">{previewBlockReason}</p>}
      </div>

      <div className="container" style={{ paddingBottom: 48 }}>
        <Notice>{FORMULA_DISCLAIMER}</Notice>
      </div>

      {/* Botanical blocked */}
      <Dialog open={blocked !== null} onClose={() => setBlocked(null)} title="Botanicals can’t join the formula"
        footer={blocked && <>
          <Link className="btn btn--secondary btn--sm" to={`/nature-lab?b=${blocked}`}>Explore in Nature Lab</Link>
          {!draft.blend.some((e) => e.accordId === botanicalById(blocked).relatedAccord) ? (
            <button className="btn btn--sm" onClick={() => { const r = botanicalById(blocked).relatedAccord; setBlocked(null); add(r); }}>Add {accordById(botanicalById(blocked).relatedAccord).name} accord instead</button>
          ) : <button className="btn btn--sm" onClick={() => setBlocked(null)}>OK</button>}
        </>}>
        {blocked && (
          <div className="stack">
            <Notice tone="warn"><strong>{botanicalById(blocked).name} is a raw botanical sample, exploration only.</strong> Raw plant material is not a fragrance concentrate and is not added to a perfume, even in this demo.</Notice>
            <p className="body-2">For composition, use the related <strong>{accordById(botanicalById(blocked).relatedAccord).name} accord</strong>: an illustrative demo input with a similar family association. This is an educational relationship, not a claim that they are chemically equivalent.</p>
          </div>
        )}
      </Dialog>

      {/* Accord info */}
      <Dialog open={info !== null} onClose={() => setInfo(null)} title={info ? `${accordById(info).name} accord` : ""}
        footer={info && <>
          <Link className="btn btn--secondary btn--sm" to={`/ingredients/${info}`}>Guided learning</Link>
          {!draft.blend.some((e) => e.accordId === info) && <button className="btn btn--sm" onClick={() => { const i = info; setInfo(null); add(i); }} disabled={draft.blend.length >= MAX_ACCORDS}>Add to blend</button>}
        </>}>
        {info && (() => { const a = accordById(info); return (
          <div className="stack">
            <span className="badge badge--accord">Fragrance accord, illustrative demo input</span>
            <p className="lead" style={{ fontSize: "1.0625rem" }}>{a.profile}</p>
            <p className="body-2">{a.everyday}</p>
            <dl className="facts">
              <div><dt>Family</dt><dd>{a.family}</dd></div>
              <div><dt>Role</dt><dd>{ROLE_LABEL[a.role]}, illustrative only</dd></div>
              <div><dt>Related botanical</dt><dd>{botanicalById(a.relatedBotanical).name}</dd></div>
            </dl>
          </div>
        ); })()}
      </Dialog>
    </div>
  );
}

function ShareRow({ id, share, cml, invalid }: { id: AccordId; share: number; cml: number; invalid: boolean }) {
  const { changeShare, removeFromBlend, draft } = useApp();
  const a = accordById(id);
  const [text, setText] = useState(String(share));
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => { setText(String(share)); setErr(null); }, [share]);
  const others = draft.blend.length - 1;
  const max = draft.mode === "proportional" ? 100 - others : 100;

  const commit = (v: unknown) => {
    try {
      changeShare(id, v);
      setErr(null);
    } catch (e) {
      if (e instanceof FormulaInputError) { setErr(e.message); setText(String(share)); }
      else throw e;
    }
  };
  const inputId = `share-${id}`;

  return (
    <li className={`share ${invalid ? "is-invalid" : ""}`}>
      <div className="share__top">
        <label htmlFor={inputId} className="share__name"><span className="swatch" style={{ background: a.swatch }} />{a.name}</label>
        <div className="share__num">
          <button className="icon-btn icon-btn--sm" onClick={() => commit(share - 1)} disabled={share <= 1 || (draft.mode === "proportional" && others === 0)} aria-label={`Decrease ${a.name} by 1%`}><Minus size={14} /></button>
          <input id={inputId} className="share__input num" inputMode="numeric" value={text} aria-invalid={!!err || invalid}
            aria-describedby={err ? `${inputId}-err` : undefined}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => text !== String(share) && commit(text)}
            onKeyDown={(e) => { if (e.key === "Enter") commit(text); }}
            disabled={draft.mode === "proportional" && others === 0} />
          <span aria-hidden className="muted">%</span>
          <button className="icon-btn icon-btn--sm" onClick={() => commit(share + 1)} disabled={share >= max || (draft.mode === "proportional" && others === 0)} aria-label={`Increase ${a.name} by 1%`}><Plus size={14} /></button>
        </div>
      </div>
      <input type="range" className="range" min={1} max={100} step={1} value={share}
        style={{ ["--fill" as string]: `${share}%` }}
        aria-label={`${a.name} share of blend`} aria-valuetext={`${share}%, ${formatMl(cml)}`}
        disabled={draft.mode === "proportional" && others === 0}
        onChange={(e) => commit(Number(e.target.value))} />
      <div className="share__foot small">
        <span className="muted num">{formatMl(cml)} of 2.00 ml</span>
        <button className="link small" onClick={() => removeFromBlend(id)} aria-label={`Remove ${a.name} from blend`}>Remove</button>
      </div>
      {err && <p id={`${inputId}-err`} className="field-error" role="alert">{err}</p>}
      {others === 0 && draft.mode === "proportional" && <p className="small muted">A single accord is always 100% of the blend. Add another to adjust proportions.</p>}
    </li>
  );
}
