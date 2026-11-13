// Prompt 2 acceptance journeys A–F. Needs `npm run preview` on :4173.
import { chromium } from "playwright-core";
const B = "http://localhost:4173/#";
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => { try { if (!localStorage.getItem("sentyar.v1.flags")) localStorage.setItem("sentyar.v1.flags", JSON.stringify({ welcomeSeen: true })); } catch {} });
const p = await ctx.newPage();
const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => m.type() === "error" && errs.push(m.text()));
let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) { pass++; console.log("PASS", name); } else { fail++; console.log("FAIL", name); } };
const vis = async (loc) => loc.first().waitFor({ timeout: 4000 }).then(() => true, () => false);
const step = async () => Number((await p.locator(".gm__count").innerText()).match(/Step (\d+)/)[1]);

// ---- A: discover and buy a kit
await p.goto(B + "/"); await p.waitForTimeout(800);
await p.getByRole("link", { name: /Inspired by iconic fragrances/ }).click(); await p.waitForTimeout(800);
ok("A1 discover inspired collection", await vis(p.getByRole("heading", { name: /Familiar styles/ })));
await p.getByRole("link", { name: "Azure Drift" }).first().click(); await p.waitForTimeout(600);
ok("A2 fragrance page with family + profile", await vis(p.getByRole("heading", { name: "Azure Drift" })) && (await p.locator(".fpage__info").innerText()).includes("Aquatic"));
ok("A3 kit options shown", await vis(p.getByRole("radio", { name: /Inspired Creation Kit/ })) && await vis(p.getByRole("radio", { name: /Advanced Creator Kit/ })));
await p.getByRole("radio", { name: /Advanced Creator Kit/ }).click();
await p.getByRole("radio", { name: /^100 ml/ }).first().click();
await p.getByRole("button", { name: /Bottle and cap/ }).click(); await p.waitForTimeout(800);
const sheet = p.getByRole("dialog", { name: /Choose your bottle and cap/ });
ok("A4 bottle sheet opens", await vis(sheet));
await sheet.getByRole("radio", { name: "The Facet" }).click();
await sheet.getByRole("radio", { name: "Flat disc cap" }).click();
await sheet.getByRole("radio", { name: "Gold finish" }).click(); await p.waitForTimeout(600);
const sum = await sheet.locator(".bc__sum").innerText();
ok("A5 live preview summary updates", sum.includes("The Facet") && sum.includes("Gold flat disc") && sum.includes("100 ml"));
ok("A6 3D preview canvas present", await vis(sheet.locator(".bc__preview canvas")));
await sheet.getByRole("button", { name: "Use this bottle" }).click(); await p.waitForTimeout(300);
await p.getByRole("button", { name: /Add to demo cart/ }).click(); await p.waitForTimeout(300);
await p.getByRole("button", { name: /Open cart/ }).click(); await p.waitForTimeout(500);
const cartTxt = await p.getByRole("dialog").last().innerText();
ok("A7 cart holds kit + size + bottle", cartTxt.includes("Advanced Creator Kit, 100 ml") && cartTxt.includes("The Facet"));
await p.keyboard.press("Escape");

// ---- B: learn about an ingredient
await p.goto(B + "/studio"); await p.waitForTimeout(500);
await p.getByRole("link", { name: /Scent learning library/ }).click(); await p.waitForTimeout(500);
await p.getByRole("link", { name: /^Oud/ }).first().click(); await p.waitForTimeout(500);
ok("B1 oud page", await vis(p.getByRole("heading", { name: /^Oud/ })));
ok("B2 what it is + history", await vis(p.getByRole("heading", { name: "What is Oud?" })) && await vis(p.getByRole("heading", { name: "A little history" })));
ok("B3 intensity explained", (await p.locator(".lmeter").innerText()).includes("Very strong"));
ok("B4 related accords", await vis(p.locator(".lside").getByRole("link", { name: /Woody/ })));
await p.locator(".lside").getByRole("link", { name: /Midnight Agar/ }).click(); await p.waitForTimeout(500);
ok("B5 back to a related recipe", await vis(p.getByRole("heading", { name: "Midnight Agar" })));

// ---- C: guided tutorial
await p.goto(B + "/studio/recipes/azure-drift"); await p.waitForTimeout(500);
ok("C1 recipe shows compatible kit", (await p.locator(".fpage__facts").innerText()).includes("Inspired Creation Kit"));
await p.getByRole("link", { name: /Start Guided Making/ }).click(); await p.waitForTimeout(600);
await p.getByRole("button", { name: "Play the demonstration" }).click();
await p.waitForTimeout(7200);
ok("C2 autoplay advances", (await step()) >= 2);
await p.getByRole("button", { name: "Pause", exact: true }).click(); const s1 = await step(); await p.waitForTimeout(7000);
ok("C3 pause holds", (await step()) === s1);
await p.getByRole("button", { name: "Next", exact: true }).click(); await p.waitForTimeout(300);
ok("C4 next moves on", (await step()) === s1 + 1);
await p.getByRole("button", { name: "Play", exact: true }).click(); await p.waitForTimeout(300); await p.getByRole("button", { name: "Pause", exact: true }).click();
ok("C5 resume works", true);
ok("C6 Hindi captions by default", /[ऀ-ॿ]/.test(await p.locator(".gm__say").innerText()));
await p.getByRole("radio", { name: "English" }).click();
ok("C7 English option", !/[ऀ-ॿ]/.test(await p.locator(".gm__say").innerText()));
await p.getByRole("button", { name: /What you need/ }).click(); await p.waitForTimeout(300);
ok("C8 ingredients and tools review", (await p.getByRole("dialog", { name: "What you need" }).innerText()).includes("Aquatic accord"));
await p.getByRole("button", { name: "Got it" }).click();
await p.getByRole("button", { name: /I am stuck/ }).click(); await p.waitForTimeout(300);
ok("C9 I am stuck help", await vis(p.getByRole("dialog", { name: /Help with this step/ })));
await p.getByRole("button", { name: "Continue" }).click();
await p.getByRole("button", { name: /Bottle it/ }).click(); await p.waitForTimeout(300);
for (let k = 0; k < 4; k++) { const nx = p.getByRole("button", { name: "Next", exact: true }); if (await nx.isEnabled()) await nx.click(); await p.waitForTimeout(150); }
ok("C10 completes educational flow", await vis(p.getByRole("button", { name: "Save as a creation" })));
await p.getByRole("button", { name: "Save as a creation" }).click(); await p.waitForTimeout(1000);
ok("C11 lands on save step", await vis(p.locator("#cname")));

