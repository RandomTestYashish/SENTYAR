import { useEffect, useRef, useState, type ReactNode } from "react";
import { AlertTriangle, ImageOff, Info, X } from "lucide-react";
import { useApp } from "../app/store";

/** Accessible modal built on the native <dialog> element (focus trap, Esc, inert backdrop). */
export function Dialog({
  open, onClose, title, children, footer, variant = "dialog", labelledBy, wide,
}: {
  open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode;
  variant?: "dialog" | "drawer" | "sheet"; labelledBy?: string; wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<Element | null>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      opener.current = document.activeElement;
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && d.open) {
      d.close();
    }
    return () => { document.documentElement.style.overflow = ""; };
  }, [open]);
  useEffect(() => {
    if (!open) {
      document.documentElement.style.overflow = "";
      const el = opener.current as HTMLElement | null;
      if (el && typeof el.focus === "function" && document.contains(el)) el.focus();
    }
  }, [open]);
  const titleId = labelledBy ?? `dlg-${title.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <dialog
      ref={ref}
      className={`dlg dlg--${variant} ${wide ? "dlg--wide" : ""}`}
      aria-labelledby={titleId}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      {open && (
        <div className="dlg__inner">
          <header className="dlg__head">
            <h2 id={titleId} className="h4">{title}</h2>
            <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
          </header>
          <div className="dlg__body">{children}</div>
          {footer && <footer className="dlg__foot">{footer}</footer>}
        </div>
      )}
    </dialog>
  );
}

export function ConfirmDialog({ open, title, body, confirmLabel, onConfirm, onClose, danger }: {
  open: boolean; title: string; body: ReactNode; confirmLabel: string; onConfirm: () => void; onClose: () => void; danger?: boolean;
}) {
  return (
    <Dialog open={open} onClose={onClose} title={title}
      footer={<>
        <button className="btn btn--secondary btn--sm" onClick={onClose}>Cancel</button>
        <button className={`btn btn--sm ${danger ? "btn--danger" : ""}`} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</button>
      </>}>
      <div className="body-2">{body}</div>
    </Dialog>
  );
}

export function Notice({ children, tone = "info", icon = true, className = "" }: { children: ReactNode; tone?: "info" | "warn" | "danger" | "ink"; icon?: boolean; className?: string }) {
  const Icon = tone === "warn" || tone === "danger" ? AlertTriangle : Info;
  return (
    <div className={`notice ${tone !== "info" ? `notice--${tone}` : ""} ${className}`} role={tone === "danger" ? "alert" : undefined}>
      {icon && <Icon size={16} aria-hidden />}
      <div>{children}</div>
    </div>
  );
}

/** Image with loading skeleton and an explicit failure state. */
export function Img({ src, alt, className = "", ratio, fit = "cover", eager }: { src?: string; alt: string; className?: string; ratio?: string; fit?: "cover" | "contain"; eager?: boolean }) {
  const [state, setState] = useState<"loading" | "ok" | "error">(src ? "loading" : "error");
  return (
    <div className={`media ${state === "loading" ? "skeleton" : ""} ${state === "error" ? "media--fallback" : ""} ${className}`} style={ratio ? { aspectRatio: ratio } : undefined}>
      {state === "error" ? (
        <span className="row row--tight" style={{ justifyContent: "center" }}><ImageOff size={16} aria-hidden /> <span>{alt}<br /><span className="small">Image unavailable</span></span></span>
      ) : (
        <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" style={{ objectFit: fit }}
          onLoad={() => setState("ok")} onError={() => setState("error")} />
      )}
    </div>
  );
}

export function DemoBadge({ children = "Demo data" }: { children?: ReactNode }) {
  return <span className="badge badge--demo">{children}</span>;
}

export function Toasts() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="toasts" aria-live="off">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.tone ?? "default"}`} role="status">
          <span>{t.message}</span>
          {t.action && (
            <button className="toast__action" onClick={() => { t.action!.onClick(); dismissToast(t.id); }}>{t.action.label}</button>
          )}
          <button className="icon-btn icon-btn--sm toast__close" aria-label="Dismiss notification" onClick={() => dismissToast(t.id)}><X size={16} /></button>
        </div>
      ))}
    </div>
  );
}

export function Announcer() {
  const { announcement } = useApp();
  return <div className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</div>;
}

export function SectionHead({ eyebrow, title, lead, align = "left", children }: { eyebrow?: string; title: ReactNode; lead?: ReactNode; align?: "left" | "center"; children?: ReactNode }) {
  return (
    <div className={`section-head section-head--${align}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="h2">{title}</h2>
      {lead && <p className="lead">{lead}</p>}
      {children}
    </div>
  );
}
