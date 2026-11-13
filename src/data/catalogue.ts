import type { AccordId, BottleVolume, Product, ProductCategory } from "../lib/types";
import { KITS } from "./kits";
import { BODIES, CAP_FINISHES, CAP_SHAPES, VOLUME_EXTRA, capLabel, parseConfig, bodyById } from "./bottles";

const IMG = "./assets/img/";

export const KIT = {
  id: "creator-kit-v1",
  name: "SENTYAR Creator Kit",
  priceInr: 1499,
  description:
    "A beginner-friendly introduction to exploring ingredients and creating a personal fragrance concept.",
  accordVialMl: 5, // illustrative demo inventory per accord vial
  tools: [
    { id: "vials", name: "Small mixing vials", note: "For organising demo samples." },
    { id: "pipettes", name: "Transfer pipettes, 3 ml", note: "Graduated pipettes for measured transfer in guided exercises." },
    { id: "blotters", name: "Blotter strips", note: "Paper strips for smelling, never skin." },
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
  kits: "Kits",
  accords: "Fragrance accords",
  refills: "Refills and base",
  botanicals: "Botanical exploration samples",
  tools: "Perfumery tools",
  bottles: "Empty bottles",
  caps: "Caps",
  accessories: "Presentation accessories",
  packs: "Learning packs",
};

const accordProduct = (id: AccordId, name: string, desc: string, price: number): Product => ({
  id: `accord-${id}`,
  name: `${name} accord`,
  category: "accords",
  packSize: "10 ml",
  priceInr: price,
  description: desc,
  imageAlt: `${name} accord amber vial`,
  accordId: id,
  contentMl: 10,
  sizes: [{ ml: 10, priceInr: price }, { ml: 50, priceInr: Math.round(price * 3.6 / 10) * 10 - 1 }],
  use: "Composition input for your kit recipes and refills.",
  status: "Demo accord. Real kits ship with supplier documentation.",
});

export const PRODUCTS: Product[] = [
  accordProduct("woody", "Woody", "Dry, smooth wood impression for composition practice.", 249),
  accordProduct("citrus", "Citrus", "Bright, fresh citrus impression.", 229),
  accordProduct("rose", "Rose", "Soft, velvety floral impression.", 279),
  accordProduct("vanilla", "Vanilla", "Creamy, warm vanilla impression.", 259),
  accordProduct("musk", "Musk", "Clean, soft skin-like impression.", 249),
  accordProduct("spicy", "Spicy", "Warm, piquant spice impression.", 239),
  accordProduct("aquatic", "Aquatic", "Cool, watery sea-air impression.", 249),
  accordProduct("aromatic", "Aromatic", "Crisp herbal lavender and mint impression.", 239),
  accordProduct("oud", "Oud", "Deep, resinous, smoky wood impression.", 449),
  accordProduct("amber", "Amber", "Warm, glowing resin impression.", 279),
  { id: "bot-orange", name: "Dried orange peel", category: "botanicals", packSize: "15 g pouch", priceInr: 129, description: "Exploration-only sample for smelling and learning.", image: `${IMG}orange-peel.jpg`, imageAlt: "Dried orange peel" },
  { id: "bot-cedar", name: "Cedarwood chips", category: "botanicals", packSize: "20 g pouch", priceInr: 139, description: "Exploration-only sample for smelling and learning.", image: `${IMG}cedarwood.jpg`, imageAlt: "Cedarwood chips" },
  { id: "bot-rose", name: "Dried rose petals", category: "botanicals", packSize: "10 g pouch", priceInr: 149, description: "Exploration-only sample for smelling and learning.", image: `${IMG}rose-petals.jpg`, imageAlt: "Dried rose petals" },
  { id: "bot-cinnamon", name: "Cinnamon sticks", category: "botanicals", packSize: "6 quills", priceInr: 119, description: "Exploration-only sample for smelling and learning.", image: `${IMG}cinnamon.jpg`, imageAlt: "Cinnamon sticks" },
  { id: "tool-pipettes", image: `${IMG}tool-pipettes.jpg`, name: "Transfer pipettes", category: "tools", packSize: "Pack of 20", priceInr: 99, description: "Single-use transfer pipettes for guided exercises.", imageAlt: "Transfer pipettes", art: "pipettes" },
  { id: "tool-blotters", image: `${IMG}tool-blotters.jpg`, name: "Blotter strips", category: "tools", packSize: "Pack of 50", priceInr: 89, description: "Smelling strips for evaluating on paper, not skin.", imageAlt: "Blotter strips", art: "blotters" },
  { id: "tool-vials", image: `${IMG}tool-vials.jpg`, name: "Mixing vials", category: "tools", packSize: "Set of 6", priceInr: 149, description: "Small glass vials with caps for organising samples.", imageAlt: "Mixing vials", art: "vials" },
  { id: "tool-journal", image: `${IMG}tool-journal.jpg`, name: "Formula journal", category: "tools", packSize: "64 pages", priceInr: 199, description: "Linen-bound journal for discovery notes.", imageAlt: "Formula journal", art: "journal" },
  { id: "tool-beaker", image: `${IMG}tool-beaker.jpg`, name: "Measuring beaker, 10 ml", category: "tools", packSize: "Glass, graduated", priceInr: 129, description: "Read volumes in guided exercises.", imageAlt: "Measuring beaker", art: "beaker" },
  { id: "tool-funnel", image: `${IMG}tool-funnel.jpg`, name: "Filling funnel", category: "tools", packSize: "Set of 2", priceInr: 59, description: "Fits the neck of the 10 ml bottles.", imageAlt: "Filling funnel", art: "funnel" },
  // legacy ids kept so older carts still resolve
  { id: "bottle-pebble-10", image: `${IMG}bottle-fluid.jpg`, name: "Pebble bottle, 10 ml", category: "bottles", packSize: "Empty, 10 ml", priceInr: 349, description: "The softly asymmetric SENTYAR silhouette concept with a stone cap, shown filled for reference.", imageAlt: "Empty Pebble bottle" },
  { id: "bottle-spray-5", image: `${IMG}tool-sprays.jpg`, name: "Mini atomiser, 5 ml", category: "bottles", packSize: "Set of 3, empty", priceInr: 179, description: "Empty travel atomisers.", imageAlt: "Empty mini atomisers" },
  { id: "pack-citrus", name: "Citrus exploration pack", category: "packs", packSize: "Peel + card + blotters", priceInr: 299, description: "Guided citrus learning set pairing orange peel with the Citrus accord.", image: `${IMG}orange-peel.jpg`, imageAlt: "Citrus exploration pack" },
  { id: "pack-woods", name: "Woods & spice pack", category: "packs", packSize: "Cedar + cinnamon + cards", priceInr: 329, description: "Compare dry woods with warm spice.", image: `${IMG}cinnamon.jpg`, imageAlt: "Woods and spice exploration pack" },
  { id: "kit-v1", name: "SENTYAR Creator Kit", category: "kits", packSize: "Full kit", priceInr: 1499, description: "Six demo accords, four botanicals, tools and learning material.", image: `${IMG}kit-open.jpg`, imageAlt: "Open SENTYAR Creator Kit" },
  ...KITS.map((k): Product => ({
    id: `kit-${k.id}`, name: k.name, category: "kits", packSize: `${k.accordCount} accords`, priceInr: k.priceInr,
    description: k.tagline, image: k.image, imageAlt: k.imageAlt,
    sizes: k.sizes.map((ml) => ({ ml, priceInr: k.priceInr + VOLUME_EXTRA[ml] })),
    use: k.outcome, status: "Indicative price. Not yet on sale.",
  })),
  ...BODIES.map((b): Product => ({
    id: `bottle-${b.id}`, name: `${b.name} bottle`, category: "bottles", packSize: `${b.volumes[0]} ml`, priceInr: 299 + VOLUME_EXTRA[b.volumes[0]] / 4,
    description: `${b.style} glass bottle, empty, with atomiser.`, image: `${IMG}bottle-${b.id === "pebble" ? "signature" : b.id}.jpg`, imageAlt: `Empty ${b.name} bottle`,
    sizes: b.volumes.map((ml) => ({ ml, priceInr: 299 + VOLUME_EXTRA[ml] / 4 })),
    use: "Holds a finished creation. Choose a cap separately or in the bottle builder.", status: "Empty glass, no fragrance included.",
  })),
  ...CAP_SHAPES.flatMap((sh) => CAP_FINISHES.map((f): Product => ({
    id: `cap-${sh.id}-${f.id}`, name: `${f.name} ${sh.name.toLowerCase()} cap`, category: "caps", packSize: "1 cap", priceInr: f.id === "gold" ? 149 : 129,
    description: `${sh.note}. Fits SENTYAR bottle necks.`, image: `${IMG}caps-${f.id}.jpg`, imageAlt: `${f.name} ${sh.name.toLowerCase()} perfume cap`,
    use: "Swap or upgrade the cap on a SENTYAR bottle.", status: "Fits the curated bottle range only.",
  }))),
  { id: "refill-base", name: "Perfumery alcohol base refill", category: "refills", packSize: "50 ml", priceInr: 249, description: "The base that carries your accords, for repeat batches.",
    image: `${IMG}refill-base.jpg`, imageAlt: "A clear glass bottle of perfumery alcohol base with a gold cap",
    sizes: [{ ml: 50, priceInr: 249 }, { ml: 100, priceInr: 429 }], use: "Refill for kit recipes. Follow the safety guide.", status: "Demo listing. Handling and shipping rules apply to real alcohol." },
  { id: "acc-giftbox", name: "Ivory gift box and ribbon", category: "accessories", packSize: "1 set", priceInr: 199, description: "Presentation box with champagne satin ribbon.",
    image: `${IMG}acc-giftbox.jpg`, imageAlt: "An ivory gift box tied with a champagne satin ribbon", use: "Gifting and display.", status: "Decorative. Not part of the formula." },
  { id: "acc-tray", name: "Presentation tray", category: "accessories", packSize: "1 tray", priceInr: 349, description: "Travertine-look tray for your finished bottles.",
    image: `${IMG}acc-tray.jpg`, imageAlt: "A pale travertine presentation tray holding two perfume bottles", use: "Display only.", status: "Decorative. Not part of the formula." },
  { id: "acc-shimmer", name: "Cosmetic shimmer add-on (placeholder)", category: "accessories", packSize: "Placeholder", priceInr: 99, description: "A possible future visual add-on, shown as a placeholder only.",
    image: `${IMG}acc-shimmer.jpg`, imageAlt: "A small glass jar of fine champagne shimmer powder", use: "Display concept only.", status: "Not validated for skin-applied perfume. Do not add to a perfume." },
];

/**
 * Resolve a cart line id. Variants are encoded in the id so the cart model stays simple:
 *   "accord-oud@50"                  pack size
 *   "kit-inspired@50#pebble.gem.gold" kit + bottle size + bottle configuration
 */
export const productById = (id: string): Product | undefined => {
  const [main, config] = id.split("#");
  const [base, sizeStr] = main.split("@");
  const p = PRODUCTS.find((x) => x.id === base);
  if (!p) return undefined;
  let out: Product = { ...p, id };
  if (sizeStr) {
    const size = p.sizes?.find((z) => z.ml === Number(sizeStr) as BottleVolume);
    if (!size) return undefined;
    out = { ...out, packSize: `${size.ml} ml`, priceInr: size.priceInr, name: `${p.name}, ${size.ml} ml` };
  }
  const cfg = parseConfig(config);
  if (config && !cfg) return undefined;
  if (cfg) out = { ...out, description: `${bodyById(cfg.body).name} bottle with ${capLabel(cfg.cap).toLowerCase()}`, name: `${out.name} · ${bodyById(cfg.body).name}` };
  return out;
};
export const lineId = (productId: string, ml?: number, config?: string) => `${productId}${ml ? `@${ml}` : ""}${config ? `#${config}` : ""}`;
export const productForAccord = (id: AccordId) => PRODUCTS.find((p) => p.accordId === id);

export const formatInr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
