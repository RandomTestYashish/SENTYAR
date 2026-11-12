import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { prefersReducedMotion } from "../../lib/fly";

const IMG = "./assets/img/";

type Slide = { id: string; name: string; style: string; mood: string; line: string; notes: string[]; img: string; alt: string };

export const BOTTLES: Slide[] = [
  { id: "signature", name: "The Signature", style: "Cushioned crystal", mood: "signature", line: "Heavy crystal, a faceted gold cap cut like a gem. The house silhouette.", notes: ["Amber", "Rose", "Cedar"], img: "bottle-signature", alt: "The Signature: a cushion-shaped crystal bottle of amber eau de parfum engraved SENTYAR, with a faceted gold cap" },
  { id: "orb", name: "The Orb", style: "Modern minimal", mood: "luminous", line: "A perfect sphere of light under a slim ribbed gold column.", notes: ["Vanilla", "Musk"], img: "bottle-orb", alt: "The Orb: a spherical crystal bottle of golden liquid with a tall ribbed gold cap" },
  { id: "facet", name: "The Facet", style: "Architectural", mood: "bold", line: "Bevelled like a cut stone, crowned in black onyx.", notes: ["Woody", "Spicy"], img: "bottle-facet", alt: "The Facet: a tall octagonal faceted crystal bottle with a black onyx cap" },
  { id: "fluid", name: "The Fluid", style: "Organic sculptural", mood: "sensual", line: "A pebble shaped by water, with a smooth ivory stone cap.", notes: ["Rose", "Musk"], img: "bottle-fluid", alt: "The Fluid: an organic pebble-shaped crystal bottle with an ivory stone cap" },
  { id: "atelier", name: "The Atelier", style: "Classic sculpted", mood: "timeless", line: "Fine vertical ribbing, a paper label and a heavy black cap.", notes: ["Citrus", "Woody"], img: "bottle-atelier", alt: "The Atelier: a ribbed rectangular crystal bottle with an ivory SENTYAR label and a square black cap" },
  { id: "column", name: "The Column", style: "Pure vertical", mood: "modern", line: "A slender pillar of crystal on a weighted base, gold disc cap.", notes: ["Citrus", "Musk"], img: "bottle-column", alt: "The Column: a tall slim cylindrical crystal bottle with a gold disc cap" },
  { id: "crescent", name: "The Crescent", style: "Romantic", mood: "romantic", line: "A half moon in rose amber, finished with a single pearl.", notes: ["Rose", "Vanilla"], img: "bottle-crescent", alt: "The Crescent: a crescent-moon crystal bottle of rose amber liquid with a pearl cap" },
];

const FLOATS = [
  { src: "float-rose", cls: "hx-float--rose", depth: 0.9 },
  { src: "float-petal", cls: "hx-float--petal", depth: 0.5 },
  { src: "float-orange", cls: "hx-float--orange", depth: 0.8 },
  { src: "float-cinnamon", cls: "hx-float--cinnamon", depth: 0.6 },
  { src: "float-petal", cls: "hx-float--petal2", depth: 1.2 },
];

const AUTOPLAY_MS = 4200;
const n = BOTTLES.length;
const wrap = (i: number) => ((i % n) + n) % n;
/** signed shortest distance from the active slide */
const offsetOf = (i: number, active: number) => { let d = i - active; if (d > n / 2) d -= n; if (d < -n / 2) d += n; return d; };

