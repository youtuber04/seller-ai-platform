// ---------- math / time helpers (everything is a function of t) ----------
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const E = {
  inOut: (k) => 0.5 - 0.5 * Math.cos(Math.PI * clamp(k)),
  out3: (k) => 1 - Math.pow(1 - clamp(k), 3),
  out5: (k) => 1 - Math.pow(1 - clamp(k), 5),
  in3: (k) => Math.pow(clamp(k), 3),
  backOut: (k, s = 1.8) => { k = clamp(k) - 1; return k * k * ((s + 1) * k + s) + 1; },
};
// closed-form damped spring 0 -> 1 (zeta < 1 overshoots)
function spring(t, zeta = 0.45, freq = 9) {
  if (t <= 0) return 0;
  const w = freq, wd = w * Math.sqrt(1 - zeta * zeta);
  return 1 - Math.exp(-zeta * w * t) * (Math.cos(wd * t) + (zeta * w / wd) * Math.sin(wd * t));
}
function rng(seed) { // mulberry32
  let a = seed >>> 0;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const noise1 = (t, seed = 1) => Math.sin(t * 1.7 + seed) * 0.6 + Math.sin(t * 3.1 + seed * 2.3) * 0.3 + Math.sin(t * 7.3 + seed * 4.1) * 0.1;
function blink(t, seed = 0, period = 3.3) { const p = (t + seed * 1.37) % period; return p < 0.12; }
const f2 = (v) => (Math.round(v * 100) / 100).toString();

// ---------- drawing primitives ----------
const OL = "#1b1b1f", LW = 6;
const P = (pts) => "M" + pts.map((p) => f2(p[0]) + "," + f2(p[1])).join(" L");
function limb(pts, w, color, ow = LW) {
  const d = P(pts);
  return `<path d="${d}" fill="none" stroke="${OL}" stroke-width="${w + ow * 2}" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
}
const g = (tr, body, extra = "") => `<g transform="${tr}" ${extra}>${body}</g>`;
const tf = (x, y, s = 1, r = 0) => `translate(${f2(x)},${f2(y)}) rotate(${f2(r)}) scale(${f2(s)})`;
function hand(x, y, r = 30, skin = SKIN) { return `<circle cx="${f2(x)}" cy="${f2(y)}" r="${r}" fill="${skin}" stroke="${OL}" stroke-width="${LW}"/>`; }
function star(x, y, r, fill = "#fff", rot = 0) {
  const pts = [];
  for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4 + rot; const rr = i % 2 ? r * 0.28 : r; pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]); }
  return `<path d="${P(pts)}Z" fill="${fill}"/>`;
}
function sweat(x, y, s = 1, o = 1) {
  return g(tf(x, y, s), `<path d="M0,-34 C10,-14 22,2 22,14 A22,22 0 1 1 -22,14 C-22,2 -10,-14 0,-34Z" fill="#8fd3ff" stroke="${OL}" stroke-width="5"/><ellipse cx="-7" cy="12" rx="5" ry="8" fill="#fff"/>`, `opacity="${o}"`);
}
function heart(x, y, s, fill = "#ff5d8f") {
  return g(tf(x, y, s), `<path d="M0,30 C-50,-5 -38,-48 0,-24 C38,-48 50,-5 0,30Z" fill="${fill}" stroke="${OL}" stroke-width="5"/><ellipse cx="-16" cy="-18" rx="7" ry="5" fill="#fff" opacity=".8"/>`);
}
function speedLines(cx, cy, t, n = 46, inner = 330, color = "#ffffff", op = 0.18, seed = 7) {
  const r = rng(seed + Math.floor(t * 12)); let s = "";
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + r() * 0.08; const r0 = inner + r() * 120; const w = 6 + r() * 16;
    const x0 = cx + Math.cos(a) * r0, y0 = cy + Math.sin(a) * r0, x1 = cx + Math.cos(a) * 1500, y1 = cy + Math.sin(a) * 1500;
    const nx = -Math.sin(a) * w, ny = Math.cos(a) * w;
    s += `<path d="M${f2(x0)},${f2(y0)} L${f2(x1 + nx)},${f2(y1 + ny)} L${f2(x1 - nx)},${f2(y1 - ny)}Z" fill="${color}" opacity="${op}"/>`;
  }
  return s;
}
function fxText(txt, x, y, lt, { size = 120, rot = -8, fill = "#ffe14d", stroke = OL, sw = 16 } = {}) {
  if (lt < 0) return "";
  const sc = 0.2 + 0.8 * spring(lt, 0.42, 14);
  const wob = Math.sin(lt * 5) * 2.5;
  return g(tf(x, y, sc, rot + wob), `<text class="fx" x="0" y="0" text-anchor="middle" dominant-baseline="middle" font-size="${size}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" paint-order="stroke" stroke-linejoin="round">${txt}</text>`);
}

// ---------- palette ----------
const SKIN = "#f7d3b5", SKIN_SH = "#e9b893", BLUSH = "#ff8f8f";
const H_HAIR = "#202026", TEE = "#b8bec8", TEE_SH = "#9aa1ad", PANTS = "#26355a";
const W_HAIR = "#4b3227", W_HAIR_HI = "#6e4b3a", PJ = "#f8b9ca", PJ_SH = "#e597ad";
const GRAY = { skin: "#c9c9cc", sh: "#ababaf", hair: "#5b5b60", tee: "#a7a7ab", teeSh: "#8e8e92" };

// ---------- husband ----------
// local origin = face centre; face ~ 320 px wide at s = 1
function hEyes(type, t, o = {}) {
  const ex = 64, ey = -10, c = o.gray ? "#3a3a3e" : OL;
  const both = (fn) => fn(-ex, -1) + fn(ex, 1);
  const lid = (x, y, w = 26) => `<path d="M${x - w},${y - 16} Q${x},${y - 30} ${x + w},${y - 16}" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`;
  switch (type) {
    case "closed": return both((x) => `<path d="M${x - 24},${ey} Q${x},${ey + 14} ${x + 24},${ey}" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`);
    case "happy": return both((x) => `<path d="M${x - 24},${ey + 6} Q${x},${ey - 20} ${x + 24},${ey + 6}" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`);
    case "shock": {
      const pr = o.pupil ?? 6, jx = o.jx || 0;
      return both((x) => `<circle cx="${x}" cy="${ey}" r="34" fill="#fff" stroke="${c}" stroke-width="6"/><circle cx="${x + jx}" cy="${ey + 2}" r="${pr}" fill="${c}"/>`);
    }
    case "sparkle": return both((x, sgn) => `<circle cx="${x}" cy="${ey}" r="30" fill="#2b2b36" stroke="${c}" stroke-width="5"/>` + star(x - 6, ey - 6, 17, "#fff", t * 3 * sgn) + `<circle cx="${x + 11}" cy="${ey + 12}" r="5" fill="#fff"/>`);
    case "blank": return both((x) => `<ellipse cx="${x}" cy="${ey}" rx="26" ry="20" fill="#fff" stroke="${c}" stroke-width="5"/>`);
    case "smug": return both((x, sgn) => `<path d="M${x - 26},${ey - 4} L${x + 26},${ey - 8 * sgn * 0 - 4}" stroke="${c}" stroke-width="7" stroke-linecap="round"/><ellipse cx="${x + 4}" cy="${ey + 6}" rx="10" ry="8" fill="${c}"/>`);
    case "squeeze": return both((x, sgn) => `<path d="M${x - 22 * sgn},${ey - 14} L${x + 18 * sgn},${ey} L${x - 22 * sgn},${ey + 14}" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`);
    case "determined": return both((x) => `<ellipse cx="${x}" cy="${ey + 2}" rx="10" ry="12" fill="${c}"/><circle cx="${x + 3}" cy="${ey - 2}" r="3" fill="#fff"/>`);
    case "cry": {
      let s = both((x) => `<path d="M${x - 26},${ey - 2} Q${x},${ey + 12} ${x + 26},${ey - 2}" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`);
      for (const x of [-ex, ex]) { // waterfall tears
        const k = (t * 3) % 1;
        s += `<path d="M${x - 16},${ey + 8} L${x + 16},${ey + 8} L${x + 22},${ey + 260} L${x - 22},${ey + 260}Z" fill="#9fdcff" stroke="${c}" stroke-width="4" opacity=".92"/>`;
        for (let i = 0; i < 3; i++) { const yy = ey + 30 + ((k + i / 3) % 1) * 220; s += `<path d="M${x - 8},${yy} L${x - 8},${yy + 26}" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`; }
      }
      return s;
    }
    case "side": return both((x) => lid(x, ey) + `<ellipse cx="${x + (o.look ?? 12)}" cy="${ey}" rx="10" ry="12" fill="${c}"/>`);
    default: // normal (+ blink)
      if (o.blinkNow) return hEyes("closed", t, o);
      return both((x) => lid(x, ey) + `<ellipse cx="${x + (o.look || 0)}" cy="${ey}" rx="10" ry="13" fill="${c}"/><circle cx="${x + 3 + (o.look || 0)}" cy="${ey - 4}" r="3.5" fill="#fff"/>`);
  }
}
function hBrows(mood, gray) {
  const c = gray ? GRAY.hair : H_HAIR;
  // [outer y, inner y]: inner lower = angry, inner higher = worried
  const m = { normal: [-60, -64], angry: [-80, -46], worried: [-54, -84], up: [-96, -100], smug: [-66, -78], sad: [-52, -86] }[mood] || [-60, -64];
  return limb([[-108, m[0]], [-38, m[1]]], 16, c, 3) + limb([[38, m[1]], [108, m[0]]], 16, c, 3);
}
function hMouth(type, open, t, gray) {
  const inside = gray ? "#4a4a4e" : "#7d2b2b", tongue = gray ? "#7a7a7e" : "#e46b6b", c = gray ? "#333" : OL;
  const y = 92;
  switch (type) {
    case "smile": return `<path d="M-40,${y - 6} Q0,${y + 28} 40,${y - 6}" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`;
    case "grin": {
      const o = 10 + open * 26;
      return `<path d="M-62,${y - 14} Q0,${y + 22 + o} 62,${y - 14} Q0,${y + 6} -62,${y - 14}Z" fill="#fff" stroke="${c}" stroke-width="6" stroke-linejoin="round"/>` +
        `<path d="M-44,${y - 2} L44,${y - 2}" stroke="${c}" stroke-width="3" opacity=".5"/>`;
    }
    case "flat": return `<path d="M-26,${y} L26,${y}" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`;
    case "wobble": { let d = `M-44,${y}`; for (let i = 1; i <= 8; i++) d += ` L${-44 + i * 11},${y + (i % 2 ? -8 : 8) + Math.sin(t * 30 + i) * 2}`; return `<path d="${d}" fill="none" stroke="${c}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>`; }
    case "O": { const r = 12 + open * 10; return `<ellipse cx="0" cy="${y}" rx="${r * 0.8}" ry="${r}" fill="${inside}" stroke="${c}" stroke-width="6"/>`; }
    case "puff": return `<ellipse cx="0" cy="${y}" rx="10" ry="6" fill="${inside}" stroke="${c}" stroke-width="5"/>`;
    case "yawn": { const ry = 18 + open * 46; return `<ellipse cx="0" cy="${y + 10}" rx="${34 + open * 8}" ry="${ry}" fill="${inside}" stroke="${c}" stroke-width="6"/><ellipse cx="0" cy="${y + 10 + ry * 0.55}" rx="${22}" ry="${ry * 0.3}" fill="${tongue}"/>`; }
    default: { // talk
      const ry = 4 + open * 30, rx = 30 + open * 6;
      if (open < 0.06) return `<path d="M-30,${y} Q0,${y + 10} 30,${y}" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`;
      return `<path d="M${-rx},${y - 4} Q0,${y - 10} ${rx},${y - 4} Q${rx * 0.9},${y + ry * 1.6} 0,${y + ry * 1.7} Q${-rx * 0.9},${y + ry * 1.6} ${-rx},${y - 4}Z" fill="${inside}" stroke="${c}" stroke-width="6" stroke-linejoin="round"/>` +
        (open > 0.3 ? `<ellipse cx="0" cy="${y + ry * 1.25}" rx="${rx * 0.55}" ry="${ry * 0.38}" fill="${tongue}"/>` : "");
    }
  }
}
function husbandHead(t, o = {}) {
  const gray = !!o.gray;
  const sk = gray ? GRAY.skin : SKIN, sh = gray ? GRAY.sh : SKIN_SH, hair = gray ? GRAY.hair : H_HAIR;
  // hairline points (buzz cut, slightly jagged)
  let hl = [];
  for (let i = 0; i <= 24; i++) { const x = 150 - i * 12.5; const y = -82 + Math.pow(x / 150, 2) * 52 + (i % 2 ? -5 : 4); hl.push([x, y]); }
  const hairPath = `M-156,-26 C-170,-196 170,-196 156,-26 L${P(hl).slice(1)} Z`;
  let s = "";
  s += `<ellipse cx="-158" cy="12" rx="24" ry="36" fill="${sk}" stroke="${OL}" stroke-width="${LW}"/><ellipse cx="158" cy="12" rx="24" ry="36" fill="${sk}" stroke="${OL}" stroke-width="${LW}"/>`;
  s += `<path d="M-156,-40 C-166,-178 166,-178 156,-40 C170,70 122,170 0,176 C-122,170 -170,70 -156,-40Z" fill="${sk}" stroke="${OL}" stroke-width="${LW}"/>`;
  s += `<path d="M-120,96 C-100,150 -60,168 0,170 C60,168 100,150 120,96 C110,160 60,182 0,184 C-60,182 -110,160 -120,96Z" fill="${sh}" opacity=".55"/>`;
  s += `<path d="M-72,158 Q0,196 72,158" fill="none" stroke="${OL}" stroke-width="4" opacity=".55"/>`;
  s += `<path d="${hairPath}" fill="${hair}" stroke="${OL}" stroke-width="${LW}" stroke-linejoin="round"/>`;
  s += `<path d="M-90,-150 Q-20,-178 70,-160" fill="none" stroke="#fff" stroke-width="7" opacity=".14" stroke-linecap="round"/>`;
  if (o.red) s += `<path d="M-156,-40 C-166,-178 166,-178 156,-40 C170,70 122,170 0,176 C-122,170 -170,70 -156,-40Z" fill="#ff3b3b" opacity="${o.red}"/>`;
  if (o.blush) s += `<ellipse cx="-98" cy="48" rx="34" ry="16" fill="${BLUSH}" opacity="${o.blush}"/><ellipse cx="98" cy="48" rx="34" ry="16" fill="${BLUSH}" opacity="${o.blush}"/>`;
  if (o.puff) s += `<ellipse cx="-104" cy="64" rx="${40 * o.puff}" ry="${36 * o.puff}" fill="${sk}" stroke="${OL}" stroke-width="5"/><ellipse cx="104" cy="64" rx="${40 * o.puff}" ry="${36 * o.puff}" fill="${sk}" stroke="${OL}" stroke-width="5"/>`;
  s += hBrows(o.brows || "normal", gray);
  s += hEyes(o.eyes || "normal", t, { ...o, blinkNow: (o.eyes || "normal") === "normal" && blink(t, o.seed || 0) });
  s += `<path d="M-6,22 Q-16,46 2,50 Q16,48 12,38" fill="none" stroke="${gray ? "#555" : OL}" stroke-width="5" stroke-linecap="round"/>`;
  s += hMouth(o.mouth || "talk", o.open || 0, t, gray);
  if (o.vein) s += g(tf(96, -112, o.vein), `<path d="M-18,-4 Q-6,-6 -4,-18 M4,-18 Q6,-6 18,-4 M18,4 Q6,6 4,18 M-4,18 Q-6,6 -18,4" fill="none" stroke="#e8343c" stroke-width="7" stroke-linecap="round"/>`);
  if (o.crack) s += `<path d="M-30,-168 L-14,-130 L-36,-104 L-10,-70" fill="none" stroke="#2a2a2e" stroke-width="5" stroke-linejoin="round"/>`;
  return s;
}
// torso + neck (local: face centre at 0,0); w = belly factor
function husbandTorso(o = {}) {
  const gray = !!o.gray; const tee = gray ? GRAY.tee : TEE, tsh = gray ? GRAY.teeSh : TEE_SH, sk = gray ? GRAY.skin : SKIN;
  const b = o.belly ?? 1; // 1 = normal, <1 sucked in
  const bw = 300 * b;
  let s = `<path d="M-60,150 L-62,215 L62,215 L60,150Z" fill="${sk}" stroke="${OL}" stroke-width="${LW}"/>`;
  s += `<path d="M-250,330 C-240,240 -150,206 -74,198 Q0,232 74,198 C150,206 240,240 250,330 C${bw + 20},520 ${bw + 10},760 ${bw - 20},${o.hem ?? 980} L${-bw + 20},${o.hem ?? 980} C${-bw - 10},760 ${-bw - 20},520 -250,330Z" fill="${tee}" stroke="${OL}" stroke-width="${LW}" stroke-linejoin="round"/>`;
  s += `<path d="M-74,198 Q0,250 74,198" fill="none" stroke="${OL}" stroke-width="${LW}"/>`;
  s += `<path d="M-250,330 C-246,276 -226,248 -196,236 C-226,330 -240,430 -250,520 L-${bw - 40},560 C-${bw - 50},470 -${bw - 70},400 -250,330Z" fill="${tsh}" opacity=".55"/>`;
  for (const m of [-1, 1]) s += `<path d="M${m * 200},238 C${m * 282},262 ${m * 318},330 ${m * 330},440 L${m * 236},462 C${m * 232},380 ${m * 222},300 ${m * 200},238Z" fill="${tee}" stroke="${OL}" stroke-width="${LW}" stroke-linejoin="round"/>`;
  s += `<path d="M-40,200 Q0,236 40,200 L40,214 Q0,250 -40,214Z" fill="${tsh}" opacity=".6"/>`;
  s += `<path d="M${-bw * 0.7},620 Q0,${700 + 40 * b} ${bw * 0.7},620" fill="none" stroke="${tsh}" stroke-width="10" opacity=".8"/>`;
  s += `<path d="M${bw - 60},420 C${bw - 20},560 ${bw - 30},720 ${bw - 70},900" fill="none" stroke="${tsh}" stroke-width="16" opacity=".6"/>`;
  return s;
}

