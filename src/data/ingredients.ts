// Illustrative demo catalogue. Sensory descriptions are smell references for
// learning; perception varies. Nothing here is a supplier formula.

import type { Accord, AccordId, Botanical, BotanicalId, IngredientId, PairingKind } from "../lib/types";

const IMG = "./assets/img/";

export const BOTANICALS: Botanical[] = [
  {
    id: "orange-peel",
    kind: "botanical",
    name: "Dried orange peel",
    commonName: "Sweet orange peel",
    botanicalName: "Citrus sinensis",
    materialType: "Dried fruit peel",
    image: `${IMG}orange-peel.jpg`,
    imageAlt: "A curl of dried orange peel with a glossy, textured rind",
    descriptors: ["bright", "zesty", "slightly bitter", "sweet"],
    sensory:
      "Often described as bright and zesty with a soft, sweet edge and a faint bitterness from the pith. Drying can mute the sparkle of fresh peel.",
    association: "Commonly associated with citrus fragrance families.",
    whyInKit:
      "Peel is where citrus aroma is concentrated, so it is a clear first lesson in how a raw material relates to a familiar scent family.",
    whyInteresting:
      "Rubbing or warming the peel between your fingers releases aroma — a simple way to notice how much smell lives in the surface of a material.",
    status: "exploration-only",
    safety:
      "For smelling and learning only. Citrus materials can irritate skin; do not apply peel or homemade preparations to skin.",
    relatedAccord: "citrus",
  },
  {
    id: "cedarwood",
    kind: "botanical",
    name: "Cedarwood chips",
    commonName: "Cedarwood",
    materialType: "Wood chips",
    image: `${IMG}cedarwood.jpg`,
    imageAlt: "Stacked strips of cedarwood showing deep reddish-brown grain",
    descriptors: ["dry", "pencil-shaving", "woody", "calm"],
    sensory:
      "Often described as dry and woody, reminiscent of pencil shavings and a quiet wooden drawer.",
    association: "Commonly associated with woody fragrance families.",
    whyInKit:
      "Wood is a classic structural material in perfumery and its smell is easy to recognise, which makes it a good reference point.",
    whyInteresting:
      "Wood smells stronger along freshly broken grain — notice the difference between the outer surface and a split edge.",
    status: "exploration-only",
    safety: "For smelling and learning only. Avoid splinters and dust; do not burn the chips.",
    relatedAccord: "woody",
  },
  {
    id: "rose-petals",
    kind: "botanical",
    name: "Dried rose petals",
    commonName: "Rose petals",
    botanicalName: "Rosa spp.",
    materialType: "Dried flower petals",
    image: `${IMG}rose-petals.jpg`,
    imageAlt: "Deep crimson rose petals with fine droplets on their surface",
    descriptors: ["soft", "floral", "tea-like", "powdery"],
    sensory:
      "Often described as soft and floral with a tea-like, slightly powdery character once dried — quieter than a fresh rose.",
    association: "Commonly associated with floral fragrance families.",
    whyInKit:
      "Comparing dried petals with the Rose accord shows how a raw flower and a composed floral impression can differ.",
    whyInteresting:
      "Drying changes a flower's smell considerably. The gap between memory of a fresh rose and the dried petal is itself a lesson.",
    status: "exploration-only",
    safety: "For smelling and learning only. Do not apply petals or homemade preparations to skin.",
    relatedAccord: "rose",
  },
  {
    id: "cinnamon",
    kind: "botanical",
    name: "Cinnamon sticks",
    commonName: "Cinnamon bark",
    materialType: "Dried bark quills",
    image: `${IMG}cinnamon.jpg`,
    imageAlt: "Rolled cinnamon bark quills with a warm brown, papery surface",
    descriptors: ["warm", "spicy", "sweet", "woody"],
    sensory: "Often described as warm, sweet and spicy with a dry, woody undertone.",
    association: "Commonly associated with spicy and warm fragrance families.",
    whyInKit:
      "Spices are a vivid way to learn how a small amount of a strong material can change an overall impression.",
    whyInteresting:
      "Smell the outside of the quill, then a broken end — the inner layers are often sharper and more intense.",
    status: "exploration-only",
    safety:
      "For smelling and learning only. Cinnamon materials are known skin sensitisers; never apply to skin.",
    relatedAccord: "spicy",
  },
];

