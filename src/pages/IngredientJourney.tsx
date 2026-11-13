import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, FlaskConical, Leaf, NotebookPen, X } from "lucide-react";
import { useApp } from "../app/store";
import { Img, Notice } from "../components/ui";
import { Vial } from "../components/ProductThumb";
import { GlossaryButton } from "../components/Glossary";
import {
  ACCORDS, CATEGORY_EXPLAIN, CATEGORY_LABEL, PAIRING_LABEL, ROLE_LABEL, accordById, botanicalById, ingredientById, pairing,
} from "../data/ingredients";
import { EVALUATE_WORDS } from "../data/learning";
import type { Accord, Botanical } from "../lib/types";

const STEPS = ["Meet", "Sensory", "Role", "Explore", "Process", "Try", "Result", "Save"];

export default function IngredientJourney() {
  const { id = "" } = useParams();
  const ing = ingredientById(id);
  const [step, setStep] = useState(0);
  const head = useRef<HTMLHeadingElement>(null);
  useEffect(() => { setStep(0); }, [id]);
  useEffect(() => { if (step > 0) head.current?.focus({ preventScroll: false }); }, [step]);

  if (!ing) {
    return (
      <div className="container section empty">
        <h1 className="h2">We couldn’t find that ingredient</h1>
        <p>It may have been renamed. All ten ingredients are listed in the library.</p>
        <Link to="/ingredients" className="btn">Open the ingredient library</Link>
      </div>
    );
  }
  const isB = ing.kind === "botanical";
  const all = [...ACCORDS.map((a) => a.id), "orange-peel", "cedarwood", "rose-petals", "cinnamon"];
  const idx = all.indexOf(ing.id);
  const nextId = all[(idx + 1) % all.length];

  return (
    <div className="container section--tight journey">
      <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link><span aria-hidden>/</span><Link to="/ingredients">Ingredients</Link><span aria-hidden>/</span><span aria-current="page">{ing.name}</span></nav>

      <div className="journey__grid">
        <div className="journey__main">
          <div className="journey__top">
            <span className={`badge ${isB ? "badge--botanical" : "badge--accord"}`}>{isB ? <><Leaf size={12} aria-hidden /> Botanical sample, exploration only</> : "Fragrance accord, illustrative demo input"}</span>
            <GlossaryButton />
          </div>
          <h1 className="h1">{ing.name}{!isB && " accord"}</h1>

          <ol className="jsteps" aria-label="Learning journey">
            {STEPS.map((s, i) => (
              <li key={s}>
                <button className={`jstep ${i === step ? "is-current" : ""} ${i < step ? "is-done" : ""}`} onClick={() => setStep(i)} aria-current={i === step ? "step" : undefined}>
                  <span className="num">{i + 1}</span> {s}
                </button>
              </li>
            ))}
          </ol>

          <section className="jpanel" aria-live="polite">
            <p className="eyebrow num">Step {step + 1} of 8</p>
            <h2 className="h2" ref={head} tabIndex={-1}>{titleFor(step, ing)}</h2>
            <div className="jpanel__body">
              {isB ? <BotanicalStep step={step} b={ing as Botanical} /> : <AccordStep step={step} a={ing as Accord} />}
            </div>
            <div className="sim__nav">
              <button className="btn btn--secondary" onClick={() => setStep((s) => s - 1)} disabled={step === 0}><ArrowLeft size={16} aria-hidden /> Back</button>
              {step < 7 ? (
                <button className="btn" onClick={() => setStep((s) => s + 1)}>Next <ArrowRight size={16} aria-hidden /></button>
              ) : (
                <Link className="btn" to={`/ingredients/${nextId}`}>Next ingredient: {ingredientById(nextId)!.name} <ArrowRight size={16} aria-hidden /></Link>
              )}
            </div>
          </section>
        </div>

        <aside className="journey__aside card card--pad" aria-label="Quick facts">
          <div className="journey__visual">
            {isB ? <Img src={(ing as Botanical).image} alt={(ing as Botanical).imageAlt} ratio="1 / 1" eager /> : <div className="vial-hero"><Vial color={(ing as Accord).swatch} label={ing.name} /></div>}
          </div>
          <dl className="facts">
            <div><dt>What am I looking at?</dt><dd>{isB ? `A raw ${(ing as Botanical).materialType.toLowerCase()}.` : `A composed ${(ing as Accord).family.toLowerCase()} impression.`}</dd></div>
            <div><dt>Kind</dt><dd>{isB ? "Real botanical (not an extract, not an accord)" : "Fragrance accord (demo data)"}</dd></div>
            <div><dt>Goes into the demo formula?</dt><dd>{isB ? <><X size={14} aria-hidden /> No, exploration only</> : <><Check size={14} aria-hidden /> Yes, as an illustrative input</>}</dd></div>
            <div><dt>Related</dt><dd>{isB ? <Link className="link" to={`/ingredients/${(ing as Botanical).relatedAccord}`}>{accordById((ing as Botanical).relatedAccord).name} accord</Link> : (ing as Accord).relatedBotanical ? <Link className="link" to={`/ingredients/${(ing as Accord).relatedBotanical}`}>{botanicalById((ing as Accord).relatedBotanical!).name}</Link> : (ing as Accord).learnId ? <Link className="link" to={`/learn/${(ing as Accord).learnId}`}>Learning library</Link> : "None in the kit"}</dd></div>
            <div><dt>Can I undo?</dt><dd>Yes. Anything you add can be removed from the tray or lab at any time.</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

function titleFor(step: number, ing: Accord | Botanical) {
  const n = ing.kind === "accord" ? `the ${ing.name} accord` : ing.name.toLowerCase();
  return [
    `Meet ${n}`,
    "Its sensory character",
    "Understand its role",
    ing.kind === "botanical" ? "Inspect the material" : "Explore its family",
    ing.kind === "botanical" ? "The extraction path" : "How accords are blended",
    "Try a guided action",
    "What you learned",
    "Save a discovery note",
  ][step];
}

function BotanicalStep({ step, b }: { step: number; b: Botanical }) {
  const { explore, toggleExplore } = useApp();
  const [zoom, setZoom] = useState(1.6);
  const [origin, setOrigin] = useState("50% 50%");
  const [stronger, setStronger] = useState<"" | "surface" | "edge" | "same">("");
  const exploring = explore.includes(b.id);
  const a = accordById(b.relatedAccord);
  switch (step) {
    case 0: return (<>
      <Img src={b.image} alt={b.imageAlt} ratio="16 / 9" className="jpanel__img" />
      <p className="lead">{b.commonName}{b.botanicalName ? <> · <em>{b.botanicalName}</em></> : null}, {b.materialType.toLowerCase()}.</p>
      <Notice><strong>{CATEGORY_LABEL.botanical}.</strong> {CATEGORY_EXPLAIN.botanical}</Notice>
    </>);
    case 1: return (<>
      <div className="row row--tight">{b.descriptors.map((d) => <span key={d} className="chip chip--static">{d}</span>)}</div>
      <p className="lead">{b.sensory}</p>
      <p className="small muted">Descriptions are illustrative smell references. Perception varies from person to person.</p>
    </>);
    case 2: return (<dl className="facts facts--lg">
      <div><dt>What you are exploring</dt><dd>A raw, dried natural material, its texture, structure and smell.</dd></div>
      <div><dt>How it is used in this demo</dt><dd>As a sensory and learning sample in the kit, the ingredient journey and the Nature Lab simulation.</dd></div>
      <div><dt>Can this go into the formula?</dt><dd><strong>No.</strong> Raw botanicals are never added to the formula. For composition, use the related {a.name} accord.</dd></div>
      <div><dt>Why it’s in the kit</dt><dd>{b.whyInKit}</dd></div>
    </dl>);
    case 3: return (<>
      <div className="inspect" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`); }}>
        <img src={b.image} alt={`${b.imageAlt}, magnified`} style={{ transform: `scale(${zoom})`, transformOrigin: origin }} />
      </div>
      <div className="field" style={{ maxWidth: 360 }}>
        <label htmlFor="zoom">Magnification <span className="num muted">{zoom.toFixed(1)}×</span></label>
        <input id="zoom" type="range" className="range" min={1} max={3} step={0.1} value={zoom} style={{ ["--fill" as string]: `${((zoom - 1) / 2) * 100}%` }} onChange={(e) => setZoom(Number(e.target.value))} />
        <p className="field-hint">Move your pointer over the image to inspect different areas.</p>
      </div>
      <p className="body-2">{b.whyInteresting}</p>
    </>);
    case 4: return (<>
      <ol className="numbered">
        <li><strong>Discover</strong>: inspect and smell-reference the raw material.</li>
        <li><strong>Prepare</strong>: preparation differs by material (concept only).</li>
        <li><strong>Extract</strong>: a sealed, illustrative animation.</li>
        <li><strong>Filter</strong>: separating solids from liquid, as a concept.</li>
        <li><strong>Evaluate</strong>: compare on a blotter and record what you notice.</li>
      </ol>
      <Link to={`/nature-lab?b=${b.id}`} className="btn" style={{ marginTop: 16 }}><Leaf size={16} aria-hidden /> Open the {b.name.replace("Dried ", "").toLowerCase()} simulation</Link>
      <p className="small muted" style={{ marginTop: 8 }}>The simulation never gives ratios, times, temperatures or heating instructions.</p>
    </>);
    case 5: return (<>
      <p className="body-2">If you have the sample, smell the outer surface, then a freshly broken edge. Which is stronger? If not, choose “I don’t have it”, the reference description is enough to continue.</p>
      <div className="row row--tight" role="radiogroup" aria-label="Which smelled stronger?">
        {([["surface", "Outer surface"], ["edge", "Broken edge"], ["same", "About the same"], ["", "I don’t have it"]] as const).map(([v, l]) => (
          <button key={l} role="radio" aria-checked={stronger === v} className="chip" onClick={() => setStronger(v)}>{l}</button>
        ))}
      </div>
      {stronger && <p className="small">{stronger === "edge" ? "Common: breaking a material exposes fresh surfaces where more aroma is released." : stronger === "surface" ? "Interesting: the surface can hold aroma from handling or storage." : "That’s a valid observation; some materials are fairly uniform."} You can change your answer.</p>}
      <div className="row">
        {exploring ? (
          <><span className="badge"><Check size={12} aria-hidden /> In your exploration tray</span><button className="btn btn--secondary btn--sm" onClick={() => toggleExplore(b.id, false)}>Remove</button></>
        ) : <button className="btn btn--sm" onClick={() => toggleExplore(b.id, true)}><Leaf size={16} aria-hidden /> Add to exploration tray</button>}
      </div>
    </>);
    case 6: return (<>
      <ul role="list" className="ticks">
        <li>{b.name} is a <strong>raw botanical</strong>: for smelling and learning.</li>
        <li>It is <strong>not</strong> an extract, and <strong>not</strong> a fragrance concentrate.</li>
        <li>It relates educationally to the <strong>{a.name} accord</strong>, which is what goes into the demo formula, they are not chemically equivalent.</li>
      </ul>
      <Notice tone="warn">{b.safety}</Notice>
      <p className="body-2"><strong>Next safe step:</strong> explore the {a.name} accord, or run the Nature Lab simulation.</p>
      <div className="row"><Link className="btn btn--secondary btn--sm" to={`/ingredients/${a.id}`}>{a.name} accord</Link><Link className="btn btn--secondary btn--sm" to={`/nature-lab?b=${b.id}`}>Nature Lab</Link></div>
    </>);
    default: return <SaveNote id={b.id} defaults={b.descriptors} />;
  }
}

function AccordStep({ step, a }: { step: number; a: Accord }) {
  const { draft, addToBlend, removeFromBlend } = useApp();
  const other = accordById(a.compareWith);
  const inBlend = draft.blend.find((e) => e.accordId === a.id);
  const b = a.relatedBotanical ? botanicalById(a.relatedBotanical) : undefined;
  switch (step) {
    case 0: return (<>
      <div className="vial-stage"><Vial color={a.swatch} label={a.name} /></div>
      <p className="lead">{a.everyday}</p>
      <Notice><strong>{CATEGORY_LABEL.accord}.</strong> {CATEGORY_EXPLAIN.accord}</Notice>
    </>);
    case 1: return (<>
      <div className="row row--tight">{a.descriptors.map((d) => <span key={d} className="chip chip--static">{d}</span>)}</div>
      <p className="lead">{a.profile}</p>
      <p className="small muted">Descriptions are illustrative; perception varies.</p>
    </>);
    case 2: return (<dl className="facts facts--lg">
      <div><dt>What you are exploring</dt><dd>A composed fragrance impression, several materials combined to read as one idea.</dd></div>
      <div><dt>How it is used in this demo</dt><dd>As an input in the Perfume Lab composition model, with a share of the 2 ml fragrance allocation.</dd></div>
      <div><dt>Can this go into the formula?</dt><dd><strong>Yes</strong>, as an illustrative demo input. Its composition is fictional and not disclosed as a supplier formula.</dd></div>
      <div><dt>Note role</dt><dd>{ROLE_LABEL[a.role]}, an illustrative association, not a fixed classification.</dd></div>
    </dl>);
    case 3: return (<>
      <FamilyWheel active={a.id} />
      <p className="body-2">Visual metaphor: <strong className="serif-italic" style={{ fontSize: "1.25rem" }}>{a.metaphor}</strong>. Family: {a.family}.{b && <> Related material reference: {b.name}.</>}</p>
    </>);
    case 4: return (<>
      <p className="body-2">In the lab, each accord has a <strong>share</strong> of the blend. Shares always total 100%, and the bottle always stays 10 ml.</p>
      <ul role="list" className="ticks">
        <li>Raising {a.name} from 30% to 40% gives it 0.80 ml instead of 0.60 ml of the 2 ml blend.</li>
        <li>In Proportional mode, the other accords shrink in proportion to make room.</li>
        <li>The base (8 ml) and total (10 ml) never change.</li>
      </ul>
    </>);
    case 5: return (<>
      <p className="body-2">Compare {a.name} with {other.name}, then decide whether to add it to your blend. You can remove it any time.</p>
      <div className="compare2">
        {[a, other].map((x) => (
          <div key={x.id} className="card card--pad">
            <div className="row"><span className="swatch" style={{ background: x.swatch, width: 14, height: 14 }} /><p className="h4">{x.name}</p></div>
            <p className="small muted">{x.family}</p>
            <p className="small">{x.descriptors.join(" · ")}</p>
          </div>
        ))}
      </div>
      <p className="small"><span className="pair-tag">{PAIRING_LABEL[pairing(a.id, other.id)]}</span> Illustrative suggestion, not validated compatibility data.</p>
      <div className="row">
        {inBlend ? (
          <><span className="badge"><Check size={12} aria-hidden /> In your blend at {inBlend.share}%</span><button className="btn btn--secondary btn--sm" onClick={() => removeFromBlend(a.id)}>Remove</button><Link to="/lab" className="btn btn--sm">Open Lab</Link></>
        ) : <button className="btn btn--sm" onClick={() => addToBlend(a.id)} disabled={draft.blend.length >= 6}><FlaskConical size={16} aria-hidden /> Add {a.name} to demo formula</button>}
      </div>
      {inBlend && <p className="small muted">Adding it rescaled your other accords so the blend still totals 100%.</p>}
    </>);
    case 6: return (<>
      <ul role="list" className="ticks">
        <li>{a.name} is a <strong>fragrance accord</strong>: a demo composition input.</li>
        <li>Its share changes its volume within the fixed 2 ml blend; the 10 ml bottle never grows.</li>
        {b ? <li>It relates to the {b.name.toLowerCase()} botanical as an <em>educational</em> reference only.</li> : <li>The kit has no raw botanical for this accord; learn about the material in the Scent Learning Library.</li>}
      </ul>
      <p className="body-2"><strong>Next safe step:</strong> adjust it in the lab and preview your concept.</p>
      <Link className="btn btn--sm" to="/lab">Go to the Lab</Link>
    </>);
    default: return <SaveNote id={a.id} defaults={a.descriptors} />;
  }
}

function SaveNote({ id, defaults }: { id: string; defaults: string[] }) {
  const { addNote, notes } = useApp();
  const [words, setWords] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const count = notes.filter((n) => n.ingredientId === id).length;
  const vocab = Array.from(new Set([...defaults, ...EVALUATE_WORDS])).slice(0, 14);
  return (
    <div className="stack">
      <p className="body-2">Pick the words that fit your impression and add a line of your own. Notes stay separate from your formulas.</p>
      <div className="row row--tight">
        {vocab.map((w) => <button key={w} className="chip" aria-pressed={words.includes(w)} onClick={() => setWords((ws) => ws.includes(w) ? ws.filter((x) => x !== w) : [...ws, w])} disabled={saved}>{w}</button>)}
      </div>
      <div className="field">
        <label htmlFor="jnote">Note</label>
        <textarea id="jnote" className="input" maxLength={280} value={text} onChange={(e) => setText(e.target.value)} disabled={saved} placeholder="What stood out to you?" />
      </div>
      {saved ? (
        <div className="row"><p className="saved-inline"><Check size={16} aria-hidden /> Saved to your discoveries.</p><Link to="/ingredients" className="link small">View all discoveries</Link><button className="link small" onClick={() => { setSaved(false); setWords([]); setText(""); }}>Write another</button></div>
      ) : (
        <button className="btn" disabled={!words.length && !text.trim()} onClick={() => { addNote({ ingredientId: id as never, descriptors: words, text: text.trim(), source: "ingredient-journey" }); setSaved(true); }}><NotebookPen size={16} aria-hidden /> Save discovery note</button>
      )}
      {count > 0 && !saved && <p className="small muted">You have {count} earlier note{count > 1 ? "s" : ""} on this ingredient.</p>}
    </div>
  );
}

function FamilyWheel({ active }: { active: string }) {
  const n = ACCORDS.length;
  return (
    <svg viewBox="0 0 320 320" className="wheel" role="img" aria-label={`Scent family wheel highlighting ${accordById(active as never).name}`}>
      {ACCORDS.map((x, i) => {
        const a0 = (i / n) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
        const R = 140, r = 70, c = 160;
        const p = (ang: number, rad: number) => `${c + rad * Math.cos(ang)} ${c + rad * Math.sin(ang)}`;
        const on = x.id === active;
        const mid = (a0 + a1) / 2;
        return (
          <g key={x.id}>
            <path d={`M${p(a0, r)} L${p(a0, R)} A${R} ${R} 0 0 1 ${p(a1, R)} L${p(a1, r)} A${r} ${r} 0 0 0 ${p(a0, r)} Z`} fill={on ? x.swatch : "#f1eee8"} stroke="#fff" strokeWidth="3" />
            <text x={c + 105 * Math.cos(mid)} y={c + 105 * Math.sin(mid) + 4} textAnchor="middle" fontSize="12" fontWeight={on ? 600 : 400} fill={on ? "#fff" : "#57534d"} fontFamily="var(--font-sans)">{x.name}</text>
          </g>
        );
      })}
      <text x="160" y="156" textAnchor="middle" fontSize="18" fontFamily="var(--font-serif)" fill="#0b0b0b">Six</text>
      <text x="160" y="176" textAnchor="middle" fontSize="12" fontFamily="var(--font-sans)" fill="#57534d">demo accords</text>
    </svg>
  );
}
