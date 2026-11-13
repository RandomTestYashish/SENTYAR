## SENTYAR Prompt 2: audit, implementation and handoff

This was an enhancement of the existing site, not a redesign. The royal-white theme, logo, typography, header style, hero and carousel are preserved.

---

## 1. Audit (before changes)

**Stack**
- Vite, React 18 and TypeScript.
- HashRouter, local React context store, and localStorage persistence (`src/lib/storage.ts`).
- Plain CSS tokens: `tokens.css`, then `royal.css`, then the page CSS files.
- three.js 0.170, used only in the Preview viewer.

**Tools checked**

| Tool | Status |
|---|---|
| Figma MCP `generate_image` | **Available**; used for all new imagery. |
| Blender (CLI or app) | **Not installed**. |
| Blender MCP | **Not available**. |
| ffmpeg or any video tooling | **Not installed**. |

**Working features before the change**
- Hero carousel, unboxing and Nature Lab.
- Perfume Lab with base pour and botanical infusion.
- Preview (3D), creations with versions, variations and compare.
- Marketplace and cart, Prefer quiz, guided tour.

**Why the bottle visuals looked childish (earlier rounds)**
- Hand-drawn SVGs and flat AI photos with inconsistent branding.
- Since fixed by photographic cut-outs, the traced emblem and a PBR three.js viewer.

**Must not regress**
- Hero and carousel, header look, and the theme tokens.
- All 27 legacy journey checks (`qa/flow.mjs`).
- Kit unboxing, Lab rules (10 ml = 2 ml oils + 8 ml base), creation persistence and the cart.

---

## 2. What was built

### Navigation
- The header now has four destinations: **Discover · Studio · Marketplace · About**.
- The existing visual style is kept. Sub-routes highlight their parent destination.
- Marketplace is in the primary navigation.

### Homepage
- The hero and carousel are unchanged in concept.
- Carousel defects fixed (see section 4).
- Below the hero:
  - Discover entry points (Inspired, Families, Create your own) and four inspired fragrance cards.
  - The four-kit range.
  - "Learn how to make it" (Guided Making).
  - Creations and the Prefer quiz, as before.
- The brand "movements" block moved to About.

### Discover (`/discover`)
- Inspired Fragrances: six original SENTYAR recipes, with text-only inspiration wording.
- Nine scent families, each linking to `/families/:id`.
- The kit range with the visual comparison.
- A route to Create your own.

### Inspired fragrance page (`/fragrances/:id`)
- Family, profile, intensity, what you'll make and included accords.
- Explore Recipe, and Watch how it's made.
- **Choose your kit**: kit tier, bottle size, then the bottle and cap sheet, then the demo cart.

### Kits (`/kits`, `/kits/:id`)
- **Mini ₹399, Inspired ₹799, Creator ₹1,499, Advanced ₹2,499.** These are temporary presentation prices, editable in `src/data/kits.ts`.
- Modular contents per kit, a compact visual comparison, and add-ons listed separately.

### My Studio (`/studio`)
- Hub with: My Creations, Explore recipes (`/studio/recipes`, `/studio/recipes/:id`), Create your own (`/lab`), **Guided Making** (`/studio/guide/:id`), the Scent Learning Library (`/learn`), the Ingredient Library (`/ingredients`) and Tutorials.

### Create your own (`/lab`)
- Kit selector: available accords come from that kit.
- Scent-family filters and Top/Heart/Base labels.
- **Beginner** mode (sliders only) and **Advanced** mode (numeric input and manual mode).
- Existing base pour and visual infusion steps.

### Guided Making
- Animated, step-led demonstration with 6 chapters and recipe-specific steps (17 for a four-accord recipe).
- **The scene:** the kit, the vials lining up, the picked vial lifting, the pipette with falling drops, the beaker filling with layers, the alcohol bottle tilting and pouring the base, swirl mixing, resting, the blotter with scent waves, the funnel and the bottle filling, the cap, and the finished bottle in 3D.
- **Controls:** play and pause (autoplay), next and back, a progress bar, chapter navigation and replay.
- **Language:** Hindi-first captions with an English option; subtitles toggle; optional narration via the device's text-to-speech voice.
- **Help:** "What you need" (ingredients and tools) and an "I am stuck" help panel on every step.
- **Safety boundary:** no quantities, drop counts or heating appear anywhere. Every amount and time defers to the printed, reviewed recipe card, and the on-screen beaker is labelled illustrative.

### Scent Learning Library (`/learn`, `/learn/:id`)
- 9 entries; Oud is the full example: what it is, source, history, how it's obtained (high level), perfumer descriptions, intensity, comparison with other woods, use in compositions, and safety and sourcing (CITES).
- Hindi headings toggle.
- The five material kinds are shown as distinct categories, never interchangeable.
- A beginner glossary in Hindi and English (top/heart/base note, accord, concentrate, base, oud, sillage, longevity).
- Internal **source notes** per entry for fact-checking.

### Marketplace
Categories:
- **Kits** (with sizes).
- **Accords**: 10 and 50 ml.
- **Refills**: base, 50 and 100 ml.
- **Bottles**: per-body volumes.
- **Caps**: 4 shapes × black or gold.
- **Tools** and **botanicals** (exploration only).
- **Presentation accessories**: decorative; the shimmer is a placeholder explicitly "not for perfume".

