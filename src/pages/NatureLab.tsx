import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, FlaskConical, NotebookPen, RotateCcw, ShieldAlert, ZoomIn, ZoomOut } from "lucide-react";
import { useApp } from "../app/store";
import { Img, Notice } from "../components/ui";
import { BOTANICALS, accordById, botanicalById } from "../data/ingredients";
import { EVALUATE_WORDS, EXTRACT_COLOR, NATURE_DISCLAIMER, STAGES } from "../data/learning";
import type { BotanicalId } from "../lib/types";

type Source = "own" | "kit" | "reference";

export default function NatureLab() {
  const [params, setParams] = useSearchParams();
  const initial = (BOTANICALS.find((b) => b.id === params.get("b"))?.id ?? "orange-peel") as BotanicalId;
  const [bid, setBid] = useState<BotanicalId>(initial);
  const [stage, setStage] = useState(0);
  const [maxStage, setMaxStage] = useState(0);
  const [source, setSource] = useState<Source>("kit");
  const [words, setWords] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [savedNote, setSavedNote] = useState<string | null>(null);
  const [zoom, setZoom] = useState(false);
  const { addNote, addToBlend, notes, announce } = useApp();
  const nav = useNavigate();
  const headRef = useRef<HTMLHeadingElement>(null);
  const b = botanicalById(bid);
  const accord = accordById(b.relatedAccord);
  const done = (id: BotanicalId) => notes.some((n) => n.source === "nature-lab" && n.ingredientId === id);
  const complete = stage === STAGES.length; // outcome screen

  useEffect(() => { headRef.current?.focus({ preventScroll: true }); }, [stage]);

  const pick = (id: BotanicalId) => {
    setBid(id); setStage(0); setMaxStage(0); setWords([]); setText(""); setSavedNote(null); setZoom(false);
    setParams({ b: id }, { replace: true });
    announce(`${botanicalById(id).name} selected. Stage 1 of 5: Discover.`);
  };
  const go = (i: number) => { setStage(i); setMaxStage((m) => Math.max(m, i)); };
  const restart = () => { setStage(0); setWords([]); setText(""); setSavedNote(null); announce("Simulation restarted."); };
  const save = () => {
    const n = addNote({ ingredientId: bid, descriptors: words, text: text.trim(), source: "nature-lab" });
    setSavedNote(n.id);
    announce("Learning note saved.");
  };

  const sourceLabel = source === "own" ? "your own sample" : source === "kit" ? "the kit sample (demo)" : "a prepared reference sample";
  const st = STAGES[Math.min(stage, STAGES.length - 1)];

  return (
    <div className="nature">
      <div className="container section--tight">
        <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link><span aria-hidden>/</span><span aria-current="page">Nature Lab</span></nav>
        <header className="page-head">
          <p className="eyebrow">Nature Lab · educational simulation</p>
          <h1 className="h1">From material to impression</h1>
          <p className="lead">Follow how a botanical becomes an extract — as a concept. No real protocol, no ratios, no heat. Just the ideas a perfumer works with.</p>
        </header>

        <div className="notice notice--ink nature__disclaimer" role="note">
          <ShieldAlert size={18} aria-hidden style={{ color: "var(--c-champagne)" }} />
          <p><strong>Learning only.</strong> {NATURE_DISCLAIMER}</p>
        </div>

        <div className="nature__pick" role="radiogroup" aria-label="Choose a botanical experiment">
          {BOTANICALS.map((x) => (
            <button key={x.id} role="radio" aria-checked={bid === x.id} className="nat-pick" onClick={() => pick(x.id)}>
              <img src={x.image} alt="" />
              <span>{x.name.replace("Dried ", "")} experiment</span>
              {done(x.id) && <span className="nat-pick__done"><Check size={12} aria-hidden /> Note saved</span>}
            </button>
          ))}
        </div>

        <div className="sim">
          <ol className="sim__steps" aria-label="Simulation progress">
            {STAGES.map((s, i) => (
              <li key={s.stage}>
                <button className={`sim__step ${i === stage ? "is-current" : ""} ${i < stage || complete ? "is-done" : ""}`} onClick={() => go(i)} disabled={i > maxStage} aria-current={i === stage ? "step" : undefined}>
                  <span className="sim__dot num">{i < stage || complete ? <Check size={12} aria-hidden /> : i + 1}</span>
                  <span>{s.title.split(" ")[0]}</span>
                </button>
              </li>
            ))}
            <li>
              <button className={`sim__step ${complete ? "is-current" : ""}`} onClick={() => go(STAGES.length)} disabled={maxStage < STAGES.length} aria-current={complete ? "step" : undefined}>
                <span className="sim__dot"><NotebookPen size={12} aria-hidden /></span><span>Outcome</span>
              </button>
            </li>
          </ol>

          <div className="sim__body">
            <div className="sim__visual">
              <SimVisual stage={complete ? 4 : stage} bid={bid} zoom={zoom} />
              {stage === 0 && (
                <button className="btn btn--light btn--sm sim__zoom" onClick={() => setZoom((z) => !z)} aria-pressed={zoom}>
                  {zoom ? <ZoomOut size={16} aria-hidden /> : <ZoomIn size={16} aria-hidden />} {zoom ? "Zoom out" : "Inspect closely"}
                </button>
              )}
              <span className="sim__tag small">Simulation</span>
            </div>

            <div className="sim__text">
              {!complete ? (
                <>
                  <p className="eyebrow num">Stage {stage + 1} of {STAGES.length} · {b.name}</p>
                  <h2 className="h2" ref={headRef} tabIndex={-1}>{st.title}</h2>
                  <p className="lead">{st.body}</p>
                  <details className="disclosure" open={stage === 0}>
                    <summary>What to know<ArrowRight size={16} aria-hidden /></summary>
                    <div>{st.learn}</div>
                  </details>

                  {stage === 0 && (
                    <div className="stack" style={{ marginTop: 16 }}>
                      <p className="small"><strong>Smell reference:</strong> {b.sensory}</p>
                      <fieldset className="source">
                        <legend className="label">Which sample are you exploring?</legend>
                        {([["kit", "The sample included in the demo kit"], ["own", "My own, at home"], ["reference", "A prepared reference sample (no material needed)"]] as [Source, string][]).map(([v, l]) => (
                          <label key={v} className="radio"><input type="radio" name="src" checked={source === v} onChange={() => setSource(v)} /> {l}</label>
                        ))}
                      </fieldset>
                      <p className="small muted">Don’t have it? <Link className="link" to={`/ingredients/${accord.id}`}>Continue with the related {accord.name} accord instead</Link>.</p>
                    </div>
                  )}
                  {stage === 2 && <Notice>This is a sealed, illustrative animation. Extraction conditions are set by specialists and are not given here. Do not heat materials or alcohol.</Notice>}
                  {stage === 3 && <Notice>Even a clear, filtered extract can contain contaminants and is not automatically skin-safe.</Notice>}
                  {stage === 4 && (
                    <fieldset className="words">
                      <legend className="label">Which words match your impression of {sourceLabel}?</legend>
                      <div className="row row--tight">
                        {EVALUATE_WORDS.map((w) => (
                          <button key={w} className="chip" aria-pressed={words.includes(w)} onClick={() => setWords((ws) => ws.includes(w) ? ws.filter((x) => x !== w) : [...ws, w].slice(-5))}>{w}</button>
                        ))}
                      </div>
                      <p className="small muted">Choose up to five. Perception varies — there is no wrong answer.</p>
                    </fieldset>
                  )}

                  <div className="sim__nav">
                    <button className="btn btn--secondary" onClick={() => go(stage - 1)} disabled={stage === 0}><ArrowLeft size={16} aria-hidden /> Back</button>
                    <button className="btn" onClick={() => go(stage + 1)} disabled={stage === 4 && words.length === 0}>
                      {stage === 4 ? "See outcome" : "Next"} <ArrowRight size={16} aria-hidden />
                    </button>
                  </div>
                  {stage === 4 && words.length === 0 && <p className="small muted">Pick at least one word to continue.</p>}
                  <button className="link small" onClick={restart} style={{ marginTop: 16 }}><RotateCcw size={14} aria-hidden /> Restart simulation</button>
                </>
              ) : (
                <div className="outcome">
                  <p className="eyebrow">Outcome</p>
                  <h2 className="h2" ref={headRef} tabIndex={-1}>Observation card</h2>
                  <div className="obs-card">
                    <div className="obs-card__head">
                      <Img src={b.image} alt="" className="obs-card__img" ratio="1/1" />
                      <div>
                        <p className="h4">{b.name}</p>
                        <p className="small muted">Explored with {sourceLabel} · educational simulation</p>
                      </div>
                    </div>
                    <dl className="facts">
                      <div><dt>You noticed</dt><dd>{words.join(", ")}</dd></div>
                      <div><dt>Often described as</dt><dd>{b.descriptors.join(", ")}</dd></div>
                      <div><dt>What you learned</dt><dd>Aroma moves from a material into a medium; the result must then be separated, evaluated and — before any skin use — professionally assessed.</dd></div>
                      <div><dt>Status</dt><dd>Concept only. Not a chemically verified extract.</dd></div>
                    </dl>
                    <div className="field">
                      <label htmlFor="note">Your note (optional)</label>
                      <textarea id="note" className="input" maxLength={280} value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. Brighter on the broken edge than the outside." disabled={!!savedNote} />
                    </div>
                    {savedNote ? (
                      <p className="saved-inline"><Check size={16} aria-hidden /> Learning note saved to your discoveries.</p>
                    ) : (
                      <button className="btn" onClick={save}><NotebookPen size={16} aria-hidden /> Save learning note</button>
                    )}
                  </div>
                  <div className="next-steps">
                    <p className="eyebrow">Next safe step</p>
                    <p className="body-2">For composition, continue with the related <strong>{accord.name} accord</strong> — a demo input, not this botanical.</p>
                    <div className="row">
                      <button className="btn" onClick={() => { addToBlend(accord.id); nav("/lab"); }}><FlaskConical size={16} aria-hidden /> Add {accord.name} accord &amp; open Lab</button>
                      <Link to={`/ingredients/${accord.id}`} className="btn btn--secondary">Learn about {accord.name}</Link>
                    </div>
                    <button className="link small" onClick={restart} style={{ marginTop: 16 }}><RotateCcw size={14} aria-hidden /> Run this experiment again</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimVisual({ stage, bid, zoom }: { stage: number; bid: BotanicalId; zoom: boolean }) {
  const b = botanicalById(bid);
  const tint = EXTRACT_COLOR[bid];
  if (stage === 0) {
    return (
      <div className={`sim-photo ${zoom ? "is-zoom" : ""}`}>
        <img src={b.image} alt={b.imageAlt} />
      </div>
    );
  }
  if (stage === 1) {
    return (
      <svg viewBox="0 0 400 300" className="sim-svg" role="img" aria-label={`${b.name} resting in a shallow ceramic dish, with notes that preparation varies by material`}>
        <ellipse cx="200" cy="230" rx="150" ry="26" fill="#e9e4dc" />
        <ellipse cx="200" cy="222" rx="140" ry="22" fill="#f8f6f2" stroke="#c8c0b4" />
        <clipPath id="dish"><ellipse cx="200" cy="214" rx="120" ry="60" /></clipPath>
        <image href={b.image} x="110" y="130" width="180" height="100" preserveAspectRatio="xMidYMid slice" clipPath="url(#dish)" opacity="0.95" />
        {["Dried or fresh?", "Whole or broken?", "Which part?"].map((t, i) => (
          <g key={t} transform={`translate(${60 + i * 140} ${60 + (i % 2) * 20})`}>
            <rect x="-56" y="-16" width="112" height="30" rx="15" fill="#fff" stroke="#c8c0b4" />
            <text x="0" y="4" textAnchor="middle" fontSize="12" fontFamily="var(--font-sans)" fill="#34312d">{t}</text>
          </g>
        ))}
      </svg>
    );
  }
  if (stage === 2) {
    return (
      <svg viewBox="0 0 400 300" className="sim-svg" role="img" aria-label="A sealed glass jar holding the material in a clear medium that slowly takes on colour">
        <defs>
          <linearGradient id="jarg" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0.9" /><stop offset="1" stopColor="#d8d0c4" stopOpacity="0.5" /></linearGradient>
          <clipPath id="jarin"><rect x="136" y="96" width="128" height="164" rx="16" /></clipPath>
        </defs>
        <ellipse cx="200" cy="278" rx="90" ry="8" fill="#20170c" opacity="0.12" />
        <rect x="140" y="56" width="120" height="30" rx="4" fill="#141312" />
        <text x="200" y="76" textAnchor="middle" fontSize="11" letterSpacing="2" fill="#b89972" fontFamily="var(--font-sans)">SEALED</text>
        <g clipPath="url(#jarin)">
          <rect x="130" y="110" width="140" height="160" fill="#f4efe6" />
          <rect x="130" y="110" width="140" height="160" fill={tint} className="tint-rise" />
          <image href={b.image} x="150" y="170" width="100" height="80" preserveAspectRatio="xMidYMid slice" opacity="0.85" />
          {[0, 1, 2, 3, 4].map((i) => <circle key={i} className="mote" cx={160 + i * 20} cy="240" r="2.2" fill="#fff" style={{ animationDelay: `${i * 0.6}s` }} />)}
        </g>
        <rect x="132" y="86" width="136" height="180" rx="18" fill="url(#jarg)" fillOpacity="0.35" stroke="#5f574b" strokeOpacity="0.35" />
        <path d="M146 104 V250" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
        <text x="300" y="150" fontSize="12" fontFamily="var(--font-sans)" fill="#57534d">aroma moves</text>
        <text x="300" y="166" fontSize="12" fontFamily="var(--font-sans)" fill="#57534d">into the medium</text>
        <path d="M296 158 C280 160 276 170 262 176" stroke="#57534d" fill="none" markerEnd="" />
      </svg>
    );
  }
  if (stage === 3) {
    return (
      <svg viewBox="0 0 400 300" className="sim-svg" role="img" aria-label="Liquid passing through a paper filter in a funnel and collecting clear in a flask below">
        <path d="M130 50 L270 50 L214 140 L214 170 L186 170 L186 140 Z" fill="#fff" fillOpacity="0.5" stroke="#5f574b" strokeOpacity="0.35" />
        <path d="M146 56 L254 56 L208 130 L192 130 Z" fill="#f8f6f2" stroke="#c8c0b4" strokeDasharray="3 3" />
        <image href={b.image} x="160" y="58" width="80" height="34" preserveAspectRatio="xMidYMid slice" opacity="0.8" />
        {[0, 1, 2].map((i) => <ellipse key={i} className="drip" cx="200" cy="176" rx="3" ry="4.5" fill={tint} style={{ animationDelay: `${i * 0.5}s` }} />)}
        <path d="M150 196 L250 196 L250 200 C250 200 286 230 286 256 C286 276 270 284 250 284 L150 284 C130 284 114 276 114 256 C114 230 150 200 150 200 Z" fill="#fff" fillOpacity="0.45" stroke="#5f574b" strokeOpacity="0.35" />
        <clipPath id="flask"><path d="M118 256 C118 236 150 210 150 210 L250 210 C250 210 282 236 282 256 C282 274 268 280 250 280 L150 280 C132 280 118 274 118 256 Z" /></clipPath>
        <rect x="100" y="244" width="200" height="50" fill={tint} opacity="0.75" clipPath="url(#flask)" className="pool" />
        <text x="300" y="92" fontSize="12" fontFamily="var(--font-sans)" fill="#57534d">solids stay</text>
        <text x="300" y="250" fontSize="12" fontFamily="var(--font-sans)" fill="#57534d">liquid passes</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 400 300" className="sim-svg" role="img" aria-label="Two paper blotter strips: one dipped in the extract concept, one in a reference, held side by side for comparison">
      <g transform="rotate(-8 160 150)">
        <rect x="140" y="30" width="34" height="230" fill="#fff" stroke="#c8c0b4" />
        <rect x="140" y="190" width="34" height="70" fill={tint} opacity="0.55" className="soak" />
        <text x="157" y="60" textAnchor="middle" fontSize="10" fontFamily="var(--font-sans)" fill="#57534d" transform="rotate(-90 157 60)">extract concept</text>
      </g>
      <g transform="rotate(6 240 150)">
        <rect x="226" y="30" width="34" height="230" fill="#fff" stroke="#c8c0b4" />
        <rect x="226" y="190" width="34" height="70" fill="#d9c6a3" opacity="0.5" />
        <text x="243" y="60" textAnchor="middle" fontSize="10" fontFamily="var(--font-sans)" fill="#57534d" transform="rotate(-90 243 60)">reference</text>
      </g>
    </svg>
  );
}