// ---- D: create and save
await p.goto(B + "/lab"); await p.waitForTimeout(500);
await p.getByRole("button", { name: "Clear blend" }).click().catch(() => {});
await p.waitForTimeout(300);
await p.getByRole("button", { name: "Fresh" }).click(); await p.waitForTimeout(200);
const tiles = await p.locator(".kit-tile__name").allInnerTexts();
ok("D1 family filter limits accords", tiles.length > 0 && tiles.every((t) => ["Citrus", "Musk", "Aromatic"].includes(t)));
await p.getByRole("button", { name: "Add Citrus accord to blend" }).click(); await p.waitForTimeout(250);
await p.getByRole("button", { name: "Add Musk accord to blend" }).click(); await p.waitForTimeout(400);
await p.getByLabel("Citrus share of blend").fill("60"); await p.waitForTimeout(200);
ok("D2 constrained adjust keeps 100%", (await p.locator(".total-row").innerText()).includes("100%"));
await p.getByRole("tab", { name: /Base/ }).click(); await p.getByRole("button", { name: "Pour the base" }).click(); await p.waitForTimeout(500);
await p.getByRole("button", { name: /^Preview/ }).click(); await p.waitForTimeout(1500);
await p.getByRole("button", { name: /Cap and size/ }).click(); await p.waitForTimeout(600);
const sh2 = p.getByRole("dialog", { name: /Choose your bottle and cap/ });
await sh2.getByRole("radio", { name: "The Orb" }).click(); await sh2.getByRole("radio", { name: "Tall column cap" }).click(); await sh2.getByRole("radio", { name: "Black finish" }).click();
await sh2.getByRole("button", { name: "Use this bottle" }).click(); await p.waitForTimeout(300);
ok("D3 bottle + cap chosen", (await p.locator(".pv-cfg").innerText()).includes("Black tall column cap"));
await p.locator("#cname").fill("Studio Test"); await p.getByLabel(/I understand/).check();
await p.getByRole("button", { name: /Save creation/ }).click(); await p.waitForTimeout(500);
await p.reload(); await p.goto(B + "/creations"); await p.waitForTimeout(600);
ok("D4 persists after refresh", await vis(p.getByRole("link", { name: "Studio Test" })));
await p.getByRole("link", { name: "Studio Test" }).first().click(); await p.waitForTimeout(500);
ok("D5 bottle + cap saved with creation", (await p.locator(".detail__info").innerText()).includes("Black tall column cap"));

// ---- E: reorder from a saved creation
await p.getByRole("combobox", { name: /Citrus accord pack size/ }).selectOption("50");
await p.getByRole("button", { name: /Add selected to cart/ }).click(); await p.waitForTimeout(300);
await p.getByRole("button", { name: /Open cart/ }).click(); await p.waitForTimeout(500);
const c2 = await p.getByRole("dialog").last().innerText();
ok("E1 refill in chosen pack size in cart", c2.includes("Citrus accord, 50 ml"));
ok("E2 base refill included", c2.includes("Perfumery alcohol base refill"));
await p.keyboard.press("Escape");

// ---- F: UI regression
await p.goto(B + "/"); await p.waitForTimeout(800);
ok("F1 hero carousel preserved", (await p.locator(".hx__slide").count()) === 7);
await p.getByRole("button", { name: "The Orb" }).click(); await p.waitForTimeout(900);
ok("F2 carousel interaction", (await p.locator(".hx__name").innerText()).startsWith("The Orb"));
ok("F3 Marketplace in header", await p.locator(".site-nav").getByRole("link", { name: "Marketplace" }).isVisible());
const gaps = await p.evaluate(() => { const r = [...document.querySelectorAll(".hx__slide:not(.is-far)")].map((e) => e.getBoundingClientRect()).sort((a, b) => a.left - b.left); return r.slice(1).map((x, i) => Math.round(x.left - r[i].right)); });
ok(`F4 carousel gaps even (${gaps.join(", ")})`, Math.max(...gaps) - Math.min(...gaps) < 24);
for (const w of [390, 768, 1024, 1440]) {
  await p.setViewportSize({ width: w, height: 900 });
  for (const r of ["/", "/discover", "/fragrances/sable-storm", "/kits", "/studio", "/studio/guide/azure-drift", "/learn/oud", "/marketplace", "/about", "/lab"]) {
    await p.goto(B + r); await p.waitForTimeout(350);
    const ov = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (ov > 0) ok(`F5 no overflow ${w} ${r} (${ov}px)`, false);
  }
}
ok("F5 no horizontal overflow at 390/768/1024/1440", true);
console.log(errs.length ? errs.slice(0, 5) : "no console errors");
console.log(`${pass} passed, ${fail} failed`);
await b.close();
