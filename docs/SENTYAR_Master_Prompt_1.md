# SENTYAR --- MASTER BUILD PROMPT 1

## Complete product, UX, visual design, interaction and implementation brief

**Role:** Act as a principal product designer, creative technologist,
senior frontend engineer, 3D web developer and quality lead.

**Objective:** Inspect the existing repository and build a complete,
premium, responsive, interactive prototype for **SENTYAR**. This
is not a generic e-commerce storefront and not a children's game. It is
a digital perfumery studio where people discover real botanical
materials, learn about fragrance, experiment with a guided composition
model, preview a perfume and save their creations.

**Core promise:** Explore real ingredients. Experiment thoughtfully.
Create a personal fragrance.

**Important:** Build functionality and visual quality together,
component by component. Do not build a crude functional skeleton and
postpone design. Do not build a beautiful static mockup that has no
working interactions. Every major component must be both usable and
visually polished when completed.

------------------------------------------------------------------------

# 0. NON-NEGOTIABLE WORKING RULES

1.  Inspect the existing repository before changing anything. Identify
    framework, package manager, routes, dependencies, assets, existing
    design tokens and working functionality.
2.  Preserve useful existing code. Do not delete unrelated files,
    replace the project wholesale or change frameworks without a clear
    technical reason.
3.  If the repository is empty, initialize a modern React + TypeScript +
    Vite application.
4.  Create a short implementation plan, then execute it. Do not stop
    after the plan or after the homepage.
5.  Build and style each major component together: purpose → interaction
    → visual design → motion → responsive behaviour → tests.
6.  Use the supplied references and the art direction in this prompt
    from the beginning. Treat them as one coherent design language, not
    unrelated styles to copy.
7.  Every visible control must work. No fake buttons, dead links,
    decorative controls pretending to be functional, or unfinished
    placeholder sections.
8.  Do not invent scientific, safety, performance, longevity,
    naturalness or regulatory claims.
9.  Clearly label all demo ingredients, prices, formula values and
    simulated extraction steps as illustrative prototype data.
10. Do not represent raw botanicals, arbitrary tinctures or unverified
    extracts as safe for skin application.
11. Do not provide unsafe instructions involving flames, heating
    flammable alcohol, burning materials, ash, or putting unfiltered raw
    plant matter into a finished skin perfume.
12. Do not claim a formula is commercially ready, IFRA-compliant,
    skin-safe or stability-tested unless that has actually been verified
    by qualified evidence.
13. Keep the prototype usable without login, paid APIs or a backend. Use
    local persistence for the demo and document where a production
    backend would connect.
14. If a feature cannot be completed reliably, implement a clear honest
    fallback and document the limitation. Never silently fake it.
15. At the end, run the project, test key flows, fix errors and provide
    a concise completion report with what works, what is simulated and
    what remains.



# 0A. APPROVED BRAND IDENTITY — SENTYAR

**Working brand name: SENTYAR** (spelling must remain exactly SENTYAR throughout the product). This is the selected creative direction for this prototype, not a statement that trademark, company-name or domain rights are cleared. Do not use the ® symbol. Before commercial launch, the owner must complete trademark, company-name, domain and relevant market clearance.

## Brand story and positioning

SENTYAR is a personal perfumery studio that helps people discover fragrance materials, understand the craft of scent, experiment through guided learning and create a personal fragrance concept. It is not merely a perfume store and not a childish DIY game.

Core story: **From raw ingredients to a scent that is entirely yours.**

Primary brand line: **Craft Your Signature Scent.**

Supporting line: **Discover rare ingredients, understand the art of fragrance, and create a scent that feels uniquely yours.** Avoid claims such as “rare” if the actual materials are not verified; treat this as concept copy until product sourcing is confirmed.

Brand personality: quiet luxury, tactile, curious, intelligent, modern, editorial, crafted, welcoming and precise.

## Logo direction — mandatory custom exploration

Create an original floral/botanical emblem with a custom letter **S** integrated into the geometry of the flower. The S must feel structurally designed into the petals, not placed as a separate letter on top. Explore at least three vector logo concepts:
1. Four-petal botanical emblem with a central integrated S.
2. Negative-space S formed by the meeting of petals.
3. Refined monogram S with a restrained botanical outline.

Develop a primary lockup (emblem + SENTYAR wordmark + optional descriptor “THE PERSONAL PERFUMERY”), a standalone emblem, a wordmark-only version, and one-colour versions for embossing, engraving, print and small-size use. Test at favicon size and on bottle caps, bottle labels, kit lid, ingredient cards and website header.

The wordmark must be custom-refined, crisp and legible. Do not use an unmodified generic font as the final logo. Do not include ® or ™ as if registration is confirmed. Keep all logo artwork as editable SVG/vector where possible and document clear space, minimum size, monochrome use and incorrect-use examples.

## Typography direction

Explore high-end editorial typography, not generic luxury clichés. Use a refined high-contrast serif for large headlines and brand storytelling, paired with a precise contemporary sans-serif for navigation, body copy, labels, controls and data. Suggested starting points to test (verify licensing and availability): Canela-like editorial serif, Cormorant Garamond, DM Serif Display or an equivalent; Neue Haas Grotesk-like sans, Inter or Manrope for UI. These are direction references, not a mandate to use unlicensed fonts.

Create a clear type scale with responsive sizes, line heights, weights, letter spacing and optical corrections. Use restrained italic serif only for occasional editorial emphasis. Ingredient names, small labels and UI must remain highly readable. The logo lettering must be separately refined from the type system.

## Approved colour and material direction

The selected direction is neutral luxury:
- Primary website canvas: warm white / ivory, with pure white where clarity is needed.
- Primary text and CTA: near-black / ink black.
- Packaging base: matte or soft-touch black.
- Packaging details: transparent/frosted windows, clear glass, black inserts and restrained champagne foil or brushed-metal accents.
- Supporting neutrals: bone, linen, stone and graphite.
- Botanical colours should appear mainly in the actual ingredient photography, not as a green-dominant UI palette.

Suggested tokens to tune against the supplied board:
- Bone: `#F8F6F2`
- Linen: `#E9E4DC`
- Stone: `#C8C0B4`
- Ink: `#0B0B0B`
- Champagne: `#B89972`
- White: `#FFFFFF`

