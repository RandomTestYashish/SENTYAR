// SENTYAR creative: original vector still lifes rendered to JPG on a white base.
// Run: node scripts/art.mjs  (writes public/assets/img/*.jpg, same names the app uses)
import { chromium } from "playwright-core";
import { mkdirSync, writeFileSync } from "node:fs";

const OUT = "public/assets/img/";
mkdirSync("art", { recursive: true });

/* ---------- shared defs ---------- */
const PETAL = "M50 37.5 C40.5 34, 36.5 24.5, 42 16.5 C45 12.2, 48.6 9.4, 50 4 C51.4 9.4, 55 12.2, 58 16.5 C63.5 24.5, 59.5 34, 50 37.5 Z";
const S_PATH = "M57.6 42.2 C55.2 38.6, 44.6 38.4, 44.4 44.4 C44.2 50.2, 55.8 49.8, 55.6 56 C55.4 62, 44.6 61.8, 42.4 57.8";
const emblem = (cx, cy, size, stroke, color) => `
  <g transform="translate(${cx - size / 2} ${cy - size / 2}) scale(${size / 100})" fill="none" stroke="${color}" stroke-width="${stroke}" stroke-linejoin="round" stroke-linecap="round">
    ${[0, 90, 180, 270].map((r) => `<path d="${PETAL}" transform="rotate(${r} 50 50)"/>`).join("")}
    <path d="${S_PATH}" stroke-width="${stroke * 1.05}"/>
  </g>`;

const DEFS = `
<defs>
  <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#7a5a2e"/><stop offset=".22" stop-color="#d9bd85"/><stop offset=".45" stop-color="#a07a42"/>
    <stop offset=".7" stop-color="#f2dfb2"/><stop offset="1" stop-color="#8a6936"/>
  </linearGradient>
  <linearGradient id="goldH" x1="0" x2="1">
    <stop offset="0" stop-color="#7f5f31"/><stop offset=".3" stop-color="#e6cf9e"/><stop offset=".55" stop-color="#b08b52"/>
    <stop offset=".8" stop-color="#f4e4bd"/><stop offset="1" stop-color="#86653a"/>
  </linearGradient>
  <linearGradient id="glass" x1="0" x2="1">
    <stop offset="0" stop-color="#dfe3e4" stop-opacity=".95"/><stop offset=".07" stop-color="#ffffff" stop-opacity=".7"/>
    <stop offset=".5" stop-color="#f4f5f5" stop-opacity=".06"/><stop offset=".92" stop-color="#ffffff" stop-opacity=".55"/>
    <stop offset="1" stop-color="#d4d9db" stop-opacity=".95"/>
  </linearGradient>
  <linearGradient id="amber" x1="0" x2="1">
    <stop offset="0" stop-color="#a5601c"/><stop offset=".25" stop-color="#e3a54e"/><stop offset=".55" stop-color="#f3c779"/>
    <stop offset=".8" stop-color="#cf8a35"/><stop offset="1" stop-color="#8c4f16"/>
  </linearGradient>
  <linearGradient id="amberV" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#f6d08b" stop-opacity=".0"/><stop offset=".4" stop-color="#9b5a1a" stop-opacity=".0"/>
    <stop offset="1" stop-color="#6e3a0e" stop-opacity=".45"/>
  </linearGradient>
  <linearGradient id="amberGlass" x1="0" x2="1">
    <stop offset="0" stop-color="#4b2508"/><stop offset=".2" stop-color="#9a571b"/><stop offset=".42" stop-color="#c98638"/>
    <stop offset=".7" stop-color="#7c4212"/><stop offset="1" stop-color="#3a1c06"/>
  </linearGradient>
  <linearGradient id="ivory" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fdfcf9"/><stop offset="1" stop-color="#f1ece3"/>
  </linearGradient>
  <linearGradient id="ivoryH" x1="0" x2="1">
    <stop offset="0" stop-color="#ebe5da"/><stop offset=".15" stop-color="#faf8f3"/><stop offset=".85" stop-color="#faf8f3"/><stop offset="1" stop-color="#e6dfd2"/>
  </linearGradient>
  <linearGradient id="ink" x1="0" x2="1">
    <stop offset="0" stop-color="#050505"/><stop offset=".3" stop-color="#2a2826"/><stop offset=".6" stop-color="#121110"/><stop offset="1" stop-color="#000"/>
  </linearGradient>
  <radialGradient id="glow" cx=".5" cy=".45" r=".55">
    <stop offset="0" stop-color="#fbf4e6"/><stop offset=".6" stop-color="#fefcf8"/><stop offset="1" stop-color="#ffffff"/>
  </radialGradient>
  <radialGradient id="shadow" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#2b2116" stop-opacity=".28"/><stop offset=".6" stop-color="#2b2116" stop-opacity=".08"/><stop offset="1" stop-color="#2b2116" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="caustic" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#f0b45a" stop-opacity=".55"/><stop offset="1" stop-color="#f0b45a" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="orangeFlesh" cx=".5" cy=".5" r=".5">
    <stop offset="0" stop-color="#ffd27a"/><stop offset=".7" stop-color="#f59a2a"/><stop offset="1" stop-color="#e27a16"/>
  </radialGradient>
  <radialGradient id="rosePetal" cx=".3" cy=".3" r=".9">
    <stop offset="0" stop-color="#c8344a"/><stop offset=".6" stop-color="#8f1730"/><stop offset="1" stop-color="#5c0b1f"/>
  </radialGradient>
  <linearGradient id="wood" x1="0" x2="1" y1="0" y2="1">
    <stop offset="0" stop-color="#b8754a"/><stop offset=".5" stop-color="#8e5232"/><stop offset="1" stop-color="#6a3a22"/>
  </linearGradient>
  <linearGradient id="cinn" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#b06a3b"/><stop offset=".35" stop-color="#8a4a25"/><stop offset=".7" stop-color="#6d3618"/><stop offset="1" stop-color="#4f240f"/>
  </linearGradient>
  <filter id="blur8"><feGaussianBlur stdDeviation="8"/></filter>
  <filter id="blur20"><feGaussianBlur stdDeviation="20"/></filter>
  <filter id="blur3"><feGaussianBlur stdDeviation="3"/></filter>
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/>
    <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .06 0"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>
</defs>`;

