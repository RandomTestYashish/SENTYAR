import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";
const imgs = (process.argv[3] || "orange-peel,cedarwood,rose-petals,cinnamon,bottle-fluid,bottle-facet,bottle-orb,bottle-atelier,tex-glass,tex-stone,tex-foil,tex-matte,emboss").split(",");
writeFileSync("art/_sheet.html", `<body style="margin:0;display:flex;flex-wrap:wrap;gap:6px;background:#ddd">${imgs.map(i=>`<img src="../public/assets/img/${i}.jpg" style="height:260px">`).join("")}</body>`);
const b = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
const p = await b.newPage({ viewport: { width: 1400, height: 800 } });
await p.goto(`file://${process.cwd()}/art/_sheet.html`); await p.waitForTimeout(800);
await p.screenshot({ path: process.argv[2], fullPage: true }); await b.close();
