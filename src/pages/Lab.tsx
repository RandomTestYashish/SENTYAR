import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight, Check, Info, Leaf, Minus, Plus, RotateCcw, Scale, Undo2, X } from "lucide-react";
import { useApp } from "../app/store";
import { Vessel } from "../components/Vessel";
import { Dialog, Notice } from "../components/ui";
import { OilBottle } from "../components/KitItems";
import { KIT } from "../data/catalogue";
import { GlossaryButton } from "../components/Glossary";
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

  const kitMl = KIT.accordVialMl;

  return (
    <div className="lab-page">
      <div className="container lab-head">
        <div>
          <p className="eyebrow">Perfume Lab</p>
          <h1 className="lab-title">Compose your <em>blend</em></h1>
        </div>
        <div className="lab-head__links">
          <GlossaryButton />
          <Link to="/nature-lab" className="btn btn--ghost btn--sm"><Leaf size={16} aria-hidden /> Nature Lab</Link>
        </div>
      </div>

      {(editing || parent) && (
        <div className="container">
          <div className="editing-bar">
            <span className="small">
              {editing ? <>Editing <strong>“{editing.name}”</strong> · version {editing.formulaVersion}. Saving creates version {editing.formulaVersion + 1}.</> :
                <>Variation of <strong>“{parent!.name}”</strong>. Saving creates a new linked creation.</>}
            </span>
            <button className="btn btn--ghost btn--xs" onClick={startNewDraft}>Start a new blend</button>
          </div>
        </div>
      )}

      <div className="container lab">
        {/* STAGE, beaker */}
        <section className="lab__vessel" aria-labelledby="vessel-h">
          <h2 id="vessel-h" className="sr-only">Mixing beaker</h2>
          <div className="vessel-wrap" ref={vesselRef}>
            <Vessel blend={draft.blend} dropKey={dropKey} dropColor={dropColor} highlight={hover} />
            {draft.blend.length === 0 && (
              <div className="vessel-empty">
                <p className="small body-2">Tap a bottle from your kit to begin</p>
                <button className="link small" onClick={resetBlend}>or start from the demo composition</button>
              </div>
            )}
          </div>
          <p className="vessel-caption small muted"><strong className="num">{formatMl(vols.fragranceCml)}</strong> of 2.00 ml · colours are visual coding only</p>
        </section>

        {/* PANEL, kit + formula */}
        <div className="lab__panel">
          <section className="lab__tray" aria-labelledby="tray-h">
            <div className="lab-sec-head">
              <h2 id="tray-h" className="eyebrow">From your Creator Kit</h2>
              <span className="small muted num">{draft.blend.length}/{MAX_ACCORDS}</span>
            </div>
            <ul role="list" className="kit-grid">
              {ACCORDS.map((a) => {
                const entry = draft.blend.find((e) => e.accordId === a.id);
                const used = entry ? vols.entries.find((v) => v.accordId === a.id)?.cml ?? 0 : 0;
                return (
                  <li key={a.id} className={`kit-tile ${entry ? "is-in" : ""}`} onMouseEnter={() => setHover(a.id)} onMouseLeave={() => setHover(null)}>
                    {entry ? (
                      <button className="kit-tile__main" onClick={() => removeFromBlend(a.id)} aria-label={`Remove ${a.name} from blend (currently ${entry.share}%)`}>
                        <OilBottle name={a.name} color={a.swatch} className="kit-tile__art" />
                        <span className="kit-tile__name">{a.name}</span>
                        <span className="kit-tile__meta num">{entry.share}% · {formatMl(used)}</span>
                        <span className="kit-tile__check" aria-hidden><Check size={12} /></span>
                      </button>
                    ) : (
                      <button data-accord-add={a.id} className="kit-tile__main" onClick={() => add(a.id)} disabled={draft.blend.length >= MAX_ACCORDS} aria-label={`Add ${a.name} accord to blend`}>
                        <OilBottle name={a.name} color={a.swatch} className="kit-tile__art" />
                        <span className="kit-tile__name">{a.name}</span>
                        <span className="kit-tile__meta">{kitMl} ml vial</span>
                      </button>
                    )}
                    <button className="kit-tile__info" onClick={() => setInfo(a.id)} aria-label={`About the ${a.name} accord`}><Info size={13} /></button>
                  </li>
                );
              })}
            </ul>

            <div className="bot-block">
              <p className="small muted"><Leaf size={13} aria-hidden /> Botanicals from the kit are for smelling only</p>
              <ul role="list" className="bot-list">
                {BOTANICALS.map((b) => (
                  <li key={b.id}>
                    <button className="bot-dish" onClick={() => setBlocked(b.id)} aria-label={`${b.name}, exploration only. Learn why it cannot be added`} title={b.name}>
                      <img src={b.image} alt="" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="lab__formula" aria-labelledby="formula-h">
            <div className="lab-sec-head">
              <h2 id="formula-h" className="eyebrow">Your formula</h2>
              <div className="seg seg--sm" role="radiogroup" aria-label="Adjustment mode">
                <button role="radio" aria-checked={draft.mode === "proportional"} onClick={() => setMode("proportional")}>Proportional</button>
                <button role="radio" aria-checked={draft.mode === "manual"} onClick={() => setMode("manual")}>Manual</button>
              </div>
            </div>

            {draft.blend.length === 0 ? (
              <p className="formula-empty small muted">Add two or three accords, for example Woody, Citrus and Musk.</p>
            ) : (
              <ul role="list" className="shares">
                {draft.blend.map((e) => (
                  <ShareRow key={e.accordId} id={e.accordId} share={e.share} cml={vols.entries.find((v) => v.accordId === e.accordId)!.cml}
                    invalid={issues.some((i) => "accordId" in i && i.accordId === e.accordId)} />
                ))}
              </ul>
            )}

            {lastChanges.length > 1 && (
              <p className="recalc small" aria-live="polite">
                <strong>Recalculated</strong> to keep 10 ml: {lastChanges.map((c) => `${accordById(c.accordId).name} ${c.from}→${c.to}%`).join(" · ")}
              </p>
            )}

            {draft.blend.length > 0 && (
              <div className={`total-row ${valid ? "is-ok" : "is-bad"}`}>
                <span>Blend total</span>
                <strong className="num">{total}%</strong>
                {valid ? <span className="small"><Check size={14} aria-hidden /> Balanced</span> : <span className="small"><AlertTriangle size={14} aria-hidden /> {total < 100 ? `${100 - total}% unallocated` : `${total - 100}% over`}</span>}
              </div>
            )}
            {issues[0]?.code === "unbalanced" && (
              <div className="row row--tight">
                <button className="btn btn--sm" onClick={() => balance("proportional")}><Scale size={16} aria-hidden /> Rebalance proportionally</button>
                <button className="btn btn--secondary btn--sm" onClick={() => balance("even")}>Split evenly</button>
              </div>
            )}

            <details className="disclosure explain">
              <summary>How the formula works<Plus size={16} aria-hidden /></summary>
              <div>
                <p>The preview bottle is always <strong>10 ml</strong>: <strong>2 ml</strong> fragrance blend and <strong>8 ml</strong> demo base. Accord shares are whole percentages of the 2 ml blend and always total 100%; each 1% is 0.02 ml.</p>
                {pairs.length > 0 && (
                  <ul role="list" className="pairs">
                    {pairs.map((p) => (
                      <li key={`${p.a}-${p.b}`}><span className={`pair-tag pair-tag--${p.kind}`}>{PAIRING_LABEL[p.kind]}</span> {accordById(p.a).name} + {accordById(p.b).name}</li>
                    ))}
                  </ul>
                )}
                <p className="muted" style={{ marginTop: 8 }}>{FORMULA_DISCLAIMER}</p>
              </div>
            </details>
          </section>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="lab-bar" role="region" aria-label="Formula status and actions">
        <div className="container lab-bar__inner">
          <div className="lab-bar__status">
            <span className="small num"><span className="muted">Blend</span> {formatMl(vols.fragranceCml)}</span>
            <span className="small num"><span className="muted">Base</span> {formatMl(vols.baseCml)}</span>
            <span className="small num"><strong>Total {draft.blend.length ? formatMl(vols.totalCml) : "0.00 ml"}</strong></span>
          </div>
          <div className="lab-bar__actions">
            <button className="icon-btn" onClick={undo} disabled={!undoStack.length} aria-label="Undo last change" title="Undo"><Undo2 size={18} /></button>
            <button className="icon-btn" onClick={resetBlend} aria-label="Reset to demo composition" title="Reset to demo composition"><RotateCcw size={18} /></button>
            {draft.blend.length > 0 && <button className="icon-btn hide-sm" onClick={clearBlend} aria-label="Clear blend" title="Clear blend"><X size={18} /></button>}
            <button className="btn lab-bar__cta" disabled={!valid} aria-describedby={!valid ? "preview-why" : undefined} onClick={() => nav("/lab/preview")}>
              Preview <ArrowRight size={16} aria-hidden />
            </button>
          </div>
        </div>
        {!valid && <p id="preview-why" className="container small lab-bar__why">{previewBlockReason}</p>}
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
        <label htmlFor={inputId} className="share__name"><span className="swatch" style={{ background: a.swatch }} />{a.name}<span className="share__ml muted num">{formatMl(cml)}</span></label>
        <div className="share__num">
          <button className="icon-btn icon-btn--sm" onClick={() => commit(share - 1)} disabled={share <= 1 || (draft.mode === "proportional" && others === 0)} aria-label={`Decrease ${a.name} by 1%`}><Minus size={13} /></button>
          <input id={inputId} className="share__input num" inputMode="numeric" value={text} aria-invalid={!!err || invalid}
            aria-describedby={err ? `${inputId}-err` : undefined}
            onChange={(e) => setText(e.target.value)}
            onBlur={() => text !== String(share) && commit(text)}
            onKeyDown={(e) => { if (e.key === "Enter") commit(text); }}
            disabled={draft.mode === "proportional" && others === 0} />
          <span aria-hidden className="muted">%</span>
          <button className="icon-btn icon-btn--sm" onClick={() => commit(share + 1)} disabled={share >= max || (draft.mode === "proportional" && others === 0)} aria-label={`Increase ${a.name} by 1%`}><Plus size={13} /></button>
          <button className="icon-btn icon-btn--sm share__x" onClick={() => removeFromBlend(id)} aria-label={`Remove ${a.name} from blend`}><X size={13} /></button>
        </div>
      </div>
      <input type="range" className="range" min={1} max={100} step={1} value={share}
        style={{ ["--fill" as string]: `${share}%` }}
        aria-label={`${a.name} share of blend`} aria-valuetext={`${share}%, ${formatMl(cml)}`}
        disabled={draft.mode === "proportional" && others === 0}
        onChange={(e) => commit(Number(e.target.value))} />
      {err && <p id={`${inputId}-err`} className="field-error" role="alert">{err}</p>}
      {others === 0 && draft.mode === "proportional" && <p className="small muted">A single accord is always 100%. Add another to adjust proportions.</p>}
    </li>
  );
}