Use black buttons and restrained black navigation. Do not introduce a dominant olive/green brand palette, loud gradients, neon, or colourful dashboard styling. The overall website stays light and editorial; black is used for typography, CTAs, packaging and selected contrast surfaces. The lab may use darker local surfaces around glassware only when it improves object visibility, but do not turn the whole website into a dark theme.

## Creator Kit packaging direction

Use a premium black-base discovery kit: rigid matte black box, precise black compartments, transparent or frosted lid/window where suitable, clear small vials, minimal bone/ivory ingredient cards, restrained champagne foil/embossing and the S-flower emblem. Show the actual botanical materials clearly through photography or transparent containers. Avoid excessive gold, ornate decoration, glossy cheap plastic or clutter. The packaging must feel contemporary, collectible and tactile.

## Signature bottle — original silhouette, not a generic stock bottle

Do not use the same generic cylindrical perfume bottle seen everywhere. Develop an original SENTYAR signature bottle with a recognisable silhouette and strong manufacturing plausibility. Explore at least three materially different directions before choosing the strongest:
- Organic sculptural / fluid silhouette with a controlled asymmetry.
- Architectural faceted silhouette with distinctive glass planes.
- Softly sculpted classic silhouette with a unique shoulder/base/cap relationship.

The final concept should combine originality with practical manufacturability, stable standing, comfortable grip, feasible moulding, fill/closure compatibility, label placement and a recognisable cap. Do not create an impossible decorative sculpture that cannot be manufactured or filled. The bottle should have clear thick glass, crisp edges, physically plausible refraction/reflections, a visible liquid meniscus and a distinctive cap. Place the integrated S-flower emblem elegantly on the front, base or cap. Keep bottle dimensions and closures consistent across sizes where feasible.

The user has not yet approved one final bottle silhouette. Therefore, present the three concept directions in the design exploration and select a recommended prototype direction with rationale; keep the geometry modular so it can be changed later without rebuilding the site.

## Primary visual reference asset

![SENTYAR approved concept board](assets/SENTYAR_Brand_Identity_Reference_Board.png)

The supplied file `assets/SENTYAR_Brand_Identity_Reference_Board.png` is the primary visual direction reference. Study it before implementing the brand system. Use it to understand the overall balance of warm ivory, black packaging, transparent glass, champagne accents, ingredient still life, editorial typography and the integrated S-flower concept. It is a concept board, not a finished logo, not a final bottle CAD model and not a literal screenshot to reproduce pixel-for-pixel. Improve and resolve any generated-image artefacts, misspellings or inconsistent details. Do not copy the ® mark shown in the concept image.

The target is a highly faithful implementation of the approved art direction and its visual hierarchy, while producing clean, functional, responsive original UI. A single generated moodboard cannot define every pixel of every page; use the tokens and component rules in this brief to extend it consistently.


# 1. PRODUCT VISION

## 1.1 What the product is

SENTYAR is an interactive fragrance discovery and creation
experience. A user can:

-   Discover the Creator Kit.
-   Open an interactive representation of the kit.
-   Explore real botanical samples such as dried orange peel, cedarwood
    chips, rose petals and spices.
-   Learn the difference between a botanical material, a prepared
    extract and a fragrance accord.
-   Explore a guided, educational extraction simulation.
-   Select fragrance accords in a composition workspace.
-   Adjust the relative blend proportions while the finished bottle
    volume remains fixed.
-   Preview a 10 ml perfume concept.
-   Name, save, duplicate, compare and revisit creations.
-   Browse a demo ingredient marketplace and see what would be needed to
    recreate a saved formula.

The experience should communicate craft, curiosity, materiality and
personal expression.

## 1.2 Primary audience

Design primarily for a beginner who is curious about fragrance and wants
to experiment without needing prior perfumery knowledge. Also support
fragrance enthusiasts and gift buyers.

The interface must progressively disclose complexity: approachable
first, deeper information available when requested.

## 1.3 Product principles

-   Exploration before complexity.
-   Real material storytelling, not just a list of synthetic-looking
    oils.
-   Clear distinction between learning/exploration and skin-use
    formulation.
-   User control with guardrails.
-   Explain changes as they happen.
-   Fixed output volume with transparent composition math.
-   Premium craft, not gamification for children.
-   Honest prototype boundaries.

# 2. BRAND AND ART DIRECTION

## 2.1 Brand

Name: **SENTYAR**

Working tagline: **Discover ingredients. Explore fragrance. Create your signature scent.**

Create an original wordmark and identity. Do not imitate or trace an
existing perfume brand logo. The wordmark must be sharp, balanced,
legible and distinctive at desktop and mobile sizes. Create a
typographic wordmark first; an optional restrained botanical or
distillation-inspired symbol may accompany it.

## 2.2 Visual direction: white canvas, tactile materials

The main site canvas must be white or warm white. Do not turn the entire
site into a dark theme or use large coloured background panels as the
default.

Suggested tokens: - Pure white: `#FFFFFF` - Warm white: `#FAF9F6` - Soft
neutral: `#F1F0EC` - Ink: `#20211E` - Secondary text: `#696B64` -
Botanical green: `#53634D` - Muted olive: `#92977D` - Citrus accent:
`#D78A42` - Warm wood: `#9A704C` - Fine border: `#E6E4DE`

Use accent colours sparingly. Most of the visual richness should come
from the photographed/rendered materials themselves: orange peel, rose
petals, wood grain, spices, clear glass, amber liquid, reflections and
natural shadows.

## 2.3 Materials and lighting

Glass must look crisp and transparent, not like a flat translucent card.
Use believable highlights, edge reflections, refraction, subtle caustics
where feasible, and controlled shadows. Liquids should have a clear
meniscus and believable fill level. Botanical materials should show
texture and irregularity. Wood should have visible grain. Avoid
plastic-looking 3D assets.

Use soft studio/daylight lighting, high-quality product photography,
controlled contrast and generous whitespace. Keep the interface legible
and the product objects visually dominant.

## 2.4 Typography

Use an editorial serif for selected large headlines and a highly legible
modern sans-serif for interface, controls, labels and body text.
Suggested pair: Cormorant Garamond or a comparable licensed serif with
Inter or a comparable sans-serif. Verify font loading and provide system
fallbacks.

