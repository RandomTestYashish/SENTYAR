// Typed domain models for the SENTYAR prototype.
// All catalogue values are illustrative demo data, not supplier formulas.

export type AccordId = "woody" | "citrus" | "rose" | "vanilla" | "musk" | "spicy" | "aquatic" | "aromatic" | "oud" | "amber";
export const ACCORD_IDS: AccordId[] = ["woody", "citrus", "rose", "vanilla", "musk", "spicy", "aquatic", "aromatic", "oud", "amber"];
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
  /** Visual coding only, not a claim about the material's real colour. */
  swatch: string;
  status: "demo-accord";
  /** kit botanical used to explain this accord, where the kit includes one */
  relatedBotanical?: BotanicalId;
  /** learning-library entry for this material */
  learnId?: string;
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

/** silhouettes with a 2D concept drawing (brand page) */
export type SvgBottleId = "pebble" | "facet" | "atelier";
/** every bottle a creation can be presented in; "pebble" shows as The Signature */
export type BottleConceptId = SvgBottleId | "orb" | "fluid" | "column" | "pearl";
export const BOTTLE_IDS: BottleConceptId[] = ["pebble", "orb", "facet", "fluid", "atelier", "column", "pearl"];

export type BottleVolume = 10 | 50 | 100;
export type CapShape = "classic" | "tall" | "disc" | "gem";
export type CapFinish = "black" | "gold";
export interface CapChoice { shape: CapShape; finish: CapFinish }

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
  /** bottle the creation is presented/ordered in */
  bottleVolumeMl?: BottleVolume;
  cap?: CapChoice;
  kitId?: string;
  recipeId?: string;
  notes?: string;
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

export type ProductCategory = "accords" | "botanicals" | "tools" | "bottles" | "caps" | "accessories" | "refills" | "packs" | "kits";

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
  /** pack sizes this product is actually offered in (indicative prices) */
  sizes?: { ml: BottleVolume; priceInr: number }[];
  /** what the product is for, in plain words */
  use?: string;
  /** validation / compatibility status shown to the buyer */
  status?: string;
}

export interface CartItem {
  productId: string;
  qty: number;
}

export type ExtractionStage = "discover" | "prepare" | "extract" | "filter" | "evaluate";

export type PairingKind = "suggested" | "contrast" | "not-evaluated";