const shadow = (cx, cy, rx, ry, op = 1) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#shadow)" opacity="${op}"/>`;

/* ---------- objects ---------- */
function orangeHalf(cx, cy, r, rot = 0) {
  const segs = 10;
  let s = "";
  for (let i = 0; i < segs; i++) {
    const a0 = (i / segs) * Math.PI * 2 + 0.06, a1 = ((i + 1) / segs) * Math.PI * 2 - 0.06;
    const ri = r * 0.12, ro = r * 0.8;
    const p = (a, rr) => `${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`;
    s += `<path d="M${p(a0, ri)} L${p(a0, ro)} A${ro} ${ro} 0 0 1 ${p(a1, ro)} L${p(a1, ri)} Z" fill="url(#orangeFlesh)" opacity=".95"/>`;
    for (let k = 0; k < 3; k++) {
      const a = a0 + (a1 - a0) * (0.3 + k * 0.2), rr = ri + (ro - ri) * (0.35 + (k % 2) * 0.3);
      s += `<ellipse cx="${(Math.cos(a) * rr).toFixed(1)}" cy="${(Math.sin(a) * rr).toFixed(1)}" rx="${r * 0.05}" ry="${r * 0.016}" transform="rotate(${(a * 180) / Math.PI} ${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)})" fill="#fff4d6" opacity=".55"/>`;
    }
  }
  return `<g transform="translate(${cx} ${cy}) rotate(${rot})">
    <circle r="${r}" fill="#e2731b"/><circle r="${r * 0.97}" fill="#f08a26"/>
    <circle r="${r * 0.9}" fill="#fff1d2"/><circle r="${r * 0.86}" fill="#fbe2b0"/>
    ${s}<circle r="${r * 0.1}" fill="#fff3d9"/>
    <path d="M${-r * 0.7} ${-r * 0.55} A${r} ${r} 0 0 1 ${r * 0.3} ${-r * 0.9}" stroke="#fff" stroke-opacity=".45" stroke-width="${r * 0.04}" fill="none" stroke-linecap="round"/>
  </g>`;
}

function orangeWheel(cx, cy, r, rot = 0) {
  // dried wheel: deeper colours, slight translucency
  return `<g opacity=".98">${orangeHalf(cx, cy, r, rot)}</g><circle cx="${cx}" cy="${cy}" r="${r}" fill="#b4520c" opacity=".14"/>`;
}

function peelCurl(x, y, scale, rot) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${scale})">
    <path d="M0 0 C40 -40 120 -40 150 0 C170 30 140 60 100 50 C70 42 70 20 95 18" fill="none" stroke="#d8681a" stroke-width="26" stroke-linecap="round"/>
    <path d="M0 0 C40 -40 120 -40 150 0 C170 30 140 60 100 50 C70 42 70 20 95 18" fill="none" stroke="#f39a3a" stroke-width="16" stroke-linecap="round"/>
    <path d="M10 -12 C50 -40 110 -38 140 -8" fill="none" stroke="#ffd59a" stroke-width="4" stroke-linecap="round" opacity=".8"/>
  </g>`;
}

function cinnamonQuill(x, y, len, rot, thick = 34) {
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <rect x="0" y="${-thick / 2}" width="${len}" height="${thick}" rx="${thick * 0.2}" fill="url(#cinn)"/>
    ${[0.2, 0.45, 0.7].map((t) => `<path d="M${len * t} ${-thick / 2 + 3} q4 ${thick / 2} 0 ${thick - 6}" stroke="#4a210c" stroke-opacity=".35" stroke-width="2" fill="none"/>`).join("")}
    <path d="M6 ${-thick / 2 + 5} H${len - 8}" stroke="#d99a68" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/>
    <g transform="translate(${len} 0)">
      <ellipse rx="${thick * 0.32}" ry="${thick / 2}" fill="#7a3d1b"/>
      <path d="M0 ${-thick * 0.38} a${thick * 0.2} ${thick * 0.36} 0 1 1 -2 ${thick * 0.7} a${thick * 0.12} ${thick * 0.22} 0 1 1 1 ${-thick * 0.42}" fill="none" stroke="#c4824f" stroke-width="2.4"/>
    </g>
  </g>`;
}

