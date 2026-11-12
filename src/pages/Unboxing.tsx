import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, FlaskConical, Leaf, PackageOpen, Undo2, X } from "lucide-react";
import { useApp } from "../app/store";
import { Emblem, Wordmark } from "../components/Logo";
import { Img, Notice } from "../components/ui";
import { Vial } from "../components/ProductThumb";
import { ToolArt } from "../components/KitItems";
import { ACCORDS, BOTANICALS, CATEGORY_LABEL, ROLE_LABEL, accordById, botanicalById } from "../data/ingredients";
import { KIT } from "../data/catalogue";
import { flyTo } from "../lib/fly";
import type { AccordId, BotanicalId } from "../lib/types";

type Sel = { kind: "accord"; id: AccordId } | { kind: "botanical"; id: BotanicalId } | { kind: "tool"; id: string } | null;

export default function Unboxing() {
  const { draft, explore, addToBlend, removeFromBlend, toggleExplore, flags, setFlag, setTourStep, announce } = useApp();
  const [open, setOpen] = useState<boolean>(!!flags.kitOpened);
  const [sel, setSel] = useState<Sel>(null);
  const labDock = useRef<HTMLDivElement>(null);
  const exploreDock = useRef<HTMLDivElement>(null);
  const panelHead = useRef<HTMLHeadingElement>(null);
  const nav = useNavigate();

  useEffect(() => { if (sel && window.matchMedia("(max-width: 1023px)").matches) panelHead.current?.focus(); }, [sel]);

  const openLid = () => { setOpen(true); setFlag("kitOpened"); announce("Kit opened. Three compartments: fragrance accords, botanical samples, and tools."); };
  const inBlend = (id: AccordId) => draft.blend.some((e) => e.accordId === id);
  const inExplore = (id: BotanicalId) => explore.includes(id);

  const addAccord = (id: AccordId) => {
    const src = document.querySelector(`[data-item="${id}"]`);
    const ok = addToBlend(id);
    if (ok) flyTo(src, labDock.current, { color: accordById(id).swatch });
  };
  const addBotanical = (id: BotanicalId) => {
    const src = document.querySelector(`[data-item="${id}"]`);
    toggleExplore(id, true);
    flyTo(src, exploreDock.current, { color: "#9a704c" });
    announce(`${botanicalById(id).name} added to your exploration tray. It is exploration-only and will not go into the formula.`);
  };

  return (
    <div className="unbox-page">
      <div className="container section--tight">
        <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link><span aria-hidden>/</span><Link to="/kits/creator-kit-v1">Creator Kit V1</Link><span aria-hidden>/</span><span aria-current="page">Interactive kit</span></nav>
        <header className="page-head page-head--row">
          <div>
            <p className="eyebrow">Interactive kit</p>
            <h1 className="h2">Open the Creator Kit</h1>
            <p className="body-2" style={{ marginTop: 8, maxWidth: "60ch" }}>Select any item to read about it. Accords can be added to your lab blend; botanicals go to your exploration tray, they are never added to the formula.</p>
          </div>
        </header>

        <div className="unbox">
          <div className="unbox__stage">
            <div className={`kitbox ${open ? "is-open" : ""}`}>
              <div className="kitbox__lid" aria-hidden={open}>
                <div className="kitbox__lid-face">
                  <Emblem size={56} stroke={2} />
                  <Wordmark size="md" />
                  <span className="kitbox__lid-sub">Creator Kit</span>
                </div>
              </div>
              {!open && (
                <button className="btn btn--light kitbox__open" onClick={openLid}><PackageOpen size={18} aria-hidden /> Lift the lid</button>
              )}
              <div className="kitbox__tray" hidden={!open}>
                <section className="compartment compartment--accords" aria-labelledby="c-acc">
                  <h2 id="c-acc" className="compartment__label">A · Fragrance accords</h2>
                  <ul role="list" className="compartment__row">
                    {ACCORDS.map((a) => {
                      const moved = inBlend(a.id);
                      return (
                        <li key={a.id}>
                          <button data-item={a.id} className={`kit-item kit-item--vial ${sel?.id === a.id ? "is-selected" : ""} ${moved ? "is-moved" : ""}`}
                            aria-pressed={sel?.id === a.id} aria-label={`${a.name} accord${moved ? ", in your lab blend" : ""}`} onClick={() => setSel({ kind: "accord", id: a.id })}>
                            <Vial color={a.swatch} label={a.name} fill={moved ? 0.25 : 0.7} />
                            <span className="kit-item__name">{a.name}</span>
                            {moved && <span className="kit-item__state"><Check size={12} aria-hidden /> In lab</span>}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
                <section className="compartment compartment--bots" aria-labelledby="c-bot">
                  <h2 id="c-bot" className="compartment__label">B · Botanical samples</h2>
                  <ul role="list" className="compartment__row">
                    {BOTANICALS.map((b) => {
                      const moved = inExplore(b.id);
                      return (
                        <li key={b.id}>
                          <button data-item={b.id} className={`kit-item kit-item--dish ${sel?.id === b.id ? "is-selected" : ""} ${moved ? "is-moved" : ""}`}
                            aria-pressed={sel?.id === b.id} aria-label={`${b.name}, botanical sample${moved ? ", in your exploration tray" : ""}`} onClick={() => setSel({ kind: "botanical", id: b.id })}>
                            <span className="dish"><img src={b.image} alt="" /></span>
                            <span className="kit-item__name">{b.name.replace("Dried r", "R").replace("Dried o", "O")}</span>
                            {moved && <span className="kit-item__state"><Check size={12} aria-hidden /> Exploring</span>}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </section>
                <section className="compartment compartment--tools" aria-labelledby="c-tools">
                  <h2 id="c-tools" className="compartment__label">C · Tools &amp; learning</h2>
                  <ul role="list" className="compartment__tools">
                    {KIT.tools.map((t) => (
                      <li key={t.id}>
                        <button className={`kit-item kit-item--tool ${sel?.id === t.id ? "is-selected" : ""}`} aria-pressed={sel?.id === t.id} onClick={() => setSel({ kind: "tool", id: t.id })}>
                          <span className="kit-item__art"><ToolArt id={t.id} /></span>
                          <span className="kit-item__name">{t.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>

            {/* destinations */}
            <div className="docks">
              <div className="dock" ref={labDock}>
                <p className="dock__title"><FlaskConical size={16} aria-hidden /> Lab blend <span className="muted num">({draft.blend.length})</span></p>
                {draft.blend.length === 0 ? <p className="small muted">No accords yet. Select a vial and choose “Add to lab”.</p> : (
                  <ul role="list" className="dock__chips">
                    {draft.blend.map((e) => (
                      <li key={e.accordId} className="chip chip--dock">
                        <span className="swatch" style={{ background: accordById(e.accordId).swatch }} />
                        {accordById(e.accordId).name} <span className="muted num">{e.share}%</span>
                        <button className="chip__x" onClick={() => removeFromBlend(e.accordId)} aria-label={`Remove ${accordById(e.accordId).name} from lab blend`}><X size={14} /></button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="dock" ref={exploreDock}>
                <p className="dock__title"><Leaf size={16} aria-hidden /> Exploration tray <span className="muted num">({explore.length})</span></p>
                {explore.length === 0 ? <p className="small muted">No botanicals yet. Select a sample and choose “Explore”.</p> : (
                  <ul role="list" className="dock__chips">
                    {explore.map((id) => (
                      <li key={id} className="chip chip--dock">
                        {botanicalById(id).name}
                        <button className="chip__x" onClick={() => toggleExplore(id, false)} aria-label={`Remove ${botanicalById(id).name} from exploration tray`}><X size={14} /></button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="docks__cta">
                <Link to="/lab" className={`btn ${draft.blend.length ? "" : "btn--secondary"}`}>Go to the Lab <ArrowRight size={16} aria-hidden /></Link>
                <Link to="/nature-lab" className="btn btn--secondary">Nature Lab</Link>
              </div>
            </div>
          </div>

          <aside className="unbox__panel" aria-live="polite" aria-labelledby="panel-title">
            {!sel ? (
              <div className="panel-empty">
                <p className="eyebrow">Item details</p>
                <h2 id="panel-title" className="h3" ref={panelHead} tabIndex={-1}>{open ? "Select an item" : "Lift the lid to begin"}</h2>
                <p className="body-2 small">{open ? "Choose a vial, a botanical dish or a tool. Its card appears here." : "The kit has three compartments: six fragrance accords, four botanical samples and the tools to explore them."}</p>
              </div>
            ) : sel.kind === "accord" ? (
              <AccordPanel id={sel.id} headRef={panelHead} inBlend={inBlend(sel.id)} onAdd={() => addAccord(sel.id)} onRemove={() => removeFromBlend(sel.id)} />
            ) : sel.kind === "botanical" ? (
              <BotanicalPanel id={sel.id} headRef={panelHead} exploring={inExplore(sel.id)} onAdd={() => addBotanical(sel.id)} onRemove={() => toggleExplore(sel.id, false)} />
            ) : (
              <ToolPanel id={sel.id} headRef={panelHead} onTour={() => { setTourStep(0); nav("/kits/creator-kit-v1/unbox"); }} />
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

type HeadRef = React.RefObject<HTMLHeadingElement>;

function AccordPanel({ id, inBlend, onAdd, onRemove, headRef }: { id: AccordId; inBlend: boolean; onAdd: () => void; onRemove: () => void; headRef: HeadRef }) {
  const a = accordById(id);
  return (
    <div className="panel">
      <span className="badge badge--accord">Fragrance accord</span>
      <h2 id="panel-title" className="h3" ref={headRef} tabIndex={-1}>{a.name} accord</h2>
      <div className="panel__art"><Vial color={a.swatch} label={a.name} /></div>
      <p className="small muted">{CATEGORY_LABEL.accord}</p>
      <dl className="facts">
        <div><dt>Family</dt><dd>{a.family}</dd></div>
        <div><dt>Scent</dt><dd>{a.profile}</dd></div>
        <div><dt>Role</dt><dd>{ROLE_LABEL[a.role]} (illustrative)</dd></div>
        <div><dt>Purpose in kit</dt><dd>A composition input for the Perfume Lab demo.</dd></div>
        <div><dt>Boundary</dt><dd>Demo data only. Not a supplier formula; smell on a blotter, never on skin.</dd></div>
      </dl>
      {inBlend ? (
        <div className="row">
          <span className="badge"><Check size={12} aria-hidden /> In your lab blend</span>
          <button className="btn btn--secondary btn--sm" onClick={onRemove}><Undo2 size={16} aria-hidden /> Remove</button>
        </div>
      ) : (
        <button className="btn btn--block" onClick={onAdd}><FlaskConical size={16} aria-hidden /> Add to lab</button>
      )}
      <Link to={`/ingredients/${a.id}`} className="link link--arrow small">Guided learning for {a.name} <ArrowRight size={14} aria-hidden /></Link>
    </div>
  );
}

function BotanicalPanel({ id, exploring, onAdd, onRemove, headRef }: { id: BotanicalId; exploring: boolean; onAdd: () => void; onRemove: () => void; headRef: HeadRef }) {
  const b = botanicalById(id);
  return (
    <div className="panel">
      <span className="badge badge--botanical"><Leaf size={12} aria-hidden /> Botanical sample</span>
      <h2 id="panel-title" className="h3" ref={headRef} tabIndex={-1}>{b.name}</h2>
      <Img src={b.image} alt={b.imageAlt} ratio="16 / 10" className="panel__img" />
      <p className="small muted">{CATEGORY_LABEL.botanical}</p>
      <dl className="facts">
        <div><dt>Material</dt><dd>{b.materialType}{b.botanicalName ? ` · ${b.botanicalName}` : ""}</dd></div>
        <div><dt>Smell reference</dt><dd>{b.sensory}</dd></div>
        <div><dt>Story</dt><dd>{b.whyInteresting}</dd></div>
        <div><dt>Purpose</dt><dd>{b.whyInKit}</dd></div>
        <div><dt>Safe use</dt><dd>{b.safety}</dd></div>
      </dl>
      {exploring ? (
        <div className="row">
          <span className="badge"><Check size={12} aria-hidden /> In exploration tray</span>
          <button className="btn btn--secondary btn--sm" onClick={onRemove}><Undo2 size={16} aria-hidden /> Remove</button>
        </div>
      ) : (
        <button className="btn btn--block" onClick={onAdd}><Leaf size={16} aria-hidden /> Explore this sample</button>
      )}
      <div className="row" style={{ gap: 16 }}>
        <Link to={`/nature-lab?b=${b.id}`} className="link link--arrow small">Nature Lab simulation <ArrowRight size={14} aria-hidden /></Link>
        <Link to={`/ingredients/${b.relatedAccord}`} className="link link--arrow small">Related: {accordById(b.relatedAccord).name} accord <ArrowRight size={14} aria-hidden /></Link>
      </div>
    </div>
  );
}

function ToolPanel({ id, onTour, headRef }: { id: string; onTour: () => void; headRef: HeadRef }) {
  const t = KIT.tools.find((x) => x.id === id)!;
  return (
    <div className="panel">
      <span className="badge">Tool &amp; learning</span>
      <h2 id="panel-title" className="h3" ref={headRef} tabIndex={-1}>{t.name}</h2>
      <div className="panel__art"><ToolArt id={id} label={t.name} /></div>
      <p className="body-2">{t.note}</p>
      {id === "alcohol" && <Notice tone="warn">Shown as a demo kit component only. This prototype gives no instructions for handling, heating or mixing alcohol.</Notice>}
      {id === "guide" && <Notice>Key points: botanicals are for smelling and learning; never apply raw materials or homemade extracts to skin; formulations need qualified professional validation. <Link className="link" to="/how-it-works#safety">Read the safety boundaries</Link></Notice>}
      {id === "qr" && <button className="btn btn--block" onClick={onTour}>Open the in-app tutorial</button>}
      {id === "journal" && <Link to="/creations" className="btn btn--secondary btn--block">Open My Creations</Link>}
      {id === "cards" && <Link to="/ingredients" className="btn btn--secondary btn--block">View all ingredient cards</Link>}
      {id === "blotters" && <p className="small muted">In the Nature Lab, the Evaluate stage shows how blotters are used to compare impressions.</p>}
    </div>
  );
}
