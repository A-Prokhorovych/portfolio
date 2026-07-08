import { execFile } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import sharp from "sharp";

const execFileAsync = promisify(execFile);
const runtimeModules =
  "/Users/andreyprokhorovich/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(`${runtimeModules}/playwright/index.mjs`);

const site = "https://zahnarzt-langhammer.de";
const outputDir = "public/projects/dr-langhammer";
const workDir = `${outputDir}/desktop-video-work`;
const captureDir = `${workDir}/captures`;
const frameDir = `${workDir}/frames`;
const outputVideo = `${outputDir}/langhammer-desktop-showcase.mp4`;
const poster = `${outputDir}/langhammer-desktop-showcase-poster.jpg`;
const canvas = { width: 1920, height: 1080 };
const fps = 30;
const frameCount = 210;

const pages = [
  ["home", "/"],
  ["implantologie", "/implantologie/"],
  ["praxislabor", "/praxislabor/"],
  ["kontakt", "/kontakt/"],
];

const easeInOut = (t) => 0.5 - Math.cos(Math.PI * t) / 2;
const wave = (i, phase, speed) => (Math.sin((i / (frameCount - 1)) * Math.PI * 2 * speed + phase) + 1) / 2;

await rm(workDir, { recursive: true, force: true });
await mkdir(captureDir, { recursive: true });
await mkdir(frameDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});

const captures = {};
for (const [name, path] of pages) {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  await page.goto(`${site}${path}`, { waitUntil: "networkidle", timeout: 90000 });
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = "auto";
  });
  await page.waitForTimeout(800);
  const file = `${captureDir}/${name}.png`;
  await page.screenshot({ path: file, fullPage: true, animations: "disabled" });
  captures[name] = { file, ...(await sharp(file).metadata()) };
  await page.close();
}
await browser.close();

const svg = String.raw;

async function browserWindow(capture, width, height, scroll) {
  const sourceVisibleHeight = Math.round((height - 40) * (capture.width / width));
  const maxTop = Math.max(0, capture.height - sourceVisibleHeight);
  const top = Math.round(maxTop * scroll);
  const screen = await sharp(capture.file)
    .extract({ left: 0, top, width: capture.width, height: Math.min(sourceVisibleHeight, capture.height - top) })
    .resize(width, height - 40, { fit: "cover", position: "top" })
    .png()
    .toBuffer();
  const chrome = Buffer.from(svg`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" rx="16" fill="#ffffff"/>
    <rect width="${width}" height="40" fill="#edf4f6"/>
    <circle cx="22" cy="20" r="5" fill="#f78f21"/>
    <circle cx="40" cy="20" r="5" fill="#cbdce0"/>
    <circle cx="58" cy="20" r="5" fill="#cbdce0"/>
    <rect x="84" y="13" width="${width - 116}" height="14" rx="7" fill="#ffffff"/>
    <rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" rx="16" fill="none" stroke="rgba(16,34,51,.13)"/>
  </svg>`);

  return sharp(chrome)
    .composite([{ input: screen, left: 0, top: 40 }])
    .png()
    .toBuffer();
}

for (let i = 0; i < frameCount; i += 1) {
  const t = i / (frameCount - 1);
  const home = await browserWindow(captures.home, 780, 640, easeInOut(t));
  const implant = await browserWindow(captures.implantologie, 610, 500, wave(i, 1.2, .92));
  const lab = await browserWindow(captures.praxislabor, 610, 500, wave(i, 3.4, .82));
  const contact = await browserWindow(captures.kontakt, 780, 360, wave(i, 2.2, 1.08));

  const bg = Buffer.from(svg`<svg width="1920" height="1080" viewBox="0 0 1920 1080">
    <defs>
      <radialGradient id="bg" cx="50%" cy="40%" r="78%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="56%" stop-color="#e6f2f9"/>
        <stop offset="100%" stop-color="#faf5ef"/>
      </radialGradient>
      <filter id="shadow">
        <feDropShadow dx="0" dy="24" stdDeviation="26" flood-color="#102233" flood-opacity=".20"/>
      </filter>
    </defs>
    <rect width="1920" height="1080" fill="url(#bg)"/>
    <path d="M0 896 C350 820 620 940 980 872 C1280 816 1540 770 1920 828 L1920 1080 L0 1080Z" fill="#fff" opacity=".62"/>
  </svg>`);

  await sharp(bg)
    .composite([
      { input: implant, left: 74, top: 122 },
      { input: lab, left: 1236, top: 122 },
      { input: contact, left: 578, top: 672 },
      { input: home, left: 570, top: 82 },
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(`${frameDir}/frame-${String(i).padStart(4, "0")}.jpg`);
}

await execFileAsync("ffmpeg", [
  "-y",
  "-framerate",
  String(fps),
  "-i",
  `${frameDir}/frame-%04d.jpg`,
  "-c:v",
  "libx264",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  "-r",
  String(fps),
  outputVideo,
]);

await sharp(`${frameDir}/frame-0000.jpg`).jpeg({ quality: 88, mozjpeg: true }).toFile(poster);
await writeFile(`${workDir}/README.txt`, `Generated from ${site} on ${new Date().toISOString()}\n`);
console.log(outputVideo);