Typography must have a deliberate scale, line-height, weight and
responsive behaviour. Avoid tiny low-contrast captions.

## 2.5 Layout and grid

Use an 8-point spacing system as the primary spacing rhythm, with 4px
micro-adjustments where needed. Use a responsive 12-column desktop grid
and a clear mobile grid. Define spacing, typography, radius, border,
shadow, z-index, motion and breakpoint tokens centrally.

Do not force every dimension, font size, icon or object coordinate to be
a multiple of 8. Use the grid as a consistency system, not a constraint
that damages optical alignment.

Use consistent page gutters, section widths, alignment and vertical
rhythm. Audit optical alignment as well as mathematical alignment.

## 2.6 Avoid

-   Generic SaaS dashboard styling.
-   Default shadcn-looking pages without customization.
-   Excessive rounded cards.
-   Neon colours and loud gradients.
-   Cartoonish laboratory illustrations.
-   Childish game language, points, badges or confetti.
-   Cluttered layouts and unnecessary borders.
-   Tiny typography and low-contrast text.
-   Unmotivated animation.
-   Randomly mixed visual references.

# 3. REFERENCE RESEARCH AND ASSET STRATEGY

Use these references as research starting points. Inspect relevant pages
and documentation where accessible; do not assume every reference is
directly reusable or technically appropriate. Do not copy protected
brand assets, layouts or source code.

## 3.1 Design and interaction inspiration

-   Awwwards: https://www.awwwards.com/ --- high-craft web experiences
    and interaction inspiration.
-   Framer Motion: https://motion.dev/ --- UI motion and transitions.
-   React Three Fiber: https://r3f.docs.pmnd.rs/ --- React-based 3D
    scenes.
-   Three.js: https://threejs.org/docs/ --- WebGL/3D rendering
    capabilities.
-   Drei: https://drei.docs.pmnd.rs/ --- useful React Three Fiber
    helpers.
-   Magic UI: https://magicui.design/ --- selected motion patterns; use
    selectively.
-   shadcn/ui: https://ui.shadcn.com/ --- accessible component
    foundations, customized to the brand.
-   Lucide: https://lucide.dev/ --- consistent interface icons.
-   Nielsen Norman Group:
    https://www.nngroup.com/articles/ten-usability-heuristics/ ---
    usability heuristics.
-   WCAG: https://www.w3.org/WAI/standards-guidelines/wcag/ ---
    accessibility guidance.
-   USWDS: https://designsystem.digital.gov/ --- design system and
    spacing reference.

## 3.2 Visual reference search terms

Search and curate references for: - Luxury niche perfume editorial
product photography on white. - Transparent glass perfume bottle macro
photography. - Realistic perfume liquid, glass refraction and
reflections. - Botanical ingredient still life: orange peel, rose
petals, cedarwood, spices. - Premium perfume discovery kit with
organized compartments. - Minimal laboratory glassware and pipettes. -
Interactive 3D product configurators. - Premium product unboxing
interactions. - Editorial typography and refined white-space-heavy
websites.

If browsing is available, include a small reference gallery in the
project documentation with source links, what each reference teaches,
and which component it informs. Use licensed, original, public-domain or
properly sourced images. Do not hotlink unstable images as production
assets. Do not use a reference image as if it were the actual product
photograph.

## 3.3 Asset handling

Create a consistent local asset structure. Prefer original generated or
properly licensed assets. Use high-resolution images with appropriate
crops and descriptive alt text. Provide graceful fallbacks when an image
or 3D asset fails to load. Avoid random image URLs and broken external
dependencies.

# 4. TECHNICAL ARCHITECTURE

Use the existing stack if healthy. Preferred stack for an empty
project: - React - TypeScript - Vite - Tailwind CSS or a well-structured
CSS module/token approach - Motion / Framer Motion for UI transitions -
Three.js + React Three Fiber + Drei for 3D where justified - Lucide
icons - Accessible component primitives where useful

Do not add large dependencies without a clear need. Keep 3D scenes
isolated and lazy-loaded. Use CSS/SVG for simpler glassware or bottle
elements when full 3D is unnecessary.

Suggested architecture: - `src/app` --- app shell, routing and
providers - `src/pages` --- home, kits, kit detail, lab, creations,
marketplace, how-it-works - `src/components` --- shared UI components -
`src/features/kit` --- kit contents and unboxing -
`src/features/ingredients` --- botanical and accord catalogue -
`src/features/lab` --- composition engine and vessel -
`src/features/extraction` --- educational simulation -
`src/features/creations` --- save/edit/compare flows -
`src/features/marketplace` --- product catalogue and cart - `src/data`
--- demo data - `src/lib` --- calculations, persistence, validation and
helpers - `src/styles` --- design tokens and global styles -
`public/assets` --- local image and 3D assets

Use typed data models. Separate UI state from domain calculations. Avoid
putting all functionality in one giant component.

# 5. INFORMATION ARCHITECTURE AND NAVIGATION

Create these views/routes: 1. Home 2. Explore Kits 3. SENTYAR Creator Kit V1
detail 4. Interactive Kit / Unboxing 5. Perfume Lab 6. Botanical
Exploration / Nature Lab 7. My Creations 8. Ingredient Marketplace 9.
How It Works 10. Cart drawer or cart page

Navigation: - Original SENTYAR wordmark. - Explore Kits - The
Lab - Ingredients - My Creations - How It Works - Primary CTA: Start
Creating

Use clear active states, responsive navigation, mobile menu, breadcrumbs
where useful, and a persistent route back to the current creation where
appropriate.

# 6. HOME PAGE

Create a polished editorial landing page with: - A clear hero headline:
**Craft your signature scent.** - Supporting copy explaining real
botanical exploration and guided fragrance creation. - Primary CTA:
Explore the Kit. - Secondary CTA: Enter the Lab. - A striking central
product composition featuring a perfume bottle and selected botanical
materials on a white canvas. - Subtle, purposeful motion. - A concise
"How it works" sequence: Discover → Experiment → Create. - Creator Kit
preview. - Real ingredient story section. - Preview of the creation
lab. - Saved creation / recreate concept. - Footer with navigation,
prototype disclaimer and contact placeholder only if needed.

Do not invent customer testimonials, awards, press logos, sales figures
or brand history.

