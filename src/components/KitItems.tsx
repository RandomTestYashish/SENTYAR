// Drawn kit objects (original SVG, SENTYAR royal white style): pipette,
// blotters, spray bottle, measuring beaker, funnel, perfumery alcohol sample,
// accord oil bottle, mixing vials, cards, journal, guide, QR card.
// Shared language: crystal glass, gilded metal, ivory paper, one light
// source from the upper left and a soft contact shadow.

import { useId, type ReactNode } from "react";
import { Emblem } from "./Logo";

const LINE = "#aeb4b6";
const GOLD_DEEP = "#85663a";

function useIds() {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, "");
  return { gold: `g${raw}`, goldH: `gh${raw}`, glass: `gl${raw}`, amber: `am${raw}`, shadow: `sh${raw}`, ivory: `iv${raw}`, liquid: `lq${raw}` };
}
type Ids = ReturnType<typeof useIds>;

function Defs({ ids }: { ids: Ids }) {
  return (
    <defs>
      <linearGradient id={ids.gold} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#7a5a2e" /><stop offset=".25" stopColor="#dcc08a" /><stop offset=".5" stopColor="#a37d45" />
        <stop offset=".75" stopColor="#f3e2b6" /><stop offset="1" stopColor="#8a6936" />
      </linearGradient>
      <linearGradient id={ids.goldH} x1="0" x2="1">
        <stop offset="0" stopColor="#7f5f31" /><stop offset=".3" stopColor="#e8d1a0" /><stop offset=".55" stopColor="#b08b52" />
        <stop offset=".8" stopColor="#f5e6c0" /><stop offset="1" stopColor="#86653a" />
      </linearGradient>
      <linearGradient id={ids.glass} x1="0" x2="1">
        <stop offset="0" stopColor="#d9dfe1" stopOpacity=".95" /><stop offset=".1" stopColor="#ffffff" stopOpacity=".85" />
        <stop offset=".5" stopColor="#f5f7f7" stopOpacity=".25" /><stop offset=".88" stopColor="#ffffff" stopOpacity=".7" />
        <stop offset="1" stopColor="#cfd6d8" stopOpacity=".95" />
      </linearGradient>
      <linearGradient id={ids.amber} x1="0" x2="1">
        <stop offset="0" stopColor="#4b2508" /><stop offset=".22" stopColor="#9a571b" /><stop offset=".42" stopColor="#cf8d3d" />
        <stop offset=".7" stopColor="#7c4212" /><stop offset="1" stopColor="#3a1c06" />
      </linearGradient>
      <linearGradient id={ids.liquid} x1="0" x2="1">
        <stop offset="0" stopColor="#d79a45" /><stop offset=".45" stopColor="#f6d189" /><stop offset="1" stopColor="#c7832f" />
      </linearGradient>
      <linearGradient id={ids.ivory} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#f3ede2" />
      </linearGradient>
      <radialGradient id={ids.shadow} cx=".5" cy=".5" r=".5">
        <stop offset="0" stopColor="#3b2a12" stopOpacity=".26" /><stop offset=".6" stopColor="#3b2a12" stopOpacity=".07" /><stop offset="1" stopColor="#3b2a12" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

function Svg({ children, label, vb = "0 0 100 160", className = "kit-svg" }: { children: ReactNode; label?: string; vb?: string; className?: string }) {
  return (
    <svg viewBox={vb} className={className} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {children}
    </svg>
  );
}

const Shadow = ({ ids, cx = 50, cy = 154, rx = 40, ry = 5 }: { ids: Ids; cx?: number; cy?: number; rx?: number; ry?: number }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${ids.shadow})`} />
);

/** Inline emblem drawn as SVG paths, so it scales inside other drawings. */
function Mark({ x, y, size, color, stroke = 3 }: { x: number; y: number; size: number; color: string; stroke?: number }) {
  return (
    <g transform={`translate(${x - size / 2} ${y - size / 2})`} style={{ color }}>
      <Emblem size={size} stroke={stroke} />
    </g>
  );
}

export function Pipette({ label }: { label?: string }) {
  const ids = useIds();
  return (
    <Svg label={label}>
      <Defs ids={ids} />
      <Shadow ids={ids} rx={18} ry={3} />
      <rect x="41" y="4" width="18" height="30" rx="9" fill="#17140f" />
      <rect x="44" y="7" width="4" height="22" rx="2" fill="#fff" opacity=".18" />
      <rect x="39" y="32" width="22" height="9" rx="2" fill={`url(#${ids.goldH})`} />
      <path d="M44 41 H56 V128 L51 151 H49 L44 128 Z" fill={`url(#${ids.glass})`} stroke={LINE} strokeWidth=".9" />
      <path d="M45 100 H55 V128 L51 149 H49 L45 128 Z" fill={`url(#${ids.liquid})`} opacity=".7" />
      {[56, 70, 84, 98, 112].map((y, i) => (
        <g key={y}>
          <line x1="50" x2={i % 2 ? 55 : 56} y1={y} y2={y} stroke={GOLD_DEEP} strokeWidth=".9" />
          {i % 2 === 0 && <text x="60" y={y + 2.4} fontSize="6.5" fontFamily="var(--font-serif)" fill={GOLD_DEEP}>{3 - i / 2}</text>}
        </g>
      ))}
      <path d="M46 44 V124" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function Blotters({ label }: { label?: string }) {
  const ids = useIds();
  return (
    <Svg label={label} vb="0 0 120 160">
      <Defs ids={ids} />
      <Shadow ids={ids} cx={60} cy={152} rx={48} ry={5} />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`rotate(${-16 + i * 8} 60 150)`}>
          <path d="M51 14 H69 V140 L60 150 L51 140 Z" fill={`url(#${ids.ivory})`} stroke="#ddd0ba" strokeWidth=".8" />
          <line x1="51" x2="69" y1="30" y2="30" stroke={`url(#${ids.goldH})`} strokeWidth="1.4" />
          {i === 2 && <text x="60" y="24" textAnchor="middle" fontSize="4.6" fontFamily="var(--font-serif)" letterSpacing="1.4" fill={GOLD_DEEP}>SENTYAR</text>}
        </g>
      ))}
    </Svg>
  );
}

