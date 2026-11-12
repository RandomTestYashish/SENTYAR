# SENTYAR · The Personal Perfumery (prototype)

An interactive, responsive prototype of a digital perfumery studio: discover real botanical materials, learn the craft through guided journeys and an educational extraction simulation, compose a demo blend at a fixed 10 ml volume, preview it in 3D, and save, version, compare and "recreate" creations.

> **Prototype.** All ingredients, accords, prices, formula values, pairings and the extraction simulation are illustrative demo data. Nothing here is a skin-use recipe, a validated formulation or a live offer. SENTYAR is a working brand name, trademark/name/domain clearance has not been done, so no ® or ™ is used.

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # typecheck + production build to dist/
npm run preview      # serve dist/ on http://localhost:4173
npm test             # unit tests (formula engine + persistence)
npm run qa:flow      # end-to-end journey in headless Chrome (needs `npm run preview` running + Google Chrome installed)
npm run qa:shots     # full-page screenshots of every route at 1440 & 390 px → qa/out/
```

Uses `HashRouter` and a relative Vite `base`, so `dist/` works from any static host or sub-path.

## Stack

React 18 + TypeScript + Vite · plain CSS with central design tokens (`src/styles/tokens.css`) · `react-router-dom` · `three` (lazy-loaded, only on the preview page) · `lucide-react` icons · Vitest · `playwright-core` (dev, QA scripts only).

No backend, login or paid API. Persistence uses `localStorage` behind `src/lib/storage.ts`, swap its driver for an API client to connect a production backend.

## Routes

| Route | Page |
|---|---|
| `/` | Home, hero, how it works, kit, ingredients, lab, creations |
| `/kits` | Explore Kits |
| `/kits/creator-kit-v1` | Creator Kit V1 detail |
| `/kits/creator-kit-v1/unbox` | Interactive kit / unboxing |
| `/lab` | Perfume Lab (composition) |
| `/lab/preview` | Bottle preview, 3D (WebGL) with 2D fallback, name & save |
| `/nature-lab` | Nature Lab, educational extraction simulation (`?b=orange-peel` etc.) |
| `/ingredients`, `/ingredients/:id` | Library + 8-step guided journey for each of the 10 ingredients |
| `/creations`, `/creations/:id` | My Creations, compare, scent profile; detail with versions + recreate |
| `/marketplace` | Demo marketplace (cart is a drawer from the header) |
| `/how-it-works` | Guide, formula engine, FAQ, glossary, safety boundaries, tour replay |
| `/brand` | Brand system: emblem concepts, lockups, usage, bottle directions, tokens |

## Formula engine (`src/lib/formula.ts`)

Illustrative model: **10 ml** total = **20 % fragrance blend (2 ml)** + **80 % demo base (8 ml)**.

* Accord shares are whole percentages of the 2 ml blend and must total exactly **100 %**.
* Volumes are computed in hundredths of a ml: 1 % = 0.02 ml, so all values are exact, no 9.99 / 10.01 ml.
* **Proportional mode:** changing one accord rescales the others (largest-remainder rounding, min 1 % each) and returns a change list the UI shows ("Citrus 30 % → 18 %").
* **Manual mode:** only the touched accord changes; the blend is flagged unbalanced and preview is blocked until the user rebalances (proportionally or evenly).
* Adding an accord gives it an equal share (100/n) and scales the rest; removing one redistributes its share.
* Rejects negative, NaN and empty input; validates duplicates/unknown ids; empty blend = not ready.

Example: Woody 50 % = 1.00 ml · Citrus 30 % = 0.60 ml · Musk 20 % = 0.40 ml · base 8.00 ml · **total 10.00 ml**. Raise Woody to 70 % → Citrus 18 % (0.36 ml), Musk 12 % (0.24 ml); total still 10.00 ml.

## The ten ingredients

| Ingredient | Category / status | Goes into formula? | Related |
|---|---|---|---|
| Dried orange peel | Botanical sample, exploration only | No | Citrus accord |
| Cedarwood chips | Botanical sample, exploration only | No | Woody accord |
| Dried rose petals | Botanical sample, exploration only | No | Rose accord |
| Cinnamon sticks | Botanical sample, exploration only | No | Spicy accord |
| Woody | Fragrance accord, illustrative demo input | Yes | Cedarwood |
| Citrus | Fragrance accord, illustrative demo input | Yes | Orange peel |
| Rose | Fragrance accord, illustrative demo input | Yes | Rose petals |
| Vanilla | Fragrance accord, illustrative demo input | Yes | Cinnamon |
| Musk | Fragrance accord, illustrative demo input | Yes | Rose petals |
| Spicy | Fragrance accord, illustrative demo input | Yes | Cinnamon |

Botanical ↔ accord links are educational relationships, not chemical equivalence. Trying to add a botanical in the lab opens a blocking explanation and offers the related accord instead.

## Page-by-page feature checklist

- **Home**, editorial hero (approved still life), Discover → Experiment → Create, kit band with demo price, ingredient strip, lab teaser with live formula table, creations teaser, guided-tour entry.
- **Kit detail**, hero, demo price + disclaimer, contents (accords / botanicals / tools), what you'll learn, how it works, add-to-demo-cart, tour entry.
- **Unboxing**, lid-lift animation, 3 compartments of keyboard-accessible items, detail panel per item with category, story, purpose and safe-use boundary, "Add to lab" / "Explore" with fly-to-destination animation, destination docks with remove (undo), selection persisted to the lab, QR tool opens the in-app tour.
- **Perfume Lab**, accord tray, info dialogs, blocked botanicals, SVG vessel with stacked bands, drop + ripple on add, proportional/manual modes, slider + number input + ±1 per accord, recalculation list, total status, rebalance, composition table, pairing notes, formula explainer, Learn-more FAQ, glossary, sticky status bar with undo/reset/clear/preview, edit/variation banners.
- **Preview**, lazy WebGL bottle (transmission glass, liquid with meniscus, faceted cap, live label), drag to rotate, pause, reset, replay fill, 2D/3D toggle and automatic 2D fallback; three bottle concepts; naming with suggestions; formula table; disclaimer acknowledgement; "Can I make and wear this?" explanation; save / save as version N / save as new / create variation.
- **Nature Lab**, 4 experiments, Discover → Prepare → Extract → Filter → Evaluate → Outcome, sample-source fallback (kit / own / reference / related accord), descriptor selection, observation card, save learning note, continue to related accord, restart; prominent disclaimer.
- **Ingredients**, two clearly separated categories + extract explainer, discoveries list (delete), glossary; journey pages with 8 steps (meet, sensory, role, explore [zoom/inspect or family wheel], process, try [reversible action], result, save note) and a quick-facts sidebar answering the six "user should always know" questions.
- **My Creations**, empty state, cards with blend bar, edit / variation / duplicate / compare / delete with confirm + undo toast, two-way comparison with plain-language change summary, scent profile (≥ 2 creations).
- **Creation detail**, rename, formula table, recreate table (need vs kit vial vs still-needed, product match, base honestly unmapped), add selected to cart, version history with restore, variations, compare-with, linked exploration notes.
- **Marketplace**, category tabs, 19 demo products, add with feedback, recreate CTA; cart drawer with quantity, remove (undo), subtotal, clear, "no order is placed".
- **How It Works / Brand**, see routes table.
- **Global**, welcome dialog on first visit, 10-step guided tour (skip / back / next / restart / minimise / exit, auto-checks), storage-unavailable / corrupted-data banner, toasts, polite live-region announcements, skip link, 404.

## Component inventory

`Logo` (Emblem, EmblemNegative, EmblemMonogram, Wordmark, Lockup) · `Header` (desktop nav, mobile menu, cart button with count, resume-blend link) · `Footer` · `Bottle` (modular 2D geometry: pebble/facet/atelier) · `Bottle3D` (lazy WebGL) · `Vessel` · `Vial` / `ProductThumb` · `Dialog` (native `<dialog>`; dialog / drawer / mobile sheet variants) · `ConfirmDialog` · `CartDrawer` · `Notice` (info / warn / danger / ink) · `Img` (skeleton + failure state) · `Toasts` · `Announcer` · `SectionHead` · `GlossaryList` / `HelpList` / `GlossaryButton` · `Tour` / `Welcome` · CSS primitives: `.btn` (primary / secondary / ghost / light / danger / sizes, disabled), `.icon-btn`, `.link`, `.badge`, `.chip`, `.seg` (radio segmented control), `.range` slider, `.tablist-underline`, `details.disclosure`, `.steps`, `.crumbs`, `.empty`, `.skeleton`, `.input` / `.field`.

## Design tokens (summary)

Colour: bone `#F8F6F2` canvas · linen `#E9E4DC` · stone `#C8C0B4` · graphite `#34312D` · ink `#0B0B0B` (text, CTAs, packaging) · champagne `#B89972` (accent) · white. Botanical colour comes from photography; accord swatches are visual coding only.
Type: Cormorant Garamond 400-600 (+italic) for display/headings, Inter 400-600 for UI; responsive `clamp()` scale display → label; label 12 px / 0.16 em caps.
Spacing: 8-pt scale 4 · 8 · 16 · 24 · 32 · 40 · 48 · 64 · 80 · 96 · 128. Radius 0-8 px (restrained). Three elevation levels. Motion tokens 140 / 240 / 480 / 900 ms with two easings, all collapsed under `prefers-reduced-motion`. Focus ring, z-index layers, breakpoints 600 / 900 / 1200 documented in `tokens.css`.

