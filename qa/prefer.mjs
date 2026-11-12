import { chromium } from "playwright-core";
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const errs = [], log = [];
for (const W of [1440, 390]) {
  const ctx = await b.newContext({ viewport: { width: W, height: W > 800 ? 900 : 844 } });
  await ctx.addInitScript(() => { if (!localStorage.getItem("sentyar.v1.flags")) localStorage.setItem("sentyar.v1.flags", JSON.stringify({ welcomeSeen: true })); });
  const p = await ctx.newPage(); p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto("http://localhost:4173/#/prefer"); await p.waitForTimeout(1500);
  await p.locator(".pf-w").nth(10).hover(); await p.waitForTimeout(300);
  await p.screenshot({ path: `qa/out/prefer-intro-${W}.png` });
  await p.getByRole("button", { name: /Find out in 10 picks/ }).click(); await p.waitForTimeout(600);
  await p.locator('[data-side="a"]').click(); await p.waitForTimeout(800);
  await p.locator('[data-side="b"]').click(); await p.waitForTimeout(800);
  await p.keyboard.press("ArrowLeft"); await p.waitForTimeout(900);
  await p.screenshot({ path: `qa/out/prefer-quiz-${W}.png` });
  for (let k = 0; k < 7; k++) { await p.locator(`[data-side="${k % 2 ? "a" : "b"}"]`).click(); await p.waitForTimeout(750); }
  await p.waitForTimeout(800);
  await p.screenshot({ path: `qa/out/prefer-result-${W}.png` });
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth); if (ov > 0) errs.push(`${W} overflow ${ov}`);
  await p.getByRole("button", { name: /in the Lab/ }).click(); await p.waitForTimeout(600);
  log.push(`${W}: lab total ${(await p.locator(".total-row").innerText()).replace(/\s+/g, " ")}`);
  await ctx.close();
}
await b.close(); console.log(log.join("\n")); console.log(errs.length ? errs.join("\n") : "no errors");
