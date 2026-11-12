// SENTYAR identity: the S-flower emblem and wordmark.
// Concept 1 (selected): four pointed botanical petals whose bases frame a
// central S; the S terminals reach toward the side petals so the letter
// reads as part of the flower's geometry rather than placed on top.

type EmblemProps = { size?: number; stroke?: number; className?: string; title?: string; color?: string };

const PETAL = "M50 37.5 C40.5 34, 36.5 24.5, 42 16.5 C45 12.2, 48.6 9.4, 50 4 C51.4 9.4, 55 12.2, 58 16.5 C63.5 24.5, 59.5 34, 50 37.5 Z";
const S_PATH = "M57.6 42.2 C55.2 38.6, 44.6 38.4, 44.4 44.4 C44.2 50.2, 55.8 49.8, 55.6 56 C55.4 62, 44.6 61.8, 42.4 57.8";

export function Emblem({ size = 40, stroke = 2.4, className, title, color = "currentColor" }: EmblemProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <g fill="none" stroke={color} strokeWidth={stroke} strokeLinejoin="round" strokeLinecap="round">
        {[0, 90, 180, 270].map((r) => (
          <path key={r} d={PETAL} transform={`rotate(${r} 50 50)`} />
        ))}
        <path d={S_PATH} strokeWidth={stroke * 1.05} />
      </g>
    </svg>
  );
}

/** Concept 2 — negative-space S knocked out of solid petals. */
export function EmblemNegative({ size = 96, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
      <defs>
        <mask id="s-knock">
          <rect width="100" height="100" fill="#fff" />
          <path d="M66 34 C60 24, 36 25, 37 40 C38 54, 63 47, 63 61 C63 76, 39 76, 33 66" fill="none" stroke="#000" strokeWidth="6.5" strokeLinecap="round" />
        </mask>
      </defs>
      <g fill={color} mask="url(#s-knock)">
        {[45, 135, 225, 315].map((r) => (
          <path key={r} d="M50 50 C40 44, 36 30, 42 20 C45 15, 49 11, 50 5 C51 11, 55 15, 58 20 C64 30, 60 44, 50 50 Z" transform={`rotate(${r} 50 50)`} />
        ))}
      </g>
    </svg>
  );
}

/** Concept 3 — refined monogram S inside a restrained leaf outline. */
export function EmblemMonogram({ size = 96, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden>
      <path d="M50 6 C74 26, 74 74, 50 94 C26 74, 26 26, 50 6 Z" fill="none" stroke={color} strokeWidth="1.6" />
      <path d="M50 18 L50 82" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <path d="M59.5 36 C56 30.5, 41.5 30, 41.5 40.5 C41.5 50.5, 58.5 49, 58.5 59.5 C58.5 70.5, 42.5 70, 39.5 63.5" fill="none" stroke={color} strokeWidth="4.2" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({ className = "", descriptor = false, size = "md" }: { className?: string; descriptor?: boolean; size?: "sm" | "md" | "lg" | "xl" }) {
  return (
    <span className={`wordmark wordmark--${size} ${className}`}>
      <span className="wordmark__name" aria-label="SENTYAR">SENTYAR</span>
      {descriptor && <span className="wordmark__desc">The Personal Perfumery</span>}
    </span>
  );
}

export function Lockup({ descriptor = true, size = "lg", inverse = false }: { descriptor?: boolean; size?: "md" | "lg" | "xl"; inverse?: boolean }) {
  const emblem = size === "xl" ? 112 : size === "lg" ? 72 : 48;
  return (
    <span className={`lockup ${inverse ? "lockup--inverse" : ""}`}>
      <Emblem size={emblem} stroke={size === "xl" ? 2 : 2.4} />
      <Wordmark size={size} descriptor={descriptor} />
    </span>
  );
}
