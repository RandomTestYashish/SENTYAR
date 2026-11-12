// Prefer — a pick-one-of-two taste quiz that turns visual preferences into a
// suggested demo blend. Scoring is an illustrative mapping, not a profile of
// the person and not a perfumery method.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FlaskConical, RotateCcw } from "lucide-react";
import { useApp } from "../app/store";
import { Vial } from "../components/ProductThumb";
import { accordById } from "../data/ingredients";
import { computeVolumes, distribute, formatMl } from "../lib/formula";
import { load, save } from "../lib/storage";
import { prefersReducedMotion } from "../lib/fly";
import type { AccordId, Blend } from "../lib/types";

const IMG = "./assets/img/";

type Side = "a" | "b";
interface Option { label: string; img?: string; vial?: AccordId; alt: string; w: Partial<Record<AccordId, number>> }
interface Round { axis: number; a: Option; b: Option }

const AXES: [string, string][] = [
  ["Fresh", "warm"], ["Floral", "woody"], ["Sheer", "dense"], ["Freeform", "precise"], ["Clean", "spicy"], ["Quiet", "bold"],
];

const ROUNDS: Round[] = [
  { axis: 0, a: { label: "Orange peel", img: `${IMG}orange-peel.jpg`, alt: "A curl of dried orange peel", w: { citrus: 2, musk: 1 } }, b: { label: "Cinnamon", img: `${IMG}cinnamon.jpg`, alt: "Rolled cinnamon bark quills", w: { vanilla: 1, spicy: 2 } } },
  { axis: 1, a: { label: "Rose petals", img: `${IMG}rose-petals.jpg`, alt: "Crimson rose petals with droplets", w: { rose: 2 } }, b: { label: "Cedarwood", img: `${IMG}cedarwood.jpg`, alt: "Strips of reddish cedarwood", w: { woody: 2 } } },
  { axis: 2, a: { label: "Clear glass", img: `${IMG}tex-glass.jpg`, alt: "Rippled clear glass texture", w: { citrus: 1, musk: 1 } }, b: { label: "Natural stone", img: `${IMG}tex-stone.jpg`, alt: "Pale mineral stone texture", w: { woody: 1, vanilla: 1 } } },
  { axis: 3, a: { label: "The Fluid", img: `${IMG}bottle-fluid.jpg`, alt: "An organic, asymmetric glass bottle with a stone cap", w: { rose: 1, musk: 1 } }, b: { label: "The Facet", img: `${IMG}bottle-facet.jpg`, alt: "A tall faceted glass bottle with an angular cap", w: { woody: 1, spicy: 1 } } },
  { axis: 4, a: { label: "Musk accord", vial: "musk", alt: "Musk accord vial", w: { musk: 2 } }, b: { label: "Spicy accord", vial: "spicy", alt: "Spicy accord vial", w: { spicy: 2 } } },
  { axis: 5, a: { label: "Matte black", img: `${IMG}tex-matte.jpg`, alt: "Soft-touch matte black board", w: { musk: 1, woody: 1 } }, b: { label: "Champagne foil", img: `${IMG}tex-foil.jpg`, alt: "Brushed champagne foil", w: { vanilla: 1, spicy: 1, rose: 1 } } },
  { axis: 0, a: { label: "Citrus accord", vial: "citrus", alt: "Citrus accord vial", w: { citrus: 2 } }, b: { label: "Vanilla accord", vial: "vanilla", alt: "Vanilla accord vial", w: { vanilla: 2 } } },
  { axis: 1, a: { label: "Rose accord", vial: "rose", alt: "Rose accord vial", w: { rose: 2 } }, b: { label: "Woody accord", vial: "woody", alt: "Woody accord vial", w: { woody: 2 } } },
  { axis: 3, a: { label: "The Orb", img: `${IMG}bottle-orb.jpg`, alt: "A rounded glass bottle with a slim gold cap", w: { rose: 1, vanilla: 1 } }, b: { label: "The Atelier", img: `${IMG}bottle-atelier.jpg`, alt: "A classic ribbed glass bottle with a black cap", w: { woody: 1, citrus: 1 } } },
  { axis: 5, a: { label: "Blind emboss", img: `${IMG}emboss.jpg`, alt: "The S-flower emblem embossed on black board", w: { musk: 1, woody: 1 } }, b: { label: "Still life", img: `${IMG}hero-stilllife.jpg`, alt: "Amber bottle among wood, orange and cinnamon", w: { spicy: 1, citrus: 1, vanilla: 1 } } },
];

