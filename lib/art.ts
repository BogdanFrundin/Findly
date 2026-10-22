// SVG illustrations used until real product photos come from partner feeds.
import type { Shape } from "./types";

const SH: Record<Shape, { d: string; x: string }> = {
  pants: { d: "M98 62h104l4 18 30 286h-74l-12-210-12 210H64L94 80z", x: '<path d="M96 80h108M150 84v64M120 82c4 18 18 26 30 26" class="st"/>' },
  straight: { d: "M104 62h92l3 18 14 286h-56l-7-214-7 214H87l14-286z", x: '<path d="M101 80h98M150 84v64" class="st"/>' },
  trousers: { d: "M100 62h100l3 18 22 286h-66l-9-212-9 212H75l22-286z", x: '<path d="M98 80h104M128 86l-6 270M172 86l6 270" class="st"/>' },
  dress: { d: "M118 46h64l10 34-6 66 58 220H56l58-220-6-66z", x: '<path d="M126 46l-3-26M174 46l3-26M108 146h84M150 150l-6 214" class="st"/>' },
  sheath: { d: "M116 46h68l10 36-8 70 12 214H102l12-214-8-70z", x: '<path d="M124 46l-3-26M176 46l3-26M106 152h88" class="st"/>' },
  slip: { d: "M112 52l38 32 38-32 6 94 44 220H62l44-220z", x: '<path d="M114 52l-2-30M186 52l2-30M108 146c28 6 56 6 84 0" class="st"/>' },
  coat: { d: "M112 44h76l14 6 44 34 18 176-28 6-14-120 4 230H80l4-230-14 120-28-6 18-176 44-34z", x: '<path d="M126 46l24 74 24-74M150 120v246" class="st"/><rect x="82" y="196" width="136" height="12" class="dk"/><circle cx="136" cy="160" r="3" class="dk"/><circle cx="164" cy="160" r="3" class="dk"/><circle cx="136" cy="236" r="3" class="dk"/><circle cx="164" cy="236" r="3" class="dk"/>' },
  blazer: { d: "M112 52h76l14 6 40 30 16 150-26 6-12-100 2 150H84l2-150-12 100-26-6 16-150 40-30z", x: '<path d="M128 54l22 64 22-64M150 118v176M100 230h28M172 230h28" class="st"/><circle cx="140" cy="200" r="3" class="dk"/><circle cx="160" cy="200" r="3" class="dk"/>' },
  sweater: { d: "M112 64c10 10 66 10 76 0l58 28 22 172-30 8-14-110v148H76V162l-14 110-30-8 22-172z", x: '<path d="M112 64c10 14 66 14 76 0M76 296h148M34 258l30 8M236 266l30-8" class="st"/>' },
  blouse: { d: "M112 64c10 6 66 6 76 0l58 28 22 172-30 8-14-110v148H76V162l-14 110-30-8 22-172z", x: '<path d="M126 62l24 34 24-34M150 96v204" class="st"/><circle cx="150" cy="130" r="2.5" class="dk"/><circle cx="150" cy="170" r="2.5" class="dk"/><circle cx="150" cy="210" r="2.5" class="dk"/><circle cx="150" cy="250" r="2.5" class="dk"/>' },
  top: { d: "M116 96c12-6 56-6 68 0l16 200H100z", x: '<path d="M122 96l6-48M178 96l-6-48M116 96c12 10 56 10 68 0" class="st"/>' },
  skirt: { d: "M112 96h76l42 250H70z", x: '<path d="M112 110h76M128 112l-18 232M150 112v232M172 112l18 232" class="st"/>' },
  loafer: { d: "M40 266c4-30 36-44 74-42l92-6c30-2 54 14 58 40v18H40z", x: '<path d="M40 286h224v8H40z" class="dk"/><path d="M146 228c10 12 34 12 46 0M150 240h38" class="st"/>' },
  sneaker: { d: "M38 262c2-26 24-44 58-42 30 2 46 14 70 14 40 0 78 4 96 28v16H38z", x: '<path d="M36 276h228v16H36z" class="lt"/><path d="M96 232l26 30M118 230l22 30M140 236l18 24M170 246c26 0 56 4 78 14" class="st"/>' },
  bag: { d: "M80 170h140l18 190H62z", x: '<path d="M118 172c0-64 64-64 64 0M80 196h140" class="st w"/><rect x="138" y="198" width="24" height="14" class="lt"/>' },
  scarf: { d: "M122 40h56l-4 220 26 100h-42l-8-80-8 80h-42l26-100z", x: '<path d="M126 60h48M126 80h48M104 360v14M114 360v14M124 360v14M176 360v14M186 360v14M196 360v14" class="st"/>' },
};

