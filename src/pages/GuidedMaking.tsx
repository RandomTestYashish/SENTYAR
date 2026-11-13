// Guided Making: a scroll/step-led, animated demonstration of using the kit.
// This is an interactive animation built in the browser (no recorded video
// exists yet). Narration uses the device's own text-to-speech voice when the
// learner turns it on. All physical amounts defer to the printed recipe card.

import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Captions, HelpCircle, ListChecks, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { useApp } from "../app/store";
import { recipeById } from "../data/fragrances";
import { kitById, KIT_TOOL_LABEL } from "../data/kits";
import { accordById } from "../data/ingredients";
import { CHAPTERS, buildSteps, type Scene } from "../data/tutorial";
import { Vessel } from "../components/Vessel";
import { OilBottle } from "../components/KitItems";
import { BottlePhoto } from "../components/BottlePhoto";
import { Dialog, Notice } from "../components/ui";
import { prefersReducedMotion } from "../lib/fly";
import type { Blend } from "../lib/types";
import NotFoundish from "./NotFoundish";

const Bottle3D = lazy(() => import("../features/lab/Bottle3D"));
const IMG = "./assets/img/";
const STEP_MS = 6500;

export default function GuidedMaking() {
  const { id = "" } = useParams();
  const recipe = recipeById(id);
  const { loadBlend, setBase } = useApp();
  const nav = useNavigate();
  const accords = useMemo(() => (recipe ? recipe.blend.map((e) => ({ id: e.accordId, name: accordById(e.accordId).name })) : []), [recipe]);
  const steps = useMemo(() => buildSteps(accords), [accords]);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [lang, setLang] = useState<"hi" | "en">("hi");
  const [subs, setSubs] = useState(true);
  const [voice, setVoice] = useState(false);
  const [stuck, setStuck] = useState(false);
  const [needs, setNeeds] = useState(false);
  const [pourKey, setPourKey] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  const step = steps[i];
  const last = i === steps.length - 1;
  const go = useCallback((n: number) => setI(Math.max(0, Math.min(steps.length - 1, n))), [steps.length]);

  // autoplay
  useEffect(() => {
    if (!playing || last) { if (last) setPlaying(false); return; }
    const t = window.setTimeout(() => go(i + 1), STEP_MS);
    return () => window.clearTimeout(t);
  }, [playing, i, last, go]);

  // base pour animation trigger
  useEffect(() => { if (step?.scene.kind === "base") setPourKey((k) => k + 1); }, [step]);

  // narration via the device voice (optional)
  useEffect(() => {
    if (!voice || !step || !("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(lang === "hi" ? step.hi : step.en);
    u.lang = lang === "hi" ? "hi-IN" : "en-IN"; u.rate = 0.95;
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(u);
    return () => window.speechSynthesis.cancel();
  }, [voice, step, lang]);
  useEffect(() => () => { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); }, []);

  // keyboard: arrows, space
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input, textarea, dialog")) return;
      if (e.key === "ArrowRight") go(i + 1);
      else if (e.key === "ArrowLeft") go(i - 1);
      else if (e.key === " " && document.activeElement === stageRef.current) { e.preventDefault(); setPlaying((p) => !p); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [i, go]);

  if (!recipe) return <NotFoundish what="tutorial" back="/studio/recipes" />;
  const kit = kitById(recipe.kitId)!;
  const chapterIdx = CHAPTERS.findIndex((c) => c.id === step.chapter);
  const play = () => { setStarted(true); setPlaying(true); if (last) go(0); };
  const finish = () => { loadBlend(recipe.blend, recipe.name, recipe.id); setBase(true); nav("/lab/preview"); };

  return (
    <div className="gm">
      <div className="container gm__top">
        <nav aria-label="Breadcrumb" className="crumbs"><Link to="/studio">My Studio</Link><span aria-hidden>/</span><Link to={`/studio/recipes/${recipe.id}`}>{recipe.name}</Link><span aria-hidden>/</span><span aria-current="page">Guided Making</span></nav>
        <div className="gm__titlerow">
          <h1 className="gm__title">Make <em>{recipe.name}</em></h1>
          <div className="gm__tools">
            <div className="seg seg--sm" role="radiogroup" aria-label="Language">
              <button role="radio" aria-checked={lang === "hi"} onClick={() => setLang("hi")} lang="hi">हिंदी</button>
              <button role="radio" aria-checked={lang === "en"} onClick={() => setLang("en")}>English</button>
            </div>
            <button className="icon-btn icon-btn--sm" aria-pressed={subs} onClick={() => setSubs((s) => !s)} aria-label={subs ? "Hide subtitles" : "Show subtitles"} title="Subtitles"><Captions size={17} /></button>
            {"speechSynthesis" in window && <button className="icon-btn icon-btn--sm" aria-pressed={voice} onClick={() => setVoice((v) => !v)} aria-label={voice ? "Turn narration off" : "Turn narration on"} title="Narration (device voice)">{voice ? <Volume2 size={17} /> : <VolumeX size={17} />}</button>}
            <button className="btn btn--ghost btn--sm" onClick={() => setNeeds(true)}><ListChecks size={15} aria-hidden /> What you need</button>
          </div>
        </div>
        <ol className="gm__chapters" aria-label="Chapters">
          {CHAPTERS.map((c, ci) => {
            const first = steps.findIndex((s) => s.chapter === c.id);
            return (
              <li key={c.id}>
                <button className={`gm__chapter ${ci === chapterIdx ? "is-on" : ""} ${ci < chapterIdx ? "is-done" : ""}`} onClick={() => go(first)} aria-current={ci === chapterIdx ? "step" : undefined}>
                  <span className="gm__chn num">{ci + 1}</span><span lang={lang}>{lang === "hi" ? c.hi : c.en}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="container gm__body">
        <div className="gm__stage" ref={stageRef} tabIndex={0} aria-label="Demonstration. Use the arrow keys to move between steps, space to play or pause." aria-roledescription="animated demonstration">
          <SceneView scene={step.scene} recipeBlend={recipe.blend} kitImage={kit.image} pourKey={pourKey} name={recipe.name} key={step.id} />
          {!started && (
            <button className="gm__bigplay" onClick={play} aria-label="Play the demonstration"><Play size={30} aria-hidden /><span>Play demonstration</span></button>
          )}
          {subs && started && <p className="gm__subs" lang={lang} aria-hidden>{lang === "hi" ? step.hi : step.en}</p>}
          <span className="gm__sim small">Animated demonstration</span>
        </div>

        <aside className="gm__panel" aria-live="polite">
          <p className="gm__count small num">Step {i + 1} of {steps.length} · <span lang={lang}>{lang === "hi" ? CHAPTERS[chapterIdx].hi : CHAPTERS[chapterIdx].en}</span></p>
          <p className="gm__say" lang={lang}>{lang === "hi" ? step.hi : step.en}</p>
          <p className="gm__alt small muted" lang={lang === "hi" ? "en" : "hi"}>{lang === "hi" ? step.en : step.hi}</p>
          {(step.scene.kind === "drop" || step.scene.kind === "rest" || step.scene.kind === "mix") && (
            <Notice tone="warn"><strong>Use your recipe card.</strong> Amounts and times come only from the printed, reviewed card in your kit. The beaker on screen is illustrative.</Notice>
          )}
          {last && (
            <div className="gm__done">
              <button className="btn" onClick={finish}>Save as a creation</button>
              <Link to={`/studio/recipes/${recipe.id}`} className="btn btn--secondary">Back to recipe</Link>
            </div>
          )}
          <button className="link small gm__stuckbtn" onClick={() => { setPlaying(false); setStuck(true); }}><HelpCircle size={14} aria-hidden /> {lang === "hi" ? "मैं अटक गया हूँ" : "I am stuck"}</button>
        </aside>
      </div>

      <div className="container gm__bar" role="group" aria-label="Playback controls">
        <button className="icon-btn" onClick={() => go(i - 1)} disabled={i === 0} aria-label="Back"><ArrowLeft size={18} /></button>
        <button className="gm__play" onClick={() => (playing ? setPlaying(false) : play())} aria-label={playing ? "Pause" : last ? "Replay from the start" : "Play"}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
        <button className="icon-btn" onClick={() => go(i + 1)} disabled={last} aria-label="Next"><ArrowRight size={18} /></button>
        <div className="gm__progress" aria-hidden><span style={{ width: `${((i + 1) / steps.length) * 100}%` }} />{playing && !last && <span className="gm__tick" key={`t${i}`} style={{ animationDuration: `${STEP_MS}ms`, left: `${(i / steps.length) * 100}%`, width: `${100 / steps.length}%` }} />}</div>
        <button className="icon-btn" onClick={() => { go(0); setStarted(true); setPlaying(true); }} aria-label="Replay from the start"><RotateCcw size={17} /></button>
      </div>

      <Dialog open={stuck} onClose={() => setStuck(false)} title={lang === "hi" ? "मदद" : "Help with this step"}
        footer={<><button className="btn btn--secondary btn--sm" onClick={() => { setStuck(false); setStarted(true); }}>Watch this step again</button><button className="btn btn--sm" onClick={() => setStuck(false)}>Continue</button></>}>
        <div className="stack">
          {step.stuck.length ? step.stuck.map((s) => (
            <div key={s.q} className="gm__faq"><p className="h4">{s.q}</p><p lang="hi">{s.aHi}</p><p className="small muted">{s.aEn}</p></div>
          )) : <p>You’re at the end. If something went wrong along the way, open the recipe card’s troubleshooting section.</p>}
          <Notice>Still stuck? In the full product this connects to SENTYAR support. In this prototype, support is not connected.</Notice>
        </div>
      </Dialog>

      <Dialog open={needs} onClose={() => setNeeds(false)} title="What you need" footer={<button className="btn btn--sm" onClick={() => setNeeds(false)}>Got it</button>}>
        <div className="stack">
          <p className="eyebrow">From the {kit.name}</p>
          <ul role="list" className="gm__needs">
            {accords.map((a) => <li key={a.id}><OilBottle name={a.name} color={accordById(a.id).swatch} className="gm__needimg" /><span>{a.name} accord</span></li>)}
          </ul>
          <ul role="list" className="kit-tools">{kit.tools.map((t) => <li key={t}>{KIT_TOOL_LABEL[t]}</li>)}</ul>
        </div>
      </Dialog>
    </div>
  );
}

function SceneView({ scene, recipeBlend, kitImage, pourKey, name }: { scene: Scene; recipeBlend: Blend; kitImage: string; pourKey: number; name: string }) {
  const reduced = prefersReducedMotion();
  const upto = scene.kind === "drop" ? scene.upto : ["base", "mix", "rest", "blotter"].includes(scene.kind) ? recipeBlend.length : 0;
  const partial = recipeBlend.slice(0, upto);
  const showBeaker = ["drop", "base", "mix", "rest", "blotter"].includes(scene.kind);
  const baseIn = ["base", "mix", "rest", "blotter"].includes(scene.kind);

  switch (scene.kind) {
    case "kit":
      return <div className="sc sc--kit"><img src={kitImage} alt="Your kit, opened" className="sc__kit" /></div>;
    case "lineup":
    case "pick":
      return (
        <div className="sc sc--lineup">
          {recipeBlend.map((e, n) => (
            <div key={e.accordId} className={`sc__vial ${scene.kind === "pick" && scene.accord === e.accordId ? "is-picked" : scene.kind === "pick" ? "is-dim" : ""}`} style={{ "--n": n } as CSSProperties}>
              <OilBottle name={accordById(e.accordId).name} color={accordById(e.accordId).swatch} className="sc__oil" />
            </div>
          ))}
          <img src={`${IMG}tool-alcohol.webp`} alt="" className={`sc__alcohol ${scene.kind === "pick" ? "is-dim" : ""}`} />
        </div>
      );
    default:
      break;
  }
  if (showBeaker) {
    const a = scene.kind === "drop" ? accordById(scene.accord) : null;
    return (
      <div className={`sc sc--beaker sc--${scene.kind}`}>
        {scene.kind === "drop" && a && (
          <>
            <div className="sc__holdvial"><OilBottle name={a.name} color={a.swatch} className="sc__oil" /></div>
            <img src={`${IMG}tool-pipettes.webp`} alt="" className="sc__pipette" />
            {!reduced && <span className="sc__drops" style={{ "--c": a.swatch } as CSSProperties}><i /><i /><i /></span>}
          </>
        )}
        {scene.kind === "base" && <img src={`${IMG}tool-alcohol.webp`} alt="" className="sc__pourbottle" />}
        {scene.kind === "blotter" && <><img src={`${IMG}tool-blotters.webp`} alt="" className="sc__blotter" /><span className="sc__waves" aria-hidden><i /><i /><i /></span></>}
        {scene.kind === "rest" && <span className="sc__rest" aria-hidden>☾</span>}
        <div className={`sc__vessel ${scene.kind === "mix" && !reduced ? "is-swirl" : ""}`}>
          <Vessel blend={partial} baseAdded={baseIn} pourKey={scene.kind === "base" ? pourKey : 0} dropKey={scene.kind === "drop" ? upto : 0} dropColor={a?.swatch} />
        </div>
      </div>
    );
  }
  if (scene.kind === "transfer") {
    return (
      <div className="sc sc--transfer">
        <img src={`${IMG}tool-funnel.webp`} alt="" className="sc__funnel" />
        <div className="sc__fill"><BottlePhoto concept="pebble" engrave={false} className="sc__bottle" /></div>
      </div>
    );
  }
  if (scene.kind === "cap") {
    return (
      <div className="sc sc--cap">
        <div className="sc__capbottle"><BottlePhoto concept="pebble" name={name} className="sc__bottle" /></div>
        <span className="sc__click" aria-hidden />
      </div>
    );
  }
  // done: the finished bottle in 3D, with the photo as fallback
  return (
    <div className="sc sc--done">
      <Suspense fallback={<BottlePhoto concept="pebble" name={name} className="sc__bottle" />}>
        <Bottle3D concept="pebble" name={name} autoRotate={!reduced} resetKey={0} background="#fbf7f0" />
      </Suspense>
    </div>
  );
}