function rose(cx, cy, r) {
  let s = "";
  const rings = [
    { n: 6, rr: 1.0, sc: 1.0, off: 0 },
    { n: 5, rr: 0.72, sc: 0.8, off: 20 },
    { n: 5, rr: 0.48, sc: 0.62, off: 50 },
    { n: 4, rr: 0.28, sc: 0.45, off: 10 },
  ];
  rings.forEach(({ n, rr, sc, off }, ri) => {
    for (let i = 0; i < n; i++) {
      const a = off + (i * 360) / n;
      s += `<g transform="rotate(${a}) translate(0 ${-r * rr * 0.45}) scale(${sc})">
        <path d="M${-r * 0.55} 0 C${-r * 0.6} ${-r * 0.75} ${r * 0.6} ${-r * 0.75} ${r * 0.55} 0 C${r * 0.4} ${r * 0.35} ${-r * 0.4} ${r * 0.35} ${-r * 0.55} 0 Z" fill="url(#rosePetal)" stroke="#4d0817" stroke-opacity=".35" stroke-width="1.5"/>
        <path d="M${-r * 0.4} ${-r * 0.3} C${-r * 0.2} ${-r * 0.48} ${r * 0.2} ${-r * 0.48} ${r * 0.4} ${-r * 0.3}" stroke="#e86478" stroke-opacity="${0.5 - ri * 0.08}" stroke-width="2" fill="none"/>
      </g>`;
    }
  });
  return `<g transform="translate(${cx} ${cy})">${s}<circle r="${r * 0.1}" fill="#4d0817"/></g>`;
}

function petal(x, y, s, rot) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <path d="M0 0 C-36 -8 -52 -48 -32 -72 C-20 -86 -6 -82 0 -70 C6 -82 20 -86 32 -72 C52 -48 36 -8 0 0 Z" fill="url(#rosePetal)"/>
    <path d="M0 -4 C-4 -24 -3 -48 0 -66" stroke="#e86478" stroke-opacity=".45" stroke-width="2" fill="none"/>
    <path d="M-30 -60 C-24 -74 -12 -78 -6 -70" stroke="#fff" stroke-opacity=".4" stroke-width="3" fill="none" stroke-linecap="round"/>
  </g>`;
}

function leaf(x, y, s, rot, color = "#6b7a52") {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
    <path d="M0 0 C20 -30 70 -36 110 0 C70 36 20 30 0 0 Z" fill="${color}"/>
    <path d="M0 0 C40 -8 80 -6 108 0" stroke="#dfe6cf" stroke-opacity=".6" stroke-width="2" fill="none"/>
  </g>`;
}

function cedarChip(x, y, w, h, rot, tone = 0) {
  const tones = [["#c27e53", "#8d4f2e"], ["#b06b43", "#7d4226"], ["#cf9468", "#a35f39"]][tone % 3];
  let grain = "";
  for (let i = 1; i < 6; i++) grain += `<path d="M${(w * i) / 6} 4 C${(w * i) / 6 + 6} ${h * 0.4} ${(w * i) / 6 - 6} ${h * 0.6} ${(w * i) / 6 + 3} ${h - 4}" stroke="#5a2f17" stroke-opacity=".3" stroke-width="1.6" fill="none"/>`;
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <defs><linearGradient id="cw${x}${y}" x1="0" x2="1"><stop offset="0" stop-color="${tones[0]}"/><stop offset="1" stop-color="${tones[1]}"/></linearGradient></defs>
    <path d="M6 0 L${w - 10} 4 L${w} ${h * 0.5} L${w - 6} ${h} L4 ${h - 6} L0 ${h * 0.45} Z" fill="url(#cw${x}${y})"/>
    ${grain}
    <path d="M8 3 L${w - 12} 7" stroke="#f2c7a0" stroke-opacity=".6" stroke-width="2"/>
  </g>`;
}

function cedarBlock(x, y, w, h, rot) {
  let grain = "";
  for (let i = 1; i < 9; i++) grain += `<path d="M${(w * i) / 9} 10 C${(w * i) / 9 + 10} ${h * 0.3} ${(w * i) / 9 - 8} ${h * 0.7} ${(w * i) / 9 + 4} ${h - 8}" stroke="#4f2812" stroke-opacity=".28" stroke-width="2.2" fill="none"/>`;
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <path d="M14 0 C${w * 0.4} -10 ${w * 0.7} 8 ${w - 6} 2 L${w} ${h - 12} C${w * 0.6} ${h + 6} ${w * 0.3} ${h - 4} 0 ${h} L4 ${h * 0.4} Z" fill="url(#wood)"/>
    ${grain}
    <path d="M18 6 C${w * 0.4} -2 ${w * 0.7} 12 ${w - 10} 8" stroke="#e6b088" stroke-opacity=".55" stroke-width="3" fill="none"/>
  </g>`;
}

