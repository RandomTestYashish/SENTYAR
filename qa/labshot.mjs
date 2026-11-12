import { chromium } from "playwright-core";
const out = process.argv[2];
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
for (const w of [1440, 390]) {
  const ctx = await b.newContext({ viewport: { width: w, height: w > 800 ? 900 : 844 } });
  await ctx.addInitScript(() => { try { localStorage.setItem("sentyar.v1.flags", JSON.stringify({ welcomeSeen: true })); } catch {} });
  const p = await ctx.newPage();
  await p.goto("http://localhost:4173/#/lab", { waitUntil: "networkidle" }); await p.waitForTimeout(600);
  for (const a of ["Woody", "Citrus", "Rose", "Musk"]) { await p.getByRole("button", { name: `Add ${a} accord to blend` }).click(); await p.waitForTimeout(250); }
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${out}-${w}.png` });
  if (w < 800) { await p.evaluate(() => window.scrollTo(0, 620)); await p.waitForTimeout(400); await p.screenshot({ path: `${out}-${w}b.png` }); }
  await ctx.close();
}
await b.close();