export function SprayBottle({ label, ml = 10 }: { label?: string; ml?: number }) {
  const ids = useIds();
  return (
    <Svg label={label} vb="0 0 100 160">
      <Defs ids={ids} />
      <Shadow ids={ids} rx={40} />
      <rect x="38" y="4" width="24" height="16" rx="3" fill={`url(#${ids.goldH})`} />
      <rect x="47" y="8" width="6" height="4" rx="1" fill="#7a5a2e" opacity=".6" />
      <rect x="34" y="20" width="32" height="20" rx="2" fill={`url(#${ids.gold})`} />
      {[25, 30, 35].map((y) => <line key={y} x1="34" x2="66" y1={y} y2={y} stroke="#6d5128" strokeOpacity=".3" strokeWidth=".7" />)}
      <path d="M22 44 C22 41 24 40 28 40 H72 C76 40 78 41 78 44 V146 C78 150 76 152 72 152 H28 C24 152 22 150 22 146 Z" fill={`url(#${ids.glass})`} stroke={LINE} />
      <line x1="50" y1="40" x2="50" y2="146" stroke={LINE} strokeOpacity=".7" strokeWidth=".8" />
      <rect x="30" y="80" width="40" height="40" fill="none" stroke={`url(#${ids.goldH})`} strokeWidth=".9" />
      <Mark x={50} y={93} size={12} color="#a8844f" stroke={4} />
      <text x="50" y="112" textAnchor="middle" fontSize="5.4" fontFamily="var(--font-sans)" fill={GOLD_DEEP} letterSpacing="1.1">{ml} ML</text>
      <path d="M27 48 V140" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
      <rect x="22" y="146" width="56" height="6" rx="2" fill="#fff" opacity=".6" />
    </Svg>
  );
}