/** Signature pebble bottle. Local origin = centre of base. */
function pebbleBottle(cx, by, s = 1, opts = {}) {
  const body = "M-170 -420 C-60 -442 60 -442 170 -420 C215 -410 225 -370 225 -300 L225 -110 C225 -40 200 -15 150 -8 C60 4 -60 4 -150 -8 C-200 -15 -225 -40 -225 -110 L-225 -300 C-225 -370 -215 -410 -170 -420 Z";
  const juice = "M-196 -300 C-60 -312 60 -288 196 -300 L196 -118 C196 -60 176 -40 136 -34 C56 -24 -56 -24 -136 -34 C-176 -40 -196 -60 -196 -118 Z";
  const facets = [
    ["-100,-500 100,-500 70,-560 -70,-560", "#e9d3a2"],
    ["-100,-500 -70,-560 -128,-540", "#9c7640"],
    ["100,-500 70,-560 128,-540", "#8a6634"],
    ["-70,-560 70,-560 40,-612 -40,-612", "#f6e7c4"],
    ["-70,-560 -40,-612 -100,-596 -128,-540", "#b8935a"],
    ["70,-560 40,-612 100,-596 128,-540", "#a07a43"],
    ["-40,-612 40,-612 0,-640", "#fff3d6"],
    ["-40,-612 0,-640 -100,-596", "#d4b47c"],
    ["40,-612 0,-640 100,-596", "#c29f63"],
  ];
  return `<g transform="translate(${cx} ${by}) scale(${s})">
    <ellipse cx="0" cy="40" rx="300" ry="34" fill="url(#caustic)" filter="url(#blur8)"/>
    ${shadow(0, 2, 270, 26)}
    <path d="${body}" fill="#ffffff" fill-opacity=".55"/>
    <path d="${juice}" fill="url(#amber)"/>
    <path d="${juice}" fill="url(#amberV)"/>
    <ellipse cx="0" cy="-300" rx="196" ry="10" fill="#f9d996" opacity=".9"/>
    <path d="${body}" fill="url(#glass)" opacity=".75"/>
    <path d="${body}" fill="none" stroke="#b9bfc1" stroke-width="3"/>
    <path d="M-200 -330 C-206 -250 -206 -180 -200 -120" stroke="#fff" stroke-width="14" stroke-linecap="round" opacity=".85" fill="none"/>
    <path d="M196 -350 C202 -280 202 -220 198 -170" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".7" fill="none"/>
    <path d="M-150 -26 C-60 -14 60 -14 150 -26" stroke="#fff" stroke-width="5" opacity=".5" fill="none"/>
    ${emblem(0, -232, 70, 2.4, "#fffaf0")}
    <text x="6" y="-158" text-anchor="middle" font-family="Cormorant Garamond" font-weight="500" font-size="44" letter-spacing="15" fill="#fffaf0">SENTYAR</text>
    <text x="3" y="-122" text-anchor="middle" font-family="Inter" font-weight="500" font-size="12" letter-spacing="6" fill="#fffaf0" opacity=".9">${opts.sub ?? "EAU DE PARFUM"}</text>
    <rect x="-44" y="-470" width="88" height="48" fill="url(#glass)" stroke="#c4c9cb" stroke-width="2"/>
    <rect x="-62" y="-506" width="124" height="44" rx="5" fill="url(#goldH)"/>
    ${[-494, -486, -478].map((y) => `<line x1="-60" x2="60" y1="${y}" y2="${y}" stroke="#6d5128" stroke-opacity=".35"/>`).join("")}
    ${facets.map(([p, c]) => `<polygon points="${p}" fill="${c}" stroke="#6d5128" stroke-opacity=".25" stroke-width="1.2"/>`).join("")}
  </g>`;
}

function plinth(cx, cy, rx, ry, h) {
  return `<g>
    ${shadow(cx, cy + h + 6, rx * 1.08, ry * 0.6)}
    <path d="M${cx - rx} ${cy} V${cy + h} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy + h} V${cy} Z" fill="url(#ivoryH)"/>
    <path d="M${cx - rx} ${cy + 16} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy + 16}" stroke="url(#goldH)" stroke-width="3" fill="none"/>
    <path d="M${cx - rx} ${cy + h - 10} A${rx} ${ry} 0 0 0 ${cx + rx} ${cy + h - 10}" stroke="#d9cfbe" stroke-width="1.5" fill="none"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#ivory)"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#e4dccd" stroke-width="2"/>
  </g>`;
}

const arch = (cx, top, w, bottom, op = 1) =>
  `<path d="M${cx - w / 2} ${bottom} V${top + w / 2} A${w / 2} ${w / 2} 0 0 1 ${cx + w / 2} ${top + w / 2} V${bottom}" fill="none" stroke="url(#goldH)" stroke-width="2.5" opacity="${op}"/>`;

/* ---------- compositions ---------- */
const scenes = {};

