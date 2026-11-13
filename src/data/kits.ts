// Kit range. Prices are TEMPORARY presentation prices only (no costing or
// supplier validation has been done). Edit here; every page reads this file.

import type { AccordId, BottleVolume } from "../lib/types";

export type KitId = "mini" | "inspired" | "creator-kit-v1" | "advanced";
export type KitLevel = "First try" | "Beginner" | "Explorer" | "Enthusiast";

export interface Kit {
  id: KitId;
  name: string;
  priceInr: number;
  level: KitLevel;
  tagline: string;
  /** accords included; "recipe" kits ship the accords of the chosen recipe */
  accords: AccordId[] | "recipe";
  accordCount: number;
  botanicals: boolean;
  tools: string[];          // tool ids, see KIT_TOOL_LABEL
  outcome: string;
  sizes: BottleVolume[];
  tutorial: boolean;
  adds: string;             // what is different from the tier below
  image: string;
  imageAlt: string;
}

const IMG = "./assets/img/";

export const KIT_TOOL_LABEL: Record<string, string> = {
  pipettes: "Transfer pipettes",
  blotters: "Blotter strips",
  sprays: "Empty spray bottle",
  beaker: "Measuring beaker",
  funnel: "Filling funnel",
  alcohol: "Perfumery alcohol base",
  vials: "Mixing vials",
  cards: "Ingredient cards",
  journal: "Formula journal",
  guide: "Safety and handling guide",
  qr: "Guided Making QR",
  recipe: "Printed recipe card",
  caps: "Choice of two caps",
  tray: "Presentation tray",
};

export const KITS: Kit[] = [
  {
    id: "mini", name: "Mini Creation Kit", priceInr: 399, level: "First try",
    tagline: "Three fresh accords and the basics, for a first 10 ml perfume.",
    accords: ["citrus", "aquatic", "musk"], accordCount: 3, botanicals: false,
    tools: ["pipettes", "blotters", "sprays", "alcohol", "recipe", "qr"],
    outcome: "One 10 ml fresh perfume concept", sizes: [10], tutorial: true,
    adds: "The smallest way to start: one recipe, one bottle.",
    image: `${IMG}kit-mini.jpg`, imageAlt: "The SENTYAR Mini Creation Kit: a small ivory box with three amber vials, a pipette and a 10 ml spray bottle",
  },
  {
    id: "inspired", name: "Inspired Creation Kit", priceInr: 799, level: "Beginner",
    tagline: "Everything for one inspired fragrance, with the exact accords its recipe needs.",
    accords: "recipe", accordCount: 4, botanicals: false,
    tools: ["pipettes", "blotters", "beaker", "funnel", "sprays", "alcohol", "recipe", "qr"],
    outcome: "One inspired perfume, in 10 ml or 50 ml", sizes: [10, 50], tutorial: true,
    adds: "Adds a beaker and funnel, and the accords chosen for your inspired fragrance.",
    image: `${IMG}kit-inspired.jpg`, imageAlt: "The SENTYAR Inspired Creation Kit: an ivory box with four labelled amber vials, a gold-rimmed beaker, funnel and spray bottle",
  },
  {
    id: "creator-kit-v1", name: "Creator Kit", priceInr: 1499, level: "Explorer",
    tagline: "Six accords, four botanicals and the full toolset to compose your own.",
    accords: ["woody", "citrus", "rose", "vanilla", "musk", "spicy"], accordCount: 6, botanicals: true,
    tools: ["vials", "pipettes", "blotters", "beaker", "funnel", "sprays", "alcohol", "cards", "journal", "guide", "qr"],
    outcome: "Your own composition, saved and repeatable", sizes: [10, 50], tutorial: true,
    adds: "Adds six accords for free composition, botanicals to smell, cards and a journal.",
    image: `${IMG}kit-open.jpg`, imageAlt: "The SENTYAR Creator Kit open: six amber dropper bottles, a gold-rimmed beaker, pipette, spray bottle and booklet in an ivory linen box",
  },
  {
    id: "advanced", name: "Advanced Creator Kit", priceInr: 2499, level: "Enthusiast",
    tagline: "All ten accords, extra vials and presentation pieces for serious exploring.",
    accords: ["woody", "citrus", "rose", "vanilla", "musk", "spicy", "aquatic", "aromatic", "oud", "amber"], accordCount: 10, botanicals: true,
    tools: ["vials", "pipettes", "blotters", "beaker", "funnel", "sprays", "alcohol", "cards", "journal", "guide", "qr", "caps", "tray"],
    outcome: "Several compositions, up to a 100 ml bottle", sizes: [10, 50, 100], tutorial: true,
    adds: "Adds Aquatic, Aromatic, Oud and Amber, a cap choice and a presentation tray.",
    image: `${IMG}kit-advanced.jpg`, imageAlt: "The SENTYAR Advanced Creator Kit: a large two-tier ivory box with ten amber vials, tools, two bottles and gold and black caps",
  },
];

export const kitById = (id: string) => KITS.find((k) => k.id === id);
/** accords the kit actually ships with, resolving recipe-specific kits */
export const kitAccords = (k: Kit, recipeAccords?: AccordId[]): AccordId[] =>
  k.accords === "recipe" ? (recipeAccords ?? []) : k.accords;
