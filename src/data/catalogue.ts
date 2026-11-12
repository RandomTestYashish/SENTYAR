import type { AccordId, Product, ProductCategory } from "../lib/types";

const IMG = "./assets/img/";

export const KIT = {
  id: "creator-kit-v1",
  name: "SENTYAR Creator Kit V1",
  priceInr: 799,
  description:
    "A beginner-friendly introduction to exploring ingredients and creating a personal fragrance concept.",
  accordVialMl: 5, // illustrative demo inventory per accord vial
  tools: [
    { id: "vials", name: "Small mixing vials", note: "For organising demo samples." },
    { id: "pipettes", name: "Transfer pipettes, 3 ml", note: "Graduated pipettes for measured transfer in guided exercises." },
    { id: "blotters", name: "Blotter strips", note: "Paper strips for smelling — never skin." },
    { id: "sprays", name: "Empty spray bottle, 10 ml", note: "Empty glass atomiser with a champagne collar, for your finished concept." },
    { id: "beaker", name: "Measuring beaker, 10 ml", note: "Graduated glass beaker for reading volumes in guided exercises." },
    { id: "funnel", name: "Filling funnel", note: "Small ceramic-white funnel that fits the bottle neck." },
    { id: "alcohol", name: "Perfumery alcohol sample", note: "Displayed as a demo kit component only. No handling instructions are given in this prototype." },
    { id: "cards", name: "Ingredient cards", note: "One card per accord and botanical." },
    { id: "journal", name: "Formula journal", note: "For notes alongside your saved creations." },
    { id: "guide", name: "Safety and handling guide", note: "Read before any hands-on activity." },
    { id: "qr", name: "QR tutorial", note: "Opens the in-app guided tour." },
  ],
} as const;

export const CATEGORY_NAMES: Record<ProductCategory, string> = {
  accords: "Fragrance accords",
  botanicals: "Botanical exploration samples",
  tools: "Perfumery tools",
  bottles: "Empty bottles",
  packs: "Learning packs",
};

const accordProduct = (id: AccordId, name: string, desc: string, price: number): Product => ({
  id: `accord-${id}`,
  name: `${name} accord`,
  category: "accords",
  packSize: "5 ml demo vial",
  priceInr: price,
  description: desc,
  imageAlt: `${name} accord demo vial`,
  accordId: id,
  contentMl: 5,
});

export const PRODUCTS: Product[] = [
  accordProduct("woody", "Woody", "Dry, smooth wood impression for composition practice.", 249),
  accordProduct("citrus", "Citrus", "Bright, fresh citrus impression.", 229),
  accordProduct("rose", "Rose", "Soft, velvety floral impression.", 279),
  accordProduct("vanilla", "Vanilla", "Creamy, warm vanilla impression.", 259),
  accordProduct("musk", "Musk", "Clean, soft skin-like impression.", 249),
  accordProduct("spicy", "Spicy", "Warm, piquant spice impression.", 239),
  { id: "bot-orange", name: "Dried orange peel", category: "botanicals", packSize: "15 g pouch", priceInr: 129, description: "Exploration-only sample for smelling and learning.", image: `${IMG}orange-peel.jpg`, imageAlt: "Dried orange peel" },
  { id: "bot-cedar", name: "Cedarwood chips", category: "botanicals", packSize: "20 g pouch", priceInr: 139, description: "Exploration-only sample for smelling and learning.", image: `${IMG}cedarwood.jpg`, imageAlt: "Cedarwood chips" },
  { id: "bot-rose", name: "Dried rose petals", category: "botanicals", packSize: "10 g pouch", priceInr: 149, description: "Exploration-only sample for smelling and learning.", image: `${IMG}rose-petals.jpg`, imageAlt: "Dried rose petals" },
  { id: "bot-cinnamon", name: "Cinnamon sticks", category: "botanicals", packSize: "6 quills", priceInr: 119, description: "Exploration-only sample for smelling and learning.", image: `${IMG}cinnamon.jpg`, imageAlt: "Cinnamon sticks" },
  { id: "tool-pipettes", name: "Transfer pipettes", category: "tools", packSize: "Pack of 20", priceInr: 99, description: "Single-use transfer pipettes for guided exercises.", imageAlt: "Transfer pipettes", art: "pipettes" },
  { id: "tool-blotters", name: "Blotter strips", category: "tools", packSize: "Pack of 50", priceInr: 89, description: "Smelling strips for evaluating on paper, not skin.", imageAlt: "Blotter strips", art: "blotters" },
  { id: "tool-vials", name: "Mixing vials", category: "tools", packSize: "Set of 6", priceInr: 149, description: "Small glass vials with caps for organising samples.", imageAlt: "Mixing vials", art: "vials" },
  { id: "tool-journal", name: "Formula journal", category: "tools", packSize: "64 pages", priceInr: 199, description: "Linen-bound journal for discovery notes.", imageAlt: "Formula journal", art: "journal" },
  { id: "tool-beaker", name: "Measuring beaker, 10 ml", category: "tools", packSize: "Glass, graduated", priceInr: 129, description: "Read volumes in guided exercises.", imageAlt: "Measuring beaker", art: "beaker" },
  { id: "tool-funnel", name: "Filling funnel", category: "tools", packSize: "Set of 2", priceInr: 59, description: "Fits the neck of the 10 ml bottles.", imageAlt: "Filling funnel", art: "funnel" },
  { id: "bottle-pebble-10", name: "Pebble bottle, 10 ml", category: "bottles", packSize: "Empty, 10 ml", priceInr: 349, description: "The recommended SENTYAR silhouette concept, empty.", imageAlt: "Empty Pebble bottle" },
  { id: "bottle-spray-5", name: "Mini atomiser, 5 ml", category: "bottles", packSize: "Set of 3, empty", priceInr: 179, description: "Empty travel atomisers.", imageAlt: "Empty mini atomisers" },
  { id: "pack-citrus", name: "Citrus exploration pack", category: "packs", packSize: "Peel + card + blotters", priceInr: 299, description: "Guided citrus learning set pairing orange peel with the Citrus accord.", image: `${IMG}orange-peel.jpg`, imageAlt: "Citrus exploration pack" },
  { id: "pack-woods", name: "Woods & spice pack", category: "packs", packSize: "Cedar + cinnamon + cards", priceInr: 329, description: "Compare dry woods with warm spice.", image: `${IMG}cinnamon.jpg`, imageAlt: "Woods and spice exploration pack" },
  { id: "kit-v1", name: "SENTYAR Creator Kit V1", category: "packs", packSize: "Full kit", priceInr: 799, description: "Six demo accords, four botanicals, tools and learning material.", image: `${IMG}kit-open.jpg`, imageAlt: "Open SENTYAR Creator Kit" },
];

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);
export const productForAccord = (id: AccordId) => PRODUCTS.find((p) => p.accordId === id);

export const formatInr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