scenes["hero-stilllife"] = { w: 1092, h: 980, svg: `
  <rect width="1092" height="980" fill="url(#glow)"/>
  ${arch(546, 70, 640, 800, 0.9)}
  ${arch(546, 96, 588, 800, 0.35)}
  ${plinth(546, 800, 420, 66, 110)}
  ${cedarBlock(800, 540, 150, 260, 8)}
  ${leaf(250, 780, 1.1, -160)}
  ${leaf(300, 800, 0.9, -120, "#7d8b62")}
  ${pebbleBottle(536, 812, 0.9)}
  ${orangeHalf(850, 735, 90, -8)}
  ${rose(265, 770, 72)}
  ${petal(400, 868, 1.25, 40)}
  ${petal(170, 870, 1.0, -30)}
  ${cinnamonQuill(690, 860, 260, -6, 30)}
  ${cinnamonQuill(720, 884, 230, -3, 26)}
  <circle cx="610" cy="880" r="4" fill="url(#gold)"/><circle cx="640" cy="870" r="2.5" fill="url(#gold)"/><circle cx="460" cy="874" r="3" fill="url(#gold)"/>
` };

function amberVial(x, by, w, h, color, name) {
  const capH = h * 0.32;
  return `<g transform="translate(${x} ${by})">
    ${shadow(w / 2, 0, w * 0.7, 8)}
    <rect x="0" y="${-h + capH}" width="${w}" height="${h - capH}" rx="${w * 0.14}" fill="url(#amberGlass)"/>
    <rect x="${w * 0.12}" y="${-h + capH + h * 0.18}" width="${w * 0.76}" height="${h * 0.34}" fill="#fbf8f2"/>
    <rect x="${w * 0.12}" y="${-h + capH + h * 0.18}" width="${w * 0.76}" height="${h * 0.04}" fill="${color}"/>
    ${name ? `<text x="${w / 2}" y="${-h + capH + h * 0.4}" text-anchor="middle" font-family="Cormorant Garamond" font-weight="600" font-size="${w * 0.2}" fill="#141210">${name}</text>` : ""}
    <rect x="${w * 0.08}" y="${-h + capH + 6}" width="${w * 0.1}" height="${h - capH - 14}" rx="3" fill="#fff" opacity=".18"/>
    <rect x="${w * 0.04}" y="${-h}" width="${w * 0.92}" height="${capH}" rx="3" fill="url(#goldH)"/>
    ${[0.25, 0.5, 0.75].map((t) => `<line x1="${w * 0.04}" x2="${w * 0.96}" y1="${-h + capH * t}" y2="${-h + capH * t}" stroke="#6d5128" stroke-opacity=".3"/>`).join("")}
  </g>`;
}

function beakerStr(x, by, w, h, liquid = 0.35) {
  return `<g transform="translate(${x} ${by})">
    ${shadow(w / 2, 0, w * 0.7, 9)}
    <path d="M0 ${-h} H${w} V-8 Q${w} 0 ${w - 8} 0 H8 Q0 0 0 -8 Z" fill="url(#glass)" stroke="#aeb5b8" stroke-width="2"/>
    <rect x="2" y="${-h * liquid}" width="${w - 4}" height="${h * liquid - 4}" rx="6" fill="#f3c877" opacity=".55"/>
    <path d="M-6 ${-h} H${w + 6}" stroke="url(#goldH)" stroke-width="7" stroke-linecap="round"/>
    ${[0.2, 0.4, 0.6, 0.8].map((t) => `<line x1="${w * 0.6}" x2="${w * 0.86}" y1="${-h * t}" y2="${-h * t}" stroke="#a07a42" stroke-width="2"/>`).join("")}
    <path d="M10 ${-h + 12} V-14" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".9"/>
  </g>`;
}

