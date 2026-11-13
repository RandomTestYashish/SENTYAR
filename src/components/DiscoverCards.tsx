import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Check, FlaskConical, Minus, PlayCircle } from "lucide-react";
import { INSPIRED, familyById, recipeById, type InspiredFragrance, type ScentFamily } from "../data/fragrances";
import { KITS, KIT_TOOL_LABEL, kitById, type Kit } from "../data/kits";
import { accordById } from "../data/ingredients";
import { formatInr } from "../data/catalogue";

export function Intensity({ level }: { level: "Soft" | "Moderate" | "Strong" }) {
  const n = level === "Soft" ? 1 : level === "Moderate" ? 2 : 3;
  return (
    <span className="intensity" aria-label={`Intensity: ${level}`}>
      {[1, 2, 3].map((i) => <span key={i} className={i <= n ? "on" : ""} aria-hidden />)}
      <span className="intensity__t">{level}</span>
    </span>
  );
}

export function FragranceCard({ f, compact }: { f: InspiredFragrance; compact?: boolean }) {
  const fam = familyById(f.family)!;
  const recipe = recipeById(f.recipeId)!;
  const from = Math.min(...f.kits.map((k) => kitById(k)!.priceInr));
  return (
    <article className="fcard">
      <Link to={`/fragrances/${f.id}`} className="fcard__media" aria-label={`${f.name}, ${fam.name}`}>
        <img src={f.image} alt={f.imageAlt} loading="lazy" />
        <span className="fcard__fam">{fam.name}</span>
      </Link>
      <div className="fcard__body">
        <h3 className="fcard__name"><Link to={`/fragrances/${f.id}`}>{f.name}</Link></h3>
        {f.inspiration && <p className="fcard__insp">{f.inspiration}</p>}
        <p className="fcard__profile">{f.profile}</p>
        {!compact && (
          <p className="fcard__ings small">{recipe.blend.map((e) => accordById(e.accordId).name).join(" · ")}</p>
        )}
        <div className="fcard__meta">
          <Intensity level={f.intensity} />
          <span className="fcard__price">from <strong className="num">{formatInr(from)}</strong></span>
        </div>
        <div className="fcard__ctas">
          <Link to={`/fragrances/${f.id}#kit`} className="btn btn--sm">Choose kit</Link>
          <Link to={`/studio/recipes/${f.recipeId}`} className="link small">Explore recipe</Link>
        </div>
      </div>
    </article>
  );
}

export function FamilyTile({ fam }: { fam: ScentFamily }) {
  return (
    <Link to={`/families/${fam.id}`} className="ftile">
      <span className="ftile__img"><img src={fam.image} alt="" loading="lazy" /></span>
      <span className="ftile__name">{fam.name}</span>
      <span className="ftile__hi" lang="hi">{fam.nameHi}</span>
      <span className="ftile__short small muted">{fam.short}</span>
    </Link>
  );
}

export function KitCard({ k }: { k: Kit }) {
  return (
    <article className="kcard">
      <Link to={k.id === "creator-kit-v1" ? "/kits/creator-kit-v1" : `/kits/${k.id}`} className="kcard__media" aria-label={k.name}>
        <img src={k.image} alt={k.imageAlt} loading="lazy" />
      </Link>
      <div className="kcard__body">
        <p className="kcard__level">{k.level}</p>
        <h3 className="kcard__name">{k.name}</h3>
        <p className="small body-2">{k.tagline}</p>
        <p className="kcard__price"><span className="num">{formatInr(k.priceInr)}</span> <span className="small muted">indicative</span></p>
        <Link to={k.id === "creator-kit-v1" ? "/kits/creator-kit-v1" : `/kits/${k.id}`} className="link link--arrow small">View kit <ArrowRight size={14} aria-hidden /></Link>
      </div>
    </article>
  );
}

/** Compact visual comparison: what each tier adds. */
export function KitCompare() {
  const rows: { label: string; icon: JSX.Element; val: (k: Kit) => string | boolean }[] = [
    { label: "Fragrance accords", icon: <FlaskConical size={15} aria-hidden />, val: (k) => k.accords === "recipe" ? "4, matched to your recipe" : `${k.accordCount}` },
    { label: "Botanicals to smell", icon: <span aria-hidden>❦</span>, val: (k) => k.botanicals },
    { label: "Beaker and funnel", icon: <span aria-hidden>⌀</span>, val: (k) => k.tools.includes("beaker") },
    { label: "Journal and cards", icon: <BookOpen size={15} aria-hidden />, val: (k) => k.tools.includes("journal") },
    { label: "Cap choice and tray", icon: <span aria-hidden>◇</span>, val: (k) => k.tools.includes("caps") },
    { label: "Guided Making video", icon: <PlayCircle size={15} aria-hidden />, val: (k) => k.tutorial },
    { label: "Bottle sizes", icon: <span aria-hidden>ml</span>, val: (k) => k.sizes.map((s) => `${s}`).join(" / ") + " ml" },
  ];
  return (
    <div className="kcompare" role="table" aria-label="Kit comparison">
      <div className="kcompare__row kcompare__row--head" role="row">
        <span role="columnheader" className="sr-only">Feature</span>
        {KITS.map((k) => (
          <span key={k.id} role="columnheader" className="kcompare__kit">
            <img src={k.image} alt="" />
            <strong>{k.name.replace(" Kit", "")}</strong>
            <span className="num">{formatInr(k.priceInr)}</span>
          </span>
        ))}
      </div>
      {rows.map((r) => (
        <div key={r.label} className="kcompare__row" role="row">
          <span role="rowheader" className="kcompare__label">{r.icon}{r.label}</span>
          {KITS.map((k) => {
            const v = r.val(k);
            return <span key={k.id} role="cell" className="kcompare__cell">{v === true ? <Check size={16} aria-label="Included" /> : v === false ? <Minus size={16} aria-label="Not included" className="muted" /> : v}</span>;
          })}
        </div>
      ))}
      <div className="kcompare__row kcompare__row--adds" role="row">
        <span role="rowheader" className="kcompare__label">What it adds</span>
        {KITS.map((k) => <span key={k.id} role="cell" className="kcompare__cell small">{k.adds}</span>)}
      </div>
    </div>
  );
}

export const toolNames = (k: Kit) => k.tools.map((t) => KIT_TOOL_LABEL[t]).filter(Boolean);
export { INSPIRED };
