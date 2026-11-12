// Lift near-white studio backgrounds to pure #fff so photos melt into the white page.
// Highlights above WP map to 255; everything below 200 is untouched.
import { chromium } from "playwright-core";
import { readFileSync, writeFileSync } from "node:fs";
const names = process.argv.slice(2);
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const p = await b.newPage();
for (const n of names) {
  const path = `public/assets/img/${n}.jpg`;
  const src = "data:image/jpeg;base64," + readFileSync(path).toString("base64");
  const out = await p.evaluate(async (src) => {
    const img = new Image(); img.src = src; await img.decode();
    const c = document.createElement("canvas"); c.width = img.naturalWidth; c.height = img.naturalHeight;
    const x = c.getContext("2d"); x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height); const a = d.data;
    // white point from the corners
    const px = (i, j) => { const k = (j * c.width + i) * 4; return Math.min(a[k], a[k + 1], a[k + 2]); };
    const wp = Math.max(225, Math.min(250, Math.min(px(4, 4), px(c.width - 5, 4), px(4, c.height - 5), px(c.width - 5, c.height - 5)) - 3));
    const lut = new Uint8ClampedArray(256);
    for (let v = 0; v < 256; v++) lut[v] = v < 190 ? v : Math.min(255, Math.round(190 + (v - 190) * (65 / (wp - 190))));
    for (let i = 0; i < a.length; i += 4) { a[i] = lut[a[i]]; a[i + 1] = lut[a[i + 1]]; a[i + 2] = lut[a[i + 2]]; }
    x.putImageData(d, 0, 0);
    return { wp, url: c.toDataURL("image/jpeg", 0.86) };
  }, src);
  writeFileSync(path, Buffer.from(out.url.split(",")[1], "base64"));
  console.log(n, "white point", out.wp);
}
await b.close();
