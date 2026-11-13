import { chromium } from "playwright-core";
const out = process.argv[2];
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => { try { localStorage.setItem("sentyar.v1.flags", JSON.stringify({ welcomeSeen: true })); } catch {} });
const p = await ctx.newPage();
await p.goto("http://localhost:4173/#/studio/guide/azure-drift", { waitUntil: "networkidle" }); await p.waitForTimeout(800);
await p.getByRole("button", { name: "Play the demonstration" }).click(); await p.getByRole("button", { name: "Pause", exact: true }).click();
const shots = { 0: "kit", 3: "pick", 4: "drop", 10: "base", 11: "mix", 13: "blotter", 14: "transfer", 15: "cap", 16: "done" };
for (let i = 0; i <= 16; i++) {
  if (shots[i]) { await p.waitForTimeout(i === 16 ? 3500 : 1600); await p.evaluate(() => window.scrollTo(0, 120)); await p.screenshot({ path: `${out}-${String(i).padStart(2, "0")}-${shots[i]}.png` }); }
  const nx = p.getByRole("button", { name: "Next", exact: true }); if (await nx.isEnabled()) await nx.click();
}
await b.close();
