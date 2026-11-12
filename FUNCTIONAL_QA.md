# Functional QA

Automated: `npm test` (21 unit tests) and `npm run qa:flow` (headless Chrome, 1440 px and 390 px). Last run 2026-11-12: **all passing at both widths, run three times in a row, no console errors.**

## Core journey (`qa/flow.mjs`)

| # | Step | Status |
|---|---|---|
| 1 | Home opens; welcome dialog on first visit | PASS |
| 2 | Navigate to Creator Kit V1 | PASS |
| 3–4 | Kit contents; open unboxing (lid lift) | PASS |
| 5 | Select a botanical, read detail, add to exploration tray | PASS |
| 6 | Nature Lab simulation → outcome → learning note saved | PASS |
| 7–8 | Select accord in kit, add to lab with fly animation; selection persists to lab | PASS |
| 9 | Add more accords in lab | PASS |
| 10 | Adjust proportions (slider) | PASS |
| 11 | Blend totals 100 % | PASS |
| 12 | Total stays 10.00 ml | PASS |
| — | Recalculation list shown | PASS |
| — | Raw botanical blocked from formula (GAP 5) | PASS |
| — | Manual mode → unbalanced blocks preview → rebalance | PASS |
| — | Invalid input ("abc") rejected with message | PASS |
| — | Undo restores previous state | PASS |
| 13–14 | Name (suggestion chip), acknowledge, save | PASS |
| 15 | Refresh — creation persists | PASS |
| 17 | Create variation, compare two, "what changed" summary | PASS |
| 16 | Reopen, edit, save as v2; history lists v1 | PASS |
| 20 | Recreate flow adds mapped products to cart | PASS |
| 18–19 | Marketplace add; cart drawer remove | PASS |
| — | Ingredient journey reaches step 8 (save note) | PASS |
| — | Unknown route → 404 page | PASS |

## Calculation tests (`src/lib/formula.test.ts`)

| Test | Status |
|---|---|
| Brief example 1.00 / 0.60 / 0.40 + 8 = 10.00 ml | PASS |
| Totals stay 100 % / 2.00 / 8.00 / 10.00 ml while adding 1→6 accords | PASS |
| 500 random proportional edits never show 9.99 / 10.01 ml | PASS |
| Negative, NaN, empty, non-numeric rejected; decimals rounded | PASS |
| Empty formula handled (`empty` issue) | PASS |
| Duplicate / unknown accord detected | PASS |
| Remove redistributes proportionally; removing last → empty | PASS |
| Manual mode only changes one accord and reports imbalance | PASS |
| compareBlends reports added / removed / deltas | PASS |

## Persistence (`src/lib/storage.test.ts`)

Round-trip, corrupt JSON recovery (banner shown), malformed records dropped, unbalanced stored blends normalised, cart qty clamped, storage unavailable → app still works: **PASS**.

## Manual / inspected

| Area | Status | Notes |
|---|---|---|
| Keyboard: all controls are buttons/links/inputs; focus ring visible; dialogs trap focus and return it (native `<dialog>`) | PASS (inspected) | Full screen-reader pass not done |
| Live announcements on add/remove/undo/save | PASS (inspected) | |
| Reduced motion: tokens collapse to 1 ms; drop/ripple/simulation animations disabled; 3D auto-rotate off | PASS (CSS/code inspected) | |
| WebGL fallback: detection → 2D bottle + notice; context-loss → 2D | PASS (code path) | Not run in a WebGL-less browser |
| 3D renders in headless Chrome (SwiftShader) | PASS | Glass looks more milky in SwiftShader than on a GPU |
| No horizontal overflow on any route at 390 px | PASS | Checked by `qa/shots.mjs` |
| Lazy loading: three.js only in the preview chunk | PASS | Checked in the build output |

## Known gaps

- No automated axe/contrast scan; contrast was checked against the token values (text-2 6.9:1, text-3 5.0:1 on bone).
- Not tested on real iOS Safari / Android devices, or with a screen reader.
