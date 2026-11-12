import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { DEFAULT_BLEND, addAccord, isBlendValid, normalize, removeAccord, setShare, evenSplit } from "../lib/formula";
import {
  initStorage, load, readBlend, readCart, readCreations, readNotes, save, storageAvailable, uid,
} from "../lib/storage";
import type {
  AccordId, AdjustMode, Blend, BotanicalId, BottleConceptId, CartItem, Creation, DiscoveryNote, ShareChange,
} from "../lib/types";
import { accordById } from "../data/ingredients";
import { productById } from "../data/catalogue";

initStorage();

export interface Toast { id: number; message: string; action?: { label: string; onClick: () => void }; tone?: "default" | "success" | "warn" }

interface LabDraft {
  blend: Blend;
  mode: AdjustMode;
  name: string;
  editingId: string | null;
  parentId: string | null;
  bottle: BottleConceptId;
  /** perfumer's alcohol base (the 8 ml) has been poured into the beaker */
  baseAdded: boolean;
  /** botanicals dropped in as a visual infusion; never part of the formula */
  infusions: BotanicalId[];
}

const BOTANICAL_IDS: BotanicalId[] = ["orange-peel", "cedarwood", "rose-petals", "cinnamon"];

function readDraft(raw: unknown): LabDraft | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  const blend = readBlend(r.blend) ?? [];
  return {
    blend,
    mode: r.mode === "manual" ? "manual" : "proportional",
    name: typeof r.name === "string" ? r.name.slice(0, 40) : "",
    editingId: typeof r.editingId === "string" ? r.editingId : null,
    parentId: typeof r.parentId === "string" ? r.parentId : null,
    bottle: r.bottle === "facet" || r.bottle === "atelier" ? r.bottle : "pebble",
    baseAdded: r.baseAdded === true,
    infusions: Array.isArray(r.infusions) ? (r.infusions.filter((x) => BOTANICAL_IDS.includes(x as BotanicalId)) as BotanicalId[]).slice(0, 4) : [],
  };
}
const readIdList = (raw: unknown): BotanicalId[] | null =>
  Array.isArray(raw) ? (raw.filter((x) => BOTANICAL_IDS.includes(x)) as BotanicalId[]) : null;
const readFlags = (raw: unknown): Record<string, boolean> | null =>
  typeof raw === "object" && raw !== null ? (raw as Record<string, boolean>) : null;

const EMPTY_DRAFT: LabDraft = { blend: [], mode: "proportional", name: "", editingId: null, parentId: null, bottle: "pebble", baseAdded: false, infusions: [] };