# 7. CREATOR KIT V1 --- DEMO PRODUCT

Create one demo kit: - Name: SENTYAR Creator Kit V1 - Demo price: ₹799 - Label
price as prototype/demo pricing, not a confirmed live offer. -
Description: a beginner-friendly introduction to exploring ingredients
and creating a personal fragrance concept.

Illustrative contents: A. Fragrance accords: - Woody - Citrus - Rose -
Vanilla - Musk - Spicy

B. Real botanical exploration samples: - Dried orange peel - Cedarwood
chips - Dried rose petals - Cinnamon sticks

C. Tools and learning material: - Small mixing vials - Transfer
pipettes - Blotter strips - Mini spray bottles - Perfumery alcohol
sample (display as a demo kit component only) - Ingredient cards -
Formula journal - Safety and handling guide - QR tutorial placeholder
that opens an in-app tutorial, not a dead link

All quantities and final commercial contents remain provisional until
supplier and perfumer validation. Do not imply that the kit is ready for
sale.

# 8. KIT DETAIL AND INTERACTIVE UNBOXING

Build a premium kit detail page with: - Product hero and price. - What
is included. - What the user will learn. - How the experience works. -
Clear prototype disclaimer. - Start unboxing CTA.

Unboxing experience: - Show a premium open box with separate
compartments. - Distinguish botanical samples, fragrance accords and
tools. - Each item is interactive and keyboard/touch accessible. -
Selecting an item opens a detail panel with name, category, scent
description, material story, purpose and safe-use boundary. - Add-to-lab
action animates the selected item from its compartment to the
appropriate workspace. - The item must not merely disappear; show its
destination and state change. - Provide undo/remove and clear selection
feedback. - Preserve the selection when navigating to the lab.

Do not imply that raw botanicals are directly added to a skin perfume.
They belong to exploration/extraction learning unless an approved
extract has been separately validated.

# 9. INGREDIENT CATALOGUE AND DETAIL MODEL

Create two clearly separated categories.

## 9.1 Botanical exploration materials

-   Dried orange peel
-   Cedarwood chips
-   Dried rose petals
-   Cinnamon sticks

Each botanical record should include: - Name. - Botanical/common name
where known. - Material type. - Natural sensory description, phrased as
an illustrative smell reference. - Typical fragrance association,
without making unsupported claims. - Origin field only if known;
otherwise omit. - Photo/visual. - Exploration-only or professionally
evaluated status. - Safety note. - Related accord(s).

## 9.2 Fragrance accords

-   Woody
-   Citrus
-   Rose
-   Vanilla
-   Musk
-   Spicy

Each accord record should include: - Name. - Fragrance family. -
Descriptive scent profile. - Suggested conceptual role (top/heart/base
association only where appropriate and clearly illustrative). - Demo
colour/visual. - Prototype status. - Compatibility note where data
exists.

Do not pretend these are real supplier formulas or disclose fabricated
ingredient compositions. Use clearly labelled fictional/demo data.

## 9.3 Ingredient detail interaction

On selection, show a refined detail panel or popover with: -
Image/material visual. - Name and category. - Sensory description. - Why
it is included in the kit. - Whether it is exploration-only or a demo
accord. - Related materials. - Add to exploration / add to composition
action as appropriate.

# 10. NATURE LAB --- EDUCATIONAL EXTRACTION SIMULATION

This is a central brand differentiator. Build a tactile educational
experience, but treat it as a simulation, not a customer-ready
extraction protocol.

Stages: 1. Discover --- inspect and smell-reference the raw material. 2.
Prepare --- learn that preparation differs by material; no unsafe
procedural instructions. 3. Extract --- show an educational animation of
a sealed sample and extraction medium. Do not give arbitrary ratios,
time, temperature or heating instructions. 4. Filter --- show
separation/filtration as a visual concept. 5. Evaluate --- compare the
resulting sample concept with a blotter and learn what must be assessed.

Include: - Orange peel experiment. - Cedarwood experiment. - Rose petal
experiment. - Cinnamon experiment.

For every stage, show progress, explanation and an accessible next/back
action. Include a restart option.

Fallback when the user does not have the botanical at home: - Use the
sample represented as included in the demo kit. - Explore a prepared
reference sample. - Continue with a related fragrance accord.

Critical message: "Botanical experiments are for learning and sensory
exploration. A homemade extract is not automatically suitable for skin
use or for a finished perfume. Composition, contaminants, filtration,
microbial quality, stability, compatibility and applicable safety limits
must be assessed by qualified professionals before skin use."

No flame, heating, burning, ash, smoke capture, or unsafe alcohol
handling instructions. Do not invite users to add unfiltered botanical
matter to a finished perfume.

# 11. INTERACTIVE PERFUME LAB

This is the primary interaction and must receive the highest
implementation and design effort.

## 11.1 Layout

Desktop: - Left: available fragrance accords and selected ingredients. -
Centre: large mixing vessel / lab workspace. - Right: formula controls,
composition summary and guidance. - Bottom: fixed-volume status and
preview/save actions.

Mobile: - Central vessel remains prominent. - Ingredient tray becomes
horizontal or collapsible. - Formula controls become a clear bottom
sheet or stacked panel. - Main CTA remains reachable without covering
controls. - Touch targets must be comfortable.

## 11.2 Selection and animation

-   Selecting an accord highlights it.
-   Add action animates the accord into the vessel.
-   Show a subtle liquid response and ingredient chip in the formula
    list.
-   Removing an accord animates it out or clearly updates the vessel.
-   Undo/reset must be available.
-   Use restrained motion and respect reduced-motion preferences.

## 11.3 Fixed-volume formula model

For the demo only: - Finished preview volume: 10 ml. - Illustrative
fragrance blend allocation: 20% = 2 ml. - Illustrative base allocation:
80% = 8 ml.

This is a UI demonstration model, not a safe or universally suitable
perfume recipe. Actual concentration, ingredient limits and base
suitability vary by material and must be set by a qualified perfumer
using supplier documentation and applicable standards.

Represent the fragrance blend as normalized percentages that sum to 100%
of the 2 ml fragrance allocation.

Example demo composition: - Woody: 50% of fragrance blend = 1.0 ml of
the 2 ml allocation. - Citrus: 30% = 0.6 ml. - Musk: 20% = 0.4 ml. -
Demo base allocation: 8.0 ml. - Total preview: 10.0 ml.

