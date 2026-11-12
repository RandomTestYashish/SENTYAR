import { chromium } from "playwright-core";
// usage: node qa/view.mjs route width outPrefix y1,y2,...
const [route, w, out, ys] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const ctx = await b.newContext({ viewport: { width: +w, height: +w > 800 ? 900 : 844 } });
await ctx.addInitScript(() => { try { localStorage.setItem("sentyar.v1.flags", JSON.stringify({ welcomeSeen: true })); } catch {} });
const p = await ctx.newPage();
await p.goto("http://localhost:4173/#" + route, { waitUntil: "networkidle" }); await p.waitForTimeout(1500);
for (const [i, y] of (ys || "0").split(",").entries()) { await p.evaluate((y) => window.scrollTo(0, +y), y); await p.waitForTimeout(500); await p.screenshot({ path: `${out}-${i}.png` }); }
await b.close();