const KEY = "prefer";
type Saved = { picks: Side[] };
const readSaved = (raw: unknown): Saved | null =>
  raw && typeof raw === "object" && Array.isArray((raw as Saved).picks)
    ? { picks: (raw as Saved).picks.filter((p) => p === "a" || p === "b").slice(0, ROUNDS.length) as Side[] }
    : null;

export function suggest(picks: Side[]): { blend: Blend; leanings: (0 | 1 | null)[]; name: string } {
  const score: Record<string, number> = {};
  const axisTally = AXES.map(() => [0, 0]);
  picks.forEach((p, i) => {
    const r = ROUNDS[i];
    Object.entries(r[p].w).forEach(([k, v]) => { score[k] = (score[k] ?? 0) + (v ?? 0); });
    axisTally[r.axis][p === "a" ? 0 : 1] += 1;
  });
  const top = (Object.entries(score) as [AccordId, number][]).sort((x, y) => y[1] - x[1]).slice(0, 3);
  const shares = top.length ? distribute(top.map((t) => t[1]), 100, 1) : [];
  const blend = top.map(([accordId], i) => ({ accordId, share: shares[i] }));
  const leanings = axisTally.map(([a, b]) => (a === b ? null : a > b ? 0 : 1)) as (0 | 1 | null)[];
  const words = leanings.map((l, i) => (l === null ? null : AXES[i][l])).filter(Boolean) as string[];
  const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
  const name = words.length >= 2 ? `${cap(words[0])} & ${cap(words[1])}` : "My Prefer blend";
  return { blend, leanings, name };
}

// ---------- floating object field (hero + result) ----------
const FIELD_IMGS = ["orange-peel", "cedarwood", "rose-petals", "cinnamon", "bottle-orb", "bottle-facet", "bottle-atelier", "bottle-fluid", "tex-glass", "tex-stone", "tex-foil", "tex-matte", "emboss", "kit-open"];
// x/y in % of the field, z 0 (far, blurred) → 1 (near, sharp)
const TILES = [
  [4, 8, 0.2], [14, 20, 0.6], [3, 46, 0.35], [12, 62, 1], [5, 82, 0.25], [22, 4, 0.15], [24, 86, 0.3],
  [70, 4, 0.2], [80, 10, 0.45], [90, 22, 1], [84, 40, 0.3], [94, 52, 0.2], [83, 70, 0.95], [86, 74, 0.35], [92, 88, 0.2],
  [34, 2, 0.1], [56, 92, 0.15], [40, 94, 0.1], [62, 2, 0.12], [1, 30, 0.1],
];

function Field({ dim }: { dim?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current!;
    let raf = 0;
    const on = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", String(e.clientX / window.innerWidth - 0.5));
        el.style.setProperty("--my", String(e.clientY / window.innerHeight - 0.5));
      });
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => { window.removeEventListener("pointermove", on); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className={`pf-field ${dim ? "pf-field--dim" : ""}`} ref={ref} aria-hidden>
      {TILES.map(([x, y, z], i) => (
        <span key={i} className={`pf-tile ${y > 16 && y < 84 ? "pf-tile--mid" : ""}`} style={{
          left: `${x}%`, top: `${y}%`, ["--z" as string]: z, ["--d" as string]: `${(i % 7) * -1.3}s`,
          width: `${72 + z * 72}px`,
        }}>
          <img src={`${IMG}${FIELD_IMGS[i % FIELD_IMGS.length]}.jpg`} alt="" loading="lazy" />
        </span>
      ))}
    </div>
  );
}

