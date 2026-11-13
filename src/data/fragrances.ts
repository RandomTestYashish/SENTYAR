// Scent families, curated demo recipes and the Inspired Fragrance collection.
// Inspiration references are text-only comparisons of a scent *style*. SENTYAR
// does not reproduce any proprietary formula or product, and uses no other
// brand's logo, bottle, packaging or imagery. Reference wording is subject to
// legal review before commercial launch.

import type { AccordId, Blend, BottleVolume } from "../lib/types";
import type { KitId } from "./kits";

const IMG = "./assets/img/";

export type FamilyId = "fresh" | "aquatic" | "citrus" | "woody" | "floral" | "oud" | "amber" | "gourmand" | "spicy";

export interface ScentFamily {
  id: FamilyId;
  name: string;
  nameHi: string;
  short: string;
  image: string;
  accords: AccordId[];
  learnId: string;
}

export const FAMILIES: ScentFamily[] = [
  { id: "fresh", name: "Fresh", nameHi: "ताज़ा", short: "Crisp herbs and clean air", image: `${IMG}family-fresh.jpg`, accords: ["aromatic", "citrus", "musk"], learnId: "lavender" },
  { id: "aquatic", name: "Aquatic", nameHi: "समुद्री", short: "Sea breeze and wet stone", image: `${IMG}family-aquatic.jpg`, accords: ["aquatic", "citrus", "musk"], learnId: "aquatic-notes" },
  { id: "citrus", name: "Citrus", nameHi: "सिट्रस", short: "Bright peel and zest", image: `${IMG}orange-peel.jpg`, accords: ["citrus", "aromatic"], learnId: "bergamot" },
  { id: "woody", name: "Woody", nameHi: "लकड़ी जैसी", short: "Dry, smooth timber", image: `${IMG}cedarwood.jpg`, accords: ["woody", "musk"], learnId: "sandalwood" },
  { id: "floral", name: "Floral", nameHi: "फूलों जैसी", short: "Rose and soft petals", image: `${IMG}rose-petals.jpg`, accords: ["rose", "musk"], learnId: "rose" },
  { id: "oud", name: "Oud", nameHi: "ऊद", short: "Deep, resinous, smoky wood", image: `${IMG}family-oud.jpg`, accords: ["oud", "woody", "rose"], learnId: "oud" },
  { id: "amber", name: "Amber / Oriental", nameHi: "अम्बर", short: "Warm resin glow", image: `${IMG}family-amber.jpg`, accords: ["amber", "vanilla", "spicy"], learnId: "amber" },
  { id: "gourmand", name: "Gourmand", nameHi: "मीठी", short: "Vanilla and soft sweetness", image: `${IMG}family-gourmand.jpg`, accords: ["vanilla", "amber", "musk"], learnId: "vanilla" },
  { id: "spicy", name: "Spicy", nameHi: "मसालेदार", short: "Cinnamon and warm spice", image: `${IMG}cinnamon.jpg`, accords: ["spicy", "woody", "amber"], learnId: "cinnamon" },
];
export const familyById = (id: string) => FAMILIES.find((f) => f.id === id);

export type Difficulty = "Easy" | "Medium" | "Advanced";

export interface Recipe {
  id: string;
  name: string;
  family: FamilyId;
  description: string;
  difficulty: Difficulty;
  /** illustrative demo shares of the 2 ml fragrance allocation (not a validated physical recipe) */
  blend: Blend;
  kitId: KitId;
  volumeMl: BottleVolume;
  tutorial: boolean;
}

export const RECIPES: Recipe[] = [
  { id: "azure-drift", name: "Azure Drift", family: "aquatic", description: "Cool sea air over clean musk.", difficulty: "Easy",
    blend: [{ accordId: "aquatic", share: 40 }, { accordId: "citrus", share: 25 }, { accordId: "aromatic", share: 15 }, { accordId: "musk", share: 20 }], kitId: "inspired", volumeMl: 10, tutorial: true },
  { id: "sable-storm", name: "Sable Storm", family: "fresh", description: "Peppery freshness on a warm, ambery trail.", difficulty: "Medium",
    blend: [{ accordId: "aromatic", share: 30 }, { accordId: "citrus", share: 25 }, { accordId: "spicy", share: 15 }, { accordId: "amber", share: 30 }], kitId: "inspired", volumeMl: 10, tutorial: true },
  { id: "midnight-agar", name: "Midnight Agar", family: "oud", description: "Dark resinous wood with a rose heart.", difficulty: "Advanced",
    blend: [{ accordId: "oud", share: 25 }, { accordId: "woody", share: 35 }, { accordId: "rose", share: 20 }, { accordId: "amber", share: 20 }], kitId: "inspired", volumeMl: 10, tutorial: true },
  { id: "citrus-courtyard", name: "Citrus Courtyard", family: "citrus", description: "Bright peel and green herbs, light and easy.", difficulty: "Easy",
    blend: [{ accordId: "citrus", share: 55 }, { accordId: "aromatic", share: 25 }, { accordId: "musk", share: 20 }], kitId: "mini", volumeMl: 10, tutorial: true },
  { id: "golden-hour", name: "Golden Hour", family: "amber", description: "Amber glow, vanilla and a touch of spice.", difficulty: "Medium",
    blend: [{ accordId: "amber", share: 40 }, { accordId: "vanilla", share: 30 }, { accordId: "spicy", share: 15 }, { accordId: "woody", share: 15 }], kitId: "inspired", volumeMl: 10, tutorial: true },
  { id: "rose-velour", name: "Rose Velour", family: "floral", description: "Velvet rose softened with musk and wood.", difficulty: "Easy",
    blend: [{ accordId: "rose", share: 50 }, { accordId: "musk", share: 30 }, { accordId: "woody", share: 20 }], kitId: "creator-kit-v1", volumeMl: 10, tutorial: true },
  { id: "orange-woods", name: "Orange Woods", family: "woody", description: "Sunny citrus over smooth timber.", difficulty: "Easy",
    blend: [{ accordId: "woody", share: 50 }, { accordId: "citrus", share: 30 }, { accordId: "musk", share: 20 }], kitId: "creator-kit-v1", volumeMl: 10, tutorial: true },
  { id: "vanilla-cashmere", name: "Vanilla Cashmere", family: "gourmand", description: "Soft vanilla and skin-like musk.", difficulty: "Easy",
    blend: [{ accordId: "vanilla", share: 50 }, { accordId: "musk", share: 30 }, { accordId: "amber", share: 20 }], kitId: "advanced", volumeMl: 10, tutorial: true },
];
export const recipeById = (id: string) => RECIPES.find((r) => r.id === id);

