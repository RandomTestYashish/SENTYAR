// Guided Making script. Hindi-first captions with English.
// SAFETY BOUNDARY: no quantities, drop counts, heating or botanical additions are
// invented here. Every physical amount defers to the printed, professionally
// reviewed recipe card that ships in the kit. The on-screen beaker uses the
// illustrative digital shares only, and says so.

import type { AccordId } from "../lib/types";

export type Scene =
  | { kind: "kit" }
  | { kind: "lineup" }
  | { kind: "pick"; accord: AccordId }
  | { kind: "drop"; accord: AccordId; upto: number }
  | { kind: "base" }
  | { kind: "mix" }
  | { kind: "rest" }
  | { kind: "blotter" }
  | { kind: "transfer" }
  | { kind: "cap" }
  | { kind: "done" };

export interface Step {
  id: string;
  chapter: ChapterId;
  scene: Scene;
  hi: string;
  en: string;
  stuck: { q: string; aHi: string; aEn: string }[];
}

export type ChapterId = "prepare" | "oils" | "base" | "mix" | "evaluate" | "bottle";
export const CHAPTERS: { id: ChapterId; hi: string; en: string }[] = [
  { id: "prepare", hi: "तैयारी", en: "Prepare" },
  { id: "oils", hi: "ऑयल डालें", en: "Add the oils" },
  { id: "base", hi: "बेस डालें", en: "Add the base" },
  { id: "mix", hi: "मिलाएँ", en: "Mix and rest" },
  { id: "evaluate", hi: "सूँघकर देखें", en: "Evaluate" },
  { id: "bottle", hi: "बोतल में भरें", en: "Bottle it" },
];

const ACCORD_HI: Record<AccordId, string> = {
  woody: "वुडी", citrus: "सिट्रस", rose: "रोज़", vanilla: "वनीला", musk: "मस्क", spicy: "स्पाइसी",
  aquatic: "एक्वाटिक", aromatic: "एरोमैटिक", oud: "ऊद", amber: "अम्बर",
};

