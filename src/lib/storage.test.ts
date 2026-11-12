import { beforeEach, describe, expect, it } from "vitest";
import { initStorage, load, readCart, readCreations, save, type StorageDriver } from "./storage";

function memoryDriver(): StorageDriver & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
    removeItem: (k) => void data.delete(k),
  };
}

describe("storage", () => {
  let d: ReturnType<typeof memoryDriver>;
  beforeEach(() => {
    d = memoryDriver();
    initStorage(d);
  });

  it("round-trips creations", () => {
    const c = {
      schema: 1,
      id: "a",
      name: "Orange Woods",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
      formulaVersion: 1,
      volumeMl: 10,
      blend: [
        { accordId: "woody", share: 60 },
        { accordId: "citrus", share: 40 },
      ],
      botanicalNoteIds: [],
      appearance: { bottle: "pebble" },
      disclaimerAcknowledged: true,
      history: [],
    };
    save("creations", [c]);
    const r = load("creations", readCreations, []);
    expect(r.recovered).toBe(false);
    expect(r.value[0].name).toBe("Orange Woods");
    expect(r.value[0].blend).toEqual(c.blend);
  });

  it("recovers from corrupt JSON", () => {
    d.data.set("sentyar.v1.creations", "{not json");
    const r = load("creations", readCreations, []);
    expect(r.value).toEqual([]);
    expect(r.recovered).toBe(true);
  });

  it("drops malformed records and renormalises unbalanced blends", () => {
    save("creations", [
      { id: "x", name: "Bad", blend: "nope" },
      { id: "y", name: "Old", blend: [{ accordId: "rose", share: 30 }, { accordId: "musk", share: 30 }] },
    ]);
    const r = load("creations", readCreations, []);
    expect(r.value).toHaveLength(1);
    expect(r.value[0].blend.reduce((a, e) => a + e.share, 0)).toBe(100);
  });

  it("clamps cart quantities", () => {
    expect(readCart([{ productId: "p", qty: 99 }, { productId: "q", qty: -2 }, { bad: 1 }])).toEqual([
      { productId: "p", qty: 20 },
      { productId: "q", qty: 1 },
    ]);
  });

  it("works without storage", () => {
    initStorage(null);
    expect(save("cart", [])).toBe(false);
    expect(load("cart", readCart, []).value).toEqual([]);
  });
});