// ---------- wife ----------
function wEyes(type, t, o = {}) {
  const ex = 52, ey = 2;
  const both = (fn) => fn(-ex, -1) + fn(ex, 1);
  const lash = (x, sgn, y = ey) => `<path d="M${x - 28 * sgn},${y - 4} Q${x},${y - 26} ${x + 28 * sgn},${y - 10} L${x + 34 * sgn},${y - 18}" fill="none" stroke="${OL}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
  switch (type) {
    case "closed": return both((x, s) => `<path d="M${x - 26},${ey} Q${x},${ey + 14} ${x + 26},${ey}" fill="none" stroke="${OL}" stroke-width="6" stroke-linecap="round"/><path d="M${x + 26 * s},${ey} l${8 * s},6" stroke="${OL}" stroke-width="4"/>`);
    case "happy": return both((x) => `<path d="M${x - 26},${ey + 8} Q${x},${ey - 18} ${x + 26},${ey + 8}" fill="none" stroke="${OL}" stroke-width="7" stroke-linecap="round"/>`);
    case "half": return both((x, s) => `<ellipse cx="${x + (o.look ?? 8)}" cy="${ey + 6}" rx="13" ry="12" fill="#3a2419"/><circle cx="${x + 4 + (o.look ?? 8)}" cy="${ey + 2}" r="3.5" fill="#fff"/><path d="M${x - 28},${ey - 2} Q${x},${ey - 8} ${x + 30},${ey - 2}" fill="none" stroke="${OL}" stroke-width="8" stroke-linecap="round"/>`);
    case "squint": return both((x, s) => `<path d="M${x - 28},${ey - 2} L${x + 28},${ey - 6 * s * 0 - 2}" stroke="${OL}" stroke-width="8" stroke-linecap="round"/><ellipse cx="${x + (o.look ?? 0)}" cy="${ey + 6}" rx="10" ry="7" fill="#3a2419"/><path d="M${x - 22},${ey + 14} L${x + 22},${ey + 12}" stroke="${OL}" stroke-width="4" stroke-linecap="round"/>`);
    case "sharp": return both((x, s) => `<path d="M${x - 28 * s},${ey + 6} Q${x},${ey - 14} ${x + 30 * s},${ey - 14}" fill="none" stroke="${OL}" stroke-width="8" stroke-linecap="round"/><ellipse cx="${x}" cy="${ey + 6}" rx="12" ry="14" fill="#3a2419"/><circle cx="${x + 4}" cy="${ey}" r="3.5" fill="#fff"/>`);
    default:
      if (o.blinkNow) return wEyes("closed", t, o);
      return both((x, s) => `<ellipse cx="${x + (o.look || 0)}" cy="${ey + 4}" rx="14" ry="18" fill="#3a2419"/><circle cx="${x + 5 + (o.look || 0)}" cy="${ey - 2}" r="5" fill="#fff"/>` + lash(x, s));
  }
}
function wMouth(type, open) {
  const y = 86;
  switch (type) {
    case "smile": return `<path d="M-22,${y - 4} Q0,${y + 14} 22,${y - 4}" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`;
    case "smirk": return `<path d="M-18,${y + 2} Q6,${y + 6} 22,${y - 8}" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`;
    case "flat": return `<path d="M-16,${y} L16,${y}" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`;
    case "sniff": return `<path d="M-10,${y} Q0,${y - 6} 10,${y}" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`;
    default: {
      if (open < 0.06) return o_closed(y, type === "talkSmile");
      const ry = 3 + open * 17, rx = 14 + open * 5;
      return `<path d="M${-rx},${y - 2} Q0,${y - 6} ${rx},${y - 2} Q${rx * 0.8},${y + ry * 1.5} 0,${y + ry * 1.6} Q${-rx * 0.8},${y + ry * 1.5} ${-rx},${y - 2}Z" fill="#8a2e3b" stroke="${OL}" stroke-width="5" stroke-linejoin="round"/>` +
        (open > 0.35 ? `<ellipse cx="0" cy="${y + ry * 1.2}" rx="${rx * 0.5}" ry="${ry * 0.35}" fill="#ef7b86"/>` : "");
    }
  }
  function o_closed(y, smile) { return smile ? `<path d="M-20,${y - 2} Q0,${y + 10} 20,${y - 2}" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>` : `<path d="M-16,${y} Q0,${y + 4} 16,${y}" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`; }
}
function wifeBackHair() {
  return `<path d="M-150,-30 C-190,-210 190,-210 150,-30 C172,60 160,150 120,190 L-120,190 C-160,150 -172,60 -150,-30Z" fill="${W_HAIR}" stroke="${OL}" stroke-width="${LW}"/>`;
}
function wifePonytail(t) {
  const sw = Math.sin(t * 2.2) * 4;
  return `<path d="M108,112 C${170 + sw},150 ${190 + sw},260 ${150 + sw},360 C${132 + sw},300 ${118},220 92,150Z" fill="${W_HAIR}" stroke="${OL}" stroke-width="${LW}" stroke-linejoin="round"/>` +
    `<path d="M${136 + sw * 0.5},180 C${158 + sw},240 ${156 + sw},290 ${148 + sw},330" fill="none" stroke="${W_HAIR_HI}" stroke-width="6" stroke-linecap="round"/>` +
    `<ellipse cx="108" cy="126" rx="18" ry="14" fill="#e84d7a" stroke="${OL}" stroke-width="5"/>`;
}
function wifeHead(t, o = {}) {
  let s = wifeBackHair();
  if (o.pony !== false) s += wifePonytail(t);
  s += `<path d="M-122,-36 C-130,-150 130,-150 122,-36 C120,56 74,140 0,152 C-74,140 -120,56 -122,-36Z" fill="${SKIN}" stroke="${OL}" stroke-width="${LW}"/>`;
  s += `<path d="M-80,122 C-50,146 50,146 80,122 C60,150 30,158 0,160 C-30,158 -60,150 -80,122Z" fill="${SKIN_SH}" opacity=".5"/>`;
  if (o.blush) s += `<ellipse cx="-74" cy="54" rx="30" ry="13" fill="${BLUSH}" opacity="${o.blush}"/><ellipse cx="74" cy="54" rx="30" ry="13" fill="${BLUSH}" opacity="${o.blush}"/>` +
    [-90, -78, -66].map((x) => `<path d="M${x},44 l-6,16" stroke="#e55" stroke-width="3" opacity="${o.blush}"/>`).join("") + [62, 74, 86].map((x) => `<path d="M${x},44 l-6,16" stroke="#e55" stroke-width="3" opacity="${o.blush}"/>`).join("");
  // bangs (side swept) + top
  s += `<path d="M-132,-20 C-150,-170 120,-196 146,-60 C150,-30 140,0 128,20 C118,-20 96,-60 60,-84 C30,-40 -20,-20 -70,-14 C-40,-36 -20,-60 -10,-86 C-50,-50 -100,-30 -132,-20Z" fill="${W_HAIR}" stroke="${OL}" stroke-width="${LW}" stroke-linejoin="round"/>`;
  s += `<path d="M-60,-150 Q10,-176 90,-140" fill="none" stroke="${W_HAIR_HI}" stroke-width="9" stroke-linecap="round"/>`;
  s += `<path d="M-130,-10 C-140,40 -134,90 -118,130" fill="none" stroke="${W_HAIR}" stroke-width="18" stroke-linecap="round"/>`;
  const br = o.brows || "normal";
  const by = { normal: [-52, -60], angry: [-46, -64], up: [-70, -76], worried: [-60, -48], flat: [-54, -54] }[br];
  s += `<path d="M-84,${by[0]} Q-56,${by[1] - 6} -26,${by[1]}" fill="none" stroke="${W_HAIR}" stroke-width="7" stroke-linecap="round"/><path d="M84,${by[0]} Q56,${by[1] - 6} 26,${by[1]}" fill="none" stroke="${W_HAIR}" stroke-width="7" stroke-linecap="round"/>`;
  const et = o.eyes || "normal";
  s += wEyes(et, t, { ...o, blinkNow: et === "normal" && blink(t, (o.seed || 0) + 1.1, 3.6) });
  s += `<path d="M-2,30 Q-8,48 4,52" fill="none" stroke="${OL}" stroke-width="4" stroke-linecap="round"/>`;
  s += wMouth(o.mouth || "talk", o.open || 0);
  if (o.glasses) {
    const glare = o.glare || 0;
    for (const x of [-52, 52]) {
      s += `<rect x="${x - 44}" y="-28" width="88" height="62" rx="18" fill="rgba(220,240,255,${0.12 + glare * 0.86})" stroke="#2a2a30" stroke-width="5"/>`;
      if (o.shine !== undefined) { const k = o.shine; s += `<path d="M${x - 44 + k * 120},-28 l-30,62 l14,0 l30,-62Z" fill="#fff" opacity="${0.85 * Math.sin(Math.PI * clamp(k))}"/>`; }
    }
    s += `<path d="M-8,-4 Q0,-12 8,-4" fill="none" stroke="#2a2a30" stroke-width="5"/>`;
  }
  return s;
}
function wifeTorso(o = {}) {
  let s = `<path d="M-46,136 L-48,200 L48,200 L46,136Z" fill="${SKIN}" stroke="${OL}" stroke-width="${LW}"/>`;
  s += `<path d="M-200,320 C-190,240 -120,206 -60,196 L0,300 L60,196 C120,206 190,240 200,320 L232,980 L-232,980Z" fill="${PJ}" stroke="${OL}" stroke-width="${LW}" stroke-linejoin="round"/>`;
  s += `<path d="M-60,196 L-20,250 L-74,262 Z M60,196 L20,250 L74,262Z" fill="#fff" stroke="${OL}" stroke-width="5" stroke-linejoin="round"/>`;
  s += `<path d="M0,300 L0,980" stroke="${PJ_SH}" stroke-width="6"/>` + [380, 500, 620].map((y) => `<circle cx="14" cy="${y}" r="9" fill="#fff" stroke="${OL}" stroke-width="4"/>`).join("");
  s += `<rect x="-150" y="420" width="70" height="60" rx="8" fill="none" stroke="${PJ_SH}" stroke-width="5"/>`;
  for (const m of [-1, 1]) s += `<path d="M${m * 150},226 C${m * 226},246 ${m * 250},320 ${m * 258},420 L${m * 190},432 C${m * 186},350 ${m * 174},280 ${m * 150},226Z" fill="${PJ_SH}" stroke="${OL}" stroke-width="5" stroke-linejoin="round"/>`;
  return s;
}

// ---------- props ----------
function toothbrush(x, y, r) { return g(tf(x, y, 1, r), `<rect x="-14" y="-10" width="210" height="24" rx="12" fill="#4f8cff" stroke="${OL}" stroke-width="5"/><rect x="-34" y="-34" width="46" height="26" rx="6" fill="#fff" stroke="${OL}" stroke-width="5"/>`); }
function bottle(x, y, s, body = "#2ec4b6", cap = "#fff") { return g(tf(x, y, s), `<rect x="-44" y="-70" width="88" height="170" rx="22" fill="${body}" stroke="${OL}" stroke-width="6"/><rect x="-26" y="-108" width="52" height="42" rx="8" fill="${cap}" stroke="${OL}" stroke-width="6"/><rect x="-30" y="-20" width="60" height="60" rx="8" fill="#fff" opacity=".7"/><path d="M-30,-50 L-30,60" stroke="#fff" stroke-width="8" opacity=".5" stroke-linecap="round"/>`); }
function perfume(x, y, s, r = 0) { return g(tf(x, y, s, r), `<rect x="-58" y="-60" width="116" height="130" rx="30" fill="rgba(255,190,220,.85)" stroke="${OL}" stroke-width="6"/><rect x="-14" y="-96" width="28" height="40" fill="#d4a24c" stroke="${OL}" stroke-width="5"/><rect x="-26" y="-124" width="52" height="32" rx="10" fill="#ff6fa5" stroke="${OL}" stroke-width="5"/><path d="M-36,-34 L-36,40" stroke="#fff" stroke-width="10" opacity=".6" stroke-linecap="round"/>`); }
function calculator(x, y, s, r = 0, lit = -1) {
  let keys = ""; let k = 0;
  for (let j = 0; j < 4; j++) for (let i = 0; i < 3; i++) { keys += `<rect x="${-48 + i * 34}" y="${-10 + j * 30}" width="26" height="22" rx="5" fill="${k === lit ? "#ffd84d" : "#e9e9ef"}" stroke="${OL}" stroke-width="3"/>`; k++; }
  return g(tf(x, y, s, r), `<rect x="-62" y="-90" width="124" height="210" rx="16" fill="#3b3f4c" stroke="${OL}" stroke-width="6"/><rect x="-48" y="-74" width="96" height="48" rx="6" fill="#bfe3b0" stroke="${OL}" stroke-width="4"/><text x="40" y="-38" text-anchor="end" font-family="DoHyeon" font-size="34" fill="#2c4a2a">₩₩₩</text>` + keys);
}
function receipt(x, y, w, h, r = 0, seed = 3) {
  const rr = rng(seed); let lines = ""; const n = Math.floor((h - 40) / 26);
  for (let i = 0; i < n; i++) { const lw = w * (0.35 + rr() * 0.45); lines += `<rect x="${-w / 2 + 16}" y="${22 + i * 26}" width="${lw}" height="9" rx="4" fill="#9aa0aa"/><rect x="${w / 2 - 16 - 44}" y="${22 + i * 26}" width="44" height="9" rx="4" fill="#c2464f"/>`; }
  let zig = `M${-w / 2},0 L${w / 2},0 L${w / 2},${h}`; for (let i = 0; i <= 10; i++) zig += ` L${w / 2 - (i * w) / 10},${h + (i % 2 ? 14 : 0)}`; zig += "Z";
  return g(tf(x, y, 1, r), `<path d="${zig}" fill="#fffdf6" stroke="${OL}" stroke-width="5" stroke-linejoin="round"/>` + lines);
}
function mist(x, y, k, seed) { // one perfume puff: k = 0..1 life
  if (k <= 0 || k >= 1) return "";
  const r = rng(seed); let s = "";
  for (let i = 0; i < 9; i++) {
    const a = r() * Math.PI * 2, d = 40 + r() * 150 * E.out3(k), rr = 40 + r() * 70 * (0.5 + k);
    s += `<circle cx="${f2(x + Math.cos(a) * d)}" cy="${f2(y + Math.sin(a) * d * 0.7 - k * 60)}" r="${f2(rr)}" fill="#fff" opacity="${f2(0.3 * (1 - k))}"/>`;
  }
  return s;
}
function petal(x, y, s, r, fill = "#ff9fc3") { return g(tf(x, y, s, r), `<path d="M0,-18 C14,-14 14,10 0,18 C-14,10 -14,-14 0,-18Z" fill="${fill}" stroke="${OL}" stroke-width="3"/>`); }
