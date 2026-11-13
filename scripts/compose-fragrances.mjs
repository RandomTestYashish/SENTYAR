// Seat a branded SENTYAR bottle cut-out on each generated backdrop's plinth.
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync } from "node:fs";
const JOBS = [
  { id: "azure-drift", bottle: "bottle-fluid", baseY: 0.615, h: 0.42 },
  { id: "sable-storm", bottle: "bottle-facet", baseY: 0.67, h: 0.46 },
  { id: "midnight-agar", bottle: "bottle-signature", baseY: 0.665, h: 0.4 },
  { id: "citrus-courtyard", bottle: "bottle-column", baseY: 0.67, h: 0.5 },
  { id: "golden-hour", bottle: "bottle-orb", baseY: 0.645, h: 0.42 },
  { id: "rose-velour", bottle: "bottle-pearl", baseY: 0.625, h: 0.36 },
];
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const p = await b.newPage();
const only = process.argv[2]?.split(",");
for (const j of JOBS) {
  if (only && !only.includes(j.id)) continue;
  const bg = "data:image/png;base64," + readFileSync(`art/photo/bg-${j.id}.png`).toString("base64");
  const bt = "data:image/webp;base64," + readFileSync(`public/assets/img/${j.bottle}.webp`).toString("base64");
  const url = await p.evaluate(async ({ bg, bt, j }) => {
    const load = async (s) => { const i = new Image(); i.src = s; await i.decode(); return i; };
    const B = await load(bg), T = await load(bt);
    const c = document.createElement("canvas"); c.width = B.naturalWidth; c.height = B.naturalHeight;
    const x = c.getContext("2d"); x.drawImage(B, 0, 0);
    // bottle bbox from alpha
    const t = document.createElement("canvas"); t.width = T.naturalWidth; t.height = T.naturalHeight;
    const tx = t.getContext("2d"); tx.drawImage(T, 0, 0); const d = tx.getImageData(0, 0, t.width, t.height).data;
    let minY = t.height, maxY = 0, minX = t.width, maxX = 0;
    for (let y = 0; y < t.height; y++) for (let X = 0; X < t.width; X++) { if (d[(y * t.width + X) * 4 + 3] > 140) { if (y < minY) minY = y; if (y > maxY) maxY = y; if (X < minX) minX = X; if (X > maxX) maxX = X; } }
    const bh = maxY - minY, bw = maxX - minX;
    const targetH = j.h * c.height, s = targetH / bh;
    const baseY = j.baseY * c.height, cx = c.width / 2;
    // contact shadow
    const sw = bw * s * 0.62;
    const g = x.createRadialGradient(cx, baseY, 0, cx, baseY, sw);
    g.addColorStop(0, "rgba(60,40,15,0.38)"); g.addColorStop(0.55, "rgba(60,40,15,0.12)"); g.addColorStop(1, "rgba(60,40,15,0)");
    x.save(); x.translate(cx, baseY); x.scale(1, 0.16); x.translate(-cx, -baseY); x.fillStyle = g; x.beginPath(); x.arc(cx, baseY, sw, 0, Math.PI * 2); x.fill(); x.restore();
    // bottle (crop to its bbox; ignore the baked shadow below the glass)
    x.drawImage(T, minX, minY, bw, bh, cx - (bw * s) / 2, baseY - bh * s, bw * s, bh * s);
    return c.toDataURL("image/jpeg", 0.88);
  }, { bg, bt, j });
  writeFileSync(`public/assets/img/frag-${j.id}.jpg`, Buffer.from(url.split(",")[1], "base64"));
  console.log("composed", j.id);
}
await b.close();