export function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt)));
  return "#" + [n >> 16, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, "0")).join("");
}

export function gpaths(shape: Shape, tone: string) {
  const s = SH[shape] || SH.pants, dk = shade(tone, -0.28), lt = shade(tone, 0.35), st = shade(tone, -0.38);
  const x = s.x.replace(/class="dk"/g, `fill="${dk}" stroke="none"`).replace(/class="lt"/g, `fill="${lt}" stroke="none"`)
    .replace(/class="st w"/g, 'stroke-width="6" stroke-opacity="1"').replace(/class="st"/g, "");
  return `<g filter="url(#drop)"><path d="${s.d}" fill="${tone}"/></g><path d="${s.d}" fill="url(#shd)"/><path d="${s.d}" fill="url(#vshd)"/><g fill="none" stroke="${st}" stroke-width="1.4" stroke-linecap="round" stroke-opacity=".55">${x}</g>`;
}

export function garmentSvg(shape: Shape, tone: string, { floor = true, scale = 1, dy = 0 } = {}) {
  const tf = `translate(${150 - 150 * scale} ${200 - 200 * scale + dy}) scale(${scale})`;
  return `<svg viewBox="0 0 300 400" aria-hidden="true">${floor ? '<ellipse cx="150" cy="378" rx="110" ry="10" fill="url(#floor)"/>' : ""}<g transform="${tf}">${gpaths(shape, tone)}</g></svg>`;
}

export function boutique(v: number) {
  const W = [["#2b1a16", "#4a2b26"], ["#32201b", "#5a2a30"], ["#271916", "#3d2a22"]][v];
  const id = "bq" + v;
  let s = `<svg viewBox="0 0 390 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>
    <linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${W[0]}"/><stop offset="1" stop-color="${W[1]}"/></linearGradient>
    <linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e7c99a" stop-opacity=".55"/><stop offset="1" stop-color="#8a5a45" stop-opacity=".15"/></linearGradient>
    <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a3a2e"/><stop offset="1" stop-color="#1e1310"/></linearGradient></defs>
    <rect width="390" height="700" fill="url(#${id}w)"/>`;
  const arch = (x: number, w: number, top: number, bot: number) =>
    `<path d="M${x} ${bot}V${top + w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0V${bot}z" fill="url(#${id}a)"/><path d="M${x} ${bot}V${top + w / 2}a${w / 2} ${w / 2} 0 0 1 ${w} 0V${bot}" fill="none" stroke="#c6a779" stroke-opacity=".45" stroke-width="1.2"/>`;
  const lamp = (x: number, y: number) =>
    `<line x1="${x}" y1="0" x2="${x}" y2="${y}" stroke="#c6a779" stroke-opacity=".6"/><circle cx="${x}" cy="${y + 6}" r="60" fill="url(#glow)" opacity=".55"/><circle cx="${x}" cy="${y + 6}" r="7" fill="#f6dfb4"/>`;
  if (v === 0) {
    s += arch(30, 120, 90, 470) + arch(240, 120, 90, 470) + lamp(195, 120);
    s += `<rect x="0" y="470" width="390" height="230" fill="url(#${id}f)"/>`;
    s += `<line x1="58" y1="300" x2="332" y2="300" stroke="#c6a779" stroke-width="2.5"/><line x1="70" y1="300" x2="70" y2="470" stroke="#c6a779" stroke-width="2"/><line x1="320" y1="300" x2="320" y2="470" stroke="#c6a779" stroke-width="2"/>`;
    ([["coat", "#c6ab84"], ["dress", "#5a2230"], ["blazer", "#2f2c2b"], ["blouse", "#efe8db"], ["coat", "#a67c51"], ["slip", "#3b3431"]] as [Shape, string][]).forEach(([sh, t], i) => {
      const x = 82 + i * 46;
      s += `<path d="M${x + 20} 300c0-8 6-8 6-12" fill="none" stroke="#c6a779" stroke-width="1.4"/><g transform="translate(${x - 4} 296) scale(.17 .4)">${gpaths(sh, t)}</g>`;
    });
    s += `<ellipse cx="195" cy="600" rx="70" ry="14" fill="#c6a779" opacity=".35"/><rect x="125" y="560" width="140" height="40" fill="#6e2736"/><ellipse cx="195" cy="560" rx="70" ry="14" fill="#7d3242"/><g transform="translate(160 480) scale(.25)">${gpaths("bag", "#e8d6b8")}</g>`;
  } else if (v === 1) {
    s += arch(115, 160, 60, 500) + lamp(80, 90) + lamp(310, 90);
    s += `<rect x="0" y="500" width="390" height="200" fill="url(#${id}f)"/><rect x="20" y="170" width="70" height="300" fill="none" stroke="#c6a779" stroke-opacity=".5"/><rect x="300" y="170" width="70" height="300" fill="none" stroke="#c6a779" stroke-opacity=".5"/>`;
    s += `<line x1="195" y1="470" x2="195" y2="520" stroke="#c6a779" stroke-width="2"/><ellipse cx="195" cy="522" rx="34" ry="6" fill="#c6a779" opacity=".7"/>`;
    s += `<g transform="translate(108 200) scale(.58)">${gpaths("coat", "#c8ad86")}</g><path d="M182 202c0-18 26-18 26 0" fill="#d9bfa5"/>`;
    s += `<g transform="translate(14 420) scale(.22)">${gpaths("loafer", "#1f1c1b")}</g><g transform="translate(296 400) scale(.26)">${gpaths("bag", "#5a2230")}</g>`;
  } else {
    s += arch(40, 310, 40, 520) + lamp(195, 70);
    s += `<rect x="0" y="520" width="390" height="180" fill="url(#${id}f)"/>`;
    [200, 290, 380].forEach((y) => { s += `<line x1="70" y1="${y}" x2="320" y2="${y}" stroke="#c6a779" stroke-width="2"/>`; });
    ([["#5a2230", 90], ["#e8d6b8", 170], ["#24201f", 250]] as [string, number][]).forEach(([t, x]) => { s += `<g transform="translate(${x - 30} 118) scale(.27)">${gpaths("bag", t)}</g>`; });
    ([["loafer", "#1f1c1b", 80], ["sneaker", "#f2eee7", 165], ["loafer", "#6e2736", 250]] as [Shape, string, number][]).forEach(([sh, t, x]) => { s += `<g transform="translate(${x - 14} 200) scale(.26)">${gpaths(sh, t)}</g>`; });
    ([["scarf", "#b88f66", 95], ["top", "#e9ddcc", 170], ["scarf", "#5a2230", 250]] as [Shape, string, number][]).forEach(([sh, t, x]) => { s += `<g transform="translate(${x - 12} 290) scale(.22 .24)">${gpaths(sh, t)}</g>`; });
  }
  return s + `<rect width="390" height="700" fill="#000" opacity=".08"/></svg>`;
}