function Questions({ leanings, onHover }: { leanings?: (0 | 1 | null)[]; onHover?: boolean }) {
  return (
    <h1 className={`pf-q ${onHover ? "pf-q--hover" : ""}`}>
      {AXES.map(([a, b], i) => {
        const l = leanings?.[i];
        return (
          <span key={a} className="pf-q__line">
            <span className={`pf-w ${l === 0 ? "is-on" : ""}`}>{a}</span>{" "}
            <span className="pf-or">or</span>{" "}
            <span className={`pf-w ${l === 1 ? "is-on" : ""}`}>{b}</span>?
          </span>
        );
      })}
    </h1>
  );
}

function Pick({ o }: { o: Option }) {
  return o.img ? <img src={o.img} alt={o.alt} /> : (
    <span className="pf-vial" role="img" aria-label={o.alt}><Vial color={accordById(o.vial!).swatch} label={accordById(o.vial!).name} /></span>
  );
}

export default function Prefer() {
  const { loadBlend } = useApp();
  const nav = useNavigate();
  const [picks, setPicks] = useState<Side[]>(() => load(KEY, readSaved, { picks: [] }).value.picks);
  const [view, setView] = useState<"intro" | "quiz" | "result">(() => (picks.length >= ROUNDS.length ? "result" : "intro"));
  const [busy, setBusy] = useState(false);
  const stackRef = useRef<HTMLDivElement>(null);
  const qRef = useRef<HTMLParagraphElement>(null);
  const i = picks.length;
  const round = ROUNDS[Math.min(i, ROUNDS.length - 1)];
  const result = useMemo(() => suggest(picks), [picks]);

  useEffect(() => { save(KEY, { picks }); }, [picks]);
  useEffect(() => { if (view === "quiz") qRef.current?.focus({ preventScroll: true }); }, [view, i]);

  const choose = useCallback((side: Side, el: HTMLElement | null) => {
    if (busy || i >= ROUNDS.length) return;
    const done = () => {
      const next = [...picks, side];
      setPicks(next);
      setBusy(false);
      if (next.length >= ROUNDS.length) setView("result");
    };
    const img = el?.querySelector("img, svg");
    const target = stackRef.current;
    if (!img || !target || prefersReducedMotion()) return done();
    setBusy(true);
    const a = img.getBoundingClientRect(), b = target.getBoundingClientRect();
    const ghost = img.cloneNode(true) as HTMLElement;
    ghost.classList.add("pf-ghost");
    Object.assign(ghost.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px` });
    document.body.appendChild(ghost);
    const s = 44 / Math.max(a.width, a.height);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    ghost.animate([
      { transform: "translate(0,0) scale(1)", borderRadius: "8px" },
      { transform: `translate(${dx}px, ${dy}px) scale(${s}) rotate(${side === "a" ? -6 : 6}deg)`, borderRadius: "40px" },
    ], { duration: 560, easing: "cubic-bezier(0.65, 0, 0.35, 1)" }).finished.catch(() => undefined).finally(() => { ghost.remove(); done(); });
  }, [busy, i, picks]);

  useEffect(() => {
    if (view !== "quiz") return;
    const k = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowLeft") choose("a", document.querySelector('[data-side="a"]'));
      if (e.key === "ArrowRight") choose("b", document.querySelector('[data-side="b"]'));
      if (e.key === "Backspace" && picks.length) setPicks((p) => p.slice(0, -1));
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [view, choose, picks.length]);

  const restart = () => { setPicks([]); setView("quiz"); };

  // ---------- intro ----------
  if (view === "intro") {
    return (
      <section className="pf pf--hero">
        <Field />
        <div className="pf-hero__inner">
          <Questions onHover />
          <div className="pf-ctas">
            {picks.length > 0 ? (
              <>
                <button className="pf-pill pf-pill--ink" onClick={() => setView("quiz")}>Continue at {picks.length + 1} of {ROUNDS.length}</button>
                <button className="pf-pill" onClick={restart}>Start over</button>
              </>
            ) : (
              <button className="pf-pill pf-pill--ink" onClick={() => setView("quiz")}>Find out in {ROUNDS.length} picks</button>
            )}
            <button className="pf-pill" onClick={() => setView("result")} disabled={picks.length < 3} title={picks.length < 3 ? "Make at least 3 picks first" : undefined}>Your result</button>
          </div>
          <p className="pf-credit">Pick by instinct. Your choices become a suggested demo blend — an illustrative mapping, not a perfumer’s formula.</p>
        </div>
      </section>
    );
  }

  // ---------- result ----------
  if (view === "result") {
    const vols = computeVolumes(result.blend);
    const enough = picks.length >= 3 && result.blend.length > 0;
    return (
      <section className="pf pf--hero pf--result">
        <Field dim />
        <div className="pf-hero__inner">
          <p className="pf-kicker">Your result · {picks.length} of {ROUNDS.length} picks</p>
          <Questions leanings={result.leanings} />
          {enough ? (
            <div className="pf-card">
              <p className="pf-card__title">Suggested starting blend</p>
              <ul role="list" className="pf-blend">
                {vols.entries.map((e) => (
                  <li key={e.accordId}>
                    <span className="swatch" style={{ background: accordById(e.accordId).swatch }} />
                    <span>{accordById(e.accordId).name}</span>
                    <span className="pf-bar"><span style={{ width: `${e.share}%`, background: accordById(e.accordId).swatch }} /></span>
                    <span className="num">{e.share}%</span>
                    <span className="num muted">{formatMl(e.cml)}</span>
                  </li>
                ))}
              </ul>
              <p className="small muted">Fixed 10 ml demo: 2.00 ml blend + 8.00 ml base. Illustrative mapping from your picks — not a skin-use recipe.</p>
            </div>
          ) : <p className="pf-credit">Make at least three picks to see a suggested blend.</p>}
          <div className="pf-ctas">
            {enough && <button className="pf-pill pf-pill--ink" onClick={() => { loadBlend(result.blend, result.name); nav("/lab"); }}><FlaskConical size={16} aria-hidden /> Open “{result.name}” in the Lab</button>}
            {picks.length < ROUNDS.length && <button className="pf-pill" onClick={() => setView("quiz")}>Continue at {picks.length + 1} of {ROUNDS.length}</button>}
            <button className="pf-pill" onClick={restart}><RotateCcw size={14} aria-hidden /> Start over</button>
          </div>
        </div>
      </section>
    );
  }

  // ---------- quiz ----------
  return (
    <section className="pf pf--quiz">
      <div className="pf-top">
        <Link to="/" className="pf-brand">Prefer</Link>
        <p className="pf-ask" ref={qRef} tabIndex={-1}>Which look do you like?</p>
        <p className="pf-count num" aria-live="polite">{i + 1} of {ROUNDS.length}</p>
      </div>
      <div className="pf-pair" key={i}>
        {(["a", "b"] as Side[]).map((side) => (
          <button key={side} data-side={side} className="pf-opt" onClick={(e) => choose(side, e.currentTarget)} disabled={busy}
            aria-label={`${round[side].label}${side === "a" ? " (left arrow)" : " (right arrow)"}`}>
            <Pick o={round[side]} />
            <span className="pf-opt__label">{round[side].label}</span>
          </button>
        ))}
      </div>
      <div className="pf-bottom">
        <button className="pf-back" onClick={() => (picks.length ? setPicks((p) => p.slice(0, -1)) : setView("intro"))}><ArrowLeft size={14} aria-hidden /> Back</button>
        <div className="pf-stack" ref={stackRef} aria-label={`${picks.length} picks so far`} role="img">
          {picks.slice(-6).map((p, k, arr) => {
            const o = ROUNDS[picks.length - arr.length + k][p];
            return (
              <span key={picks.length - arr.length + k} className="pf-chip" style={{ ["--k" as string]: k - (arr.length - 1) / 2 }} title={o.label}>
                {o.img ? <img src={o.img} alt="" /> : <span style={{ background: accordById(o.vial!).swatch }} />}
              </span>
            );
          })}
        </div>
        <button className="pf-back" onClick={() => setView("result")} disabled={picks.length < 3}>Your result</button>
      </div>
    </section>
  );
}