scenes["kit-open"] = { w: 1208, h: 622, svg: `
  <rect width="1208" height="622" fill="#ffffff"/>
  <rect width="1208" height="622" fill="url(#glow)"/>
  ${shadow(410, 590, 400, 28)}
  ${shadow(985, 590, 190, 22)}
  <!-- lid -->
  <rect x="80" y="38" width="660" height="262" rx="4" fill="url(#ivory)" stroke="#e2d9c8" stroke-width="2"/>
  <rect x="100" y="56" width="620" height="226" fill="none" stroke="url(#goldH)" stroke-width="1.6"/>
  ${emblem(410, 118, 74, 2.4, "#a8844f")}
  <text x="416" y="200" text-anchor="middle" font-family="Cormorant Garamond" font-weight="500" font-size="40" letter-spacing="14" fill="#a8844f">SENTYAR</text>
  <text x="414" y="236" text-anchor="middle" font-family="Inter" font-weight="500" font-size="12" letter-spacing="6" fill="#8c7150">CREATOR KIT · V1</text>
  <!-- tray -->
  <rect x="60" y="292" width="700" height="290" rx="4" fill="#efe9de"/>
  <rect x="76" y="304" width="668" height="170" fill="#e6dfd2"/>
  ${[300, 425, 600].map((x) => `<rect x="${x}" y="304" width="4" height="170" fill="#f6f2ea"/>`).join("")}
  ${amberVial(98, 500, 42, 150, "#c79a5b", "")}
  ${amberVial(148, 500, 42, 150, "#d9973f", "")}
  ${amberVial(198, 500, 42, 150, "#b8475a", "")}
  ${amberVial(248, 500, 42, 150, "#8a6a4e", "")}
  ${beakerStr(322, 500, 92, 150)}
  <g transform="translate(440 500)">
    <rect x="0" y="-210" width="16" height="44" rx="8" fill="#141210"/>
    <path d="M2 -166 H14 V-40 L9 -2 H7 L2 -40 Z" fill="url(#glass)" stroke="#aeb5b8" stroke-width="1.6"/>
    ${[-140, -120, -100, -80].map((y) => `<line x1="2" x2="9" y1="${y}" y2="${y}" stroke="#a07a42" stroke-width="1.5"/>`).join("")}
  </g>
  ${amberVial(472, 500, 58, 190, "#c79a5b", "")}
  ${amberVial(540, 500, 58, 170, "#7d7468", "")}
  <g transform="translate(618 500)">
    <rect x="0" y="-188" width="112" height="188" fill="#fbf9f5" stroke="#d9cfbe"/>
    <rect x="8" y="-180" width="96" height="172" fill="none" stroke="url(#goldH)" stroke-width="1.2"/>
    ${emblem(56, -144, 28, 3, "#a8844f")}
    <text x="56" y="-100" text-anchor="middle" font-family="Inter" font-size="9" letter-spacing="3" fill="#141210">THE</text>
    <text x="56" y="-84" text-anchor="middle" font-family="Cormorant Garamond" font-size="14" letter-spacing="1" fill="#141210">INGREDIENTS</text>
    <line x1="34" x2="78" y1="-70" y2="-70" stroke="#a8844f"/>
  </g>
  <rect x="60" y="474" width="700" height="108" fill="url(#ivoryH)"/>
  <line x1="60" x2="760" y1="474" y2="474" stroke="url(#goldH)" stroke-width="3"/>
  <line x1="60" x2="760" y1="574" y2="574" stroke="#e2d9c8" stroke-width="2"/>
  ${emblem(410, 526, 30, 3, "#b8955f")}
  <!-- gift box -->
  <g transform="translate(830 250)">
    <rect x="0" y="40" width="310" height="300" fill="url(#ivoryH)" stroke="#e2d9c8" stroke-width="2"/>
    <rect x="-10" y="0" width="330" height="62" fill="url(#ivory)" stroke="#e2d9c8" stroke-width="2"/>
    <rect x="136" y="0" width="38" height="340" fill="url(#gold)"/>
    <rect x="-10" y="18" width="330" height="26" fill="url(#goldH)"/>
    <path d="M155 6 C110 -60 50 -60 60 -20 C68 10 120 10 155 6 Z" fill="url(#gold)" stroke="#7a5a2e" stroke-opacity=".4"/>
    <path d="M155 6 C200 -60 260 -60 250 -20 C242 10 190 10 155 6 Z" fill="url(#gold)" stroke="#7a5a2e" stroke-opacity=".4"/>
    <path d="M150 10 L120 70 L136 68 Z M160 10 L196 74 L178 70 Z" fill="#a07a42"/>
    <ellipse cx="155" cy="6" rx="18" ry="14" fill="url(#goldH)"/>
    <line x1="180" y1="44" x2="232" y2="140" stroke="#a07a42" stroke-width="1.5"/>
    <g transform="translate(200 140) rotate(-8)">
      <rect x="0" y="0" width="74" height="104" rx="6" fill="#fffdf8" stroke="#d9cfbe"/>
      <circle cx="37" cy="12" r="4" fill="none" stroke="#a07a42"/>
      ${emblem(37, 52, 34, 3, "#a8844f")}
      <line x1="20" x2="54" y1="82" y2="82" stroke="#a8844f"/>
    </g>
  </g>
` };

function dish(cx, cy, r) {
  return `${shadow(cx, cy + r * 0.12, r * 1.05, r * 0.22)}
  <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.36}" fill="#fff" stroke="#e6dfd2" stroke-width="2"/>
  <ellipse cx="${cx}" cy="${cy - 4}" rx="${r * 0.96}" ry="${r * 0.33}" fill="none" stroke="url(#goldH)" stroke-width="3"/>
  <ellipse cx="${cx}" cy="${cy + 2}" rx="${r * 0.78}" ry="${r * 0.25}" fill="#f6f2ea"/>`;
}

const square = (body) => `<rect width="600" height="600" fill="url(#glow)"/><g transform="translate(300 330) scale(1.2) translate(-300 -350)">${body}</g>`;

scenes["orange-peel"] = { w: 600, h: 600, svg: square(`
  ${dish(300, 410, 230)}
  ${orangeWheel(230, 330, 92, 10)}
  ${orangeWheel(370, 310, 80, -20)}
  ${peelCurl(240, 420, 0.9, -8)}
  ${peelCurl(330, 400, 0.7, 20)}
  ${leaf(420, 400, 0.6, -30)}
`) };

scenes["cedarwood"] = { w: 600, h: 600, svg: square(`
  ${dish(300, 410, 230)}
  ${cedarChip(170, 300, 120, 70, -14, 0)}
  ${cedarChip(300, 280, 140, 64, 10, 1)}
  ${cedarChip(220, 360, 130, 60, 6, 2)}
  ${cedarChip(340, 360, 110, 62, -20, 0)}
  ${cedarChip(260, 410, 100, 50, -4, 1)}
  ${cedarChip(150, 400, 80, 44, 22, 2)}
`) };

