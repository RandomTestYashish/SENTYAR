// Curated bottle bodies, caps and volumes for the shared bottle configurator.
// Only these combinations are offered; nothing implies custom manufacturing.

import type { BottleConceptId, BottleVolume, CapChoice, CapFinish, CapShape } from "../lib/types";

export interface BottleBody {
  id: BottleConceptId;
  name: string;
  style: string;
  volumes: BottleVolume[];
  defaultCap: CapChoice;
}

export const BODIES: BottleBody[] = [
  { id: "pebble", name: "The Signature", style: "Cushioned crystal", volumes: [10, 50, 100], defaultCap: { shape: "gem", finish: "gold" } },
  { id: "orb", name: "The Orb", style: "Modern minimal", volumes: [10, 50], defaultCap: { shape: "tall", finish: "gold" } },
  { id: "facet", name: "The Facet", style: "Architectural", volumes: [10, 50, 100], defaultCap: { shape: "gem", finish: "black" } },
  { id: "fluid", name: "The Fluid", style: "Organic sculptural", volumes: [10, 50], defaultCap: { shape: "classic", finish: "gold" } },
  { id: "atelier", name: "The Atelier", style: "Classic sculpted", volumes: [50, 100], defaultCap: { shape: "classic", finish: "black" } },
  { id: "column", name: "The Column", style: "Pure vertical", volumes: [10, 50], defaultCap: { shape: "disc", finish: "gold" } },
  { id: "pearl", name: "The Pearl", style: "Romantic", volumes: [10, 50], defaultCap: { shape: "classic", finish: "gold" } },
];
export const bodyById = (id: BottleConceptId) => BODIES.find((b) => b.id === id) ?? BODIES[0];

export const CAP_SHAPES: { id: CapShape; name: string; note: string }[] = [
  { id: "classic", name: "Classic", note: "The silhouette's own cap" },
  { id: "tall", name: "Tall column", note: "Slim and elegant" },
  { id: "disc", name: "Flat disc", note: "Low and modern" },
  { id: "gem", name: "Faceted gem", note: "Cut like a stone" },
];
export const CAP_FINISHES: { id: CapFinish; name: string; swatch: string }[] = [
  { id: "black", name: "Black", swatch: "linear-gradient(135deg,#2a2725,#050505)" },
  { id: "gold", name: "Gold", swatch: "linear-gradient(135deg,#8a6936,#e6cf9e,#a37d45)" },
];

/** indicative extra for larger bottles (presentation only) */
export const VOLUME_EXTRA: Record<BottleVolume, number> = { 10: 0, 50: 600, 100: 1100 };

export const capLabel = (c: CapChoice) => `${CAP_FINISHES.find((f) => f.id === c.finish)?.name} ${CAP_SHAPES.find((s) => s.id === c.shape)?.name.toLowerCase()} cap`;

/** encode a configuration into a cart line id, e.g. "kit-inspired@50#pebble.gem.gold" */
export const configKey = (body: BottleConceptId, cap: CapChoice) => `${body}.${cap.shape}.${cap.finish}`;
export function parseConfig(key?: string): { body: BottleConceptId; cap: CapChoice } | null {
  if (!key) return null;
  const [body, shape, finish] = key.split(".");
  const b = BODIES.find((x) => x.id === body);
  if (!b || !CAP_SHAPES.some((s) => s.id === shape) || !CAP_FINISHES.some((f) => f.id === finish)) return null;
  return { body: b.id, cap: { shape: shape as CapShape, finish: finish as CapFinish } };
}
