// ---------- backgrounds ----------
function bgNight(t, { window: win = true, beam = true } = {}) {
  let s = `<rect width="1080" height="1920" fill="url(#gNightWall)"/>`;
  if (win) {
    s += `<rect x="90" y="300" width="420" height="520" rx="10" fill="url(#gNightSky)" stroke="#191633" stroke-width="16"/>`;
    const r = rng(11);
    for (let i = 0; i < 16; i++) { const x = 110 + r() * 380, y = 320 + r() * 300, tw = 0.5 + 0.5 * Math.sin(t * 2 + i); s += star(x, y, 4 + r() * 5, "#fff", 0).replace("<path", `<path opacity="${f2(0.4 + 0.6 * tw)}"`); }
    s += `<circle cx="400" cy="420" r="120" fill="#fff6d0" opacity=".12"/><circle cx="400" cy="420" r="62" fill="#fff4cf"/><circle cx="380" cy="405" r="12" fill="#efe2b5"/><circle cx="420" cy="440" r="8" fill="#efe2b5"/>`;
    s += `<path d="M300,300 L300,820 M90,560 L510,560" stroke="#191633" stroke-width="12"/>`;
    s += `<path d="M40,250 C120,420 60,700 120,880 L20,880 L20,250Z" fill="#3c2f63" stroke="${OL}" stroke-width="5"/><path d="M560,250 C480,420 540,700 480,880 L580,880 L580,250Z" fill="#3c2f63" stroke="${OL}" stroke-width="5"/>`;
    if (beam) s += `<path d="M110,820 L500,820 L1080,1500 L560,1500Z" fill="#cfd8ff" opacity=".07"/>`;
  }
  return s;
}
function bgWarm(t, { lamp = [930, 930], clock = false } = {}) {
  let s = `<rect width="1080" height="1920" fill="url(#gWarmWall)"/>`;
  s += `<rect x="70" y="420" width="300" height="400" rx="8" fill="#1e2440" stroke="#3a2a20" stroke-width="16"/><path d="M220,420 L220,820" stroke="#3a2a20" stroke-width="10"/>`;
  s += `<path d="M40,380 C110,520 70,760 120,880 L30,880 L30,380Z M400,380 C330,520 370,760 320,880 L410,880 L410,380Z" fill="#a8574a" stroke="${OL}" stroke-width="5"/>`;
  s += `<rect x="640" y="440" width="190" height="150" rx="6" fill="#e9d8b6" stroke="#6b4a33" stroke-width="12"/><path d="M660,570 L720,500 L760,540 L790,510 L815,570Z" fill="#7aa36c"/>`;
  if (clock) s += clockFace(540, 470, 92, 2, 0);
  const [lx, ly] = lamp;
  s += `<circle cx="${lx}" cy="${ly}" r="420" fill="url(#gLampGlow)"/>`;
  s += `<rect x="${lx - 110}" y="${ly + 120}" width="220" height="300" fill="#6b4a33" stroke="${OL}" stroke-width="6"/>`;
  s += `<rect x="${lx - 14}" y="${ly + 10}" width="28" height="112" fill="#c9a26b" stroke="${OL}" stroke-width="5"/><path d="M${lx - 90},${ly + 20} L${lx - 56},${ly - 90} L${lx + 56},${ly - 90} L${lx + 90},${ly + 20}Z" fill="#ffe2a3" stroke="${OL}" stroke-width="6"/>`;
  return s;
}
function clockFace(x, y, r, h, m) {
  const ha = ((h % 12) / 12 + m / 720) * Math.PI * 2, ma = (m / 60) * Math.PI * 2;
  let ticks = ""; for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; ticks += `<path d="M${f2(x + Math.sin(a) * r * 0.78)},${f2(y - Math.cos(a) * r * 0.78)} L${f2(x + Math.sin(a) * r * 0.9)},${f2(y - Math.cos(a) * r * 0.9)}" stroke="#333" stroke-width="5"/>`; }
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fbf6ea" stroke="${OL}" stroke-width="8"/>` + ticks +
    `<path d="M${x},${y} L${f2(x + Math.sin(ha) * r * 0.48)},${f2(y - Math.cos(ha) * r * 0.48)}" stroke="#222" stroke-width="9" stroke-linecap="round"/>` +
    `<path d="M${x},${y} L${f2(x + Math.sin(ma) * r * 0.72)},${f2(y - Math.cos(ma) * r * 0.72)}" stroke="#222" stroke-width="6" stroke-linecap="round"/><circle cx="${x}" cy="${y}" r="8" fill="#c33"/>`;
}
function bgBath(t) {
  let s = `<rect width="1080" height="1920" fill="#eef3f6"/>`;
  for (let x = 0; x <= 1080; x += 120) s += `<path d="M${x},0 L${x},1920" stroke="#d6dee5" stroke-width="4"/>`;
  for (let y = 0; y <= 1920; y += 120) s += `<path d="M0,${y} L1080,${y}" stroke="#d6dee5" stroke-width="4"/>`;
  s += `<rect x="150" y="380" width="780" height="820" rx="30" fill="#cfe7f3" stroke="#9fb2c0" stroke-width="18"/><path d="M220,460 L380,420 M240,560 L460,500" stroke="#fff" stroke-width="18" opacity=".55" stroke-linecap="round"/>`;
  s += `<rect x="0" y="1560" width="1080" height="360" fill="#f7f7f7" stroke="${OL}" stroke-width="6"/><rect x="0" y="1540" width="1080" height="40" fill="#e3e8ec" stroke="${OL}" stroke-width="6"/>`;
  return s;
}
function bgHall(t) {
  return `<rect width="1080" height="1920" fill="url(#gHall)"/><rect x="0" y="1500" width="1080" height="420" fill="#16161d"/>`;
}
function duvet(y, color = "#dfe5f8", sh = "#b9c2e4", t = 0, wave = 10) {
  let d = `M-20,${y}`;
  for (let i = 0; i <= 8; i++) d += ` Q${-20 + i * 140 - 70},${y + (i % 2 ? -wave : wave) + Math.sin(t + i) * 2} ${-20 + i * 140},${y}`;
  d += " L1100,1940 L-20,1940Z";
  return `<path d="${d}" fill="${color}" stroke="${OL}" stroke-width="${LW}"/>` +
    `<path d="M120,${y + 140} Q300,${y + 110} 420,${y + 240} M640,${y + 120} Q800,${y + 200} 980,${y + 150} M260,${y + 420} Q520,${y + 360} 760,${y + 470}" fill="none" stroke="${sh}" stroke-width="10" stroke-linecap="round"/>`;
}
function pillow(x, y, w, h, c = "#f4f6ff") { return `<rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h * 0.45}" fill="${c}" stroke="${OL}" stroke-width="${LW}"/>`; }
function backOfHead(x, y, s) {
  return g(tf(x, y, s), `<path d="M-300,330 C-280,220 -160,190 0,190 C160,190 280,220 300,330 L330,700 L-330,700Z" fill="${TEE}" stroke="${OL}" stroke-width="${LW}"/>` +
    `<ellipse cx="-150" cy="10" rx="24" ry="36" fill="${SKIN}" stroke="${OL}" stroke-width="${LW}"/><ellipse cx="150" cy="10" rx="24" ry="36" fill="${SKIN}" stroke="${OL}" stroke-width="${LW}"/>` +
    `<path d="M-60,140 L-60,215 L60,215 L60,140Z" fill="${SKIN}" stroke="${OL}" stroke-width="${LW}"/>` +
    `<path d="M-152,-30 C-160,-190 160,-190 152,-30 C160,60 110,150 0,156 C-110,150 -160,60 -152,-30Z" fill="${H_HAIR}" stroke="${OL}" stroke-width="${LW}"/>` +
    `<path d="M-80,-120 Q0,-150 80,-120" stroke="#fff" stroke-width="8" opacity=".12" fill="none"/>`);
}
function fiveHand(x, y, s, r = 0) {
  let f = "";
  const fingers = [[-46, -40, -150], [-18, -62, -100], [12, -66, -90], [40, -56, -80], [62, -10, -30]];
  for (const [fx, fy, a] of fingers) { const L = fx === 62 ? 46 : 60; const rad = (a * Math.PI) / 180; f += limb([[fx * 0.7, fy * 0.5], [fx * 0.7 + Math.cos(rad) * -L * 0.2 + fx * 0.25, fy + Math.sin(rad) * L * 0.4 - 10]], 24, SKIN, 5); }
  return g(tf(x, y, s, r), f + `<ellipse cx="0" cy="0" rx="58" ry="62" fill="${SKIN}" stroke="${OL}" stroke-width="${LW}"/><path d="M-20,10 Q0,24 22,8" stroke="${SKIN_SH}" stroke-width="5" fill="none"/>`);
}
function husbandBust(t, x, y, s, head, torso = {}, r = 0) { return g(tf(x, y, s, r), husbandTorso(torso) + husbandHead(t, head)); }
function wifeBust(t, x, y, s, head, r = 0) { return g(tf(x, y, s, r), wifeTorso() + wifeHead(t, head)); }
const lipAt = (who, t) => (DATA.lip[who][Math.round(t * DATA.fps)] || 0);