Important calculation behaviour: - Total finished volume stays fixed at
10 ml. - Increasing one accord must not increase bottle volume. - When a
value changes, either proportionally normalize the other selected accord
shares or switch to an explicit manual allocation mode. Make the
behaviour obvious to the user. - Never silently change other ingredients
without showing the recalculation. - Show each accord's percentage and
calculated demo volume. - Show total blend percentage = 100%. - Show
base allocation and total preview volume. - Prevent negative values,
NaN, empty invalid states and totals above/below constraints. - Provide
reset to a valid default composition. - If no accords are selected, show
an empty state and do not claim the perfume is ready. - Provide a clear
"Demo formula --- not a skin-use recipe" label.

Use a pure, unit-tested calculation module. Do not bury formula math in
UI components.

## 11.4 User guidance

Provide contextual help: - What is an accord? - What do top, heart and
base notes mean? - Why is the output volume fixed? - What changes when a
proportion is adjusted? - Why does a botanical sample differ from a
fragrance accord?

Do not overwhelm beginners. Use short explanations and expandable "Learn
more" details.

# 12. 3D OBJECTS AND MATERIAL QUALITY

The bottle, mixing vessel and key materials should feel tactile and
premium.

## 12.1 Bottle

Create a high-quality 3D bottle where feasible: - Transparent glass with
crisp edges. - Believable thickness and refraction. - Controlled
highlights and reflections. - Realistic liquid level and meniscus. - A
custom SENTYAR label. - Subtle rotation, drag-to-rotate and
reset view. - Responsive sizing. - Accessible non-3D fallback with
equivalent information.

## 12.2 Mixing vessel

-   Clear glass vessel with believable silhouette.
-   Visible liquid level.
-   Smooth fill changes.
-   Ingredient addition feedback.
-   Avoid excessive particle effects or fake physics that reduce
    clarity.

## 12.3 Performance

-   Lazy-load 3D assets.
-   Compress textures and models.
-   Limit polygon counts and shader complexity.
-   Provide reduced-quality/mobile fallback.
-   Respect `prefers-reduced-motion`.
-   Avoid blocking initial page load.
-   Ensure the site remains usable if WebGL is unavailable.

## 12.4 Honest rendering

If true physically based refraction is too expensive or unreliable, use
a high-quality hybrid approach (CSS/SVG/2D image plus controlled 3D)
rather than a broken or slow effect. Never sacrifice usability for a 3D
gimmick.

# 13. FINAL PERFUME PREVIEW

When the user has a valid demo composition: - Show a clear "Your
fragrance concept" preview. - Animate bottle filling. - Reflect the
chosen accord profile through restrained label accents or a subtle
visual treatment; do not imply liquid colour scientifically identifies
scent. - Allow custom perfume naming. - Example names: "My Sunday",
"After Hours", "Orange Woods", "Rose Affair". - Show selected accords,
relative blend percentages and fixed 10 ml demo volume. - Allow
back/edit, save and create variation. - Include the demo-formula
disclaimer.

The bottle size must remain fixed. Increasing the amount of one accord
changes its share within the fixed allocation, not the bottle volume.

# 14. MY CREATIONS

Persist demo creations locally.

Each saved creation should contain: - Unique local ID. - User-given
name. - Created/updated timestamps. - Formula version. - Fixed preview
volume. - Selected accords and normalized percentages. - Botanical
exploration notes separately from the formula. - Preview appearance
settings. - Prototype disclaimer status.

Actions: - View. - Edit. - Duplicate. - Create variation. - Compare two
creations. - Delete with confirmation.

Include: - Empty state for first-time users. - Save confirmation. -
Version history or at least a simple "variation" relationship. - Local
persistence after refresh. - Graceful handling if local storage is
unavailable or corrupt.

Do not store sensitive personal information.

# 15. INGREDIENT MARKETPLACE

Build a demo marketplace, clearly labelled as a prototype. No real
checkout or payment collection is required.

Categories: - Fragrance accords. - Botanical exploration samples. -
Perfumery tools. - Empty bottles. - Learning / experiment packs.

Each demo product: - Image. - Name. - Category. - Pack size where
applicable. - Illustrative price in INR. - Short description. -
Prototype/demo price label. - Add to cart.

Cart: - Add/remove items. - Quantity adjustment. - Subtotal
calculation. - Empty state. - Persistent demo cart. - Clear statement
that no order/payment is actually placed.

## 15.1 Recreate a saved formula

When a saved formula is opened: - List required demo accords. - Show
required demo amounts. - Show available kit quantity only if the demo
inventory data supports it. - Calculate missing amount only when the
underlying values are known. - Offer relevant marketplace items. - Add
relevant items to cart.

Do not fabricate stock, delivery dates, shipping fees or real product
availability.

# 16. ONBOARDING AND HELP

Add a first-time guided flow: 1. What is in the kit? 2. Difference
between botanicals and fragrance accords. 3. Explore a botanical. 4. Add
accords to the lab. 5. Adjust the demo blend. 6. Name and save a
creation.

Allow Skip, Back and Restart. Do not force a long tutorial on returning
users. Include contextual help at the point of need.

# 17. DESIGN SYSTEM AND COMPONENT LIBRARY

Create reusable, documented tokens and components.

Tokens: - Colour. - Typography. - Spacing. - Grid. - Breakpoints. -
Radius. - Border. - Elevation/shadow. - Motion duration/easing. - Focus
ring. - Layering/z-index.

Components: - Header/navigation. - Buttons and icon buttons. - Links. -
Ingredient cards. - Botanical material tiles. - Accord selector. -
Quantity controls. - Sliders. - Progress indicator. - Tabs. -
Tooltips. - Dialogs. - Drawers/bottom sheets. - Toasts. - Empty
states. - Loading states. - Error states. - Product cards. - Bottle
preview. - Formula summary. - Cart item. - Mobile navigation.

For each component define: - Default. - Hover. - Focus-visible. -
Active/pressed. - Disabled. - Loading where relevant. - Error/success
where relevant.

Use semantic HTML and accessible labels. Avoid clickable divs when a
button or link is appropriate.