export type Intensity = "Soft" | "Moderate" | "Strong";

export interface InspiredFragrance {
  id: string;
  name: string;
  /** text-only comparison of the scent style; never presented as the original product */
  inspiration?: string;
  family: FamilyId;
  profile: string;
  intensity: Intensity;
  intensityNote: string;
  recipeId: string;
  image: string;
  imageAlt: string;
  kits: KitId[];
  makes: string;
}

export const INSPIRED: InspiredFragrance[] = [
  { id: "azure-drift", name: "Azure Drift", inspiration: "Inspired by the fresh aquatic style of Davidoff Cool Water", family: "aquatic",
    profile: "Cool, watery and clean. Like sea air on warm skin.", intensity: "Moderate", intensityNote: "Noticeable but easy to wear daily (curated demo description).",
    recipeId: "azure-drift", image: `${IMG}frag-azure-drift.jpg`, imageAlt: "A SENTYAR crystal bottle on pale stone beside smooth sea glass and a shallow ripple of water",
    kits: ["inspired", "advanced"], makes: "A 10 ml or 50 ml fresh aquatic eau de parfum concept" },
  { id: "sable-storm", name: "Sable Storm", inspiration: "Inspired by the fresh, peppery aromatic style of Dior Sauvage", family: "fresh",
    profile: "Crisp and peppery up top, warm and ambery underneath.", intensity: "Strong", intensityNote: "Projects well; a little goes a long way (curated demo description).",
    recipeId: "sable-storm", image: `${IMG}frag-sable-storm.jpg`, imageAlt: "A SENTYAR faceted bottle with an onyx cap on slate beside lavender, bergamot and black pepper",
    kits: ["inspired", "advanced"], makes: "A 10 ml or 50 ml fresh aromatic concept" },
  { id: "midnight-agar", name: "Midnight Agar", inspiration: "Inspired by classic woody oud profiles", family: "oud",
    profile: "Deep resinous wood with a velvet rose heart.", intensity: "Strong", intensityNote: "Rich and long-lasting in style (curated demo description).",
    recipeId: "midnight-agar", image: `${IMG}frag-midnight-agar.jpg`, imageAlt: "A SENTYAR bottle beside dark agarwood chips, a rose and a curl of incense smoke on travertine",
    kits: ["inspired", "advanced"], makes: "A 10 ml or 50 ml woody oud concept" },
  { id: "citrus-courtyard", name: "Citrus Courtyard", inspiration: "Inspired by light citrus colognes", family: "citrus",
    profile: "Bright peel, green herbs, clean finish.", intensity: "Soft", intensityNote: "Light and refreshing (curated demo description).",
    recipeId: "citrus-courtyard", image: `${IMG}frag-citrus-courtyard.jpg`, imageAlt: "A slim SENTYAR column bottle with lemons, bergamot leaves and orange blossom on white marble",
    kits: ["mini", "inspired", "advanced"], makes: "A 10 ml citrus concept" },
  { id: "golden-hour", name: "Golden Hour", inspiration: "Inspired by warm amber fragrances", family: "amber",
    profile: "Glowing resin, vanilla and a little spice.", intensity: "Moderate", intensityNote: "Warm and close, great for evenings (curated demo description).",
    recipeId: "golden-hour", image: `${IMG}frag-golden-hour.jpg`, imageAlt: "A SENTYAR orb bottle in warm light beside amber resin pieces, saffron and a vanilla pod",
    kits: ["inspired", "advanced"], makes: "A 10 ml or 50 ml amber concept" },
  { id: "rose-velour", name: "Rose Velour", family: "floral",
    profile: "Velvet rose, softened with musk and wood.", intensity: "Moderate", intensityNote: "Romantic and polished (curated demo description).",
    recipeId: "rose-velour", image: `${IMG}frag-rose-velour.jpg`, imageAlt: "A SENTYAR pearl-capped bottle with red roses and scattered petals on ivory silk",
    kits: ["creator-kit-v1", "advanced"], makes: "A 10 ml or 50 ml floral concept" },
];
export const inspiredById = (id: string) => INSPIRED.find((f) => f.id === id);