// ---------- scenes ----------
// each returns { body, cam:{s,cx,cy}, punch, whip, flash, filter }
const SCENES = {
  s01(t, seg, lt, st, D) {
    const turn = E.inOut(prog(st, 3.6, 4.3));
    let b = bgNight(t);
    b += `<rect x="40" y="560" width="1000" height="260" rx="30" fill="#5a3d2e" stroke="${OL}" stroke-width="${LW}"/><path d="M80,600 L1000,600" stroke="#7a553f" stroke-width="10"/>`;
    b += pillow(310, 790, 380, 150) + pillow(770, 790, 380, 150);
    b += g(tf(320, 800, 0.62), husbandHead(t, { eyes: turn > 0.6 ? "side" : "normal", look: 14 * turn, brows: "normal", mouth: "flat", seed: 1 }));
    b += g(tf(lerp(780, 750, turn), 805, 0.6, lerp(6, -14, turn)), wifeHead(t, { eyes: turn < 0.5 ? "closed" : "half", look: -10, mouth: "smile", blush: 0.5 * turn, pony: false, seed: 2 }));
    b += duvet(900, "#dfe5f8", "#b9c2e4", t * 0.5);
    return { body: b, cam: { s: lerp(1.0, 1.08, E.inOut(lt / D)), cx: 540, cy: 900 }, night: true };
  },
  s02(t, seg, lt, st, D) {
    const open = lipAt("w", t);
    let b = `<rect width="1080" height="1920" fill="#1d2550"/><circle cx="560" cy="820" r="700" fill="url(#gSoftBlue)"/>`;
    b += pillow(560, 760, 900, 520, "#e9edff");
    b += g(tf(560, 800, 1.55, -10), wifeHead(t, { eyes: "half", look: -8, mouth: "talk", open, blush: 0.9, pony: false, seed: 3 }));
    b += duvet(1110, "#dfe5f8", "#b9c2e4", t);
    b += hand(420, 1100, 38) + hand(700, 1096, 38);
    for (const [hx, hy, ph] of [[190, 560, 0], [900, 600, 1.4], [930, 1000, 2.6], [150, 980, 3.3]]) {
      const beat = Math.abs(Math.sin((st * 2.4 + ph) * Math.PI));
      if (st > -0.2) b += heart(hx, hy, 0.7 + 0.35 * beat * Math.min(1, (st + 0.2) * 3));
    }
    b += `<path d="M-60,1560 C40,1440 260,1420 380,1560 L420,1940 L-60,1940Z" fill="#3a3f55" stroke="${OL}" stroke-width="${LW}"/>`;
    b += fxText("두근", 830, 470, st - 0.3, { size: 104, rot: 8, fill: "#ff7aa8" });
    return { body: b, cam: { s: lerp(1.0, 1.06, E.inOut(lt / D)), cx: 560, cy: 820 }, night: true };
  },
  s03(t, seg, lt, st, D) {
    const ex = st > 2.35;
    const take = ex ? spring(st - 2.35, 0.35, 16) : 0;
    let b = `<rect width="1080" height="1920" fill="#101a3e"/>` + speedLines(540, 880, t, 54, 420, ex ? "#ffd6e6" : "#ffffff", ex ? 0.2 : 0.14);
    b += `<ellipse cx="540" cy="980" rx="640" ry="360" fill="#c9d3f7" stroke="${OL}" stroke-width="${LW}"/>`;
    const sq = ex ? 1 + 0.06 * Math.sin(take * Math.PI) : 1;
    const head = ex
      ? { eyes: "sparkle", brows: "up", mouth: "grin", open: 0.3, blush: 1, seed: 4 }
      : { eyes: "shock", pupil: Math.max(3, 9 - st * 4), jx: Math.sin(t * 40) * 2, brows: "up", mouth: "O", open: 0.2 + 0.1 * Math.sin(t * 30), blush: clamp(st * 0.4), seed: 4 };
    b += g(`translate(540,900) scale(${f2(1.95 / sq)},${f2(1.95 * sq)})`, husbandHead(t, head));
    b += sweat(540 + 300, 760 + clamp(st / 3) * 160, 1.6);
    if (ex) for (let i = 0; i < 5; i++) { const k = ((st - 2.35) * 0.9 + i / 5) % 1; b += heart(220 + i * 160, 1150 - k * 600, 0.5 + 0.2 * Math.sin(i), "#ff6f9f").replace("<g", `<g opacity="${f2(1 - k)}"`); }
    b += fxText("!?", 860, 520, lt - 0.05, { size: 170, rot: 10 });
    if (ex) b += fxText("두근두근♥", 280, 520, st - 2.45, { size: 92, rot: -10, fill: "#ff7aa8" });
    return { body: b, cam: { s: 1.0, cx: 540, cy: 900 }, punch: lt, night: true };
  },
  s04(t, seg, lt, st, D) {
    const pop = spring(lt, 0.42, 11);
    const exit = E.in3(prog(lt, D - 0.42, D));
    const open = lipAt("h", t);
    let b = bgNight(t, { beam: false });
    b += `<rect x="560" y="900" width="560" height="220" rx="24" fill="#5a3d2e" stroke="${OL}" stroke-width="${LW}"/>` + pillow(840, 1010, 300, 110);
    b += g(tf(840, 1000, 0.42, -6), wifeHead(t, { eyes: "normal", look: -14, mouth: "flat", pony: false, seed: 5 }));
    b += `<path d="M520,1080 Q800,1050 1100,1080 L1100,1940 L520,1940Z" fill="#dfe5f8" stroke="${OL}" stroke-width="${LW}"/>`;
    const hx = 430 + exit * 1150, hy = 780 + (1 - pop) * 520;
    let man = "";
    man += limb([[hx + 230, hy + 330], [hx + 340, hy + 170], [hx + 330, hy - 10]], 78, TEE, LW);
    man += husbandBust(t, hx, hy, 1.05, { eyes: "shock", pupil: 8, brows: "up", mouth: "talk", open, blush: 0.6, seed: 6 }, { hem: 1200 });
    man += fiveHand(hx + 335, hy - 110 + Math.sin(t * 22) * 6, 1.25, 8);
    for (let i = 0; i < 4; i++) man += sweat(hx - 210 + i * 30 + Math.sin(t * 9 + i) * 10, hy - 170 - ((t * 1.4 + i * 0.25) % 1) * 120, 0.9);
    man += [0, 1, 2].map((i) => `<path d="M${f2(hx - 330)},${f2(hy + 40 + i * 70)} l-120,0" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".7"/>`).join("");
    b += exit > 0 ? `<g filter="url(#blurX)">${man}</g>` + `<circle cx="${f2(350)}" cy="1250" r="${f2(160 * exit)}" fill="#fff" opacity="${f2(0.6 * (1 - exit))}"/>` : man;
    b += `<path d="M-20,1350 Q300,1300 600,1350 L600,1940 L-20,1940Z" fill="#dfe5f8" stroke="${OL}" stroke-width="${LW}"/>`;
    b += fxText("후다닥!", 290, 560, st - 0.05, { size: 128, rot: -8 });
    return { body: b, cam: { s: 1.0, cx: 540, cy: 960 }, night: true };
  },
  s05(t, seg, lt, st, D) {
    let b = bgBath(t);
    const osc = Math.sin(st * Math.PI * 2 * 7) * 26;
    const hx = 540, hy = 780;
    b += limb([[hx + 250, hy + 340], [hx + 330, hy + 470], [hx + 300, hy + 560]], 76, TEE) + bottle(hx + 300, hy + 520, 1.0);
    b += husbandBust(t, hx, hy, 1.1, { eyes: "determined", brows: "angry", mouth: "flat", blush: 0, seed: 7 }, { hem: 1200 });
    const r = rng(9); const n = Math.floor(clamp((st + 0.3) / 1.6) * 16) + 3; let foam = "";
    for (let i = 0; i < n; i++) foam += `<circle cx="${f2(hx + (r() - 0.5) * 220)}" cy="${f2(hy + 100 + (r() - 0.5) * 90)}" r="${f2(18 + r() * 26)}" fill="#fff" stroke="#c9d6df" stroke-width="3"/>`;
    b += foam;
    for (let i = 0; i < 10; i++) { const k = ((st * 0.6 + i * 0.1) % 1 + 1) % 1; b += `<circle cx="${f2(hx - 200 + i * 44 + Math.sin(t * 3 + i) * 20)}" cy="${f2(hy + 60 - k * 420)}" r="${f2(10 + (i % 3) * 6)}" fill="none" stroke="#9fd4ff" stroke-width="4" opacity="${f2(1 - k)}"/>`; }
    b += limb([[hx - 250, hy + 340], [hx - 300, hy + 220], [hx - 130 + osc, hy + 130]], 76, TEE);
    b += toothbrush(hx - 130 + osc, hy + 130, 0) + hand(hx - 130 + osc, hy + 140, 36);
    b += fxText("벅벅벅", 830, 560, st + 0.2, { size: 120, rot: 8 });
    return { body: b, cam: { s: lerp(1.04, 1.0, E.out3(lt / 0.8)), cx: 540, cy: 880 }, whipIn: lt };
  },
  s06(t, seg, lt, st, D) {
    let b = bgBath(t);
    const hx = 560, hy = 790;
    const sprays = [-0.2, 0.9, 2.0];
    let press = 0; for (const s0 of sprays) { const k = st - s0; if (k > 0 && k < 0.25) press = Math.sin((k / 0.25) * Math.PI); }
    b += husbandBust(t, hx, hy, 1.08, { eyes: "happy", brows: "normal", mouth: "smile", blush: 0.6, seed: 8 }, { hem: 1200 });
    b += limb([[hx - 250, hy + 340], [hx - 330, hy + 300], [hx - 220, hy + 190]], 76, TEE);
    b += perfume(hx - 230, hy + 140 + press * 8, 1.0, -18) + hand(hx - 230, hy + 210, 38);
    sprays.forEach((s0, i) => { b += mist(hx - 300, hy + 120, (st - s0) / 1.4, 30 + i); });
    for (let i = 0; i < 14; i++) { const r = rng(40 + i); const x0 = r() * 1080, sp = 140 + r() * 100; const y = ((r() * 1400 + t * sp) % 1500) + 380; b += petal(x0 + Math.sin(t * 1.5 + i) * 40, y, 1.3, t * 90 + i * 40); }
    for (let i = 0; i < 6; i++) { const a = i + t * 0.6; b += star(hx + Math.cos(a) * 330, hy - 60 + Math.sin(a * 1.3) * 200, 18 + 8 * Math.sin(t * 6 + i), "#fff7b0", t * 2); }
    sprays.forEach((s0, i) => { b += fxText("칙!", [250, 820, 300][i], [560, 620, 980][i], st - s0, { size: 118, rot: [-10, 8, -4][i], fill: "#fff" }); });
    return { body: b, cam: { s: lerp(1.0, 1.06, E.inOut(lt / D)), cx: 560, cy: 860 } };
  },
  s07(t, seg, lt, st, D) {
    let b = bgBath(t);
    const suck = spring(st - 2.2, 0.5, 12);
    const on = st > 2.2;
    const jit = on ? Math.sin(t * 70) * 3 : 0;
    // mirror with reflection
    b += `<rect x="640" y="430" width="400" height="900" rx="24" fill="#c7e2ef" stroke="#8ea4b3" stroke-width="16"/>`;
    const fig = (mir) => {
      let m = "";
      const hx = 0, hy = 0;
      m += `<rect x="-230" y="${1000 * 1}" width="460" height="700" fill="${PANTS}" stroke="${OL}" stroke-width="${LW}"/>`;
      m += husbandTorso({ belly: lerp(1.12, 0.78, suck), hem: 1010 });
      m += husbandHead(t, on ? { eyes: "squeeze", brows: "angry", mouth: "puff", puff: 1, red: 0.25, vein: spring(st - 2.3, 0.4, 14), seed: 9 }
        : { eyes: "normal", look: 0, brows: "worried", mouth: "flat", seed: 9 });
      if (on) m += limb([[230, 300], [400, 230], [330, 60]], 78, TEE) + hand(330, 40, 46) + `<ellipse cx="350" cy="190" rx="70" ry="54" fill="${SKIN}" stroke="${OL}" stroke-width="${LW}"/>`;
      else m += limb([[230, 300], [300, 560], [200, 700]], 78, TEE) + hand(190, 700, 40);
      m += limb([[-230, 300], [-300, 560], [-200, 760]], 78, TEE) + hand(-190, 770, 40);
      return m;
    };
    b += `<g clip-path="url(#clipMirror)">${g(`translate(${880 + jit},760) scale(-0.62,0.62)`, fig(true))}<rect x="640" y="430" width="400" height="900" fill="#9fd0ff" opacity=".18"/><path d="M700,520 L840,460 M700,640 L900,540" stroke="#fff" stroke-width="16" opacity=".5" stroke-linecap="round"/></g>`;
    b += g(`translate(${360 + jit},720) scale(0.86)`, fig(false));
    if (on) for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; b += `<path d="M${f2(360 + Math.cos(a) * 330)},${f2(980 + Math.sin(a) * 420)} l${f2(Math.cos(a) * 40)},${f2(Math.sin(a) * 40)}" stroke="${OL}" stroke-width="7" stroke-linecap="round"/>`; }
    b += fxText("흐읍!", 330, 470, st - 2.2, { size: 130, rot: 6, fill: "#ff6b6b" });
    return { body: b, cam: { s: lerp(1.0, 1.05, E.inOut(lt / D)), cx: 540, cy: 900 } };
  },
  s08(t, seg, lt, st, D) {
    const op = E.out3(prog(lt, 0, 0.55));
    const open = lipAt("h", t);
    let b = bgHall(t);
    b += `<rect x="560" y="360" width="460" height="1300" fill="url(#gDoorLight)"/>`;
    b += `<path d="M560,1660 L1020,1660 L1080,1920 L380,1920Z" fill="#ffcf86" opacity="${f2(0.35 * op)}"/>`;
    const dw = lerp(460, 70, op);
    b += `<path d="M${1020 - dw},360 L1020,330 L1020,1690 L${1020 - dw},1660Z" fill="#5b3a28" stroke="${OL}" stroke-width="${LW}"/><circle cx="${f2(1020 - dw + 30)}" cy="1010" r="14" fill="#e0b25a" stroke="${OL}" stroke-width="4"/>`;
    b += `<rect x="540" y="340" width="34" height="1340" fill="#3b2a20" stroke="${OL}" stroke-width="5"/>`;
    b += `<path d="M0,0 L1080,0 L1080,1920 L0,1920Z" fill="#000" opacity="${f2(0.5 * (1 - op))}"/>`;
    const hx = 380, hy = 780;
    b += husbandBust(t, hx, hy, 1.0, { eyes: "smug", brows: "smug", mouth: open > 0.08 ? "grin" : "grin", open: open * 0.8, blush: 0.2, seed: 10 }, { hem: 1200 }, 5);
    b += limb([[hx + 230, hy + 320], [hx + 310, hy + 70], [hx + 190, hy - 120]], 76, TEE) + hand(hx + 186, hy - 132, 40);
    const gl = spring(st - 0.8, 0.4, 12);
    if (st > 0.8) b += star(hx + 40, hy + 92, 44 * gl, "#fffbe0", t * 4) + star(hx + 40, hy + 92, 22 * gl, "#fff", -t * 4);
    for (let i = 0; i < 5; i++) { const tw = Math.max(0, Math.sin(t * 5 + i * 1.3)); b += star(hx - 200 + i * 100, hy - 240 + (i % 2) * 60, 26 * tw, "#fff3a6", 0); }
    b += fxText("반짝!", 230, 520, st - 0.8, { size: 116, rot: -8, fill: "#fff3a6" });
    return { body: b, cam: { s: lerp(1.02, 1.06, E.inOut(lt / D)), cx: 540, cy: 900 } };
  },
  s09(t, seg, lt, st, D) {
    const open = lipAt("w", t);
    let b = bgWarm(t, { lamp: [930, 900] });
    b += `<rect x="-20" y="1060" width="1120" height="120" rx="20" fill="#7a5340" stroke="${OL}" stroke-width="${LW}"/>`;
    const tap = st > 0.2 && st < 2.6 ? Math.floor(st * 8) % 12 : -1;
    const pat = st > 1.3 && st < 2.7 ? Math.abs(Math.sin((st - 1.3) * Math.PI * 3)) : 0;
    b += wifeBust(t, 600, 760, 1.0, { eyes: st < 1.0 ? "happy" : "normal", look: -6, mouth: "talkSmile", open, glasses: true, blush: 0.35, seed: 11 });
    b += duvet(1240, "#efe4d2", "#d4c3a8", t, 14);
    const r = rng(21); for (let i = 0; i < 16; i++) b += receipt(100 + r() * 880, 1330 + r() * 380, 90, 120, (r() - 0.5) * 70, 50 + i);
    b += g(tf(470, 1560, 1, -8), `<rect x="-150" y="-90" width="300" height="190" rx="10" fill="#fff" stroke="${OL}" stroke-width="6"/><path d="M0,-90 L0,100" stroke="${OL}" stroke-width="4"/>` + [0, 1, 2, 3].map((i) => `<path d="M-130,${-50 + i * 36} L-20,${-50 + i * 36} M20,${-50 + i * 36} L130,${-50 + i * 36}" stroke="#b8c" stroke-width="5"/>`).join(""));
    b += limb([[600 + 200, 760 + 330], [850, 1180], [830, 1110]], 64, PJ) + calculator(830, 1060, 1.0, 10, tap) + hand(800, 1130, 32);
    b += limb([[600 - 200, 760 + 330], [330, 1180], [300, 1250 - pat * 50]], 64, PJ) + hand(300, 1260 - pat * 50, 34);
    b += backOfHead(150, 1620, 1.05);
    return { body: b, cam: { s: lerp(1.0, 1.05, E.inOut(lt / D)), cx: 560, cy: 900 }, flash: lt };
  },
  s10(t, seg, lt, st, D) {
    const open = lipAt("h", t);
    let b = `<rect width="1080" height="1920" fill="url(#gGloom)"/>`;
    const r = rng(77); for (let i = 0; i < 26; i++) { const x = r() * 1080, y0 = r() * 1920; const y = (y0 + t * 260) % 2100 - 100; b += `<path d="M${f2(x)},${f2(y)} l0,${f2(120 + r() * 160)}" stroke="#7d84a8" stroke-width="5" opacity=".35"/>`; }
    b += husbandBust(t, 540, 800, 1.18, { gray: true, eyes: "blank", brows: "normal", mouth: "talk", open: open * 0.6, crack: true, seed: 12 }, { gray: true, hem: 1200 });
    const k = clamp(lt / 1.2);
    b += g(tf(560 + k * 120 + Math.sin(t * 4) * 20 * k, 930 - k * 380, 0.6 + 0.5 * k), `<path d="M0,0 C40,-10 70,-60 50,-110 C30,-160 -40,-150 -50,-100 C-60,-40 -20,-20 0,0Z" fill="#fff" opacity="${f2(0.85 * (1 - k * 0.4))}" stroke="#ccd" stroke-width="4"/><circle cx="-12" cy="-90" r="6" fill="#556"/><circle cx="16" cy="-92" r="6" fill="#556"/>`);
    b += fxText("멍-", 840, 560, lt - 0.1, { size: 130, rot: 0, fill: "#d9dbe6" });
    return { body: b, cam: { s: 1.0, cx: 540, cy: 900 }, punch: lt };
  },
  s11(t, seg, lt, st, D) {
    const open = lipAt("w", t);
    let b = bgWarm(t, { lamp: [960, 880] });
    b += wifeBust(t, 690, 760, 1.0, { eyes: "sharp", brows: "flat", mouth: "talk", open, glasses: true, seed: 13 });
    const h = lerp(120, 1000, E.out3(prog(st, 0, 2.4)));
    b += limb([[490, 1090], [380, 900], [330, 640]], 64, PJ);
    b += receipt(330, 620, 230, h, -3, 99) + hand(330, 620, 34);
    b += husbandBust(t, 900, 1520, 0.7, { eyes: "side", look: -16, brows: "worried", mouth: "wobble", blush: 0, seed: 14 }, { hem: 1200 });
    b += sweat(1000, 1380 + ((t * 1.2) % 1) * 60, 1.1) + sweat(780, 1350, 0.8);
    return { body: b, cam: { s: lerp(1.0, 1.04, E.inOut(lt / D)), cx: 600, cy: 900 } };
  },
  s11b(t, seg, lt, st, D) {
    const open = lipAt("w", t);
    const inK = E.out3(prog(lt, 0, 0.6));
    const shock = st > 3.6;
    const jump = shock ? spring(st - 3.6, 0.35, 14) : 0;
    let b = bgWarm(t, { lamp: [980, 860] }) + `<rect width="1080" height="1920" fill="#2a1508" opacity=".25"/>`;
    b += husbandBust(t, 740, 860 - Math.sin(Math.PI * clamp(st - 3.6)) * 40, 1.15,
      shock ? { eyes: "shock", pupil: 5, brows: "up", mouth: "wobble", blush: 0, seed: 15 }
            : { eyes: "side", look: Math.sin(t * 9) > 0 ? -16 : 16, brows: "worried", mouth: "wobble", seed: 15 }, { hem: 1200 });
    for (let i = 0; i < (shock ? 6 : 3); i++) b += sweat(740 + 230 + (i % 2) * 40 - i * 8, 700 + ((t * 1.3 + i * 0.3) % 1) * 200 - i * 30, 1.2);
    const sniff = st < 1.0;
    b += wifeBust(t, lerp(-200, 320, inK), 880, 1.1, { eyes: "squint", brows: "angry", mouth: sniff ? "sniff" : "talk", open: sniff ? 0 : open, glasses: true, seed: 16 }, 12);
    if (sniff) for (let i = 0; i < 3; i++) { const k = (st * 3 + i / 3) % 1; b += `<path d="M${f2(420 + k * 60)},${f2(900 + i * 24)} q12,-10 24,0" fill="none" stroke="${OL}" stroke-width="5" opacity="${f2(1 - k)}"/>`; }
    b += fxText("킁킁", 300, 540, lt - 0.1, { size: 112, rot: -10, fill: "#fff" });
    if (shock) b += fxText("뜨끔!", 860, 520, st - 3.6, { size: 120, rot: 8, fill: "#ff6b6b" });
    return { body: b, cam: { s: lerp(1.02, 1.1, E.inOut(lt / D)), cx: 560, cy: 880 }, punch: shock ? st - 3.6 : undefined };
  },
  s11c(t, seg, lt, st, D) {
    let b = `<rect width="1080" height="1920" fill="url(#gBlue)"/>`;
    const r = rng(5); for (let i = 0; i < 40; i++) { const x = r() * 1080, y = (r() * 1400 + t * 900) % 1400 + 520; b += `<path d="M${f2(x)},${f2(y)} l-10,46" stroke="#a9c4ff" stroke-width="5" opacity=".6" stroke-linecap="round"/>`; }
    b += husbandBust(t, 540, 900, 1.45, { eyes: "cry", brows: "sad", mouth: "wobble", seed: 17 }, { hem: 1200 });
    let cloud = ""; for (const [cx, cy, cr] of [[420, 520, 90], [540, 480, 120], [670, 520, 95], [480, 570, 80], [610, 575, 85]]) cloud += `<circle cx="${cx}" cy="${cy}" r="${cr}" fill="#6d7894" stroke="${OL}" stroke-width="6"/>`;
    b += g(`translate(${f2(Math.sin(t * 1.3) * 14)},0)`, cloud + `<path d="M440,600 Q540,640 640,600" stroke="#6d7894" stroke-width="40"/>`);
    return { body: b, cam: { s: lerp(1.0, 1.06, E.inOut(lt / D)), cx: 540, cy: 900 } };
  },
  s12(t, seg, lt, st, D) {
    const open = lipAt("h", t);
    let b = bgWarm(t, { lamp: [130, 880] });
    b += wifeBust(t, 840, 900, 0.78, { eyes: "half", look: -12, brows: "flat", mouth: "flat", glasses: true, seed: 18 });
    b += g(tf(840, 900, 0.78), limb([[-170, 420], [0, 470], [170, 420]], 70, PJ_SH) + limb([[-150, 380], [150, 470]], 70, PJ));
    const up = E.out3(prog(st, -0.1, 0.5)) * (1 - E.inOut(prog(st, 3.6, 4.4)));
    const hx = 400, hy = 860;
    b += limb([[hx - 240, hy + 320], [lerp(hx - 330, hx - 260, up), lerp(hy + 560, hy - 60, up)], [lerp(hx - 280, hx - 160, up), lerp(hy + 760, hy - 300, up)]], 76, TEE) + hand(lerp(hx - 280, hx - 160, up), lerp(hy + 760, hy - 300, up), 40);
    b += limb([[hx + 240, hy + 320], [lerp(hx + 330, hx + 260, up), lerp(hy + 560, hy - 60, up)], [lerp(hx + 280, hx + 160, up), lerp(hy + 760, hy - 300, up)]], 76, TEE) + hand(lerp(hx + 280, hx + 160, up), lerp(hy + 760, hy - 300, up), 40);
    b += husbandBust(t, hx, hy, 1.0, { eyes: "closed", brows: "normal", mouth: st < 1.4 ? "yawn" : "talk", open: st < 1.4 ? Math.max(open, 0.4) : open, blush: 0, seed: 19 }, { hem: 1200 });
    b += sweat(hx + 170, hy - 120, 0.9);
    b += fxText("하암~", 820, 560, st - 0.1, { size: 116, rot: 6, fill: "#fff" });
    return { body: b, cam: { s: lerp(1.0, 1.05, E.inOut(lt / D)), cx: 560, cy: 900 } };
  },
  s12b(t, seg, lt, st, D) {
    const open = lipAt("w", t);
    let b = `<rect width="1080" height="1920" fill="#1a0d2e"/>`;
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2, rr = 520 + 60 * Math.sin(t * 5 + i * 2);
      const x = 540 + Math.cos(a) * rr * 0.75, y = 880 + Math.sin(a) * rr;
      b += `<path d="M540,880 Q${f2(540 + Math.cos(a + 0.3) * rr * 0.6)},${f2(880 + Math.sin(a + 0.3) * rr * 0.6)} ${f2(x)},${f2(y)}" stroke="#7b2cf0" stroke-width="${f2(70 + 30 * Math.sin(t * 7 + i))}" opacity=".35" stroke-linecap="round" fill="none"/>`;
    }
    b += wifeBust(t, 540, 820, 1.5, { eyes: "sharp", brows: "angry", mouth: "talk", open, glasses: true, glare: 1, shine: prog(lt, 0.1, 0.55), seed: 20 });
    b += `<rect width="1080" height="1920" fill="#2a0a40" opacity=".18"/>`;
    b += fxText("!!!", 880, 520, lt - 0.05, { size: 170, rot: 8, fill: "#ff5d5d" });
    return { body: b, cam: { s: 1.0, cx: 540, cy: 900 }, punch: lt };
  },
  outro(t, lt) {
    let b = bgWarm(t, { lamp: [960, 900], clock: true });
    b += `<rect x="560" y="1010" width="560" height="240" rx="20" fill="#7a5340" stroke="${OL}" stroke-width="${LW}"/><path d="M560,1120 Q820,1090 1100,1120 L1100,1360 L560,1360Z" fill="#efe4d2" stroke="${OL}" stroke-width="${LW}"/>`;
    b += wifeBust(t, 820, 820, 0.72, { eyes: "sharp", brows: "angry", mouth: "flat", glasses: true, glare: 1, seed: 21 });
    b += g(tf(820, 820, 0.72), limb([[-170, 420], [0, 470], [170, 420]], 70, PJ_SH) + limb([[-150, 380], [150, 470]], 70, PJ));
    b += `<rect x="0" y="1360" width="1080" height="560" fill="#8a6a52"/>`;
    const r = rng(8); for (let i = 0; i < 10; i++) b += receipt(560 + r() * 460, 1180 + r() * 120, 70, 90, (r() - 0.5) * 60, 70 + i);
    b += `<ellipse cx="320" cy="1560" rx="250" ry="90" fill="${PANTS}" stroke="${OL}" stroke-width="${LW}"/>`;
    b += husbandBust(t, 320, 1080, 0.72, { eyes: "cry", brows: "sad", mouth: "wobble", seed: 22 }, { hem: 640 }, 12);
    b += hand(200, 1500, 34) + hand(440, 1500, 34);
    return { body: b, cam: { s: lerp(1.04, 1.0, E.out3(lt / 2)), cx: 540, cy: 1000 } };
  },
};
