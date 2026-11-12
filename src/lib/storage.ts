// Small persistence abstraction over localStorage.
// Production note: replace `driver` with an API client (e.g. /api/creations)
//, the rest of the app only talks to `load`/`save`.

import { isAccordId, normalize } from "./formula";
import type {
  Blend,
  CartItem,
  Creation,
  CreationVersion,
  DiscoveryNote,
} from "./types";

export interface StorageDriver {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const PREFIX = "sentyar.v1.";

let driver: StorageDriver | null = null;
let available = false;

function detect(): StorageDriver | null {
  try {
    const ls = globalThis.localStorage;
    const probe = `${PREFIX}__probe`;
    ls.setItem(probe, "1");
    ls.removeItem(probe);
    return ls;
  } catch {
    return null;
  }
}

export function initStorage(custom?: StorageDriver | null) {
  driver = custom === undefined ? detect() : custom;
  available = driver !== null;
  return available;
}

export const storageAvailable = () => available;

export interface LoadResult<T> {
  value: T;
  /** true when stored data existed but was unreadable and was discarded */
  recovered: boolean;
}

export function load<T>(key: string, validate: (raw: unknown) => T | null, fallback: T): LoadResult<T> {
  if (!driver) return { value: fallback, recovered: false };
  let text: string | null = null;
  try {
    text = driver.getItem(PREFIX + key);
  } catch {
    return { value: fallback, recovered: false };
  }
  if (text === null) return { value: fallback, recovered: false };
  try {
    const parsed = validate(JSON.parse(text));
    if (parsed === null) return { value: fallback, recovered: true };
    return { value: parsed, recovered: false };
  } catch {
    return { value: fallback, recovered: true };
  }
}

export function save(key: string, value: unknown): boolean {
  if (!driver) return false;
  try {
    driver.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

// ---------- validators ----------

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const str = (v: unknown, fb = "") => (typeof v === "string" ? v : fb);

export function readBlend(raw: unknown): Blend | null {
  if (!Array.isArray(raw)) return null;
  const entries = raw.filter(
    (e) => isObj(e) && isAccordId(e.accordId) && typeof e.share === "number" && Number.isFinite(e.share),
  ) as Blend;
  const unique = entries.filter((e, i) => entries.findIndex((x) => x.accordId === e.accordId) === i);
  if (unique.length === 0) return [];
  const total = unique.reduce((a, e) => a + e.share, 0);
  const clean = unique.map((e) => ({ accordId: e.accordId, share: Math.round(Math.max(0, e.share)) }));
  return total === 100 && clean.every((e) => e.share >= 1) ? clean : normalize(clean);
}

function readVersion(raw: unknown): CreationVersion | null {
  if (!isObj(raw)) return null;
  const blend = readBlend(raw.blend);
  if (!blend || blend.length === 0) return null;
  return {
    version: typeof raw.version === "number" ? raw.version : 1,
    savedAt: str(raw.savedAt, new Date(0).toISOString()),
    name: str(raw.name, "Untitled"),
    blend,
  };
}

export function readCreation(raw: unknown): Creation | null {
  if (!isObj(raw) || typeof raw.id !== "string") return null;
  const blend = readBlend(raw.blend);
  if (!blend || blend.length === 0) return null;
  const now = new Date().toISOString();
  const bottle = (raw.appearance as { bottle?: string } | undefined)?.bottle;
  return {
    schema: 1,
    id: raw.id,
    name: str(raw.name, "Untitled creation").slice(0, 60) || "Untitled creation",
    createdAt: str(raw.createdAt, now),
    updatedAt: str(raw.updatedAt, str(raw.createdAt, now)),
    formulaVersion: typeof raw.formulaVersion === "number" ? raw.formulaVersion : 1,
    volumeMl: 10,
    blend,
    botanicalNoteIds: Array.isArray(raw.botanicalNoteIds)
      ? raw.botanicalNoteIds.filter((x): x is string => typeof x === "string")
      : [],
    appearance: { bottle: bottle === "facet" || bottle === "atelier" ? bottle : "pebble" },
    disclaimerAcknowledged: raw.disclaimerAcknowledged === true,
    parentId: typeof raw.parentId === "string" ? raw.parentId : undefined,
    history: Array.isArray(raw.history)
      ? raw.history.map(readVersion).filter((v): v is CreationVersion => v !== null)
      : [],
  };
}

export function readCreations(raw: unknown): Creation[] | null {
  if (!Array.isArray(raw)) return null;
  return raw.map(readCreation).filter((c): c is Creation => c !== null);
}

export function readCart(raw: unknown): CartItem[] | null {
  if (!Array.isArray(raw)) return null;
  return raw
    .filter((i) => isObj(i) && typeof i.productId === "string" && typeof i.qty === "number")
    .map((i) => ({
      productId: (i as CartItem).productId,
      qty: Math.min(20, Math.max(1, Math.round((i as CartItem).qty))),
    }));
}

export function readNotes(raw: unknown): DiscoveryNote[] | null {
  if (!Array.isArray(raw)) return null;
  return raw.filter(
    (n): n is DiscoveryNote =>
      isObj(n) && typeof n.id === "string" && typeof n.ingredientId === "string" && Array.isArray(n.descriptors),
  );
}

export const uid = () =>
  (globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`);
