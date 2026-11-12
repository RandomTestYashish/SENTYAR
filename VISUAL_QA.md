# Visual QA

Process: `npm run qa:shots` captures full-page screenshots of every route at 1440 × 900 and 390 × 844. Each one was compared with the approved concept board (`docs/reference/`), then fixed and recaptured.

## Checks performed

| Screen | Desktop | Mobile | Notes / fixes made |
|---|---|---|---|
| Home | ✓ | ✓ | Hero uses the board still life; type, CTA order and ivory/ink balance match the board. Lazy images verified after scrolling. |
| Kit detail | ✓ | ✓ | |
| Unboxing | ✓ | ✓ | Black kit with champagne state tags, matching the board's kit. |
| Ingredient journey | ✓ | ✓ | Fixed: a long category badge overflowed on mobile (badges now wrap). |
| Nature Lab | ✓ | ✓ | |
| Perfume Lab | ✓ | ✓ | Fixed: 1120 px mobile overflow from the horizontal accord tray (grid children `min-width: 0`). Fixed: vessel now comes first on mobile. |
| Bottle preview | ✓ | ✓ | Fixed the 3D bottle: it was opaque white with a faceted outline and an oversized cap. Now the outline is smooth, the backdrop colour shows through the glass, the cap is in proportion and the camera is pulled back. |
| My Creations / detail | ✓ | ✓ | |
| Marketplace + cart | ✓ | ✓ | |
| How it works / Brand | ✓ | ✓ | |

## Known deviations from the reference board

- **Wordmark** is set in Cormorant Garamond with custom tracking. It is not hand-drawn letterforms, so it is softer than the board's Canela-like wordmark.
- **Fonts**: Cormorant Garamond and Inter stand in for Canela and Neue Haas Grotesk, which are licensed fonts we don't have.
- **Photography** is cropped from the 1536 px board, so ingredient images are low resolution and are only shown at small sizes.
- **3D glass** is physically based but simpler than the board's rendering: no caustics, and only an approximate meniscus. On a real GPU it looks clearer than in the SwiftShader screenshots.
- **Hero bottle** (from the board) differs from the recommended "Pebble" geometry used in the app. This is intentional: the board is the art direction, and the Pebble keeps its asymmetric, stone-capped character in a form that can be manufactured.
- Pixel-perfect parity with the board is **not** claimed. The board is a moodboard, not a UI screen.