function useStore() {
  const initial = useRef(() => {
    const creations = load("creations", readCreations, []);
    const cart = load("cart", readCart, []);
    const notes = load("notes", readNotes, []);
    const draft = load("draft", readDraft, EMPTY_DRAFT);
    const explore = load("explore", readIdList, []);
    const flags = load("flags", readFlags, {});
    return {
      creations: creations.value, cart: cart.value, notes: notes.value, draft: draft.value,
      explore: explore.value, flags: flags.value,
      recovered: [creations, cart, notes, draft].some((r) => r.recovered),
    };
  }).current();

  const [creations, setCreations] = useState<Creation[]>(initial.creations);
  const [cart, setCart] = useState<CartItem[]>(initial.cart);
  const [notes, setNotes] = useState<DiscoveryNote[]>(initial.notes);
  const [draft, setDraft] = useState<LabDraft>(initial.draft);
  const [explore, setExplore] = useState<BotanicalId[]>(initial.explore);
  const [flags, setFlags] = useState<Record<string, boolean>>(initial.flags);
  const [undoStack, setUndoStack] = useState<Blend[]>([]);
  const [lastChanges, setLastChanges] = useState<ShareChange[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [announcement, setAnnouncement] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [tourStep, setTourStep] = useState<number | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);

  // persistence
  useEffect(() => { if (!save("creations", creations) && storageAvailable()) setSaveFailed(true); }, [creations]);
  useEffect(() => { save("cart", cart); }, [cart]);
  useEffect(() => { save("notes", notes); }, [notes]);
  useEffect(() => { save("draft", draft); }, [draft]);
  useEffect(() => { save("explore", explore); }, [explore]);
  useEffect(() => { save("flags", flags); }, [flags]);

  const announce = useCallback((msg: string) => {
    setAnnouncement("");
    requestAnimationFrame(() => setAnnouncement(msg));
  }, []);

  const toastId = useRef(0);
  const toast = useCallback((message: string, opts: Omit<Toast, "id" | "message"> = {}) => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, message, ...opts }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), opts.action ? 7000 : 4200);
  }, []);
  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  // ---------- blend ----------
  const commitBlend = useCallback((next: Blend, changes: ShareChange[], prev: Blend) => {
    setUndoStack((s) => [...s.slice(-29), prev]);
    setDraft((d) => ({ ...d, blend: next }));
    setLastChanges(changes);
  }, []);

  const addToBlend = useCallback((id: AccordId) => {
    const prev = draft.blend;
    if (prev.some((e) => e.accordId === id)) return false;
    const r = addAccord(prev, id);
    if (r.blend === prev) return false;
    commitBlend(r.blend, r.changes, prev);
    const own = r.blend.find((e) => e.accordId === id)!;
    announce(`${accordById(id).name} accord added at ${own.share}%. Other accords rescaled to keep the blend at 100%.`);
    return true;
  }, [draft.blend, commitBlend, announce]);

  const removeFromBlend = useCallback((id: AccordId) => {
    const prev = draft.blend;
    const r = removeAccord(prev, id);
    if (r.blend === prev) return;
    commitBlend(r.blend, r.changes, prev);
    announce(`${accordById(id).name} accord removed.${r.blend.length ? " Remaining shares rescaled to 100%." : " The blend is now empty."}`);
    toast(`${accordById(id).name} removed from the blend`, { action: { label: "Undo", onClick: () => { setDraft((d) => ({ ...d, blend: prev })); setLastChanges([]); } } });
  }, [draft.blend, commitBlend, announce, toast]);

  const changeShare = useCallback((id: AccordId, value: unknown) => {
    const prev = draft.blend;
    const r = setShare(prev, id, value, draft.mode); // may throw FormulaInputError
    if (r.changes.length === 0) return r;
    commitBlend(r.blend, r.changes, prev);
    return r;
  }, [draft.blend, draft.mode, commitBlend]);

  const undo = useCallback(() => {
    if (!undoStack.length) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack((s) => s.slice(0, -1));
    setDraft((d) => ({ ...d, blend: prev }));
    setLastChanges([]);
    announce("Last change undone.");
  }, [undoStack, announce]);

  const resetBlend = useCallback(() => {
    const prev = draft.blend;
    commitBlend(DEFAULT_BLEND, [], prev);
    setDraft((d) => ({ ...d, baseAdded: true }));
    announce("Blend reset to the default demo composition: Woody 50%, Citrus 30%, Musk 20%, with the 8 ml base.");
  }, [draft.blend, commitBlend, announce]);

  const clearBlend = useCallback(() => {
    const prev = draft.blend;
    commitBlend([], [], prev);
    setDraft((d) => ({ ...d, baseAdded: false, infusions: [] }));
    announce("Blend cleared.");
  }, [draft.blend, commitBlend, announce]);

  const balance = useCallback((how: "proportional" | "even") => {
    const prev = draft.blend;
    const next = how === "even" ? evenSplit(prev) : normalize(prev);
    commitBlend(next, [], prev);
    announce("Blend rebalanced to 100%.");
  }, [draft.blend, commitBlend, announce]);

  const setMode = useCallback((mode: AdjustMode) => setDraft((d) => ({ ...d, mode })), []);
  const setDraftName = useCallback((name: string) => setDraft((d) => ({ ...d, name: name.slice(0, 40) })), []);
  const setBottle = useCallback((bottle: BottleConceptId) => setDraft((d) => ({ ...d, bottle })), []);
  const setBase = useCallback((on: boolean) => {
    setDraft((d) => ({ ...d, baseAdded: on }));
    announce(on ? "Perfumer's alcohol base poured: 8.00 ml." : "Base removed from the beaker.");
  }, [announce]);
  const toggleInfusion = useCallback((id: BotanicalId) => {
    setDraft((d) => ({ ...d, infusions: d.infusions.includes(id) ? d.infusions.filter((x) => x !== id) : [...d.infusions, id] }));
  }, []);

  // ---------- creations ----------
  const saveCreation = useCallback((opts: { asNew?: boolean } = {}): Creation | null => {
    if (!isBlendValid(draft.blend)) return null;
    const now = new Date().toISOString();
    const name = draft.name.trim() || "Untitled creation";
    const editing = !opts.asNew && draft.editingId ? creations.find((c) => c.id === draft.editingId) : undefined;
    let saved: Creation;
    if (editing) {
      saved = {
        ...editing,
        name,
        blend: draft.blend,
        updatedAt: now,
        formulaVersion: editing.formulaVersion + 1,
        appearance: { bottle: draft.bottle },
        disclaimerAcknowledged: true,
        history: [...editing.history, { version: editing.formulaVersion, savedAt: editing.updatedAt, name: editing.name, blend: editing.blend }].slice(-20),
      };
      setCreations((cs) => cs.map((c) => (c.id === saved.id ? saved : c)));
    } else {
      saved = {
        schema: 1, id: uid(), name, createdAt: now, updatedAt: now, formulaVersion: 1, volumeMl: 10,
        blend: draft.blend, botanicalNoteIds: notes.map((n) => n.id).slice(-12),
        appearance: { bottle: draft.bottle }, disclaimerAcknowledged: true,
        parentId: draft.parentId ?? undefined, history: [],
      };
      setCreations((cs) => [saved, ...cs]);
    }
    setDraft((d) => ({ ...d, editingId: saved.id, parentId: saved.parentId ?? null, name: saved.name }));
    announce(`Saved “${saved.name}”, version ${saved.formulaVersion}.`);
    return saved;
  }, [draft, creations, notes, announce]);

  const loadIntoLab = useCallback((c: Creation, as: "edit" | "variation") => {
    setUndoStack((s) => [...s.slice(-29), draft.blend]);
    setLastChanges([]);
    if (as === "edit") {
      setDraft({ blend: c.blend, mode: "proportional", name: c.name, editingId: c.id, parentId: c.parentId ?? null, bottle: c.appearance.bottle, baseAdded: true, infusions: [] });
    } else {
      setDraft({ blend: c.blend, mode: "proportional", name: `${c.name} variation`.slice(0, 40), editingId: null, parentId: c.id, bottle: c.appearance.bottle, baseAdded: true, infusions: [] });
    }
  }, [draft.blend]);

  /** Replace the lab draft with a suggested blend (e.g. from the Prefer quiz). */
  const loadBlend = useCallback((blend: Blend, name: string) => {
    if (!isBlendValid(blend)) return;
    setUndoStack((s) => [...s.slice(-29), draft.blend]);
    setLastChanges([]);
    setDraft({ ...EMPTY_DRAFT, blend, name: name.slice(0, 40) });
    announce(`Suggested blend loaded into the lab: ${blend.map((e) => `${accordById(e.accordId).name} ${e.share}%`).join(", ")}.`);
  }, [draft.blend, announce]);

  const startNewDraft = useCallback(() => {
    setUndoStack((s) => [...s.slice(-29), draft.blend]);
    setDraft({ ...EMPTY_DRAFT });
    setLastChanges([]);
  }, [draft.blend]);

  const duplicateCreation = useCallback((id: string) => {
    const c = creations.find((x) => x.id === id);
    if (!c) return null;
    const now = new Date().toISOString();
    const copy: Creation = { ...c, id: uid(), name: `${c.name} (copy)`.slice(0, 60), createdAt: now, updatedAt: now, formulaVersion: 1, history: [], parentId: undefined };
    setCreations((cs) => [copy, ...cs]);
    return copy;
  }, [creations]);

  const deleteCreation = useCallback((id: string) => {
    const c = creations.find((x) => x.id === id);
    setCreations((cs) => cs.filter((x) => x.id !== id));
    if (draft.editingId === id) setDraft((d) => ({ ...d, editingId: null }));
    if (c) toast(`Deleted “${c.name}”`, { action: { label: "Undo", onClick: () => setCreations((cs) => [c, ...cs]) } });
  }, [creations, draft.editingId, toast]);

  const restoreVersion = useCallback((id: string, version: number) => {
    setCreations((cs) => cs.map((c) => {
      if (c.id !== id) return c;
      const v = c.history.find((h) => h.version === version);
      if (!v) return c;
      const now = new Date().toISOString();
      return {
        ...c, blend: v.blend, name: v.name, updatedAt: now, formulaVersion: c.formulaVersion + 1,
        history: [...c.history, { version: c.formulaVersion, savedAt: c.updatedAt, name: c.name, blend: c.blend }].slice(-20),
      };
    }));
  }, []);

  const renameCreation = useCallback((id: string, name: string) => {
    setCreations((cs) => cs.map((c) => (c.id === id ? { ...c, name: name.slice(0, 60) || c.name, updatedAt: new Date().toISOString() } : c)));
  }, []);

  // ---------- notes / exploration ----------
  const addNote = useCallback((n: Omit<DiscoveryNote, "id" | "createdAt">) => {
    const note: DiscoveryNote = { ...n, id: uid(), createdAt: new Date().toISOString() };
    setNotes((ns) => [note, ...ns].slice(0, 100));
    return note;
  }, []);
  const deleteNote = useCallback((id: string) => setNotes((ns) => ns.filter((n) => n.id !== id)), []);
  const toggleExplore = useCallback((id: BotanicalId, on?: boolean) => {
    setExplore((ids) => {
      const has = ids.includes(id);
      const want = on ?? !has;
      if (want && !has) return [...ids, id];
      if (!want && has) return ids.filter((x) => x !== id);
      return ids;
    });
  }, []);

  // ---------- cart ----------
  const addToCart = useCallback((productId: string, qty = 1) => {
    const p = productById(productId);
    if (!p) return;
    setCart((c) => {
      const found = c.find((i) => i.productId === productId);
      if (found) return c.map((i) => (i.productId === productId ? { ...i, qty: Math.min(20, i.qty + qty) } : i));
      return [...c, { productId, qty }];
    });
    announce(`${p.name} added to cart.`);
  }, [announce]);
  const setQty = useCallback((productId: string, qty: number) => {
    setCart((c) => (qty <= 0 ? c.filter((i) => i.productId !== productId) : c.map((i) => (i.productId === productId ? { ...i, qty: Math.min(20, qty) } : i))));
  }, []);
  const removeFromCart = useCallback((productId: string) => {
    const prev = cart;
    setCart((c) => c.filter((i) => i.productId !== productId));
    const p = productById(productId);
    toast(`${p?.name ?? "Item"} removed from cart`, { action: { label: "Undo", onClick: () => setCart(prev) } });
  }, [cart, toast]);
  const clearCart = useCallback(() => setCart([]), []);

  const setFlag = useCallback((key: string, value = true) => setFlags((f) => ({ ...f, [key]: value })), []);

  return {
    // state
    creations, cart, notes, draft, explore, flags, undoStack, lastChanges, toasts, announcement, cartOpen, tourStep,
    storageOk: storageAvailable(), recovered: initial.recovered, saveFailed,
    // actions
    announce, toast, dismissToast,
    addToBlend, removeFromBlend, changeShare, undo, resetBlend, clearBlend, balance, setMode, setDraftName, setBottle, setBase, toggleInfusion,
    saveCreation, loadIntoLab, loadBlend, startNewDraft, duplicateCreation, deleteCreation, restoreVersion, renameCreation,
    addNote, deleteNote, toggleExplore,
    addToCart, setQty, removeFromCart, clearCart, setCartOpen,
    setFlag, setTourStep,
  };
}

export type Store = ReturnType<typeof useStore>;
const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useStore();
  const value = useMemo(() => store, [store]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useApp outside StoreProvider");
  return s;
}