export const ACCORDS: Accord[] = [
  {
    id: "woody",
    kind: "accord",
    name: "Woody",
    family: "Woody",
    descriptors: ["dry", "smooth", "grounding"],
    profile: "A dry, smooth wood impression with a quiet, grounding character.",
    everyday: "Think of a cedar drawer or a freshly sharpened pencil, softened and rounded.",
    metaphor: "Polished timber",
    role: "base",
    swatch: "#8A6A4E",
    status: "demo-accord",
    relatedBotanical: "cedarwood",
    compareWith: "spicy",
  },
  {
    id: "citrus",
    kind: "accord",
    name: "Citrus",
    family: "Citrus",
    descriptors: ["bright", "fresh", "sparkling"],
    profile: "A bright, fresh citrus impression that tends to feel lively and open.",
    everyday: "The first breath of a just-peeled orange.",
    metaphor: "Morning light",
    role: "top",
    swatch: "#D9973F",
    status: "demo-accord",
    relatedBotanical: "orange-peel",
    compareWith: "woody",
  },
  {
    id: "rose",
    kind: "accord",
    name: "Rose",
    family: "Floral",
    descriptors: ["floral", "velvety", "romantic"],
    profile: "A soft, velvety rose impression — floral without being sugary.",
    everyday: "A rose in a cool room rather than a sweet bouquet.",
    metaphor: "Velvet petal",
    role: "heart",
    swatch: "#9E3A4A",
    status: "demo-accord",
    relatedBotanical: "rose-petals",
    compareWith: "musk",
  },
  {
    id: "vanilla",
    kind: "accord",
    name: "Vanilla",
    family: "Gourmand / Amber",
    descriptors: ["creamy", "sweet", "warm"],
    profile: "A creamy, warm vanilla impression with gentle sweetness.",
    everyday: "The warmth of a vanilla pod split open, not cake frosting.",
    metaphor: "Warm cream",
    role: "base",
    swatch: "#C9A877",
    status: "demo-accord",
    relatedBotanical: "cinnamon",
    compareWith: "musk",
  },
  {
    id: "musk",
    kind: "accord",
    name: "Musk",
    family: "Musky",
    descriptors: ["clean", "soft", "skin-like"],
    profile: "A clean, soft impression often described as skin-like and cosy.",
    everyday: "Freshly washed linen, warmed by sunlight.",
    metaphor: "Clean linen",
    role: "base",
    swatch: "#B9AFA3",
    status: "demo-accord",
    relatedBotanical: "rose-petals",
    compareWith: "vanilla",
  },
  {
    id: "spicy",
    kind: "accord",
    name: "Spicy",
    family: "Spicy",
    descriptors: ["warm", "piquant", "vivid"],
    profile: "A warm, piquant spice impression that adds energy in small amounts.",
    everyday: "Cinnamon and clove in a warm kitchen.",
    metaphor: "Ember glow",
    role: "heart",
    swatch: "#8C3F25",
    status: "demo-accord",
    relatedBotanical: "cinnamon",
    compareWith: "woody",
  },
];

export const accordById = (id: AccordId) => ACCORDS.find((a) => a.id === id)!;
export const botanicalById = (id: BotanicalId) => BOTANICALS.find((b) => b.id === id)!;
export const ingredientById = (id: string) =>
  (ACCORDS.find((a) => a.id === id) ?? BOTANICALS.find((b) => b.id === id)) as
    | Accord
    | Botanical
    | undefined;
export const isIngredientId = (id: string): id is IngredientId => ingredientById(id) !== undefined;

export const CATEGORY_LABEL = {
  botanical: "Botanical sample — exploration only",
  extract: "Prepared extract — not approved for skin use unless specifically validated",
  accord: "Fragrance accord — illustrative demo composition input",
} as const;

export const CATEGORY_EXPLAIN = {
  botanical:
    "A raw, dried natural material you can look at, touch and smell. It is not a fragrance concentrate and never goes into the formula.",
  accord:
    "A composed fragrance impression used by the demo composition engine. Values are illustrative prototype data, not a supplier formula.",
} as const;

export const ROLE_LABEL: Record<string, string> = {
  top: "Top-note association",
  heart: "Heart-note association",
  base: "Base-note association",
};

// ---- Illustrative pairing model (not chemical compatibility data) ----
const PAIRS: Record<string, PairingKind> = {
  "citrus|woody": "suggested",
  "musk|woody": "suggested",
  "rose|musk": "suggested",
  "vanilla|musk": "suggested",
  "spicy|woody": "suggested",
  "spicy|vanilla": "suggested",
  "citrus|rose": "contrast",
  "citrus|spicy": "contrast",
  "rose|spicy": "contrast",
  "citrus|vanilla": "contrast",
  "rose|vanilla": "contrast",
  "rose|woody": "suggested",
};

export function pairing(a: AccordId, b: AccordId): PairingKind {
  return PAIRS[`${a}|${b}`] ?? PAIRS[`${b}|${a}`] ?? "not-evaluated";
}

export const PAIRING_LABEL: Record<PairingKind, string> = {
  suggested: "Suggested pairing",
  contrast: "Creative contrast",
  "not-evaluated": "Not evaluated",
};
