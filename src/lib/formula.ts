// Pure, UI-free formula engine for the illustrative fixed-volume model.
//
// Demo model (NOT a skin-use recipe):
//   finished preview volume  = 10 ml (fixed)
//   fragrance blend          = 20 % = 2 ml
//   demo base allocation     = 80 % = 8 ml
// Accord shares are whole percentages of the 2 ml fragrance allocation and
// must total exactly 100. Volumes are computed in integer hundredths of a
// millilitre (1 % share = 0.02 ml = 2 cml) so totals are always exact:
// no 9.99 ml or 10.01 ml can appear.

import { ACCORD_IDS } from "./types";
import type { AccordId, AdjustMode, Blend, BlendEntry, ShareChange } from "./types";

export const TOTAL_ML = 10;
export const FRAGRANCE_PCT = 20;
export const BASE_PCT = 80;
export const TOTAL_CML = TOTAL_ML * 100; // 1000
export const FRAGRANCE_CML = (TOTAL_CML * FRAGRANCE_PCT) / 100; // 200
export const BASE_CML = TOTAL_CML - FRAGRANCE_CML; // 800
export const MIN_SHARE = 1;
export const MAX_ACCORDS = 6;

const VALID_IDS: AccordId[] = ACCORD_IDS;

export const DEFAULT_BLEND: Blend = [
  { accordId: "woody", share: 50 },
  { accordId: "citrus", share: 30 },
  { accordId: "musk", share: 20 },
];

export const isAccordId = (v: unknown): v is AccordId =>
  typeof v === "string" && (VALID_IDS as string[]).includes(v);

export const totalShare = (blend: Blend): number =>
  blend.reduce((sum, e) => sum + e.share, 0);

/**
 * Distribute an integer `total` across `weights` proportionally using the
 * largest-remainder method, guaranteeing every slot gets at least `min`
 * and the result sums to exactly `total`.
 */
export function distribute(weights: number[], total: number, min = 0): number[] {
  const n = weights.length;
  if (n === 0) return [];
  const floor = min * n;
  if (total < floor) throw new RangeError("total too small for minimum");
  // Prefer a pure proportional split; reserve minimums only when needed.
  if (min > 0) {
    const plain = distribute(weights, total, 0);
    if (plain.every((v) => v >= min)) return plain;
  }
  const spare = total - floor;
  const safe = weights.map((w) => (Number.isFinite(w) && w > 0 ? w : 0));
  const wsum = safe.reduce((a, b) => a + b, 0);
  const basis = wsum > 0 ? safe : safe.map(() => 1);
  const bsum = wsum > 0 ? wsum : n;
  const raw = basis.map((w) => (w / bsum) * spare);
  const out = raw.map((r) => Math.floor(r));
  let rem = spare - out.reduce((a, b) => a + b, 0);
  const order = raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac || a.i - b.i);
  for (let k = 0; rem > 0; k = (k + 1) % n, rem--) out[order[k].i] += 1;
  return out.map((v) => v + min);
}

/** Rescale any blend so shares are whole numbers ≥ MIN_SHARE summing to 100. */
export function normalize(blend: Blend): Blend {
  if (blend.length === 0) return [];
  const shares = distribute(
    blend.map((e) => Math.max(0, e.share)),
    100,
    MIN_SHARE,
  );
  return blend.map((e, i) => ({ ...e, share: shares[i] }));
}

export function diffShares(before: Blend, after: Blend): ShareChange[] {
  const ids = new Set<AccordId>([...before, ...after].map((e) => e.accordId));
  const changes: ShareChange[] = [];
  ids.forEach((id) => {
    const from = before.find((e) => e.accordId === id)?.share ?? 0;
    const to = after.find((e) => e.accordId === id)?.share ?? 0;
    if (from !== to) changes.push({ accordId: id, from, to });
  });
  return changes;
}

export interface BlendResult {
  blend: Blend;
  changes: ShareChange[];
}

/**
 * Add an accord. The newcomer receives an equal share (100 / n) and existing
 * accords are scaled proportionally into the remainder. Returns the
 * recalculation so the UI can show exactly what moved.
 */
export function addAccord(blend: Blend, id: AccordId): BlendResult {
  if (!isAccordId(id)) throw new TypeError(`Unknown accord: ${String(id)}`);
  if (blend.some((e) => e.accordId === id)) return { blend, changes: [] };
  if (blend.length >= MAX_ACCORDS) return { blend, changes: [] };
  if (blend.length === 0) {
    const next = [{ accordId: id, share: 100 }];
    return { blend: next, changes: diffShares(blend, next) };
  }
  const n = blend.length + 1;
  const newShare = Math.round(100 / n);
  const rest = distribute(
    blend.map((e) => e.share),
    100 - newShare,
    MIN_SHARE,
  );
  const next: Blend = [
    ...blend.map((e, i) => ({ ...e, share: rest[i] })),
    { accordId: id, share: newShare },
  ];
  return { blend: next, changes: diffShares(blend, next) };
}

/** Remove an accord and redistribute its share proportionally. */
export function removeAccord(blend: Blend, id: AccordId): BlendResult {
  const kept = blend.filter((e) => e.accordId !== id);
  if (kept.length === blend.length) return { blend, changes: [] };
  if (kept.length === 0) return { blend: [], changes: diffShares(blend, []) };
  const wasBalanced = totalShare(blend) === 100;
  const next = wasBalanced ? normalize(kept) : kept;
  return { blend: next, changes: diffShares(blend, next) };
}

