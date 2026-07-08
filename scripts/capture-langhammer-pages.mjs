import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const runtimeModules =
  "/Users/andreyprokhorovich/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = await import(`${runtimeModules}/playwright/index.mjs`);

const outputDir = "public/projects/dr-langhammer";
const layoutDir = `${outputDir}/layout-screens`;
await mkdir(layoutDir, { recursive: true });

const currentSite = "https://zahnarzt-langhammer.de";
const oldSite = "https://web.archive.org/web/20240227043640/https://zahnarzt-langhammer.de/";

const layouts = [
  ["home", "/"],
  ["zahnarztpraxis", "/zahnarztpraxis/"],
  ["implantologie", "/implantologie/"],
  ["cerec-3d", "/cerec-3d/"],
  ["aesthetische-zahnheilkunde", "/asthetische-zahnheilkunde/"],
  ["prophylaxe", "/prophylaxe/"],
  ["airflow-zahnreinigung", "/airflow-zahnreinigung/"],
  ["praxislabor", "/praxislabor/"],
  ["services", "/services/"],
  ["kontakt", "/kontakt/"],
];

const browser = await chromium.launch({
  headless: true,
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});

async function capture(url, path, viewport, fullPage = true, waitUntil = "networkidle") {
  const page = await browser.newPage({
    viewport,
    deviceScaleFactor: 1,
    isMobile: viewport.width < 600,
    hasTouch: viewport.width < 600,
  });
  await page.goto(url, { waitUntil, timeout: 90000 });
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = "auto";
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path, fullPage, animations: "disabled" });
  await page.close();
}

await capture(oldSite, `${outputDir}/before-2024-fullpage.png`, { width: 1440, height: 1400 }, true, "domcontentloaded");
await capture(`${currentSite}/`, `${outputDir}/after-2025-fullpage.png`, { width: 1440, height: 1400 });
await capture(`${currentSite}/`, `${outputDir}/after-2025-home-mobile.png`, { width: 390, height: 844 });

for (const [name, path] of layouts) {
  const rawPath = `${layoutDir}/${name}-raw.png`;
  await capture(`${currentSite}${path}`, rawPath, { width: 390, height: 844 });
  await sharp(rawPath)
    .resize({ width: 520, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(`${layoutDir}/${name}.jpg`);
}

await browser.close();
console.log(`Captured ${layouts.length + 3} Langhammer screenshots`);
