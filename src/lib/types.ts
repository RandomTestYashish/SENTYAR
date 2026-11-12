// Typed domain models for the SENTYAR prototype.
// All catalogue values are illustrative demo data, not supplier formulas.

export type AccordId = "woody" | "citrus" | "rose" | "vanilla" | "musk" | "spicy";
export type BotanicalId = "orange-peel" | "cedarwood" | "rose-petals" | "cinnamon";
export type IngredientId = AccordId | BotanicalId;

export type IngredientCategory = "botanical" | "accord";

/** Illustrative note-role association only. */
export type NoteRole = "top" | "heart" | "base";

export interface Botanical {
  id: BotanicalId;
  kind: "botanical";
  name: string;
  commonName: string;
  botanicalName?: string;
  materialType: string;
  image: string;
  imageAlt: string;
  descriptors: string[];
  sensory: string;
  association: string;
  whyInKit: string;
  whyInteresting: string;
  status: "exploration-only";
  safety: string;
  relatedAccord: AccordId;
}

export interface Accord {
  id: AccordId;
  kind: "accord";
  name: string;
  family: string;
  descriptors: string[];
  profile: string;
  everyday: string;
  metaphor: string;
  role: NoteRole;
  /** Visual coding only — not a claim about the material's real colour. */
  swatch: string;
  status: "demo-accord";
  relatedBotanical: BotanicalId;
  compareWith: AccordId;
}

export interface BlendEntry {
  accordId: AccordId;
  /** Whole-number percentage of the fragrance allocation. */
  share: number;
}

export type Blend = BlendEntry[];

export type AdjustMode = "proportional" | "manual";

export interface ShareChange {
  accordId: AccordId;
  from: number;
  to: number;
}

export type BottleConceptId = "pebble" | "facet" | "atelier";

export interface CreationVersion {
  version: number;
  savedAt: string;
  name: string;
  blend: Blend;
}

export interface Creation {
  schema: 1;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  formulaVersion: number;
  volumeMl: 10;
  blend: Blend;
  /** Botanical exploration notes are kept separately from the formula. */
  botanicalNoteIds: string[];
  appearance: { bottle: BottleConceptId };
  disclaimerAcknowledged: boolean;
  parentId?: string;
  history: CreationVersion[];
}

export interface DiscoveryNote {
  id: string;
  ingredientId: IngredientId;
  createdAt: string;
  descriptors: string[];
  text: string;
  source: "ingredient-journey" | "nature-lab";
}

export type ProductCategory = "accords" | "botanicals" | "tools" | "bottles" | "packs";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  packSize?: string;
  priceInr: number;
  description: string;
  image?: string;
  imageAlt: string;
  /** For accord products: which accord and how much it contains (demo). */
  accordId?: AccordId;
  contentMl?: number;
  /** drawn tool illustration id (see KitItems.ToolArt) */
  art?: string;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export type ExtractionStage = "discover" | "prepare" | "extract" | "filter" | "evaluate";

export type PairingKind = "suggested" | "contrast" | "not-evaluated";
