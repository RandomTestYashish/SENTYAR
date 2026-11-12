// Transparent, non-clinical scent profile computed only from the user's own
// saved demo formulas. No personality inference.

import { ACCORDS, pairing } from "../data/ingredients";
import type { AccordId, Creation } from "./types";

export const PROFILE_MIN_CREATIONS = 2;

export interface ScentProfile {
  enough: boolean;
  families: { accordId: AccordId; weight: number; count: number }[];
  pairs: { a: AccordId; b: AccordId; count: number }[];
  suggestions: { accordId: AccordId; because: AccordId }[];
}

export function scentProfile(creations: Creation[]): ScentProfile {
  if (creations.length < PROFILE_MIN_CREATIONS) return { enough: false, families: [], pairs: [], suggestions: [] };
  const weight = new Map<AccordId, number>();
  const count = new Map<AccordId, number>();
  const pairs = new Map<string, number>();
  creations.forEach((c) => {
    c.blend.forEach((e) => {
      weight.set(e.accordId, (weight.get(e.accordId) ?? 0) + e.share);
      count.set(e.accordId, (count.get(e.accordId) ?? 0) + 1);
    });
    const ids = c.blend.map((e) => e.accordId).sort();
    ids.forEach((a, i) => ids.slice(i + 1).forEach((b) => pairs.set(`${a}|${b}`, (pairs.get(`${a}|${b}`) ?? 0) + 1)));
  });
  const total = [...weight.values()].reduce((a, b) => a + b, 0) || 1;
  const families = [...weight.entries()]
    .map(([accordId, w]) => ({ accordId, weight: Math.round((w / total) * 100), count: count.get(accordId) ?? 0 }))
    .sort((a, b) => b.weight - a.weight);
  const pairList = [...pairs.entries()]
    .filter(([, n]) => n >= 2)
    .map(([k, n]) => { const [a, b] = k.split("|") as AccordId[]; return { a, b, count: n }; })
    .sort((x, y) => y.count - x.count)
    .slice(0, 3);
  const used = new Set(families.map((f) => f.accordId));
  const top = families[0]?.accordId;
  const suggestions = top
    ? ACCORDS.filter((a) => !used.has(a.id) && pairing(a.id, top) === "suggested").map((a) => ({ accordId: a.id, because: top })).slice(0, 2)
    : [];
  return { enough: true, families, pairs: pairList, suggestions };
}