# 18. MOTION AND MICRO-INTERACTION SPECIFICATION

Motion should feel precise, tactile, restrained and purposeful.

Required: - Page transitions. - Header and navigation feedback. - Kit
opening. - Ingredient hover/focus/selection. - Ingredient travel from
kit compartment to lab. - Mixing vessel response. - Liquid fill
transition. - Formula value update. - Bottle rotation. - Bottle
filling. - Label appearance. - Save confirmation. - Cart feedback. -
Dialog and drawer transitions.

Rules: - Motion communicates cause and effect. - Use consistent timing
and easing tokens. - Avoid long delays that block tasks. - Do not
animate every element simultaneously. - Support reduced-motion
settings. - Do not use animation as the only way to communicate a state
change. - Provide a non-motion equivalent for important feedback.

# 19. UX, ACCESSIBILITY AND RESPONSIVE QUALITY

Follow established usability heuristics and WCAG guidance.

Requirements: - Clear system status. - Consistent terminology. - User
control and undo. - Error prevention and helpful recovery. - Recognition
rather than recall. - Beginner-friendly language. - Visible focus
states. - Keyboard navigation. - Screen-reader labels and announcements
for important changes. - Adequate contrast. - Touch targets suitable for
mobile. - No colour-only meaning. - Reduced-motion support. - Responsive
typography and layouts. - No horizontal overflow. - No content hidden
behind sticky controls.

Test desktop, tablet and mobile widths. Do not simply shrink the desktop
design. Adapt the information hierarchy and interaction patterns.

# 20. CONTENT AND TONE

Use concise, confident, warm language. Avoid fake scientific authority,
exaggerated luxury claims and childish gamification.

Use terms consistently: - Botanical: raw natural material for
exploration. - Extract: material produced through an extraction process;
not automatically skin-safe. - Accord: a fragrance composition/profile
used in the demo. - Blend: selected accords in the composition model. -
Formula: saved demo composition. - Creation: the user's named saved
concept.

Provide useful empty, loading, error, success and confirmation copy.

# 21. DATA, STATE AND PERSISTENCE

Use typed models for: - Kit. - Botanical. - Accord. - Demo product. -
Formula. - Saved creation. - Cart item. - Extraction simulation state.

Keep: - Formula calculations in pure functions. - Demo catalogue in
separate data files. - Persistence behind a small storage abstraction. -
UI components focused on presentation and interaction.

Use localStorage for: - Saved creations. - Cart. - First-visit/tutorial
completion where appropriate.

Validate stored data on read. Handle missing, malformed or older data
gracefully.

# 22. TESTING AND ACCEPTANCE CRITERIA

Do not declare completion until these flows work:

## Core user journey

1.  Open the home page.
2.  Navigate to SENTYAR Creator Kit V1.
3.  Inspect the kit contents.
4.  Open the unboxing experience.
5.  Select a botanical and read its detail.
6.  Run the educational extraction simulation.
7.  Select a fragrance accord.
8.  Add it to the lab with animation.
9.  Add more accords.
10. Adjust proportions.
11. Confirm the normalized blend totals 100%.
12. Confirm the 10 ml demo output remains fixed.
13. Name the creation.
14. Save it.
15. Refresh the page and confirm it persists.
16. Reopen and edit the creation.
17. Duplicate or compare a variation.
18. Browse the marketplace.
19. Add/remove an item from cart.
20. Open a saved formula and inspect its recreate flow.

## Calculation tests

-   Percentages sum to 100% within defined rounding tolerance.
-   Demo ingredient volumes sum to the 2 ml fragrance allocation.
-   Base allocation remains 8 ml in the illustrative model.
-   Total preview remains 10 ml.
-   Invalid and negative values are rejected.
-   Empty formula is handled.
-   Rounding does not create visible totals such as 9.99 ml or 10.01 ml
    without explanation.

## Visual tests

-   No broken images.
-   No text clipping.
-   No accidental overflow.
-   Consistent 8-point spacing rhythm.
-   Sharp logo and readable typography.
-   Glass and liquid remain visually legible.
-   3D fallback works.
-   Mobile layout is intentionally designed.

## Technical tests

-   Run lint/typecheck/build where scripts exist.
-   Check console errors.
-   Test keyboard navigation.
-   Test reduced motion.
-   Test local persistence.
-   Test WebGL-unavailable fallback.
-   Check loading performance and lazy-loaded assets.

If automated tests are available, add tests for formula math,
persistence and critical user flows.

# 23. DEFINITION OF DONE

The work is complete only when: - The complete multi-page experience
exists. - The main user journey works end-to-end. - Functionality and
visual design have been developed together. - The site uses the
white-canvas botanical art direction. - The 8px spacing system and
design tokens are consistently applied. - The brand wordmark is original
and crisp. - The 3D/product visuals are high quality or use a deliberate
polished fallback. - Micro-interactions are purposeful and responsive. -
Saved creations persist. - Marketplace demo cart works. - All prototype
and safety boundaries are clear. - Desktop and mobile have been
checked. - No major dead buttons or broken routes remain. - README and
reference notes are included.

# 24. FINAL HANDOFF

When finished, provide: 1. Summary of what was built. 2. Routes/pages
implemented. 3. Main interactions that were tested. 4. Exact command to
run the project. 5. Any dependencies added. 6. Asset sources and
reference links. 7. Known limitations and simulated features. 8. What
must be professionally validated before a real commercial kit or
skin-use product is launched.

**Start by inspecting the repository. Then build the complete Perfume
SENTYAR experience. Do not stop at a plan, wireframe, landing page or
static mockup.**


---

# 25. COMPLETE GUIDED INGREDIENT LEARNING EXPERIENCE

This section is mandatory. Do not leave ingredient education as a few static descriptions. Build a guided, progressive experience that teaches a beginner what each material is, how it smells, what role it may play, how it differs from other ingredient types, and what the user can safely do with it in this prototype.

## 25.1 Ingredient learning journey

Create a guided flow for every ingredient:

