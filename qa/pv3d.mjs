import { chromium } from "playwright-core";
const out = process.argv[2];
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => { try { localStorage.setItem("sentyar.v1.flags", JSON.stringify({ welcomeSeen: true })); } catch {} });
const p = await ctx.newPage(); const errs = [];
p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
await p.goto("http://localhost:4173/#/lab", { waitUntil: "networkidle" }); await p.waitForTimeout(500);
await p.getByRole("button", { name: "Reset to demo composition" }).click(); await p.waitForTimeout(300);
await p.getByRole("button", { name: /^Preview/ }).click(); await p.waitForTimeout(800);
await p.locator("#cname").fill("Orange Woods");
await p.getByRole("button", { name: "Pause rotation" }).click().catch(() => {});
await p.waitForTimeout(3500);
const shots = (process.argv[3] || "pebble,orb,facet,fluid,atelier,column,pearl").split(",");
const names = { pebble: "The Signature", orb: "The Orb", facet: "The Facet", fluid: "The Fluid", atelier: "The Atelier", column: "The Column", pearl: "The Pearl" };
for (const s of shots) {
  await p.getByRole("radio", { name: names[s] }).click(); await p.waitForTimeout(3500);
  await p.locator(".pv-stage").screenshot({ path: `${out}-${s}.png` });
}
console.log(errs.length ? errs.slice(0, 5) : "no errors"); await b.close();