scenes["rose-petals"] = { w: 600, h: 600, svg: square(`
  ${dish(300, 410, 230)}
  ${petal(185, 430, 1.05, -50)}
  ${petal(415, 440, 1.0, 60)}
  ${petal(395, 365, 0.85, 120)}
  ${petal(205, 355, 0.8, -110)}
  ${leaf(330, 380, 0.8, -10)}
  ${rose(290, 350, 92)}
  <circle cx="380" cy="300" r="5" fill="#fff" opacity=".8"/><circle cx="200" cy="320" r="3.5" fill="#fff" opacity=".7"/>
`) };

scenes["cinnamon"] = { w: 600, h: 600, svg: square(`
  ${dish(300, 410, 230)}
  ${cinnamonQuill(140, 330, 300, -4, 40)}
  ${cinnamonQuill(150, 372, 290, -2, 40)}
  ${cinnamonQuill(160, 412, 280, 1, 40)}
  <rect x="270" y="296" width="18" height="140" rx="4" fill="url(#gold)" transform="rotate(-3 279 366)"/>
  <path d="M286 300 C320 270 330 300 300 312 M286 300 C300 262 270 264 278 300" stroke="url(#gold)" stroke-width="5" fill="none"/>
`) };

/* bottles (450 x 600) */
const tall = (body) => `<rect width="450" height="600" fill="url(#glow)"/>${body}`;
const goldCap = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="url(#goldH)"/>`;

scenes["bottle-fluid"] = { w: 450, h: 600, svg: tall(`
  ${shadow(225, 520, 150, 16)}
  <path d="M120 230 C80 300 90 470 160 512 C220 540 320 530 345 470 C372 400 350 300 300 250 C270 222 160 196 120 230 Z" fill="url(#amber)"/>
  <path d="M120 230 C80 300 90 470 160 512 C220 540 320 530 345 470 C372 400 350 300 300 250 C270 222 160 196 120 230 Z" fill="url(#glass)" opacity=".55" stroke="#b9bfc1" stroke-width="2"/>
  <path d="M118 290 C108 350 112 420 140 470" stroke="#fff" stroke-width="9" stroke-linecap="round" fill="none" opacity=".85"/>
  <rect x="196" y="192" width="40" height="36" fill="url(#glass)" stroke="#b9bfc1"/>
  <path d="M170 196 C160 120 230 90 280 120 C320 146 290 200 250 196 Z" fill="#e9e2d6" stroke="#cfc4b2"/>
  <path d="M190 150 C210 120 250 118 270 132" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none"/>
  ${emblem(232, 380, 46, 2.6, "#fffaf0")}
`) };

scenes["bottle-facet"] = { w: 450, h: 600, svg: tall(`
  ${shadow(225, 525, 120, 14)}
  <polygon points="150,190 300,190 330,240 330,500 300,525 150,525 120,500 120,240" fill="url(#amber)"/>
  <polygon points="150,190 300,190 330,240 330,500 300,525 150,525 120,500 120,240" fill="url(#glass)" opacity=".5" stroke="#b9bfc1" stroke-width="2"/>
  <polygon points="150,190 300,190 280,240 170,240" fill="#fff" opacity=".35"/>
  <polygon points="120,240 170,240 170,500 120,500" fill="#fff" opacity=".22"/>
  <polygon points="280,240 330,240 330,500 280,500" fill="#5a2c06" opacity=".18"/>
  <rect x="200" y="160" width="50" height="30" fill="url(#glass)" stroke="#b9bfc1"/>
  <polygon points="175,160 275,160 300,110 250,52 200,52 150,110" fill="#141210"/>
  <polygon points="200,52 250,52 260,110 190,110" fill="#3a3632"/>
  <polygon points="150,110 190,110 175,160" fill="#26231f"/>
  ${emblem(225, 370, 50, 2.6, "#fffaf0")}
`) };

scenes["bottle-orb"] = { w: 450, h: 600, svg: tall(`
  ${shadow(225, 525, 140, 16)}
  <circle cx="225" cy="380" r="140" fill="url(#amber)"/>
  <circle cx="225" cy="380" r="140" fill="url(#glass)" opacity=".5" stroke="#b9bfc1" stroke-width="2"/>
  <path d="M120 320 A120 120 0 0 1 200 254" stroke="#fff" stroke-width="10" stroke-linecap="round" fill="none" opacity=".9"/>
  <rect x="205" y="214" width="40" height="34" fill="url(#glass)" stroke="#b9bfc1"/>
  ${goldCap(196, 120, 58, 96)}
  ${[140, 160, 180, 200].map((y) => `<line x1="198" x2="252" y1="${y}" y2="${y}" stroke="#6d5128" stroke-opacity=".3"/>`).join("")}
  ${emblem(225, 380, 54, 2.6, "#fffaf0")}
