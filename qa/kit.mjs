import { chromium } from "playwright-core";
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const errs = [];
for (const W of [1440, 390]) {
  const ctx = await b.newContext({ viewport: { width: W, height: 900 } });
  await ctx.addInitScript(() => { if (!localStorage.getItem("sentyar.v1.flags")) localStorage.setItem("sentyar.v1.flags", JSON.stringify({ welcomeSeen: true, kitOpened: true })); });
  const p = await ctx.newPage(); p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto("http://localhost:4173/#/kits/creator-kit-v1"); await p.waitForTimeout(1200);
  await p.locator(".flatlay").screenshot({ path: `qa/out/flatlay-${W}.png` });
  await p.goto("http://localhost:4173/#/kits/creator-kit-v1/unbox"); await p.waitForTimeout(1200);
  await p.getByRole("button", { name: /Measuring beaker/ }).click(); await p.waitForTimeout(300);
  await p.screenshot({ path: `qa/out/unbox-tools-${W}.png`, fullPage: true });
  await p.goto("http://localhost:4173/#/marketplace"); await p.waitForTimeout(800);
  await p.getByRole("tab", { name: /Perfumery tools/ }).click(); await p.waitForTimeout(500);
  await p.locator("#plist").screenshot({ path: `qa/out/market-tools-${W}.png` });
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (ov > 0) errs.push(`${W} overflow`);
  await ctx.close();
}
await b.close(); console.log(errs.length ? errs.join("\n") : "no errors");
