// Replace the AI-generated flower on the kit lid and booklet with the exact SENTYAR emblem.
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync } from "node:fs";
const EMBLEM = readFileSync("art/emblem/path.txt", "utf8").trim();
const SPOTS = [
  { cx: 520, cy: 232, r: 36, from: [96, 0], size: 60 },   // lid
  { cx: 898, cy: 622, r: 22, from: [0, 44], size: 34 },   // booklet
];
const src = "data:image/png;base64," + readFileSync("art/photo/kit-open.png").toString("base64");
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const p = await b.newPage();
const url = await p.evaluate(async ({ src, SPOTS, EMBLEM }) => {
  const img = new Image(); img.src = src; await img.decode();
  const c = document.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight;
  const x = c.getContext("2d"); x.drawImage(img, 0, 0);
  for (const s of SPOTS) {
    // 1. cover with neighbouring texture through a feathered circular mask
    const d = s.r * 2 + 16, patch = document.createElement("canvas"); patch.width = patch.height = d;
    const px = patch.getContext("2d");
    px.drawImage(img, s.cx - d / 2 + s.from[0], s.cy - d / 2 + s.from[1], d, d, 0, 0, d, d);
    px.globalCompositeOperation = "destination-in";
    const g = px.createRadialGradient(d / 2, d / 2, s.r * 0.75, d / 2, d / 2, d / 2);
    g.addColorStop(0, "rgba(0,0,0,1)"); g.addColorStop(1, "rgba(0,0,0,0)");
    px.fillStyle = g; px.fillRect(0, 0, d, d);
    x.drawImage(patch, s.cx - d / 2, s.cy - d / 2);
    // 2. foil-stamp the exact emblem: debossed shadow, then gold
    const em = s.size, ox = s.cx - em / 2, oy = s.cy - em / 2, path = new Path2D(EMBLEM);
    x.save(); x.translate(ox, oy + 0.8); x.scale(em / 100, em / 100); x.fillStyle = "rgba(90,60,20,0.35)"; x.fill(path, "evenodd"); x.restore();
    const foil = x.createLinearGradient(ox, oy, ox + em, oy + em);
    foil.addColorStop(0, "#9a7434"); foil.addColorStop(0.45, "#e6c98c"); foil.addColorStop(0.6, "#b88f4b"); foil.addColorStop(1, "#8c6830");
    x.save(); x.translate(ox, oy); x.scale(em / 100, em / 100); x.fillStyle = foil; x.fill(path, "evenodd"); x.restore();
  }
  return c.toDataURL("image/png");
}, { src, SPOTS, EMBLEM });
writeFileSync("art/photo/kit-open-retouched.png", Buffer.from(url.split(",")[1], "base64"));
await b.close();