## Simulated vs real

| Real (working) | Simulated / demo |
|---|---|
| Formula maths, validation, rounding | Accord descriptions, pairings, note roles |
| Local persistence (creations, versions, notes, cart, draft, tour) with validation & recovery | Kit contents, quantities, 5 ml vial inventory |
| Undo, reset, compare, version restore, variations | Prices (INR), products, pack sizes |
| Recreate maths from known demo values | Extraction "process" (animation only) |
| WebGL detection + fallback | Brand wordmark (typeset, not custom-drawn) |
| Keyboard, focus, live announcements, reduced motion | Concept photography (cropped from the board) |

## Must be professionally validated before any commercial kit or skin-use product

Real material sourcing and supplier documentation (SDS, IFRA certificates, allergen declarations) · concentrations within applicable limits, set by a qualified perfumer · base suitability, compatibility and stability testing · cosmetic safety assessment and labelling for each target market · microbial/contaminant control for any botanical extract · child-safety and packaging compliance for alcohol samples · trademark, company-name and domain clearance for SENTYAR · validated pricing, inventory and fulfilment.

## Asset sources

All imagery is cropped from the supplied concept board `docs/reference/SENTYAR_Brand_Identity_Reference_Board.png` (the owner's asset) with the ® marks removed from the hero bottle and kit lid; used as concept imagery, not product photography. Resolution is limited by the 1536 px board, so ingredient photos are shown at modest sizes. Fonts: Google Fonts (Cormorant Garamond, Inter, OFL). Icons: Lucide (ISC). Everything else (emblems, bottles, vessel, vials, simulation scenes) is original SVG / three.js geometry.

## Visual reference log

Browsing was not used in this build; these are the brief's references and the lesson applied from each:

| Reference | Lesson applied | Informs |
|---|---|---|
| Supplied concept board | Ivory canvas, ink CTAs, black kit, amber glass, champagne foil, serif/sans pairing | Everything |
| https://www.awwwards.com/ | Restrained, editorial whitespace; motion only where it explains | Home, kit band |
| https://motion.dev/ | Consistent easing/duration tokens; cause → effect motion | Fly-to-dock, drop/ripple, fill |
| https://threejs.org/docs/ , https://r3f.docs.pmnd.rs/ , https://drei.docs.pmnd.rs/ | `MeshPhysicalMaterial` transmission + env map for glass; lazy-load; dispose on unmount (plain three used instead of R3F to keep deps small) | Bottle3D |
| https://ui.shadcn.com/ , https://magicui.design/ | Accessible primitive patterns, customised, no default look | Dialog/drawer, segmented control |
| https://lucide.dev/ | One consistent icon family | Icons |
| https://www.nngroup.com/articles/ten-usability-heuristics/ | Visible status, undo, error prevention, recognition over recall | Lab status bar, recalculation list, undo toasts |
| https://www.w3.org/WAI/standards-guidelines/wcag/ | Contrast ≥ 4.5:1, focus visible, no colour-only meaning, live regions | Tokens, all components |
| https://designsystem.digital.gov/ | Token-driven spacing scale | `tokens.css` |

## Next best steps

1. Commission custom wordmark letterforms and final emblem vector refinement.
2. Real product photography (high-res) for ingredients, kit and bottle; replace board crops.
3. CAD the Pebble bottle with a glass supplier; swap the procedural 3D model for a compressed glTF.
4. Perfumer review of accord descriptions, pairings and the demo model; replace demo data with validated content.
5. Backend (auth-optional) for creations and cart; analytics on the first-creation funnel.
6. Usability test the tour and lab with 5-8 beginners; add axe-core to CI.

See `VISUAL_QA.md` and `FUNCTIONAL_QA.md` for QA records.