export function Beaker({ label }: { label?: string }) {
  const ids = useIds();
  return (
    <Svg label={label} vb="0 0 100 160">
      <Defs ids={ids} />
      <Shadow ids={ids} cx={50} cy={153} rx={38} ry={5} />
      {/* liquid */}
      <path d="M22 108 H76 V141 C76 146 73 149 68 149 H30 C25 149 22 146 22 141 Z" fill={`url(#${ids.liquid})`} opacity=".62" />
      <ellipse cx="49" cy="108" rx="27" ry="2.2" fill="#fbe2aa" opacity=".9" />
      {/* glass body */}
      <path d="M20 26 H78 L84 19 H88 L80 30 V141 C80 148 75 152 68 152 H30 C24 152 20 148 20 141 Z" fill={`url(#${ids.glass})`} stroke={LINE} strokeWidth="1" />
      {/* gilded rim and foot */}
      <path d="M18 26 H80 L85.5 19 H89" fill="none" stroke={`url(#${ids.goldH})`} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 146 C22 150 26 152 30 152 H68 C73 152 78 150 79 146" fill="none" stroke={`url(#${ids.goldH})`} strokeWidth="2.6" />
      {/* engraved graduations */}
      {[2, 4, 6, 8, 10].map((v) => {
        const y = 140 - v * 10.5;
        return (
          <g key={v}>
            <line x1="58" x2="72" y1={y} y2={y} stroke={GOLD_DEEP} strokeWidth="1" />
            <line x1="62" x2="72" y1={y + 5.25} y2={y + 5.25} stroke={GOLD_DEEP} strokeWidth=".6" opacity=".7" />
            <text x="55" y={y + 2.4} textAnchor="end" fontSize="7" fontFamily="var(--font-serif)" fill={GOLD_DEEP}>{v}</text>
          </g>
        );
      })}
      <text x="66" y="40" textAnchor="middle" fontSize="5" fontFamily="var(--font-sans)" letterSpacing="1" fill={GOLD_DEEP}>ML</text>
      <Mark x={37} y={66} size={16} color="#a8844f" stroke={3.4} />
      {/* highlights */}
      <path d="M26 34 V140" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".95" />
      <path d="M76 40 V96" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity=".8" />
    </Svg>
  );
}

export function Funnel({ label }: { label?: string }) {
  const ids = useIds();
  return (
    <Svg label={label} vb="0 0 100 160">
      <Defs ids={ids} />
      <Shadow ids={ids} cx={50} cy={150} rx={24} ry={4} />
      <path d="M18 58 H82 L60 100 V146 H40 V100 Z" fill={`url(#${ids.ivory})`} stroke="#ddd0ba" />
      <path d="M26 66 L44 100" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="50" cy="58" rx="32" ry="8" fill="#fff" stroke={`url(#${ids.goldH})`} strokeWidth="2.6" />
      <ellipse cx="50" cy="59" rx="11" ry="3" fill="#ede5d6" />
      <line x1="40" x2="60" y1="102" y2="102" stroke={`url(#${ids.goldH})`} strokeWidth="2" />
    </Svg>
  );
}

export function AlcoholBottle({ label }: { label?: string }) {
  const ids = useIds();
  return (
    <Svg label={label} vb="0 0 100 160">
      <Defs ids={ids} />
      <Shadow ids={ids} rx={40} />
      <rect x="33" y="6" width="34" height="26" rx="3" fill={`url(#${ids.goldH})`} />
      {[12, 18, 24].map((y) => <line key={y} x1="33" x2="67" y1={y} y2={y} stroke="#6d5128" strokeOpacity=".3" strokeWidth=".7" />)}
      <rect x="40" y="32" width="20" height="6" fill={`url(#${ids.glass})`} stroke={LINE} strokeWidth=".8" />
      <path d="M20 46 C20 40 25 38 31 38 H69 C75 38 80 40 80 46 V146 C80 150 78 152 74 152 H26 C22 152 20 150 20 146 Z" fill={`url(#${ids.glass})`} stroke={LINE} />
      <rect x="27" y="62" width="46" height="78" fill="#fffdf8" />
      <rect x="30" y="65" width="40" height="72" fill="none" stroke={`url(#${ids.goldH})`} strokeWidth=".9" />
      <Mark x={50} y={77} size={10} color="#a8844f" stroke={4} />
      <text x="50" y="94" textAnchor="middle" fontSize="6" fontFamily="var(--font-serif)" fontWeight="600" fill="#14110d" letterSpacing=".8">PERFUMERY</text>
      <text x="50" y="102" textAnchor="middle" fontSize="6" fontFamily="var(--font-serif)" fontWeight="600" fill="#14110d" letterSpacing=".8">ALCOHOL</text>
      <text x="50" y="114" textAnchor="middle" fontSize="4.6" fontFamily="var(--font-sans)" fill="#6e675e">display only</text>
      <line x1="38" x2="62" y1="121" y2="121" stroke={`url(#${ids.goldH})`} />
      <text x="50" y="131" textAnchor="middle" fontSize="6" fontFamily="var(--font-sans)" fill="#14110d">30 ml</text>
      <path d="M24 50 V142" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </Svg>
  );
}