1. **Meet the ingredient** — show a large, high-quality image or 3D representation, its name and category.
2. **Discover its sensory character** — describe the scent in plain language, using a small set of descriptors such as fresh, dry, woody, floral, sweet, warm or spicy. Make clear that descriptions are illustrative and perception varies.
3. **Understand its role** — explain whether it is a raw botanical sample for exploration, a prepared extract concept, or a fragrance accord used by the demo composition engine.
4. **Explore the material** — let the user inspect, rotate or zoom the object where appropriate. Use tactile interactions without making the user guess what is clickable.
5. **Learn the process** — show the appropriate educational path: botanical exploration/extraction simulation or accord discovery and blending.
6. **Try a guided action** — provide a clearly explained, reversible interaction.
7. **Understand the result** — explain what the user has learned and what the next safe step is.
8. **Save a discovery note** — allow the user to add the ingredient to a personal discovery list or note.

The user should always know:
- What am I looking at?
- Is this a real botanical, an extract, or a fragrance accord?
- What can I do with it in this prototype?
- Does it go into the demo formula, or is it exploration-only?
- What happens when I select it?
- Can I undo or change my selection?

## 25.2 Guided ingredient cards

Create a consistent detail template for all ten demo ingredient entries:

### Botanical exploration materials
1. Dried orange peel.
2. Cedarwood chips.
3. Dried rose petals.
4. Cinnamon sticks.

### Fragrance accords
5. Woody accord.
6. Citrus accord.
7. Rose accord.
8. Vanilla accord.
9. Musk accord.
10. Spicy accord.

Each detail view must include:
- Ingredient name.
- Category badge with plain-language explanation.
- Large image/material view.
- Short sensory description.
- “What you are exploring” explanation.
- “How it is used in this demo” explanation.
- “Can this go into the formula?” status.
- Related ingredient or accord.
- Guided next action.
- Safety/validation note where relevant.

Use these category labels consistently:
- **Botanical sample — exploration only**
- **Prepared extract — not approved for skin use unless specifically validated**
- **Fragrance accord — illustrative demo composition input**

Never blur these categories. A raw botanical sample must not be treated as a fragrance concentrate.

## 25.3 Guided accord discovery

For each of the six accords, create a short guided learning interaction:
- Introduce the accord in everyday language.
- Show its scent-family association.
- Show a visual metaphor or material reference.
- Let the user compare it with one related accord.
- Let the user add it to the demo formula.
- Explain what changing its blend share does to the composition display.

Do not assert a precise top/heart/base classification unless the demo data explicitly marks it as illustrative. Do not imply that a single accord has a universal formula or fixed performance.

## 25.4 Guided botanical exploration

For each of the four botanical samples:
- Show the raw material separately from its related accord.
- Let the user inspect the material.
- Explain why the material is interesting in perfumery.
- Offer the Nature Lab simulation if available.
- Show a clear boundary between sensory exploration and skin-use formulation.
- Offer a fallback if the user does not have the material at home.

Examples:
- Dried orange peel → related Citrus accord.
- Cedarwood chips → related Woody accord.
- Dried rose petals → related Rose accord.
- Cinnamon sticks → related Spicy accord.

These are educational relationships, not claims that the botanical sample and accord are chemically equivalent.

## 25.5 First-time guided path

Add a “Take a guided tour” entry point on the home page and kit page.

The tour should guide the user through:
1. Open the Creator Kit.
2. Select one botanical sample.
3. Learn the difference between botanical and accord.
4. Open the Nature Lab.
5. Complete one educational simulation.
6. Select two or more accords.
7. Add them to the mixing vessel.
8. Adjust the normalized blend.
9. Preview the fixed-volume perfume concept.
10. Name and save the creation.

Allow Skip, Back, Exit and Restart. Keep progress visible but unobtrusive. The tour must not trap the user or block independent exploration.

---

# 26. TEN PRODUCT GAPS — MANDATORY IMPLEMENTATION

The following ten gaps must be addressed explicitly in the product experience. Do not merely mention them in documentation; implement the appropriate UI, state, data or prototype behaviour.

## GAP 1 — First-time onboarding

Implement:
- A short welcome and “how this works” introduction.
- A guided first kit journey.
- Contextual hints near unfamiliar controls.
- Skip, back, exit and restart.
- A way to replay the guide from Help.
- Persistent completion state in local storage.
- No forced tutorial on every visit.

Acceptance: a first-time beginner can complete the first creation without needing external instructions.

## GAP 2 — Ingredient science and terminology

Implement:
- Clear definitions for botanical, extract, accord, blend, formula, top note, heart note and base note.
- Plain-language explanations.
- A visible distinction between raw material and prepared fragrance input.
- A “Learn more” expansion rather than overwhelming the main screen.
- A glossary accessible from the lab and ingredient detail views.

Acceptance: a beginner can explain the difference between a dried orange peel sample and a Citrus accord after using the guided ingredient flow.

## GAP 3 — Extraction lab outcome loop

Implement the complete educational loop:
Discover → Prepare concept → Extract simulation → Filter simulation → Evaluate → Save learning note → Return to lab.

The user must see an outcome, not just click through disconnected steps. The outcome may be an educational observation card, sensory descriptor selection or comparison note. It must not pretend to be a chemically verified extract.

Acceptance: after the simulation, the user can see what they explored, save a note and continue to a related accord.

## GAP 4 — Formula engine clarity

Implement:
- A fixed 10 ml demo output.
- A clearly visible normalized accord blend.
- A clearly visible base allocation in the illustrative model.
- Live percentage and volume calculations.
- Transparent recalculation behaviour.
- Rounding rules.
- Empty, invalid and reset states.
- A formula explanation panel.

Acceptance: every displayed quantity is internally consistent, the blend totals 100%, and the finished preview remains exactly 10 ml.

## GAP 5 — Ingredient compatibility and warnings

Create a compatibility data model for the prototype. Do not invent real chemical compatibility facts.

For demo accords, use clearly labelled illustrative relationships such as:
- “Suggested pairing”
- “Creative contrast”
- “Not evaluated”
- “Professional review required”

Show a warning when:
- A user selects a raw botanical in the formula area.
- A material has no verified use data.
- A demo combination is only illustrative.
- A user tries to interpret the preview as a skin-use recipe.

Do not block harmless creative exploration unnecessarily, but do block raw botanical samples from being silently added as skin-use formula ingredients.

Acceptance: the user can distinguish creative suggestions from validated compatibility and cannot mistake a demo formula for a safety-approved recipe.

## GAP 6 — 3D quality and performance

