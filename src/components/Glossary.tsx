import { useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import { GLOSSARY, HELP } from "../data/learning";
import { Dialog } from "./ui";

export function GlossaryList({ compact }: { compact?: boolean }) {
  return (
    <dl className={`glossary ${compact ? "glossary--compact" : ""}`}>
      {GLOSSARY.map((g) => (
        <div key={g.term} className="glossary__row">
          <dt>{g.term}</dt>
          <dd>{g.def}</dd>
        </div>
      ))}
    </dl>
  );
}

export function HelpList({ items = HELP }: { items?: { q: string; a: string }[] }) {
  return (
    <div>
      {items.map((h) => (
        <details key={h.q} className="disclosure">
          <summary>{h.q}<Plus size={18} aria-hidden /></summary>
          <div>{h.a}</div>
        </details>
      ))}
    </div>
  );
}

export function GlossaryButton({ label = "Glossary", className = "btn btn--ghost btn--sm" }: { label?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className={className} onClick={() => setOpen(true)}><BookOpen size={16} aria-hidden /> {label}</button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Glossary" variant="drawer">
        <p className="body-2 small" style={{ marginBottom: 16 }}>Plain-language definitions used throughout SENTYAR.</p>
        <GlossaryList />
      </Dialog>
    </>
  );
}