/** Amber accord bottle: studio photograph with the accord printed on its blank ivory label. */
export function OilBottle({ name, color, ml = 5, label, className = "kit-svg" }: { name: string; color: string; ml?: number; label?: string; className?: string }) {
  return (
    <Svg label={label} vb="25 9 50 82" className={`${className} kit-photo`}>
      <image href="./assets/img/oil-bottle.jpg" x="0" y="0" width="100" height="100" />
      <rect x="42" y="55.3" width="16.2" height="0.9" fill={color} />
      <g transform="translate(48.6 57.4)" style={{ color: "#a8844f" }}><Emblem size={2.8} stroke={5} /></g>
      <text x="50" y="65.4" textAnchor="middle" fontSize="3.4" fontFamily="var(--font-serif)" fontWeight="600" fill="#14110d">{name}</text>
      <text x="50" y="69.2" textAnchor="middle" fontSize="1.35" fontFamily="var(--font-sans)" fill="#6e675e" letterSpacing=".35">DEMO ACCORD</text>
      <line x1="45.5" x2="54.5" y1="72" y2="72" stroke="#b08d57" strokeWidth=".25" />
      <text x="50" y="76" textAnchor="middle" fontSize="2.2" fontFamily="var(--font-sans)" fill="#14110d">{ml} ml</text>
    </Svg>
  );
}

export function MixingVials({ label }: { label?: string }) {
  const ids = useIds();
  return (
    <Svg label={label} vb="0 0 120 160">
      <Defs ids={ids} />
      <Shadow ids={ids} cx={60} cy={154} rx={50} ry={5} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${14 + i * 32} 20)`}>
          <rect x="3" y="0" width="22" height="18" rx="2" fill={`url(#${ids.goldH})`} />
          <path d="M2 18 H26 V124 C26 130 22 132 18 132 H10 C6 132 2 130 2 124 Z" fill={`url(#${ids.glass})`} stroke={LINE} strokeWidth=".9" />
          {i === 1 && <path d="M3 90 H25 V124 C25 129 22 131 18 131 H10 C6 131 3 129 3 124 Z" fill={`url(#${ids.liquid})`} opacity=".6" />}
          <path d="M7 24 V120" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      ))}
    </Svg>
  );
}