export function HeroCarousel({ onTour }: { onTour: () => void }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(() => !prefersReducedMotion());
  const [hover, setHover] = useState(false);
  const [mounted, setMounted] = useState(false);
  const root = useRef<HTMLElement>(null);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const slide = BOTTLES[active];

  const go = useCallback((i: number) => setActive(wrap(i)), []);
  const next = useCallback(() => setActive((a) => wrap(a + 1)), []);
  const prev = useCallback(() => setActive((a) => wrap(a - 1)), []);

  useEffect(() => { const t = requestAnimationFrame(() => setMounted(true)); return () => cancelAnimationFrame(t); }, []);

  // autoplay; restarts whenever the slide changes so manual moves get a full beat
  useEffect(() => {
    if (!playing || hover) return;
    const t = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [playing, hover, active, next]);

  // pointer parallax + glow, written to CSS variables (no re-render)
  useEffect(() => {
    const el = root.current; if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--px", x.toFixed(3)); el.style.setProperty("--py", y.toFixed(3));
        el.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`); el.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(1)}%`);
      });
    };
    el.addEventListener("pointermove", onMove);
    return () => { el.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);

  const onDown = (e: RPointerEvent) => { drag.current = { x: e.clientX, moved: false }; };
  const onMove = (e: RPointerEvent) => { const d = drag.current; if (d && Math.abs(e.clientX - d.x) > 8) d.moved = true; };
  const onUp = (e: RPointerEvent) => {
    const d = drag.current; drag.current = null; if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
  };

  return (
    <section ref={root} className={`hx ${mounted ? "is-in" : ""}`} aria-label="SENTYAR bottle collection">
      <div className="hx__glow" aria-hidden />
      <p className="hx__bgword" aria-hidden key={`bg-${slide.id}`}>{slide.name.replace("The ", "")}</p>

      <header className="hx__head">
        <p className="eyebrow hx__eyebrow"><span>The Personal Perfumery</span></p>
        <h1 className="hx__title">
          <span className="hx__line"><span>Craft your</span></span>{" "}
          <span className="hx__line hx__line--mood"><span className="hx__mood" key={slide.mood} aria-live="off">
            {slide.mood.split("").map((ch, i) => <span key={i} style={{ "--i": i } as CSSProperties}>{ch}</span>)}
          </span></span>{" "}
          <span className="hx__line"><span>scent.</span></span>
        </h1>
      </header>

      <div
        className="hx__stage"
        role="group"
        aria-roledescription="carousel"
        aria-label="Bottle silhouettes. Use the left and right arrow keys to browse."
        tabIndex={0}
        onKeyDown={onKey}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={() => (drag.current = null)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
      >
        {FLOATS.map((f, i) => (
          <img key={i} src={`${IMG}${f.src}.webp`} alt="" className={`hx-float ${f.cls}`} style={{ "--d": f.depth } as CSSProperties} draggable={false} />
        ))}
        <div className="hx__plinth" aria-hidden />
        <ul className="hx__track" role="list">
          {BOTTLES.map((b, i) => {
            const o = offsetOf(i, active);
            const abs = Math.abs(o);
            return (
              <li
                key={b.id}
                className={`hx__slide ${o === 0 ? "is-active" : ""} ${abs >= 3 ? "is-far" : ""}`}
                style={{ "--o": o, "--a": abs } as CSSProperties}
                aria-hidden={o !== 0}
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${n}: ${b.name}`}
                onClick={() => { if (!drag.current?.moved && o !== 0) go(i); }}
              >
                <img src={`${IMG}${b.img}.webp`} alt={o === 0 ? b.alt : ""} draggable={false} loading={abs > 2 ? "lazy" : "eager"} />
              </li>
            );
          })}
        </ul>
      </div>

      <div className="hx__foot">
        <div className="hx__caption" key={`cap-${slide.id}`}>
          <p className="hx__count num"><span>{String(active + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")} · {slide.style}</p>
          <h2 className="hx__name">{slide.name}</h2>
          <p className="hx__desc">{slide.line}</p>
          <p className="hx__notes">{slide.notes.map((x) => <span key={x}>{x}</span>)}</p>
        </div>

        <div className="hx__controls">
          <button className="hx__btn" onClick={prev} aria-label="Previous bottle"><ArrowLeft size={18} aria-hidden /></button>
          <div className="hx__dots" role="group" aria-label="Choose a bottle">
            {BOTTLES.map((b, i) => (
              <button key={b.id} aria-current={i === active ? "true" : undefined} aria-label={b.name} className={`hx__dot ${i === active ? "is-on" : ""}`} onClick={() => go(i)}>
                {i === active && playing && !hover && <span className="hx__dotfill" key={`f-${active}`} style={{ animationDuration: `${AUTOPLAY_MS}ms` }} />}
              </button>
            ))}
          </div>
          <button className="hx__btn" onClick={next} aria-label="Next bottle"><ArrowRight size={18} aria-hidden /></button>
          <button className="hx__btn hx__btn--ghost" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause autoplay" : "Play autoplay"}>
            {playing ? <Pause size={14} aria-hidden /> : <Play size={14} aria-hidden />}
          </button>
        </div>

        <div className="hx__ctas">
          <Link to="/kits/creator-kit-v1" className="btn">Explore the Kit <ArrowRight size={16} aria-hidden /></Link>
          <Link to="/lab" className="btn btn--secondary">Enter the Lab</Link>
          <div className="hx__links">
            <button className="link small" onClick={onTour}>Take a guided tour</button>
            <Link to="/prefer" className="link small">Find your taste in 10 picks</Link>
          </div>
        </div>
      </div>

      <p className="hx__note small muted">Concept bottles. Silhouettes and labelling are design direction, not finished products.</p>
    </section>
  );
}
