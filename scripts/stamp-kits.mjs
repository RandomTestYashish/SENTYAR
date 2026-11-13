// Foil-stamp the exact SENTYAR emblem, wordmark and kit name on the blank kit lids.
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync } from "node:fs";
const EMBLEM = readFileSync("art/emblem/path.txt", "utf8").trim();
const JOBS = [
  { src: "kit-mini", label: "MINI CREATION KIT", cx: 0.52, cy: 0.2, scale: 0.85 },
  { src: "kit-inspired", label: "INSPIRED CREATION KIT", cx: 0.535, cy: 0.17, scale: 1 },
  { src: "kit-advanced", label: "ADVANCED CREATOR KIT", cx: 0.56, cy: 0.16, scale: 0.95 },
];
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const p = await b.newPage();
await p.setContent(`<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500&family=Inter:wght@500&display=block" rel="stylesheet"><p style="font-family:'Cormorant Garamond'">S</p><p style="font-family:Inter">S</p>`, { waitUntil: "networkidle" });
await p.evaluate(async () => { await document.fonts.load('500 40px "Cormorant Garamond"'); await document.fonts.load("500 12px Inter"); });
for (const j of JOBS) {
  const src = "data:image/png;base64," + readFileSync(`art/photo/${j.src}.png`).toString("base64");
  const url = await p.evaluate(async ({ src, j, EMBLEM }) => {
    const img = new Image(); img.src = src; await img.decode();
    const W = img.naturalWidth, H = img.naturalHeight;
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const x = c.getContext("2d"); x.drawImage(img, 0, 0);
    const cx = j.cx * W, cy = j.cy * H, k = j.scale * W / 1536;
    const em = 56 * k, fs = 34 * k, fs2 = 11 * k;
    const top = cy - (em + fs * 1.4 + fs2 * 2) / 2;
    const foil = x.createLinearGradient(cx - 160 * k, top, cx + 160 * k, top + 120 * k);
    foil.addColorStop(0, "#8f6a2f"); foil.addColorStop(0.45, "#e2c58a"); foil.addColorStop(0.6, "#b08a4b"); foil.addColorStop(1, "#8a6630");
    const draw = (dy, fill) => {
      x.save(); x.fillStyle = fill;
      x.save(); x.translate(cx - em / 2, top + dy); x.scale(em / 100, em / 100); x.fill(new Path2D(EMBLEM), "evenodd"); x.restore();
      x.textAlign = "center"; x.textBaseline = "alphabetic";
      x.font = `500 ${fs}px "Cormorant Garamond"`; x.letterSpacing = `${fs * 0.32}px`;
      x.fillText("SENTYAR", cx + fs * 0.16, top + em + fs * 1.15 + dy);
      x.font = `500 ${fs2}px Inter`; x.letterSpacing = `${fs2 * 0.34}px`;
      x.fillText(j.label, cx + fs2 * 0.17, top + em + fs * 1.15 + fs2 * 2.4 + dy);
      x.restore();
    };
    draw(0.8 * k, "rgba(90,60,20,0.3)"); // deboss shadow
    draw(0, foil);
    return c.toDataURL("image/png");
  }, { src, j, EMBLEM });
  writeFileSync(`art/photo/${j.src}-stamped.png`, Buffer.from(url.split(",")[1], "base64"));
}
await b.close();