Each product card shows its use and status, and a pack-size selector appears only where that size is offered.

### Bottle Configurator (shared)
- A bottom sheet offering 7 bodies, 4 cap shapes, black or gold finish, and 10 / 50 / 100 ml (only supported sizes are enabled).
- **The live preview is the real 3D model of the exact combination.** The photo is the fallback when WebGL is unavailable.
- Used on kit selection, inspired fragrances, Preview (save) and creation reorder ("Order an empty bottle").

### Creations
Saves:
- Bottle body, cap and bottle volume.
- Recipe and kit reference, plus versions.

Reorder:
- Accords with a per-row pack size (10 / 50 ml).
- Base refill (50 / 100 ml).
- Bottle ordering through the configurator.

The cart encodes size and configuration in the line id (for example `kit-advanced@100#facet.disc.gold`). There is no cart schema change.

### Data
All configurable, in `src/data/`:
- `kits.ts`, `fragrances.ts` (families, recipes, inspired), `bottles.ts`, `learn.ts`, `tutorial.ts`.
- `catalogue.ts` (variants, `productById` / `lineId`), `ingredients.ts` (now 10 accords).

---

## 3. Generated assets

All are checked, all load, and every path below is used in the code. Generated with Figma `generate_image`, then post-processed by scripts in `scripts/`.

| Asset | Files (`public/assets/img/`) | Process |
|---|---|---|
| Kit range | `kit-mini.jpg`, `kit-inspired.jpg`, `kit-advanced.jpg` | Generated with blank lids, then foil-stamped with the exact emblem, wordmark and kit name (`scripts/stamp-kits.mjs`) |
| Scent families | `family-fresh/aquatic/oud/amber/gourmand.jpg` | Generated, then whitened |
| Inspired fragrances | `frag-azure-drift`, `frag-sable-storm`, `frag-midnight-agar`, `frag-citrus-courtyard`, `frag-golden-hour`, `frag-rose-velour` (`.jpg`) | Generated empty backdrops, with our branded bottle cut-outs composited on the plinth (`scripts/compose-fragrances.mjs`) |
| Caps | `caps-black.jpg`, `caps-gold.jpg` | Generated |
| Refill and add-ons | `refill-base.jpg`, `acc-giftbox.jpg`, `acc-tray.jpg`, `acc-shimmer.jpg` | Generated |
| Animation cut-outs | `tool-pipettes/blotters/funnel/sprays/alcohol.webp`, `oil-bottle.webp` | Colour-to-alpha (`scripts/cutout.mjs`) |
| Clean bottles | `bclean-*.webp` (7) | Clean glass, engraved live in the browser |

---

## 4. UI defects fixed

- **Carousel gaps.** Spacing is now computed from each neighbour's scaled width, so gaps are even (measured: 25 / 34 / 34 / 25 px at 1440). The old fixed spacing left uneven gaps.
- **Carousel shadows.** One consistent soft ground shadow per bottle, drawn outside the image box so it can't be clipped. The duplicate plinth shadow is removed.
- **Carousel on mobile.** Verified at 390 and 768; no overflow.
- **"Craft your signature scent" text.** The line masks were clipping descenders and italic overhang; they now have padding on all sides, so no characters are cropped.
- **Overflow.** No horizontal overflow on 10 key routes at 390 / 768 / 1024 / 1440.
- **Accessibility.** Configurator buttons now have clean accessible names (found by the test suite).

---

## 5. Tests

| Check | Result |
|---|---|
| `npm test` (formula and storage units) | 21 / 21 |
| `qa/flow.mjs` (legacy journeys, regression) | 27 / 27 |
| `qa/journeys.mjs` (Prompt 2 journeys A–F) | **35 / 35** |
| Other checks (`qa/hero.mjs`, `qa/kit.mjs`, `qa/prefer.mjs`) | Pass |
| Console errors | None |

---

## 6. Simulated, not real

- **Cart and checkout** are a demo: no orders, payments, stock or shipping.
- **Guided Making** is an in-browser animation, not a recorded video. Narration uses the device's voice where available.
- **The digital formula** (shares and ml) is illustrative; real amounts come from the reviewed recipe card.
- **Prices** are temporary presentation prices.
- **"I am stuck" support** is not connected to a real support channel.

---

## 7. Unavailable, and next steps

- **Blender.** Not installed and no MCP, so no `.blend` or GLB files exist. Bottles are a parametric three.js PBR model plus photographic cut-outs.
  - **Next step:** install Blender (with the user's approval), model the 7 bodies and 4 caps as separate GLB components, render a studio set (front, three-quarter and side, transparent PNG), and load the GLBs into `Bottle3D` in place of the parametric geometry.
- **Video generation.** No tool is available.
  - **Next step:** film, or render with Blender, the Guided Making sequence. The step and caption data in `src/data/tutorial.ts` can drive the video's chapters and subtitles.
- **Legal review.** "Inspired by" wording and the learning-library facts need legal and perfumer review before launch.