export class FormulaInputError extends Error {}

/** Parse a raw user value into a whole-number share, or throw. */
export function parseShare(raw: unknown): number {
  const n = typeof raw === "number" ? raw : Number(String(raw).trim());
  if (raw === "" || raw === null || raw === undefined || !Number.isFinite(n)) {
    throw new FormulaInputError("Enter a number between 1 and 100.");
  }
  if (n < 0) throw new FormulaInputError("Shares cannot be negative.");
  return Math.round(n);
}

/**
 * Change one accord's share.
 *  - proportional: clamp to what is possible, then scale the other accords
 *    proportionally so the blend still totals 100 %.
 *  - manual: set only this accord; others are untouched. The blend may then
 *    be unbalanced, which `validateBlend` reports until the user rebalances.
 */
export function setShare(
  blend: Blend,
  id: AccordId,
  raw: unknown,
  mode: AdjustMode,
): BlendResult {
  const idx = blend.findIndex((e) => e.accordId === id);
  if (idx < 0) throw new FormulaInputError("That accord is not in the blend.");
  const value = parseShare(raw);
  const others = blend.length - 1;

  if (mode === "manual") {
    const v = Math.min(100, Math.max(MIN_SHARE, value));
    const next = blend.map((e, i) => (i === idx ? { ...e, share: v } : e));
    return { blend: next, changes: diffShares(blend, next) };
  }

  if (others === 0) {
    const next = [{ ...blend[0], share: 100 }];
    return { blend: next, changes: diffShares(blend, next) };
  }
  const v = Math.min(100 - others * MIN_SHARE, Math.max(MIN_SHARE, value));
  const otherEntries = blend.filter((_, i) => i !== idx);
  const rest = distribute(
    otherEntries.map((e) => e.share),
    100 - v,
    MIN_SHARE,
  );
  let k = 0;
  const next = blend.map((e, i) =>
    i === idx ? { ...e, share: v } : { ...e, share: rest[k++] },
  );
  return { blend: next, changes: diffShares(blend, next) };
}

/** Even split, used by the "Balance evenly" helper. */
export function evenSplit(blend: Blend): Blend {
  const shares = distribute(blend.map(() => 1), 100, MIN_SHARE);
  return blend.map((e, i) => ({ ...e, share: shares[i] }));
}

export type BlendIssue =
  | { code: "empty" }
  | { code: "unbalanced"; total: number }
  | { code: "invalid-value"; accordId: string }
  | { code: "duplicate"; accordId: string }
  | { code: "unknown-accord"; accordId: string }
  | { code: "too-many" };

export function validateBlend(blend: unknown): BlendIssue[] {
  if (!Array.isArray(blend) || blend.length === 0) return [{ code: "empty" }];
  const issues: BlendIssue[] = [];
  const seen = new Set<string>();
  for (const raw of blend as Partial<BlendEntry>[]) {
    const id = String(raw?.accordId);
    if (!isAccordId(raw?.accordId)) issues.push({ code: "unknown-accord", accordId: id });
    if (seen.has(id)) issues.push({ code: "duplicate", accordId: id });
    seen.add(id);
    const s = raw?.share;
    if (typeof s !== "number" || !Number.isInteger(s) || s < MIN_SHARE || s > 100) {
      issues.push({ code: "invalid-value", accordId: id });
    }
  }
  if (blend.length > MAX_ACCORDS) issues.push({ code: "too-many" });
  const total = (blend as BlendEntry[]).reduce(
    (a, e) => a + (typeof e?.share === "number" && Number.isFinite(e.share) ? e.share : 0),
    0,
  );
  if (issues.length === 0 && total !== 100) issues.push({ code: "unbalanced", total });
  return issues;
}

export const isBlendValid = (blend: unknown) => validateBlend(blend).length === 0;

export interface Volumes {
  entries: { accordId: AccordId; share: number; cml: number }[];
  fragranceCml: number;
  baseCml: number;
  totalCml: number;
}

/** Demo volumes in hundredths of a ml. Exact because shares are integers. */
export function computeVolumes(blend: Blend): Volumes {
  const entries = blend.map((e) => ({
    accordId: e.accordId,
    share: e.share,
    cml: (e.share * FRAGRANCE_CML) / 100,
  }));
  const fragranceCml = entries.reduce((a, e) => a + e.cml, 0);
  return {
    entries,
    fragranceCml,
    baseCml: BASE_CML,
    totalCml: fragranceCml + BASE_CML,
  };
}

/** Format hundredths of a ml as "1.00 ml". */
export const formatMl = (cml: number) => `${(cml / 100).toFixed(2)} ml`;

export interface BlendComparison {
  accordId: AccordId;
  a: number;
  b: number;
  delta: number;
}

export function compareBlends(a: Blend, b: Blend): BlendComparison[] {
  const ids: AccordId[] = [];
  [...a, ...b].forEach((e) => {
    if (!ids.includes(e.accordId)) ids.push(e.accordId);
  });
  return ids.map((id) => {
    const sa = a.find((e) => e.accordId === id)?.share ?? 0;
    const sb = b.find((e) => e.accordId === id)?.share ?? 0;
    return { accordId: id, a: sa, b: sb, delta: sb - sa };
  });
}
