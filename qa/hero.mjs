import { chromium } from "playwright-core";
const out = process.argv[2];
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => { try { localStorage.setItem("sentyar.v1.flags", JSON.stringify({ welcomeSeen: true })); } catch {} });
const p = await ctx.newPage(); const errs = [];
p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
await p.goto("http://localhost:4173/#/", { waitUntil: "networkidle" }); await p.waitForTimeout(1500);
const name = () => p.locator(".hx__name").textContent();
const n0 = await name();
await p.getByRole("button", { name: "Next bottle" }).click(); await p.waitForTimeout(1200);
const n1 = await name();
await p.getByRole("button", { name: "Next bottle" }).click(); await p.waitForTimeout(1200);
await p.mouse.move(1000, 400); await p.waitForTimeout(600);
await p.screenshot({ path: out + "-next.png" });
const n2 = await name();
await p.getByRole("button", { name: "The Crescent" }).click(); await p.waitForTimeout(1200);
const n3 = await name();
// autoplay: move mouse off the stage and wait
await p.mouse.move(5, 5); await p.waitForTimeout(4800);
const n4 = await name();
// keyboard
await p.locator(".hx__stage").focus(); await p.keyboard.press("ArrowLeft"); await p.waitForTimeout(900);
const n5 = await name();
console.log([n0, n1, n2, n3, n4, n5].join(" > "));
console.log(errs.length ? errs : "no errors"); await b.close();
