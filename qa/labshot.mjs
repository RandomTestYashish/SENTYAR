import { chromium } from "playwright-core";
const out = process.argv[2];
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
for (const w of [1440, 390]) {
  const ctx = await b.newContext({ viewport: { width: w, height: w > 800 ? 900 : 844 } });
  await ctx.addInitScript(() => { try { localStorage.setItem("sentyar.v1.flags", JSON.stringify({ welcomeSeen: true })); } catch {} });
  const p = await ctx.newPage(); const errs = [];
  p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
  await p.goto("http://localhost:4173/#/lab", { waitUntil: "networkidle" }); await p.waitForTimeout(600);
  for (const a of ["Woody", "Citrus", "Rose", "Musk"]) { await p.getByRole("button", { name: `Add ${a} accord to blend` }).click(); await p.waitForTimeout(250); }
  await p.waitForTimeout(1200);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.screenshot({ path: `${out}-${w}-1oils.png` });
  await p.getByRole("tab", { name: /Base/ }).click(); await p.getByRole("button", { name: "Pour the base" }).click();
  await p.waitForTimeout(500); await p.screenshot({ path: `${out}-${w}-2pouring.png` });
  await p.waitForTimeout(1500); await p.screenshot({ path: `${out}-${w}-3base.png` });
  await p.getByRole("tab", { name: /Botanicals/ }).click();
  for (const n of ["Orange peel", "rose petals", "Cinnamon"]) { await p.getByRole("button", { name: new RegExp(`Drop in .*${n}`, "i") }).click(); await p.waitForTimeout(300); }
  await p.waitForTimeout(1500); await p.screenshot({ path: `${out}-${w}-4bots.png` });
  console.log(w, await p.locator(".lab-bar").innerText().then((t) => t.replace(/\s+/g, " ")), errs.length ? errs : "no errors");
  await ctx.close();
}
await b.close();
