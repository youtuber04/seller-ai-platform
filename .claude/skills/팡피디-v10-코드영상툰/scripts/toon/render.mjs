// Seek-and-capture renderer (HyperFrames' render contract, run locally):
// every frame is drawn by window.renderAt(t) from t alone, then screenshotted.
//   node render.mjs snap 1.5,6.2,...        -> snaps/t_<t>.png
//   node render.mjs video [workers]         -> video.mp4 (silent)
import pw from "/opt/node-tools/node_modules/playwright/index.js";
const { chromium } = pw;
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const URL_ = "file://" + path.join(DIR, "index.html");
const [mode, arg] = process.argv.slice(2);

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => console.error("pageerror:", e.message));
  await page.goto(URL_);
  await page.evaluate(async () => { await document.fonts.ready; await window.ready; });
  return page;
}

async function frame(page, t, type = "jpeg") {
  await page.evaluate((tt) => window.renderAt(tt), t);
  return page.screenshot({ type, quality: type === "jpeg" ? 95 : undefined, omitBackground: false });
}

const browser = await chromium.launch({ args: ["--force-color-profile=srgb", "--disable-lcd-text"] });
if (mode === "snap") {
  const page = await openPage(browser);
  mkdirSync(path.join(DIR, "snaps"), { recursive: true });
  for (const t of arg.split(",").map(Number)) {
    writeFileSync(path.join(DIR, "snaps", `t_${t.toFixed(2)}.png`), await frame(page, t, "png"));
  }
} else if (mode === "video") {
  const workers = Number(arg || 4);
  const page0 = await openPage(browser);
  const { fps, total } = await page0.evaluate(() => ({ fps: window.DATA.fps, total: window.DATA.total }));
  await page0.close();
  const n = Math.round(total * fps);
  const per = Math.ceil(n / workers);
  const parts = [];
  await Promise.all([...Array(workers).keys()].map(async (w) => {
    const a = w * per, b = Math.min(n, a + per);
    if (a >= b) return;
    const out = path.join(DIR, `part_${w}.mp4`);
    parts[w] = out;
    const ff = spawn("ffmpeg", ["-loglevel", "error", "-y", "-f", "image2pipe", "-framerate", String(fps), "-c:v", "mjpeg", "-i", "-",
      "-c:v", "libx264", "-preset", "medium", "-crf", "17", "-pix_fmt", "yuv420p", "-r", String(fps), out], { stdio: ["pipe", "inherit", "inherit"] });
    const page = await openPage(browser);
    for (let i = a; i < b; i++) {
      const buf = await frame(page, i / fps);
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
      if ((i - a) % 150 === 0) console.log(`worker ${w}: ${i - a}/${b - a}`);
    }
    ff.stdin.end();
    await new Promise((r) => ff.on("close", r));
    await page.close();
  }));
  const list = path.join(DIR, "parts.txt");
  writeFileSync(list, parts.filter(Boolean).map((p) => `file '${p}'`).join("\n"));
  await new Promise((r, j) => spawn("ffmpeg", ["-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", list, "-c", "copy", path.join(DIR, "video.mp4")], { stdio: "inherit" })
    .on("close", (c) => (c ? j(new Error("concat failed")) : r())));
  for (const p of parts.filter(Boolean)) if (existsSync(p)) rmSync(p);
}
await browser.close();