export function streetFigure() {
  return `<svg viewBox="0 0 300 466" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="300" height="466" fill="url(#street)"/><rect x="0" y="40" width="70" height="250" fill="#a69886" opacity=".5"/><rect x="232" y="20" width="80" height="270" fill="#a69886" opacity=".45"/>
    <ellipse cx="150" cy="452" rx="80" ry="8" fill="#000" opacity=".18"/>
    <path d="M112 320h76l18 128h-42l-14-96-14 96H94z" fill="#2f2b29"/><path d="M94 448h40v6H92zM166 448h40v6h-42z" fill="#161413"/>
    <path d="M124 92c4-30 48-30 52 0 2 14-4 26-12 30h-28c-8-4-14-16-12-30z" fill="#d6b498"/><path d="M122 92c-2-28 56-34 58-2-4-10-20-16-30-12-10-6-24 2-28 14z" fill="#3a2a20"/>
    <rect x="142" y="118" width="16" height="12" fill="#c9a589"/>
    <path d="M118 128h64l10 6 34 30 14 150-22 4-10-96 2 128H90l2-128-10 96-22-4 14-150 34-30z" fill="#c8ad86"/><path d="M118 128h64l10 6 34 30 14 150-22 4-10-96 2 128H90l2-128-10 96-22-4 14-150 34-30z" fill="url(#shd)"/>
    <path d="M130 130l20 58 20-58M150 188v158" stroke="#8d7552" stroke-width="1.4" fill="none" opacity=".7"/><rect x="92" y="236" width="116" height="9" fill="#a58c66"/>
    <path d="M200 148L232 226" stroke="#1d1a19" stroke-width="2.5"/><path d="M212 222h44l7 72h-58z" fill="#5a2230"/><path d="M212 222h44l7 72h-58z" fill="url(#shd)"/></svg>`;
}
