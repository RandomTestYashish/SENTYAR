// Shared bottle + cap + volume selector (bottom sheet). Used on kit selection,
// inspired fragrances, the Preview / save step and when reordering a creation.
// The live preview is the real-time 3D model of exactly the chosen combination,
// with the matching studio photograph as fallback when WebGL is unavailable.

import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Dialog } from "./ui";
import { BottlePhoto } from "./BottlePhoto";
import { BODIES, CAP_FINISHES, CAP_SHAPES, bodyById, capLabel } from "../data/bottles";
import type { BottleConceptId, BottleVolume, CapChoice } from "../lib/types";

const Bottle3D = lazy(() => import("../features/lab/Bottle3D"));

export interface BottleConfig { body: BottleConceptId; cap: CapChoice; volume: BottleVolume }

function canWebGL() {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}

const CapIcon = ({ shape }: { shape: CapChoice["shape"] }) => (
  <svg viewBox="0 0 40 40" width="28" height="28" aria-hidden>
    {shape === "classic" && <rect x="11" y="10" width="18" height="18" rx="6" fill="currentColor" />}
    {shape === "tall" && <rect x="15" y="4" width="10" height="28" rx="2" fill="currentColor" />}
    {shape === "disc" && <rect x="8" y="17" width="24" height="8" rx="2" fill="currentColor" />}
    {shape === "gem" && <polygon points="12,26 28,26 31,18 24,10 16,10 9,18" fill="currentColor" />}
    <rect x="16" y="32" width="8" height="4" fill="currentColor" opacity=".5" />
  </svg>
);

export function BottleConfigurator({ open, onClose, value, onConfirm, sizes, name = "Your creation", confirmLabel = "Use this bottle" }: {
  open: boolean; onClose: () => void; value: BottleConfig; onConfirm: (c: BottleConfig) => void;
  /** volumes allowed by the context (e.g. the kit); intersected with each body's volumes */
  sizes?: BottleVolume[]; name?: string; confirmLabel?: string;
}) {
  const [cfg, setCfg] = useState<BottleConfig>(value);
  const gl = useMemo(() => canWebGL(), []);
  useEffect(() => { if (open) setCfg(value); }, [open, value]);
  const body = bodyById(cfg.body);
  const allowed = (b: BottleConceptId) => bodyById(b).volumes.filter((v) => !sizes || sizes.includes(v));
  const pickBody = (b: BottleConceptId) => {
    const vols = allowed(b);
    setCfg((c) => ({ body: b, cap: bodyById(b).defaultCap, volume: vols.includes(c.volume) ? c.volume : vols[0] }));
  };

  return (
    <Dialog open={open} onClose={onClose} title="Choose your bottle and cap" variant="sheet" wide
      footer={<>
        <p className="small muted bc__sum">{body.name} · {capLabel(cfg.cap)} · {cfg.volume} ml</p>
        <button className="btn btn--sm" onClick={() => { onConfirm(cfg); onClose(); }}>{confirmLabel}</button>
      </>}>
      <div className="bc">
        <div className="bc__preview" aria-live="polite">
          {gl ? (
            <Suspense fallback={<div className="bc__loading small muted">Preparing preview…</div>}>
              <Bottle3D concept={cfg.body} cap={cfg.cap} volume={cfg.volume} name={name} autoRotate resetKey={0} background="#fbf7f0" />
            </Suspense>
          ) : (
            <BottlePhoto concept={cfg.body} name={name} className="bc__photo" />
          )}
          <p className="bc__tag small"><strong>{cfg.volume} ml</strong> · drag to turn</p>
        </div>

        <div className="bc__opts">
          <fieldset className="bc__group">
            <legend className="eyebrow">Bottle</legend>
            <div className="bc__bodies" role="radiogroup" aria-label="Bottle body">
              {BODIES.filter((b) => allowed(b.id).length > 0).map((b) => (
                <button key={b.id} role="radio" aria-checked={cfg.body === b.id} className="bc__body" onClick={() => pickBody(b.id)} aria-label={b.name}>
                  <BottlePhoto concept={b.id} engrave={false} className="bc__thumb" />
                  <span>{b.name.replace("The ", "")}</span>
                  {cfg.body === b.id && <Check size={12} className="bc__check" aria-hidden />}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="bc__group">
            <legend className="eyebrow">Cap shape</legend>
            <div className="bc__caps" role="radiogroup" aria-label="Cap shape">
              {CAP_SHAPES.map((c) => (
                <button key={c.id} role="radio" aria-label={`${c.name} cap`} aria-checked={cfg.cap.shape === c.id} className={`bc__cap bc__cap--${cfg.cap.finish}`} onClick={() => setCfg((x) => ({ ...x, cap: { ...x.cap, shape: c.id } }))}>
                  <CapIcon shape={c.id} /><span>{c.name}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="bc__row">
            <fieldset className="bc__group">
              <legend className="eyebrow">Finish</legend>
              <div className="bc__finishes" role="radiogroup" aria-label="Cap finish">
                {CAP_FINISHES.map((f) => (
                  <button key={f.id} role="radio" aria-label={`${f.name} finish`} aria-checked={cfg.cap.finish === f.id} className="bc__finish" onClick={() => setCfg((x) => ({ ...x, cap: { ...x.cap, finish: f.id } }))}>
                    <span className="bc__swatch" style={{ background: f.swatch }} aria-hidden />{f.name}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="bc__group">
              <legend className="eyebrow">Volume</legend>
              <div className="seg" role="radiogroup" aria-label="Bottle volume">
                {([10, 50, 100] as BottleVolume[]).map((v) => {
                  const ok = allowed(cfg.body).includes(v);
                  return <button key={v} role="radio" aria-checked={cfg.volume === v} disabled={!ok} title={ok ? undefined : "Not offered for this bottle or kit"} onClick={() => setCfg((x) => ({ ...x, volume: v }))}>{v} ml</button>;
                })}
              </div>
            </fieldset>
          </div>
          <p className="small muted">Only these curated bodies, caps and sizes are offered. Combinations shown are previews of the real catalogue options.</p>
        </div>
      </div>
    </Dialog>
  );
}
