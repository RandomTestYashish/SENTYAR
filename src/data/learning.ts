import type { BotanicalId, ExtractionStage } from "../lib/types";

export const GLOSSARY: { term: string; def: string }[] = [
  { term: "Botanical", def: "A raw natural material, peel, wood, petals, bark, that you can look at and smell. In SENTYAR it is for exploration only." },
  { term: "Extract", def: "A material produced by an extraction process. A homemade extract is not automatically suitable for skin or for a finished perfume." },
  { term: "Accord", def: "A composed fragrance impression, like a chord in music. Here, accords are illustrative demo inputs for the composition model." },
  { term: "Blend", def: "The accords you have selected and their relative shares. Shares always add up to 100 %." },
  { term: "Formula", def: "A saved demo composition: which accords, and in what proportions. Not a skin-use recipe." },
  { term: "Creation", def: "Your named, saved concept, the formula plus its name, bottle and notes." },
  { term: "Top note", def: "The first impression, usually brighter materials noticed early. Used here as an illustrative association only." },
  { term: "Heart note", def: "The character that emerges after the opening. Illustrative association only." },
  { term: "Base note", def: "The deeper, longer-lingering impression. Illustrative association only." },
  { term: "Blotter", def: "A paper strip used to smell materials without putting them on skin." },
];

export const HELP: { q: string; a: string }[] = [
  { q: "What is an accord?", a: "A fragrance impression composed from several materials so it reads as one idea, 'woody', 'rose'. In this prototype each accord is a demo input with illustrative data." },
  { q: "What do top, heart and base mean?", a: "They describe roughly when a material tends to be noticed: early (top), middle (heart) or late (base). We show them as illustrative associations, not fixed classifications." },
  { q: "Why is the output volume fixed?", a: "Your preview bottle is always 10 ml. Raising one accord changes its share of the blend, it never makes the bottle bigger." },
  { q: "What changes when I adjust a proportion?", a: "In Proportional mode the other accords shrink or grow in proportion so the blend stays at 100 %. In Manual mode only the accord you touch changes, and you rebalance when ready." },
  { q: "Why is a botanical sample different from an accord?", a: "A botanical is a raw material for smelling and learning. An accord is a prepared composition input. Raw botanicals never go into the formula." },
];

export interface StageCopy {
  stage: ExtractionStage;
  title: string;
  body: string;
  learn: string;
}

export const STAGES: StageCopy[] = [
  { stage: "discover", title: "Discover", body: "Look closely at the material. Notice colour, texture and where the aroma seems strongest.", learn: "Most aroma lives in specific structures, oil glands in peel, resin in wood, surface cells in petals." },
  { stage: "prepare", title: "Prepare (concept)", body: "Professionals prepare each material differently, some are dried, some fresh, some broken up. Preparation choices change the result.", learn: "We do not give preparation instructions here. This stage explains that preparation is material-specific and expertise-dependent." },
  { stage: "extract", title: "Extract (simulation)", body: "A sealed sample sits with an extraction medium while aroma compounds move from the material into the liquid.", learn: "Real extraction methods, ratios, times and conditions vary by material and are set by specialists. This animation is a concept, not a protocol." },
  { stage: "filter", title: "Filter (simulation)", body: "The solid material is separated from the liquid so only the extract remains.", learn: "Filtration alone does not make an extract safe. Contaminants, microbial quality and stability still need professional assessment." },
  { stage: "evaluate", title: "Evaluate", body: "Perfumers smell extracts on a blotter and compare them with references. Pick the words that best match your impression.", learn: "Evaluation for skin use needs composition analysis, safety limits and stability testing, done by qualified professionals." },
];

export const NATURE_DISCLAIMER =
  "Botanical experiments are for learning and sensory exploration. A homemade extract is not automatically suitable for skin use or for a finished perfume. Composition, contaminants, filtration, microbial quality, stability, compatibility and applicable safety limits must be assessed by qualified professionals before skin use.";

export const FORMULA_DISCLAIMER =
  "Demo formula, not a skin-use recipe. The 10 ml / 20 % / 80 % model is a UI demonstration. Real concentrations, ingredient limits and base suitability must be set by a qualified perfumer using supplier documentation and applicable standards.";

export const EXTRACT_COLOR: Record<BotanicalId, string> = {
  "orange-peel": "#E2A54A",
  cedarwood: "#B98A5E",
  "rose-petals": "#C98A8E",
  cinnamon: "#A8653A",
};

export const EVALUATE_WORDS = ["bright", "zesty", "dry", "woody", "soft", "floral", "warm", "spicy", "sweet", "powdery", "green", "bitter", "faint", "intense"];
