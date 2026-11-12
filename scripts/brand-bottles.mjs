// Prints the exact SENTYAR emblem + wordmark onto the clean (unbranded) bottle photos,
// so every bottle carries the same mark in the same engraved-ivory style.
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync } from "node:fs";

const EMBLEM = readFileSync("art/emblem/path.txt", "utf8").trim();
// cx, cy: label centre as a fraction of the image; w: label width as a fraction of image width
const BOTTLES = [
  { src: "clean-signature", out: "bottle-signature", cx: 0.5, cy: 0.555, w: 0.4 },
  { src: "clean-orb", out: "bottle-orb", cx: 0.5, cy: 0.615, w: 0.3 },
  { src: "clean-facet", out: "bottle-facet", cx: 0.5, cy: 0.585, w: 0.26 },
  { src: "clean-fluid", out: "bottle-fluid", cx: 0.505, cy: 0.615, w: 0.28 },
  { src: "clean-atelier", out: "bottle-atelier", cx: 0.5, cy: 0.6, w: 0.3 },
  { src: "clean-column", out: "bottle-column", cx: 0.5, cy: 0.5, w: 0.125, sub: false },
  { src: "clean-pearl", out: "bottle-pearl", cx: 0.5, cy: 0.6, w: 0.34 },
];

const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const p = await b.newPage();
await p.setContent(`<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@500&display=block" rel="stylesheet"><p style="font-family:'Cormorant Garamond'">S</p><p style="font-family:Inter">S</p>`, { waitUntil: "networkidle" });
await p.evaluate(async () => { await document.fonts.load('500 40px "Cormorant Garamond"'); await document.fonts.load('500 12px Inter'); });

for (const cfg of BOTTLES) {
  const src = "data:image/png;base64," + readFileSync(`art/photo/${cfg.src}.png`).toString("base64");
  const url = await p.evaluate(async ({ src, cfg, EMBLEM }) => {
    const img = new Image(); img.src = src; await img.decode();
    const W = img.naturalWidth, H = img.naturalHeight;
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const x = c.getContext("2d"); x.drawImage(img, 0, 0);
    const lw = cfg.w * W, cx = cfg.cx * W, cy = cfg.cy * H;
    const em = lw * 0.36, fs = lw * 0.155, sub = cfg.sub !== false;
    const blockH = em + fs * 0.55 + fs + (sub ? fs * 0.9 : 0);
    let y = cy - blockH / 2;
    const ink = "rgba(255, 249, 236, 0.93)";
    const engrave = () => { x.shadowColor = "rgba(80, 40, 6, 0.35)"; x.shadowBlur = lw * 0.012; x.shadowOffsetY = lw * 0.004; };
    // emblem
    x.save(); engrave(); x.fillStyle = ink;
    x.translate(cx - em / 2, y); x.scale(em / 100, em / 100); x.fill(new Path2D(EMBLEM), "evenodd"); x.restore();
    y += em + fs * 0.55;
    // wordmark, fitted to the label width
    x.save(); engrave(); x.fillStyle = ink; x.textAlign = "center"; x.textBaseline = "top";
    let size = fs; x.font = `500 ${size}px "Cormorant Garamond"`; x.letterSpacing = `${size * 0.3}px`;
    const m = x.measureText("SENTYAR").width; if (m > lw) { size *= lw / m; x.font = `500 ${size}px "Cormorant Garamond"`; x.letterSpacing = `${size * 0.3}px`; }
    x.fillText("SENTYAR", cx + size * 0.15, y); x.restore();
    y += size * 1.25;
    if (sub) {
      x.save(); engrave(); x.fillStyle = ink; x.textAlign = "center"; x.textBaseline = "top";
      const s2 = size * 0.32; x.font = `500 ${s2}px Inter`; x.letterSpacing = `${s2 * 0.32}px`;
      x.fillText("EAU DE PARFUM", cx + s2 * 0.16, y); x.restore();
    }
    return c.toDataURL("image/png");
  }, { src, cfg, EMBLEM });
  writeFileSync(`art/photo/${cfg.out}.png`, Buffer.from(url.split(",")[1], "base64"));
  console.log("branded", cfg.out);
}
await b.close();