export function PaperItem({ kind, label }: { kind: "cards" | "journal" | "guide" | "qr"; label?: string }) {
  const ids = useIds();
  if (kind === "journal") {
    return (
      <Svg label={label} vb="0 0 120 160">
        <Defs ids={ids} />
        <Shadow ids={ids} cx={62} cy={150} rx={46} ry={5} />
        <rect x="18" y="12" width="88" height="134" rx="2" fill={`url(#${ids.ivory})`} stroke="#ddd0ba" />
        <rect x="18" y="12" width="9" height="134" fill="#efe6d6" />
        <rect x="33" y="20" width="66" height="118" fill="none" stroke={`url(#${ids.goldH})`} strokeWidth="1" />
        <Mark x={66} y={62} size={22} color="#a8844f" stroke={3} />
        <text x="66" y="96" textAnchor="middle" fontSize="8" fontFamily="var(--font-serif)" fill="#14110d" letterSpacing="1.6">FORMULA</text>
        <text x="66" y="107" textAnchor="middle" fontSize="8" fontFamily="var(--font-serif)" fill="#14110d" letterSpacing="1.6">JOURNAL</text>
        <rect x="88" y="12" width="5" height="40" fill={`url(#${ids.gold})`} />
      </Svg>
    );
  }
  if (kind === "qr") {
    const cells = [0, 1, 2, 3, 4, 5, 6].flatMap((r) => [0, 1, 2, 3, 4, 5, 6].map((c) => ({ r, c, on: (r * 3 + c * 5 + r * c) % 3 === 0 || (r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2) })));
    return (
      <Svg label={label} vb="0 0 120 160">
        <Defs ids={ids} />
        <Shadow ids={ids} cx={60} cy={146} rx={44} ry={5} />
        <rect x="16" y="20" width="88" height="120" rx="2" fill={`url(#${ids.ivory})`} stroke="#ddd0ba" />
        <rect x="21" y="25" width="78" height="110" fill="none" stroke={`url(#${ids.goldH})`} strokeWidth=".9" />
        {cells.filter((x) => x.on).map(({ r, c }) => <rect key={`${r}-${c}`} x={32 + c * 8} y={36 + r * 8} width="8" height="8" fill="#14110d" />)}
        <text x="60" y="112" textAnchor="middle" fontSize="6.6" fontFamily="var(--font-sans)" fill={GOLD_DEEP} letterSpacing="1.2">SCAN FOR</text>
        <text x="60" y="122" textAnchor="middle" fontSize="6.6" fontFamily="var(--font-sans)" fill={GOLD_DEEP} letterSpacing="1.2">TUTORIAL</text>
      </Svg>
    );
  }
  const title = kind === "cards" ? "CEDARWOOD" : "SAFETY";
  const sub = kind === "cards" ? "botanical" : "and handling";
  return (
    <Svg label={label} vb="0 0 120 160">
      <Defs ids={ids} />
      <Shadow ids={ids} cx={60} cy={142} rx={44} ry={5} />
      {kind === "cards" && <rect x="30" y="16" width="70" height="104" rx="2" fill="#f7f1e6" stroke="#ddd0ba" transform="rotate(8 65 68)" />}
      <rect x="22" y="26" width="70" height="104" rx="2" fill={`url(#${ids.ivory})`} stroke="#ddd0ba" />
      <rect x="27" y="31" width="60" height="94" fill="none" stroke={`url(#${ids.goldH})`} strokeWidth=".9" />
      <Mark x={57} y={48} size={12} color="#a8844f" stroke={4} />
      <text x="57" y="68" textAnchor="middle" fontSize="6.6" fontFamily="var(--font-sans)" fill="#14110d" letterSpacing="1.4">{title}</text>
      <text x="57" y="79" textAnchor="middle" fontSize="7.6" fontFamily="var(--font-serif)" fontStyle="italic" fill="#55504a">{sub}</text>
      <line x1="40" x2="74" y1="90" y2="90" stroke={`url(#${ids.goldH})`} />
      {[98, 104, 110].map((y) => <line key={y} x1="36" x2="78" y1={y} y2={y} stroke="#e4d9c6" />)}
    </Svg>
  );
}

const PHOTO: Record<string, string> = {
  vials: "tool-vials", pipettes: "tool-pipettes", blotters: "tool-blotters", sprays: "tool-sprays", beaker: "tool-beaker",
  funnel: "tool-funnel", alcohol: "tool-alcohol", cards: "tool-cards", journal: "tool-journal", guide: "tool-guide", qr: "tool-guide",
};

/** Map a kit tool id to its studio photograph (drawings remain as a fallback). */
export function ToolArt({ id, label }: { id: string; label?: string }) {
  const photo = PHOTO[id];
  if (photo) {
    return (
      <Svg label={label} vb="8 8 84 84" className="kit-svg kit-photo kit-photo--tool">
        <image href={`./assets/img/${photo}.jpg`} x="0" y="0" width="100" height="100" />
      </Svg>
    );
  }
  return <ToolDrawing id={id} label={label} />;
}

export function ToolDrawing({ id, label }: { id: string; label?: string }) {

  switch (id) {
    case "vials": return <MixingVials label={label} />;
    case "pipettes": return <Pipette label={label} />;
    case "blotters": return <Blotters label={label} />;
    case "sprays": return <SprayBottle label={label} />;
    case "beaker": return <Beaker label={label} />;
    case "funnel": return <Funnel label={label} />;
    case "alcohol": return <AlcoholBottle label={label} />;
    case "cards": return <PaperItem kind="cards" label={label} />;
    case "journal": return <PaperItem kind="journal" label={label} />;
    case "guide": return <PaperItem kind="guide" label={label} />;
    case "qr": return <PaperItem kind="qr" label={label} />;
    default: return null;
  }
}
