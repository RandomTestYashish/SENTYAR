import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, ChevronDown, ChevronUp, RotateCcw, X } from "lucide-react";
import { useApp, type Store } from "../../app/store";
import { Dialog } from "../../components/ui";
import { Emblem } from "../../components/Logo";

interface Step {
  title: string;
  body: string;
  path: string;
  done?: (s: Store) => boolean;
}

export const TOUR: Step[] = [
  { title: "Open the Creator Kit", body: "Lift the lid and look at the three compartments: accords, botanicals and tools.", path: "/kits/creator-kit-v1/unbox" },
  { title: "Select a botanical sample", body: "Choose the dried orange peel (or any botanical) to read its card and add it to your exploration tray.", path: "/kits/creator-kit-v1/unbox", done: (s) => s.explore.length > 0 },
  { title: "Botanical vs accord", body: "A botanical is a raw material for smelling and learning. An accord is a prepared demo input for the formula. This page shows the difference.", path: "/ingredients/orange-peel" },
  { title: "Open the Nature Lab", body: "The Nature Lab is an educational simulation of how materials become extracts — no real protocol.", path: "/nature-lab" },
  { title: "Complete one simulation", body: "Step through Discover → Prepare → Extract → Filter → Evaluate and save a learning note.", path: "/nature-lab", done: (s) => s.notes.some((n) => n.source === "nature-lab") },
  { title: "Select two or more accords", body: "In the Perfume Lab, pick accords from the left-hand tray.", path: "/lab", done: (s) => s.draft.blend.length >= 2 },
  { title: "Add them to the vessel", body: "Use Add — watch each accord drop into the mixing vessel and appear in the formula.", path: "/lab", done: (s) => s.draft.blend.length >= 2 },
  { title: "Adjust the blend", body: "Move a slider. Other accords rescale so the blend stays at 100% and the bottle stays at 10 ml.", path: "/lab" },
  { title: "Preview your concept", body: "See the fixed 10 ml bottle fill with your blend.", path: "/lab/preview" },
  { title: "Name and save", body: "Give it a name and save it to My Creations. It stays after a refresh.", path: "/lab/preview", done: (s) => s.creations.length > 0 },
];

export function Tour() {
  const store = useApp();
  const { tourStep, setTourStep, setFlag } = store;
  const nav = useNavigate();
  const loc = useLocation();
  const [min, setMin] = useState(false);

  useEffect(() => { if (tourStep !== null) setMin(false); }, [tourStep]);
  if (tourStep === null) return null;
  const step = TOUR[tourStep];
  const here = loc.pathname === step.path;
  const done = step.done?.(store) ?? false;
  const exit = () => { setTourStep(null); setFlag("tourSeen"); };
  const go = (i: number) => {
    setTourStep(i);
    if (loc.pathname !== TOUR[i].path) nav(TOUR[i].path);
  };

  return (
    <aside className={`tour ${min ? "tour--min" : ""}`} aria-label="Guided tour" aria-live="polite">
      <div className="tour__head">
        <span className="eyebrow num">Guided tour · {tourStep + 1} of {TOUR.length}</span>
        <div className="row row--tight">
          <button className="icon-btn icon-btn--sm" onClick={() => setMin((m) => !m)} aria-label={min ? "Expand tour" : "Minimise tour"} aria-expanded={!min}>{min ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</button>
          <button className="icon-btn icon-btn--sm" onClick={exit} aria-label="Exit tour"><X size={16} /></button>
        </div>
      </div>
      <div className="steps" aria-hidden>{TOUR.map((_, i) => <span key={i} className={i <= tourStep ? "on" : ""} />)}</div>
      {!min && (
        <>
          <h2 className="h4 tour__title">{done && <Check size={18} aria-label="Completed" />} {step.title}</h2>
          <p className="small body-2">{step.body}</p>
          {!here && <button className="link link--arrow small" onClick={() => nav(step.path)}>Take me there <ArrowRight size={14} aria-hidden /></button>}
          <div className="tour__actions">
            <button className="btn btn--ghost btn--xs" onClick={() => go(0)} aria-label="Restart tour"><RotateCcw size={14} aria-hidden /> Restart</button>
            <span style={{ flex: 1 }} />
            <button className="btn btn--secondary btn--xs" onClick={() => go(tourStep - 1)} disabled={tourStep === 0}><ArrowLeft size={14} aria-hidden /> Back</button>
            {tourStep < TOUR.length - 1 ? (
              <button className="btn btn--xs" onClick={() => go(tourStep + 1)}>Next <ArrowRight size={14} aria-hidden /></button>
            ) : (
              <button className="btn btn--xs" onClick={exit}>Finish</button>
            )}
          </div>
          <button className="link small tour__skip" onClick={exit}>Skip tour</button>
        </>
      )}
    </aside>
  );
}

export function Welcome() {
  const { flags, setFlag, setTourStep } = useApp();
  const nav = useNavigate();
  const open = !flags.welcomeSeen;
  const close = () => setFlag("welcomeSeen");
  return (
    <Dialog open={open} onClose={close} title="Welcome to SENTYAR"
      footer={<>
        <button className="btn btn--secondary btn--sm" onClick={close}>Explore on my own</button>
        <button className="btn btn--sm" onClick={() => { close(); setTourStep(0); nav(TOUR[0].path); }}>Take the guided tour</button>
      </>}>
      <div className="welcome">
        <Emblem size={48} />
        <p className="lead" style={{ fontSize: "1rem" }}>A personal perfumery studio. Here is how it works:</p>
        <ol className="welcome__list">
          <li><strong>Discover.</strong> Open the Creator Kit and meet real botanical materials and six demo fragrance accords.</li>
          <li><strong>Experiment.</strong> Learn in the Nature Lab, then compose a blend in the Perfume Lab — the bottle always stays 10 ml.</li>
          <li><strong>Create.</strong> Name, save, compare and revisit your creations.</li>
        </ol>
        <p className="small muted">This is a prototype. All ingredients, prices and formula values are illustrative demo data — nothing here is a skin-use recipe. You can replay the tour from How It Works at any time.</p>
      </div>
    </Dialog>
  );
}