`) };

scenes["bottle-atelier"] = { w: 450, h: 600, svg: tall(`
  ${shadow(225, 525, 130, 14)}
  <rect x="115" y="210" width="220" height="315" rx="14" fill="url(#amber)"/>
  <rect x="115" y="210" width="220" height="315" rx="14" fill="url(#glass)" opacity=".5" stroke="#b9bfc1" stroke-width="2"/>
  ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<line x1="${135 + i * 22.5}" x2="${135 + i * 22.5}" y1="226" y2="510" stroke="#fff" stroke-opacity="${i % 2 ? 0.25 : 0.12}" stroke-width="3"/>`).join("")}
  <rect x="150" y="320" width="150" height="100" fill="#fbf8f2"/>
  <rect x="150" y="320" width="150" height="4" fill="url(#goldH)"/>
  ${emblem(225, 350, 26, 3, "#141210")}
  <text x="228" y="394" text-anchor="middle" font-family="Cormorant Garamond" font-size="20" letter-spacing="6" fill="#141210">SENTYAR</text>
  <rect x="200" y="180" width="50" height="30" fill="url(#glass)" stroke="#b9bfc1"/>
  <rect x="170" y="88" width="110" height="94" rx="6" fill="url(#ink)"/>
  <rect x="176" y="94" width="14" height="82" rx="4" fill="#fff" opacity=".12"/>
`) };

/* textures (square 400) */
const tex = (body) => `<svg viewBox="0 0 400 400">${body}</svg>`;
scenes["tex-glass"] = { w: 400, h: 400, svg: `
  <rect width="400" height="400" fill="#f4f7f8"/>
  <filter id="ripple"><feTurbulence type="turbulence" baseFrequency=".012 .05" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.3 -.3"/></filter>
  <rect width="400" height="400" filter="url(#ripple)" opacity=".85"/>
  ${Array.from({ length: 14 }, (_, i) => `<path d="M0 ${i * 30 + 10} C100 ${i * 30 - 6} 300 ${i * 30 + 26} 400 ${i * 30 + 10}" stroke="#c9d3d6" stroke-width="1.4" fill="none" opacity=".7"/>`).join("")}
  <rect width="400" height="400" fill="url(#glass)" opacity=".4"/>
` };
scenes["tex-stone"] = { w: 400, h: 400, svg: `
  <rect width="400" height="400" fill="#f7f4ee"/>
  <filter id="marble"><feTurbulence type="fractalNoise" baseFrequency=".006 .02" numOctaves="5" seed="11"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .5  0 0 0 0 .44  -2.2 0 0 0 1.25"/></filter>
  <rect width="400" height="400" filter="url(#marble)" opacity=".55"/>
  <path d="M-10 120 C80 150 160 90 260 170 C320 220 360 200 420 260" stroke="#c9b48c" stroke-width="2" fill="none" opacity=".7"/>
  <path d="M-10 300 C90 280 150 330 240 300" stroke="#d6cbb8" stroke-width="1.4" fill="none"/>
` };
scenes["tex-foil"] = { w: 400, h: 400, svg: `
  <rect width="400" height="400" fill="url(#gold)"/>
  <filter id="brush"><feTurbulence type="fractalNoise" baseFrequency=".002 .9" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 .95  0 0 0 0 .8  0 0 0 .5 0"/></filter>
  <rect width="400" height="400" filter="url(#brush)" opacity=".7"/>
` };
scenes["tex-matte"] = { w: 400, h: 400, svg: `
  <rect width="400" height="400" fill="#151413"/>
  <filter id="soft"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="2"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .07 0"/></filter>
  <rect width="400" height="400" filter="url(#soft)"/>
  <rect width="400" height="400" fill="url(#shadow)" opacity=".0"/>
` };
scenes["emboss"] = { w: 536, h: 622, svg: `
  <rect width="536" height="622" fill="url(#ivory)"/>
  <filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".7" numOctaves="2" seed="5"/><feColorMatrix values="0 0 0 0 .4  0 0 0 0 .35  0 0 0 0 .3  0 0 0 .05 0"/></filter>
  <rect width="536" height="622" filter="url(#paper)"/>
  <rect x="30" y="30" width="476" height="562" fill="none" stroke="url(#goldH)" stroke-width="2"/>
  <g opacity=".5" transform="translate(2 2)">${emblem(268, 280, 220, 2.6, "#cdbfa7")}</g>
  <g transform="translate(-1.5 -1.5)">${emblem(268, 280, 220, 2.6, "#ffffff")}</g>
  ${emblem(268, 280, 220, 1.6, "url(#gold)")}
  <text x="275" y="470" text-anchor="middle" font-family="Cormorant Garamond" font-weight="500" font-size="36" letter-spacing="14" fill="#a8844f">SENTYAR</text>
` };

/* ---------- render ---------- */
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
const page = await browser.newPage({ deviceScaleFactor: 2 });
const only = process.argv[2]?.split(",");
for (const [name, { w, h, svg }] of Object.entries(scenes)) {
  if (only && !only.includes(name)) continue;
  const doc = `<!doctype html><html><head>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@500&display=block" rel="stylesheet">
    <style>html,body{margin:0;background:#fff}svg{display:block}</style></head><body>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${DEFS}${svg}</svg></body></html>`;
  writeFileSync(`art/${name}.html`, doc);
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(doc, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${OUT}${name}.jpg`, type: "jpeg", quality: 88, clip: { x: 0, y: 0, width: w, height: h } });
  console.log("rendered", name);
}
await browser.close();