Implement:
- Lazy loading for 3D scenes.
- Compressed assets and sensible texture sizes.
- Adaptive rendering quality where practical.
- Reduced-motion support.
- WebGL-unavailable fallback.
- Mobile performance fallback.
- Loading and error states.
- A non-3D equivalent interaction.

Acceptance: the site remains usable and visually coherent on mobile or devices without WebGL.

## GAP 7 — Saved formula history and comparison

Implement:
- Save.
- Edit.
- Duplicate.
- Create variation.
- Compare two saved creations.
- Show creation/update dates.
- Show formula version.
- Restore a previous saved version if the implementation supports version history.
- Delete with confirmation.

Acceptance: a user can create two variations and understand exactly what changed between them.

## GAP 8 — Formula-based marketplace recommendations

Implement:
- “Recreate this formula” from a saved creation.
- List the accords used in the formula.
- Map each accord to related demo marketplace products.
- Show quantities needed based only on known demo data.
- Add selected items to cart.
- Show unavailable or unmapped items honestly.

Acceptance: the marketplace flow is connected to the saved formula, not just a disconnected product catalogue.

## GAP 9 — Accessibility and inclusive interaction

Implement:
- Keyboard navigation.
- Visible focus.
- Semantic controls and headings.
- Accessible labels for icon-only buttons.
- Screen-reader announcements for important state changes.
- Adequate text contrast.
- Touch-friendly target sizes.
- Reduced motion.
- No colour-only status communication.
- Useful alt text.
- Accessible modal and drawer behaviour.

Acceptance: the main creation flow can be completed without a mouse and remains understandable with assistive technology.

## GAP 10 — Product credibility and safety boundaries

Implement:
- Prototype/demo labels for unverified ingredients, prices and formulas.
- Clear separation of exploration-only botanicals and demo accords.
- No claims of skin safety, IFRA compliance, longevity or stability without evidence.
- Clear note that a qualified perfumer and relevant specialists must validate commercial formulations.
- A visible disclaimer in the Nature Lab and formula preview.
- No unsafe extraction instructions.

Acceptance: no user can reasonably mistake the educational prototype for a validated commercial perfume manufacturing or skin-use guide.

---

# 27. PERSONAL SCENT PROFILE — OPTIONAL BUT DESIGNED FOR EXTENSION

Prepare the data model so a future feature can infer a user's preferred fragrance families from saved creations.

For the prototype, create a non-clinical, transparent “Your Scent Profile” summary based only on the user's own saved demo formulas:
- Most-used accord families.
- Frequently paired accords.
- A few suggested exploration directions based on the saved data.

Do not claim psychological insight or infer personality. Do not make recommendations when there is insufficient saved data. Show “Create a few fragrances to discover your pattern” as the empty state.

This feature can be a lightweight prototype section; it must not delay the core creation journey.

---

# 28. FINAL UX CONTENT AND EMPTY STATES

Design and implement helpful states for:
- No kit selected.
- Empty ingredient selection.
- No accord selected.
- Invalid formula.
- Formula ready for preview.
- No saved creations.
- No marketplace products in cart.
- Botanical sample unavailable.
- Extraction simulation not completed.
- 3D unavailable.
- Local storage unavailable.
- Asset loading failure.

Every state must explain what happened and offer a useful next action. Do not use generic “Something went wrong” copy where a more specific explanation is possible.

---

# 29. FINAL QUALITY AUDIT — COMPONENT BY COMPONENT

After each major feature, audit both:
- Functional correctness.
- Visual craftsmanship.

Use a repeatable checklist:
1. Does the component do what the user expects?
2. Is the interaction discoverable?
3. Is the state change visible?
4. Can the action be undone where appropriate?
5. Does it work with keyboard and touch?
6. Does it follow the 8-point spacing rhythm?
7. Is typography clear and consistent?
8. Are image crops and material details high quality?
9. Is motion purposeful and performant?
10. Does the mobile version feel intentionally designed?
11. Are safety and prototype boundaries clear?
12. Are loading, error, empty and success states handled?

Do not mark a component complete if it only passes one side of the audit.

---

# 30. FINAL PROJECT HANDOFF ADDITIONS

In addition to the handoff described earlier, include:
- A page-by-page feature checklist.
- A component inventory.
- A design-token summary.
- A list of all ten ingredients and their category/status.
- A formula-engine explanation with example calculations.
- A list of simulated versus verified behaviours.
- A list of safety and commercial validations still required.
- A visual reference log with source links and the design lesson taken from each.
- A short list of the next best development steps.

**Final instruction:** Build a cohesive premium product, not a collection of disconnected screens. The user should feel they are entering one carefully art-directed digital perfumery studio from the landing page through unboxing, ingredient discovery, the lab, bottle preview, saved creations and marketplace.


# 31. VISUAL FIDELITY AND IMPLEMENTATION HONESTY

The supplied SENTYAR concept board is the approved art-direction anchor. Match its overall visual language as closely as possible: warm ivory editorial canvas, black wordmark and CTAs, black premium Creator Kit, clear glass, amber-toned liquid, restrained champagne accents, botanical still-life photography and refined serif/sans typography. Do not drift into a green-dominant, colourful, generic SaaS or generic ecommerce design.

“100% visual match” and “100% functional” are the user's desired quality bar, not a claim that can be guaranteed automatically by a prompt or one-pass code generation. Work toward the closest faithful implementation, verify every route and interaction, and explicitly report any remaining mismatch or limitation. Never claim pixel-perfect parity without comparing actual screenshots against the supplied reference board and checking all target viewport sizes.

Create a screenshot-based visual QA process: capture desktop and mobile screens for Home, Kit Detail, Unboxing, Ingredient Detail, Nature Lab, Perfume Lab, Bottle Preview, My Creations and Marketplace. Compare against the approved direction, correct spacing, typography, crop, alignment, contrast and material rendering, then repeat. Keep a `VISUAL_QA.md` with the checks performed and known deviations.

For functional QA, test every primary and secondary control, every navigation route, all formula calculations, local persistence, undo/reset, dialogs/drawers, keyboard operation, reduced motion, mobile interactions and WebGL fallback. Keep a `FUNCTIONAL_QA.md` with pass/fail status. Do not mark a feature as complete if it is only visually present or only technically wired.
