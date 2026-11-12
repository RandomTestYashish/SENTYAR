// "Colour to alpha" against white: produces a transparent WebP that composites over
// white exactly like the original photo (glass, shadows and highlights stay natural).
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync } from "node:fs";
const names = process.argv.slice(2);
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const p = await b.newPage();
for (const n of names) {
  const src = "data:image/jpeg;base64," + readFileSync(`public/assets/img/${n}.jpg`).toString("base64");
  const url = await p.evaluate(async (src) => {
    const img = new Image(); img.src = src; await img.decode();
    const c = document.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight;
    const x = c.getContext("2d"); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height); const a = d.data;
    for (let i = 0; i < a.length; i += 4) {
      const r = a[i], g = a[i + 1], bl = a[i + 2];
      let al = Math.max(255 - r, 255 - g, 255 - bl) / 255;
      al = al < 0.035 ? 0 : al; // kill paper noise
      if (al === 0) { a[i + 3] = 0; continue; }
      a[i] = Math.round(255 - (255 - r) / al); a[i + 1] = Math.round(255 - (255 - g) / al); a[i + 2] = Math.round(255 - (255 - bl) / al);
      a[i + 3] = Math.round(al * 255);
    }
    x.putImageData(d, 0, 0);
    return c.toDataURL("image/webp", 0.9);
  }, src);
  writeFileSync(`public/assets/img/${n}.webp`, Buffer.from(url.split(",")[1], "base64"));
  console.log(n);
}
await b.close();
