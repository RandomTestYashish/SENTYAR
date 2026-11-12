import { chromium } from "playwright-core";
const base = "http://localhost:4173/#";
const out = process.argv[2] || "shots";
const routes = (process.argv[3] || "/,/kits/creator-kit-v1,/kits/creator-kit-v1/unbox,/lab,/lab/preview,/nature-lab,/ingredients,/ingredients/orange-peel,/creations,/marketplace,/how-it-works,/brand").split(",");
const widths = (process.argv[4] || "1440,390").split(",").map(Number);
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const errors = [];
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w > 800 ? 900 : 844 }, deviceScaleFactor: 1 });
  await ctx.addInitScript(() => { try { if (!localStorage.getItem("sentyar.v1.flags")) localStorage.setItem("sentyar.v1.flags", JSON.stringify({ welcomeSeen: true })); } catch {} });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") errors.push(`[${w}] ${page.url()} ${m.text()}`); });
  page.on("pageerror", (e) => errors.push(`[${w}] ${page.url()} PAGEERROR ${e.message}`));
  for (const r of routes) {
    await page.goto(base + r, { waitUntil: "networkidle" });
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } window.scrollTo(0, 0); });
    await page.waitForTimeout(r.includes("preview") ? 2500 : 900);
    const name = (r === "/" ? "home" : r.replace(/\//g, "_").replace(/^_/, "")) + `-${w}.png`;
    await page.screenshot({ path: `qa/out/${name}`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) errors.push(`[${w}] ${r} horizontal overflow ${overflow}px`);
  }
  await ctx.close();
}
await browser.close();
console.log(errors.length ? errors.join("\n") : "no console errors / overflow");
