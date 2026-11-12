// SENTYAR identity: the S-flower emblem and wordmark.
// Concept 1 (selected): traced directly from the approved reference board.

type EmblemProps = { size?: number; stroke?: number; className?: string; title?: string; color?: string };

/** The S-flower emblem, traced from the approved brand board: four open
 *  pointed petals with a high-contrast serif S woven through the centre. */
export const EMBLEM_PATH = "M 49.98 7.71 C 49.78 7.79, 49.58 7.99, 49.12 8.60 C 48.50 9.41, 47.55 10.36, 46.12 11.59 C 43.02 14.26, 40.38 17.18, 39.10 19.38 C 35.98 24.69, 35.60 30.24, 38.02 35.12 C 38.90 36.90, 39.33 36.77, 38.96 34.85 C 37.63 28.11, 39.39 22.74, 44.64 17.50 C 45.46 16.69, 46.04 16.19, 48.13 14.51 C 48.65 14.09, 49.23 13.62, 49.41 13.47 C 50.05 12.93, 50.33 12.97, 51.14 13.73 C 51.41 14.00, 52.03 14.55, 52.51 14.97 C 58.09 19.83, 60.17 22.78, 61.21 27.35 C 61.52 28.70, 61.55 28.96, 61.55 30.72 C 61.55 32.52, 61.54 32.64, 61.14 34.66 C 60.76 36.56, 60.82 36.84, 61.45 35.99 C 63.02 33.85, 63.96 28.75, 63.38 25.47 C 62.57 20.91, 60.19 17.23, 54.96 12.46 C 53.17 10.83, 52.01 9.60, 51.27 8.56 C 50.68 7.72, 50.40 7.54, 49.98 7.71  M 47.42 34.50 C 42.06 35.28, 38.70 40.67, 40.59 45.45 C 41.85 48.62, 43.66 50.04, 50.46 53.21 C 52.81 54.31, 53.84 54.98, 54.95 56.14 C 59.10 60.51, 56.23 66.58, 50.00 66.59 C 46.33 66.60, 42.30 63.41, 41.49 59.86 C 41.31 59.06, 41.28 58.97, 40.93 58.25 C 40.35 57.02, 40.43 56.73, 41.61 55.60 C 43.52 53.79, 43.82 53.44, 43.61 53.31 C 43.33 53.14, 41.14 54.42, 39.04 55.98 C 32.10 61.15, 25.60 62.39, 19.09 59.76 C 16.47 58.71, 14.86 57.50, 11.25 53.89 C 10.06 52.68, 8.84 51.51, 8.54 51.27 C 7.92 50.77, 7.75 50.50, 7.85 50.20 C 7.91 50.01, 12.10 45.73, 13.24 44.68 C 17.89 40.42, 23.15 38.75, 28.78 39.77 C 31.40 40.24, 33.23 40.82, 35.51 41.92 C 37.57 42.91, 37.59 42.39, 35.56 40.77 C 29.40 35.85, 20.47 35.56, 13.68 40.05 C 11.73 41.34, 10.84 42.11, 7.82 45.09 C 5.22 47.68, 4.54 48.27, 3.14 49.20 C 1.80 50.10, 1.68 50.51, 2.58 51.08 C 3.56 51.70, 3.77 51.84, 4.25 52.20 C 5.10 52.83, 5.91 53.56, 7.21 54.85 C 12.30 59.91, 15.24 61.91, 19.19 63.00 C 25.18 64.64, 30.93 63.31, 37.69 58.73 C 38.98 57.85, 39.33 57.90, 39.32 58.95 C 39.32 59.74, 39.14 60.27, 38.55 61.21 C 36.07 65.16, 35.37 71.65, 36.92 76.34 C 38.28 80.46, 40.05 82.92, 45.00 87.52 C 47.26 89.63, 47.87 90.25, 49.25 91.88 C 49.86 92.61, 50.32 92.51, 51.12 91.46 C 51.77 90.61, 52.72 89.64, 54.72 87.80 C 59.16 83.68, 61.02 81.35, 62.34 78.27 C 63.81 74.82, 64.26 71.77, 63.86 68.06 C 63.69 66.60, 63.06 64.30, 62.28 62.35 C 61.83 61.22, 61.73 61.01, 61.19 60.03 C 60.62 59.01, 60.53 58.77, 60.38 57.78 C 59.71 53.58, 57.60 51.45, 50.74 48.04 C 46.84 46.09, 45.64 45.26, 44.65 43.77 C 42.07 39.91, 45.01 35.16, 49.98 35.16 C 53.42 35.16, 55.59 37.24, 57.40 42.25 C 57.97 43.82, 58.20 44.10, 58.63 43.71 C 59.22 43.17, 59.19 39.57, 58.57 37.39 C 58.10 35.71, 58.04 35.66, 56.79 35.65 C 56.06 35.65, 55.97 35.64, 55.59 35.49 C 53.97 34.88, 53.44 34.74, 51.91 34.56 C 50.92 34.44, 48.12 34.40, 47.42 34.50  M 74.42 36.91 C 70.14 37.32, 64.94 39.73, 62.85 42.26 C 62.00 43.28, 62.32 43.26, 64.43 42.18 C 72.51 38.04, 79.84 38.77, 86.40 44.36 C 87.77 45.54, 91.90 49.80, 92.01 50.15 C 92.13 50.54, 92.11 50.57, 89.12 53.59 C 85.77 56.98, 85.22 57.44, 82.83 58.87 C 78.10 61.69, 73.20 61.95, 66.64 59.73 C 64.36 58.96, 64.59 59.59, 67.14 61.08 C 73.87 65.01, 81.46 64.40, 87.95 59.39 C 89.39 58.28, 89.95 57.77, 91.92 55.79 C 94.47 53.23, 95.26 52.56, 97.04 51.40 C 98.32 50.56, 98.32 50.19, 97.02 49.27 C 95.79 48.40, 94.95 47.66, 92.52 45.26 C 89.57 42.35, 88.23 41.22, 86.16 39.93 C 82.72 37.76, 78.05 36.56, 74.42 36.91  M 58.45 63.77 C 58.39 63.81, 58.10 64.06, 57.82 64.34 C 56.43 65.68, 55.00 66.45, 53.23 66.81 C 50.58 67.36, 50.18 67.36, 46.69 66.81 C 45.51 66.62, 44.02 66.15, 43.01 65.64 C 42.20 65.23, 41.74 65.22, 41.18 65.57 C 41.04 65.67, 40.71 65.85, 40.45 65.97 C 39.69 66.35, 39.48 66.65, 39.21 67.79 C 37.85 73.34, 40.40 79.19, 46.31 84.10 C 47.38 84.99, 48.23 85.75, 48.95 86.44 C 49.92 87.37, 50.12 87.38, 51.05 86.50 C 51.32 86.25, 52.13 85.53, 52.87 84.90 C 56.77 81.56, 58.74 79.13, 59.92 76.20 C 60.99 73.53, 61.19 71.21, 60.62 68.17 C 60.04 65.11, 59.18 63.36, 58.45 63.77";

// `stroke` is kept for API compatibility; the traced mark is a filled shape.
export function Emblem({ size = 40, className, title, color = "currentColor" }: EmblemProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <path d={EMBLEM_PATH} fill={color} fillRule="evenodd" />
    </svg>
  );
}

/** Concept 2, negative-space S knocked out of solid petals. */
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

/** Concept 3, refined monogram S inside a restrained leaf outline. */
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