export function buildSteps(accords: { id: AccordId; name: string }[]): Step[] {
  const steps: Step[] = [
    { id: "kit", chapter: "prepare", scene: { kind: "kit" },
      hi: "अपना किट खोलें। साफ़, सूखी और हवादार जगह पर काम करें। पहले सेफ़्टी गाइड पढ़ें।",
      en: "Open your kit. Work on a clean, dry, well-ventilated surface. Read the safety guide first.",
      stuck: [{ q: "Something is missing", aHi: "किट की सूची रेसिपी कार्ड पर है। कुछ कम हो तो सपोर्ट से संपर्क करें।", aEn: "The contents list is on your recipe card. Contact support if anything is missing." }] },
    { id: "lineup", chapter: "prepare", scene: { kind: "lineup" },
      hi: "रेसिपी कार्ड पर लिखी शीशियाँ एक लाइन में रखें। हर शीशी पर नाम लिखा है।",
      en: "Line up the vials your recipe card lists. Each vial is labelled by name.",
      stuck: [{ q: "I can't read a label", aHi: "शीशी की टोपी के रंग की पट्टी से मिलान करें।", aEn: "Match the coloured stripe on the label with the recipe card." }] },
  ];
  accords.forEach((a, i) => {
    steps.push({ id: `pick-${a.id}`, chapter: "oils", scene: { kind: "pick", accord: a.id },
      hi: `${ACCORD_HI[a.id]} की शीशी उठाएँ। ड्रॉपर को सीधा रखें।`,
      en: `Pick up the ${a.name} vial. Keep the dropper upright.`,
      stuck: [{ q: "The dropper won't fill", aHi: "बल्ब को पूरा दबाएँ, फिर धीरे से छोड़ें।", aEn: "Squeeze the bulb fully, then release slowly." }] });
    steps.push({ id: `drop-${a.id}`, chapter: "oils", scene: { kind: "drop", accord: a.id, upto: i + 1 },
      hi: `${ACCORD_HI[a.id]} को बीकर में डालें, उतना ही जितना रेसिपी कार्ड पर लिखा है।`,
      en: `Add ${a.name} to the beaker, exactly the amount printed on your recipe card.`,
      stuck: [
        { q: "I added too much", aHi: "रुकें। रेसिपी कार्ड के 'गलती हो जाए तो' हिस्से को देखें, अंदाज़े से ठीक न करें।", aEn: "Stop. Check the 'if something goes wrong' section of your recipe card rather than guessing." },
        { q: "Why no amounts here?", aHi: "असली मात्रा केवल जाँचे हुए रेसिपी कार्ड पर होती है। स्क्रीन पर बीकर सिर्फ़ उदाहरण है।", aEn: "Real amounts live only on the reviewed recipe card. The on-screen beaker is illustrative." },
      ] });
  });
  steps.push(
    { id: "base", chapter: "base", scene: { kind: "base" },
      hi: "अब परफ्यूमरी बेस डालें। ऑयल थोड़ा होता है; बेस ही बोतल को भरता है।",
      en: "Now add the perfumery base. The oils are a small part; the base fills the bottle.",
      stuck: [{ q: "The base smells sharp", aHi: "यह सामान्य है। अल्कोहल की गंध आराम करने के बाद कम हो जाती है।", aEn: "That's normal. The alcohol smell softens after resting." }] },
    { id: "mix", chapter: "mix", scene: { kind: "mix" },
      hi: "रेसिपी कार्ड के अनुसार धीरे से घुमाकर मिलाएँ। कभी गरम न करें।",
      en: "Mix gently by swirling, as your recipe card describes. Never heat it.",
      stuck: [{ q: "It looks cloudy", aHi: "रुकें और रेसिपी कार्ड देखें। धुंधलापन होने पर इस्तेमाल न करें।", aEn: "Pause and check the recipe card. Do not use the mixture if it stays cloudy." }] },
    { id: "rest", chapter: "mix", scene: { kind: "rest" },
      hi: "मिश्रण को रेसिपी कार्ड पर लिखे समय तक ढककर, ठंडी और अँधेरी जगह पर रखें।",
      en: "Cover and rest the mixture somewhere cool and dark, for the time on your recipe card.",
      stuck: [{ q: "Can I skip resting?", aHi: "आराम देने से खुशबू घुल-मिल जाती है। कार्ड पर लिखा समय मानें।", aEn: "Resting lets the scent come together. Follow the time on the card." }] },
    { id: "blotter", chapter: "evaluate", scene: { kind: "blotter" },
      hi: "ब्लॉटर पट्टी की नोक डुबोएँ और सूँघें। त्वचा पर नहीं, केवल पेपर पर।",
      en: "Dip the tip of a blotter strip and smell it. On paper only, not skin.",
      stuck: [{ q: "I can't smell much", aHi: "कुछ सेकंड रुकें, फिर दोबारा सूँघें। ताज़ी हवा में ब्रेक लें।", aEn: "Wait a few seconds and smell again. Take a fresh-air break." }] },
    { id: "transfer", chapter: "bottle", scene: { kind: "transfer" },
      hi: "फ़नल लगाकर मिश्रण को धीरे-धीरे बोतल में डालें।",
      en: "Fit the funnel and pour the mixture slowly into your bottle.",
      stuck: [{ q: "It spilled", aHi: "सतह साफ़ करें और हाथ धोएँ। आँखों के संपर्क से बचें।", aEn: "Wipe the surface and wash your hands. Avoid contact with eyes." }] },
    { id: "cap", chapter: "bottle", scene: { kind: "cap" },
      hi: "स्प्रे लगाएँ और अपनी चुनी हुई कैप ऊपर लगाएँ।",
      en: "Fit the atomiser and press on the cap you chose.",
      stuck: [{ q: "The cap won't fit", aHi: "कैप को सीधा रखें और हल्के से दबाएँ। ज़ोर न लगाएँ।", aEn: "Keep the cap straight and press gently. Don't force it." }] },
    { id: "done", chapter: "bottle", scene: { kind: "done" },
      hi: "बधाई हो! आपकी रचना तैयार है। इसे My Studio में सेव करें।",
      en: "Congratulations! Your creation is ready. Save it in My Studio.",
      stuck: [] },
  );
  return steps;
}
