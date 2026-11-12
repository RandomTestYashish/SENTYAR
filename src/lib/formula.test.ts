import { describe, expect, it } from "vitest";
import {
  BASE_CML,
  DEFAULT_BLEND,
  FRAGRANCE_CML,
  addAccord,
  compareBlends,
  computeVolumes,
  distribute,
  formatMl,
  normalize,
  removeAccord,
  setShare,
  totalShare,
  validateBlend,
} from "./formula";
import type { AccordId, Blend } from "./types";

const ids: AccordId[] = ["woody", "citrus", "rose", "vanilla", "musk", "spicy"];

describe("distribute", () => {
  it("sums exactly and honours the minimum", () => {
    const out = distribute([1, 1, 1], 100, 1);
    expect(out.reduce((a, b) => a + b, 0)).toBe(100);
    expect(Math.min(...out)).toBeGreaterThanOrEqual(1);
  });
  it("falls back to even weights when all weights are zero", () => {
    expect(distribute([0, 0], 10)).toEqual([5, 5]);
  });
});

describe("default demo composition", () => {
  it("matches the brief example: 1.0 / 0.6 / 0.4 ml + 8 ml base = 10 ml", () => {
    const v = computeVolumes(DEFAULT_BLEND);
    expect(v.entries.map((e) => formatMl(e.cml))).toEqual(["1.00 ml", "0.60 ml", "0.40 ml"]);
    expect(v.fragranceCml).toBe(200);
    expect(v.baseCml).toBe(800);
    expect(formatMl(v.totalCml)).toBe("10.00 ml");
  });
});

describe("addAccord / removeAccord", () => {
  it("always totals 100 % and 10 ml as accords are added one by one", () => {
    let blend: Blend = [];
    for (const id of ids) {
      blend = addAccord(blend, id).blend;
      expect(totalShare(blend)).toBe(100);
      const v = computeVolumes(blend);
      expect(v.fragranceCml).toBe(FRAGRANCE_CML);
      expect(v.baseCml).toBe(BASE_CML);
      expect(v.totalCml).toBe(1000);
      expect(validateBlend(blend)).toEqual([]);
    }
    expect(blend).toHaveLength(6);
  });
  it("ignores duplicates", () => {
    const r = addAccord(DEFAULT_BLEND, "woody");
    expect(r.blend).toBe(DEFAULT_BLEND);
    expect(r.changes).toEqual([]);
  });
  it("reports the recalculation", () => {
    const r = addAccord(DEFAULT_BLEND, "rose");
    expect(r.changes.find((c) => c.accordId === "rose")).toEqual({ accordId: "rose", from: 0, to: 25 });
    expect(r.changes.length).toBe(4);
  });
  it("redistributes a removed share proportionally", () => {
    const r = removeAccord(DEFAULT_BLEND, "musk");
    expect(r.blend).toEqual([
      { accordId: "woody", share: 63 },
      { accordId: "citrus", share: 37 },
    ]);
  });
  it("handles removing the last accord as an empty formula", () => {
    const r = removeAccord([{ accordId: "rose", share: 100 }], "rose");
    expect(r.blend).toEqual([]);
    expect(validateBlend(r.blend)).toEqual([{ code: "empty" }]);
  });
});

describe("setShare", () => {
  it("proportional mode keeps the blend at 100 % and the bottle at 10 ml", () => {
    const r = setShare(DEFAULT_BLEND, "woody", 70, "proportional");
    expect(r.blend.find((e) => e.accordId === "woody")?.share).toBe(70);
    expect(totalShare(r.blend)).toBe(100);
    expect(computeVolumes(r.blend).totalCml).toBe(1000);
  });
  it("clamps so other accords keep at least 1 %", () => {
    const r = setShare(DEFAULT_BLEND, "woody", 100, "proportional");
    expect(r.blend.map((e) => e.share)).toEqual([98, 1, 1]);
  });
  it("manual mode only changes the edited accord and flags imbalance", () => {
    const r = setShare(DEFAULT_BLEND, "citrus", 20, "manual");
    expect(r.changes).toEqual([{ accordId: "citrus", from: 30, to: 20 }]);
    expect(validateBlend(r.blend)).toEqual([{ code: "unbalanced", total: 90 }]);
    expect(totalShare(normalize(r.blend))).toBe(100);
  });
  it("rejects negative, NaN and empty input", () => {
    expect(() => setShare(DEFAULT_BLEND, "woody", -5, "proportional")).toThrow();
    expect(() => setShare(DEFAULT_BLEND, "woody", "abc", "proportional")).toThrow();
    expect(() => setShare(DEFAULT_BLEND, "woody", "", "proportional")).toThrow();
    expect(() => setShare(DEFAULT_BLEND, "woody", Number.NaN, "manual")).toThrow();
  });
  it("rounds decimals to whole percentages", () => {
    const r = setShare(DEFAULT_BLEND, "woody", 40.6, "proportional");
    expect(r.blend[0].share).toBe(41);
    expect(totalShare(r.blend)).toBe(100);
  });
});

describe("validateBlend", () => {
  it("catches invalid states", () => {
    expect(validateBlend([])).toEqual([{ code: "empty" }]);
    expect(validateBlend(null)).toEqual([{ code: "empty" }]);
    expect(validateBlend([{ accordId: "woody", share: -1 }]).map((i) => i.code)).toContain("invalid-value");
    expect(validateBlend([{ accordId: "nope", share: 100 }]).map((i) => i.code)).toContain("unknown-accord");
    expect(
      validateBlend([
        { accordId: "woody", share: 50 },
        { accordId: "woody", share: 50 },
      ]).map((i) => i.code),
    ).toContain("duplicate");
  });
});

describe("rounding never produces 9.99 / 10.01 ml", () => {
  it("holds across many random proportional edits", () => {
    let blend: Blend = normalize(ids.map((accordId) => ({ accordId, share: 1 })));
    for (let i = 0; i < 500; i++) {
      const id = ids[i % ids.length];
      blend = setShare(blend, id, Math.floor(((i * 37) % 97) + 1), "proportional").blend;
      const v = computeVolumes(blend);
      expect(totalShare(blend)).toBe(100);
      expect(formatMl(v.fragranceCml)).toBe("2.00 ml");
      expect(formatMl(v.totalCml)).toBe("10.00 ml");
    }
  });
});

describe("compareBlends", () => {
  it("shows per-accord deltas including added/removed accords", () => {
    const b: Blend = [
      { accordId: "woody", share: 40 },
      { accordId: "rose", share: 60 },
    ];
    expect(compareBlends(DEFAULT_BLEND, b)).toEqual([
      { accordId: "woody", a: 50, b: 40, delta: -10 },
      { accordId: "citrus", a: 30, b: 0, delta: -30 },
      { accordId: "musk", a: 20, b: 0, delta: -20 },
      { accordId: "rose", a: 0, b: 60, delta: 60 },
    ]);
  });
});
