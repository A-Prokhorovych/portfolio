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
const workDir = `${outputDir}/mobile-video-work`;
const frameDir = `${workDir}/frames`;
const captureDir = `${workDir}/captures`;
const outputVideo = `${outputDir}/langhammer-mobile-showcase.mp4`;

const canvas = { width: 1920, height: 1080 };
const phone = { width: 390, height: 844, radius: 56 };
const central = { width: 390, height: 844, radius: 56, left: 765, top: 118 };
const sideTop = 192;
const sidePhone = { width: 270, height: 584, radius: 40 };
const frameCount = 240;
const fps = 30;

const pages = [
  { name: "home", url: `${site}/`, label: "Home" },
  { name: "implantologie", url: `${site}/implantologie/`, label: "Implantologie" },
  { name: "praxislabor", url: `${site}/praxislabor/`, label: "Praxislabor" },
  { name: "kontakt", url: `${site}/kontakt/`, label: "Kontakt" },
];

const easeInOut = (t) => 0.5 - Math.cos(Math.PI * t) / 2;
const wave = (i, phase = 0, speed = 1) => {
  const t = (i / (frameCount - 1)) * Math.PI * 2 * speed + phase;
  return (Math.sin(t) + 1) / 2;
};

await rm(workDir, { recursive: true, force: true });
await mkdir(frameDir, { recursive: true });
await mkdir(captureDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const captures = {};

for (const pageInfo of pages) {
  const page = await browser.newPage({
    viewport: { width: phone.width, height: phone.height },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  await page.goto(pageInfo.url, { waitUntil: "networkidle", timeout: 90000 });
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = "auto";
  });
  await page.waitForTimeout(1200);

  const path = `${captureDir}/${pageInfo.name}.png`;
  await page.screenshot({ path, fullPage: true, animations: "disabled" });
  const meta = await sharp(path).metadata();
  captures[pageInfo.name] = { ...pageInfo, path, width: meta.width, height: meta.height };
  await page.close();
}

await browser.close();

const svg = String.raw;

const roundedMask = async (width, height, radius) =>
  Buffer.from(svg`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="#fff"/>
  </svg>`);

const centerMask = await roundedMask(central.width, central.height, central.radius);
const sideMask = await roundedMask(sidePhone.width, sidePhone.height, sidePhone.radius);

async function phoneFrame(capture, spec, scroll, scale = 1) {
  const visibleW = spec.width;
  const visibleH = spec.height;
  const sourceW = capture.width;
  const sourceH = capture.height;
  const sourceVisibleH = Math.round(visibleH * (sourceW / visibleW));
  const maxTop = Math.max(0, sourceH - sourceVisibleH);
  const top = Math.round(maxTop * scroll);

  const screen = await sharp(capture.path)
    .extract({ left: 0, top, width: sourceW, height: Math.min(sourceVisibleH, sourceH - top) })
    .resize(visibleW, visibleH, { fit: "cover", position: "top" })
    .composite([
      {
        input: spec.width === central.width ? centerMask : sideMask,
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();

  const chrome = Buffer.from(svg`<svg width="${spec.width}" height="${spec.height}" viewBox="0 0 ${spec.width} ${spec.height}">
    <rect x="0" y="0" width="${spec.width}" height="${spec.height}" rx="${spec.radius}" fill="none" stroke="rgba(255,255,255,.96)" stroke-width="${18 * scale}"/>
    <rect x="${spec.width / 2 - 54 * scale}" y="${16 * scale}" width="${108 * scale}" height="${9 * scale}" rx="${5 * scale}" fill="rgba(19,29,35,.62)"/>
    <rect x="${10 * scale}" y="${10 * scale}" width="${spec.width - 20 * scale}" height="${spec.height - 20 * scale}" rx="${spec.radius - 10 * scale}" fill="none" stroke="rgba(0,85,136,.14)" stroke-width="${2 * scale}"/>
  </svg>`);

  return sharp({
    create: {
      width: spec.width,
      height: spec.height,
      channels: 4,
      background: "transparent",
    },
  })
    .composite([{ input: screen }, { input: chrome }])
    .png()
    .toBuffer();
}

for (let i = 0; i < frameCount; i += 1) {
  const globalT = i / (frameCount - 1);
  const homeScroll = easeInOut(globalT);
  const leftScroll = wave(i, 1.2, 1.35);
  const rightScroll = wave(i, 4.1, 1.08);
  const farScroll = wave(i, 2.4, 0.82);

  const center = await phoneFrame(captures.home, central, homeScroll, 1.15);
  const left = await phoneFrame(captures.implantologie, sidePhone, leftScroll, 0.82);
  const right = await phoneFrame(captures.praxislabor, sidePhone, rightScroll, 0.82);
  const farRight = await phoneFrame(captures.kontakt, sidePhone, farScroll, 0.82);

  const bg = Buffer.from(svg`<svg width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">
    <defs>
      <radialGradient id="g1" cx="50%" cy="35%" r="68%">
        <stop offset="0%" stop-color="#F6FBFC"/>
        <stop offset="56%" stop-color="#E6F2F9"/>
        <stop offset="100%" stop-color="#FAF5EF"/>
      </radialGradient>
      <linearGradient id="g2" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#005588" stop-opacity=".08"/>
        <stop offset="100%" stop-color="#F78F21" stop-opacity=".08"/>
      </linearGradient>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow dx="0" dy="28" stdDeviation="30" flood-color="#15303D" flood-opacity=".24"/>
      </filter>
    </defs>
    <rect width="1920" height="1080" fill="url(#g1)"/>
    <rect width="1920" height="1080" fill="url(#g2)"/>
    <path d="M0 908 C358 826 574 964 900 898 C1245 828 1462 754 1920 824 L1920 1080 L0 1080Z" fill="#ffffff" opacity=".62"/>
  </svg>`);

  const composites = [
    { input: left, left: 398, top: sideTop, blend: "over" },
    { input: farRight, left: 1252, top: 248, blend: "over" },
    { input: right, left: 1522, top: sideTop, blend: "over" },
    { input: center, left: central.left, top: central.top, blend: "over" },
  ];

  await sharp(bg)
    .composite(composites)
    .jpeg({ quality: 90, mozjpeg: true })
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

await writeFile(
  `${workDir}/README.txt`,
  `Generated from ${site} on ${new Date().toISOString()}\nOutput: ${outputVideo}\n`,
);

console.log(outputVideo);
