import { chromium } from "playwright-core";
const out = process.argv[2];
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
for (const w of [1440, 390]) {
  const ctx = await b.newContext({ viewport: { width: w, height: w > 800 ? 900 : 844 } });
  await ctx.addInitScript(() => { try { localStorage.setItem("sentyar.v1.flags", JSON.stringify({ welcomeSeen: true })); } catch {} });
  const p = await ctx.newPage(); const errs = [];
  p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto("http://localhost:4173/#/lab", { waitUntil: "networkidle" }); await p.waitForTimeout(500);
  await p.getByRole("button", { name: "Reset to demo composition" }).click(); await p.waitForTimeout(400);
  await p.getByRole("button", { name: /^Preview/ }).click(); await p.waitForTimeout(1200);
  await p.locator("#cname").fill("Orange Woods"); await p.waitForTimeout(400);
  if (w > 800) { await p.mouse.move(700, 450); await p.waitForTimeout(500); }
  await p.screenshot({ path: `${out}-${w}-a.png` });
  await p.getByRole("radio", { name: "The Orb" }).click(); await p.waitForTimeout(1100);
  await p.screenshot({ path: `${out}-${w}-b.png` });
  console.log(w, errs.length ? errs : "no errors");
  await ctx.close();
}
await b.close();
