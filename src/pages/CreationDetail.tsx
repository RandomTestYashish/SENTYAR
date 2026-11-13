import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, Copy, CopyPlus, History, Pencil, ShoppingBag, SlidersHorizontal, Trash2 } from "lucide-react";
import { BottleConfigurator } from "../components/BottleConfigurator";
import { bodyById, capLabel, configKey } from "../data/bottles";
import { recipeById } from "../data/fragrances";
import type { BottleVolume } from "../lib/types";
import { useApp } from "../app/store";
import { BottlePhoto } from "../components/BottlePhoto";
import { ConfirmDialog, Notice } from "../components/ui";
import { ProductThumb } from "../components/ProductThumb";
import { accordById, ingredientById } from "../data/ingredients";
import { KIT, formatInr, lineId, productById, productForAccord } from "../data/catalogue";
import { FORMULA_DISCLAIMER } from "../data/learning";
import { computeVolumes, formatMl } from "../lib/formula";
import { Comparison, fmtDate } from "./Creations";

export default function CreationDetail() {
  const { id } = useParams();
  const { creations, notes, loadIntoLab, duplicateCreation, deleteCreation, restoreVersion, renameCreation, addToCart, setCartOpen, toast } = useApp();
  const nav = useNavigate();
  const c = creations.find((x) => x.id === id);
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(c?.name ?? "");
  const [del, setDel] = useState(false);
  const [restore, setRestore] = useState<number | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [cmpWith, setCmpWith] = useState<string>("");
  const [sizes, setSizes] = useState<Record<string, BottleVolume>>({});
  const [sheet, setSheet] = useState(false);

  if (!c) {
    return (
      <div className="container section empty">
        <h1 className="h2">This creation isn’t on this device</h1>
        <p>It may have been deleted, or saved in another browser. Creations are stored locally in this prototype.</p>
        <Link to="/creations" className="btn">Back to My Creations</Link>
      </div>
    );
  }
  const vols = computeVolumes(c.blend);
  const parent = c.parentId ? creations.find((x) => x.id === c.parentId) : undefined;
  const children = creations.filter((x) => x.parentId === c.id);
  const linkedNotes = notes.filter((n) => c.botanicalNoteIds.includes(n.id));
  const others = creations.filter((x) => x.id !== c.id);
  const cmp = creations.find((x) => x.id === cmpWith);

  // Recreate: map each accord to a demo product, using only known demo values.
  const baseRefill = productById("refill-base");
  const recreate = vols.entries.map((e) => {
    const p = productForAccord(e.accordId);
    const needCml = e.cml;
    const kitCml = KIT.accordVialMl * 100;
    return { e, p, needCml, kitCml, missingCml: Math.max(0, needCml - kitCml) };
  });
  const recreateIds = [...recreate.filter((r) => r.p).map((r) => r.p!.id), "refill-base"];
  const chosen = picked.length ? picked : recreateIds;

  return (
    <div className="container section--tight">
      <nav aria-label="Breadcrumb" className="crumbs"><Link to="/">Home</Link><span aria-hidden>/</span><Link to="/creations">My Creations</Link><span aria-hidden>/</span><span aria-current="page">{c.name}</span></nav>

      <div className="detail">
        <div className="detail__visual">
          <BottlePhoto concept={c.appearance.bottle} name={c.name} className="bphoto--card" />
        </div>
        <div className="detail__info">
          <p className="eyebrow">Creation · v{c.formulaVersion}</p>
          {renaming ? (
            <form className="row" onSubmit={(e) => { e.preventDefault(); renameCreation(c.id, name.trim()); setRenaming(false); }}>
              <label htmlFor="rn" className="sr-only">Creation name</label>
              <input id="rn" className="input" value={name} maxLength={60} onChange={(e) => setName(e.target.value)} autoFocus style={{ maxWidth: 360 }} />
              <button className="btn btn--sm" type="submit">Save name</button>
              <button className="btn btn--ghost btn--sm" type="button" onClick={() => { setRenaming(false); setName(c.name); }}>Cancel</button>
            </form>
          ) : (
            <h1 className="h1">{c.name}</h1>
          )}
          <p className="small">{bodyById(c.appearance.bottle).name}{c.cap ? ` · ${capLabel(c.cap)}` : ""}{c.bottleVolumeMl ? ` · ${c.bottleVolumeMl} ml` : ""}{c.recipeId && recipeById(c.recipeId) ? <> · from <Link className="link" to={`/studio/recipes/${c.recipeId}`}>{recipeById(c.recipeId)!.name}</Link></> : null}</p>
          <p className="small muted">Created {fmtDate(c.createdAt)} · updated {fmtDate(c.updatedAt)} · formula version {c.formulaVersion}{parent ? <> · variation of <Link className="link" to={`/creations/${parent.id}`}>{parent.name}</Link></> : null}</p>

          <div className="row row--tight" style={{ marginTop: 24 }}>
            <button className="btn btn--sm" onClick={() => { loadIntoLab(c, "edit"); nav("/lab"); }}><Pencil size={16} aria-hidden /> Edit in Lab</button>
            <button className="btn btn--secondary btn--sm" onClick={() => { loadIntoLab(c, "variation"); nav("/lab"); }}><CopyPlus size={16} aria-hidden /> Create variation</button>
            <button className="btn btn--ghost btn--sm" onClick={() => { const d = duplicateCreation(c.id); if (d) { toast(`Duplicated as “${d.name}”`); nav(`/creations/${d.id}`); } }}><Copy size={16} aria-hidden /> Duplicate</button>
            {!renaming && <button className="btn btn--ghost btn--sm" onClick={() => { setName(c.name); setRenaming(true); }}>Rename</button>}
            <button className="btn btn--ghost btn--sm" onClick={() => setDel(true)}><Trash2 size={16} aria-hidden /> Delete</button>
          </div>

          <table className="formula-table" style={{ marginTop: 32 }}>
            <caption className="eyebrow">Formula · fixed 10 ml demo volume</caption>
            <thead><tr><th scope="col">Accord</th><th scope="col">Share</th><th scope="col">Demo volume</th></tr></thead>
            <tbody>
              {vols.entries.map((e) => (
                <tr key={e.accordId}><th scope="row"><span className="swatch" style={{ background: accordById(e.accordId).swatch }} /> {accordById(e.accordId).name}</th><td className="num">{e.share}%</td><td className="num">{formatMl(e.cml)}</td></tr>
              ))}
            </tbody>
            <tfoot>
              <tr><th scope="row">Demo base</th><td /><td className="num">{formatMl(vols.baseCml)}</td></tr>
              <tr className="formula-table__total"><th scope="row">Total</th><td className="num">100%</td><td className="num">{formatMl(vols.totalCml)}</td></tr>
            </tfoot>
          </table>
          <Notice tone="warn">{FORMULA_DISCLAIMER}</Notice>
        </div>
      </div>

      {/* RECREATE */}
      <section className="section--tight" aria-labelledby="rc-h" id="reorder">
        <h2 id="rc-h" className="h2">Reorder ingredients</h2>
        <p className="body-2" style={{ marginTop: 8, maxWidth: "70ch" }}>Each accord in the formula, mapped to its demo marketplace product. Amounts use only known demo values: the formula’s accord volumes and the kit’s illustrative {KIT.accordVialMl} ml vial per accord.</p>
        <div className="table-scroll">
          <table className="recreate-table">
            <thead><tr><th scope="col"><span className="sr-only">Select</span></th><th scope="col">Accord needed</th><th scope="col">Demo amount</th><th scope="col">Kit vial (demo)</th><th scope="col">Still needed</th><th scope="col">Marketplace match</th></tr></thead>
            <tbody>
              {recreate.map(({ e, p, needCml, kitCml, missingCml }) => (
                <tr key={e.accordId}>
                  <td>{p && <input type="checkbox" aria-label={`Include ${p.name}`} checked={chosen.includes(p.id)} onChange={() => setPicked((cur) => { const base = cur.length ? cur : recreateIds; return base.includes(p.id) ? base.filter((x) => x !== p.id) : [...base, p.id]; })} />}</td>
                  <th scope="row">{accordById(e.accordId).name}</th>
                  <td className="num">{formatMl(needCml)}</td>
                  <td className="num">{formatMl(kitCml)}</td>
                  <td className="num">{missingCml > 0 ? formatMl(missingCml) : <><Check size={14} aria-hidden style={{ display: "inline", verticalAlign: "-2px" }} /> Covered</>}</td>
                  <td>{p ? <span className="rc-prod"><ProductThumb product={p} /> {p.name} · <span className="num">{formatInr(p.sizes?.find((z) => z.ml === (sizes[p.id] ?? p.sizes?.[0].ml))?.priceInr ?? p.priceInr)}</span>
                    {p.sizes && <select className="input rc-size" aria-label={`${p.name} pack size`} value={sizes[p.id] ?? p.sizes[0].ml} onChange={(ev) => setSizes((z) => ({ ...z, [p.id]: Number(ev.target.value) as BottleVolume }))}>{p.sizes.map((z) => <option key={z.ml} value={z.ml}>{z.ml} ml</option>)}</select>}
                  </span> : <span className="muted">Not mapped</span>}</td>
                </tr>
              ))}
              <tr>
                <td><input type="checkbox" aria-label="Include perfumery alcohol base refill" checked={chosen.includes("refill-base")} onChange={() => setPicked((cur) => { const base = cur.length ? cur : recreateIds; return base.includes("refill-base") ? base.filter((x) => x !== "refill-base") : [...base, "refill-base"]; })} /></td>
                <th scope="row">Perfumery base</th>
                <td className="num">{formatMl(vols.baseCml)}</td>
                <td className="muted">In kit</td>
                <td className="muted">Refill</td>
                <td><span className="rc-prod">{baseRefill && <ProductThumb product={baseRefill} />} Base refill · <span className="num">{formatInr(baseRefill?.sizes?.find((z) => z.ml === (sizes["refill-base"] ?? 50))?.priceInr ?? 0)}</span>
                  <select className="input rc-size" aria-label="Base refill pack size" value={sizes["refill-base"] ?? 50} onChange={(ev) => setSizes((z) => ({ ...z, "refill-base": Number(ev.target.value) as BottleVolume }))}><option value={50}>50 ml</option><option value={100}>100 ml</option></select></span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="row" style={{ marginTop: 16 }}>
          <button className="btn" disabled={!chosen.length} onClick={() => { chosen.forEach((pid) => { const pr = productById(pid); addToCart(lineId(pid, pr?.sizes ? (sizes[pid] ?? pr.sizes[0].ml) : undefined)); }); toast(`${chosen.length} demo item${chosen.length > 1 ? "s" : ""} added to cart`, { action: { label: "View cart", onClick: () => setCartOpen(true) } }); }}>
            <ShoppingBag size={16} aria-hidden /> Add selected to cart ({chosen.length})
          </button>
          <button className="btn btn--secondary" onClick={() => setSheet(true)}><SlidersHorizontal size={16} aria-hidden /> Order an empty bottle</button>
          <Link to="/marketplace" className="btn btn--ghost">Browse marketplace</Link>
        </div>
        <BottleConfigurator open={sheet} onClose={() => setSheet(false)} name={c.name}
          value={{ body: c.appearance.bottle, cap: c.cap ?? bodyById(c.appearance.bottle).defaultCap, volume: c.bottleVolumeMl ?? bodyById(c.appearance.bottle).volumes[0] }}
          confirmLabel="Add bottle to cart"
          onConfirm={(cfg) => { addToCart(lineId(`bottle-${cfg.body}`, cfg.volume, configKey(cfg.body, cfg.cap))); toast(`${bodyById(cfg.body).name}, ${cfg.volume} ml added to cart`, { action: { label: "View cart", onClick: () => setCartOpen(true) } }); }} />
        <p className="small muted" style={{ marginTop: 8 }}>Stock, delivery and shipping are not modelled. Demo prices only, no order is placed.</p>
      </section>

      {/* HISTORY */}
      <section className="section--tight two-col" aria-labelledby="hist-h">
        <div>
          <h2 id="hist-h" className="h3"><History size={20} aria-hidden style={{ display: "inline", verticalAlign: "-3px" }} /> Version history</h2>
          <ol className="history" reversed>
            <li className="history__item is-current"><div><strong>v{c.formulaVersion}</strong> · current · {fmtDate(c.updatedAt)}<p className="small muted">{c.blend.map((e) => `${accordById(e.accordId).name} ${e.share}%`).join(" · ")}</p></div></li>
            {[...c.history].reverse().map((h) => (
              <li key={`${h.version}-${h.savedAt}`} className="history__item">
                <div><strong>v{h.version}</strong> · “{h.name}” · {fmtDate(h.savedAt)}<p className="small muted">{h.blend.map((e) => `${accordById(e.accordId).name} ${e.share}%`).join(" · ")}</p></div>
                <button className="btn btn--secondary btn--xs" onClick={() => setRestore(h.version)}>Restore</button>
              </li>
            ))}
          </ol>
          {c.history.length === 0 && <p className="small body-2">No earlier versions. Edit this creation in the Lab and save to create version {c.formulaVersion + 1}.</p>}
        </div>
        <div>
          <h2 className="h3">Variations</h2>
          {children.length ? (
            <ul role="list" className="ticks">{children.map((v) => <li key={v.id}><Link className="link" to={`/creations/${v.id}`}>{v.name}</Link></li>)}</ul>
          ) : <p className="small body-2" style={{ marginTop: 8 }}>No variations yet.</p>}
          {others.length > 0 && (
            <div className="field" style={{ marginTop: 24 }}>
              <label htmlFor="cmpw">Compare with</label>
              <select id="cmpw" className="input" value={cmpWith} onChange={(e) => setCmpWith(e.target.value)}>
                <option value="">Choose a creation…</option>
                {others.map((o) => <option key={o.id} value={o.id}>{o.name} (v{o.formulaVersion})</option>)}
              </select>
            </div>
          )}
          {cmp && <div style={{ marginTop: 16 }}><Comparison a={c} b={cmp} /></div>}
          <h2 className="h3" style={{ marginTop: 32 }}>Exploration notes</h2>
          <p className="small muted">Kept separately from the formula.</p>
          {linkedNotes.length ? (
            <ul role="list" className="ticks">{linkedNotes.map((n) => <li key={n.id} className="small">{ingredientById(n.ingredientId)?.name}: {n.descriptors.join(", ")}{n.text ? `, “${n.text}”` : ""}</li>)}</ul>
          ) : <p className="small body-2">No discovery notes were linked when this was saved.</p>}
        </div>
      </section>

      <ConfirmDialog open={del} onClose={() => setDel(false)} danger title="Delete this creation?" confirmLabel="Delete"
        body={<>“{c.name}” and its version history will be removed from this device.</>}
        onConfirm={() => { deleteCreation(c.id); nav("/creations"); }} />
      <ConfirmDialog open={restore !== null} onClose={() => setRestore(null)} title={`Restore version ${restore}?`} confirmLabel="Restore"
        body={<>The current formula (v{c.formulaVersion}) will be kept in history, and v{restore} becomes the new version {c.formulaVersion + 1}.</>}
        onConfirm={() => { if (restore !== null) { restoreVersion(c.id, restore); toast(`Restored v${restore} as v${c.formulaVersion + 1}`); } }} />
    </div>
  );
}
