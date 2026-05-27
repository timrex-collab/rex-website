#!/usr/bin/env node
/**
 * Hero-Bild srcset-Generator für rex-website.
 *
 * Liest jedes Quellbild aus client/public/images/ und erzeugt drei
 * responsive WebP-Varianten (480w, 1024w, 1920w) für <picture>-Tags.
 *
 * Idempotent: bereits existierende Output-Files werden übersprungen,
 * Quellbilder die kleiner als die Zielbreite sind werden nicht hochskaliert.
 *
 * Verwendung:  node scripts/generate-hero-srcset.mjs
 */

import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(PROJECT_ROOT, 'client/public/images');

const SOURCES = [
  'velux-dachfenster-einbau-bochum-fachbetrieb.webp',
  'braas-pv-premium-turmalin-header-photovoltaik-dach-bochum.webp',
];

const WIDTHS = [480, 1024, 1920];

const WEBP_OPTIONS = {
  quality: 82,
  effort: 6,
};

async function processSource(filename) {
  const srcPath = path.join(IMAGES_DIR, filename);

  if (!fs.existsSync(srcPath)) {
    console.error(`✗ MISSING SOURCE: ${srcPath}`);
    process.exitCode = 1;
    return;
  }

  const base = filename.replace(/\.webp$/i, '');
  const srcMeta = await sharp(srcPath).metadata();
  const srcSize = fs.statSync(srcPath).size;

  console.log(
    `\nSOURCE  ${filename}  ${srcMeta.width}×${srcMeta.height}  ${(srcSize / 1024).toFixed(1)} KB`
  );

  for (const width of WIDTHS) {
    const outName = `${base}-${width}w.webp`;
    const outPath = path.join(IMAGES_DIR, outName);

    if (fs.existsSync(outPath)) {
      console.log(`  SKIP  ${outName}  (already exists)`);
      continue;
    }

    if (srcMeta.width && srcMeta.width < width) {
      console.log(`  SKIP  ${outName}  (source ${srcMeta.width}px < target ${width}px, would upscale)`);
      continue;
    }

    await sharp(srcPath)
      .resize({ width, withoutEnlargement: true, fit: 'inside' })
      .webp(WEBP_OPTIONS)
      .toFile(outPath);

    const outMeta = await sharp(outPath).metadata();
    const outSize = fs.statSync(outPath).size;
    console.log(
      `  OK    ${outName}  ${outMeta.width}×${outMeta.height}  ${(outSize / 1024).toFixed(1)} KB`
    );
  }
}

async function main() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`✗ images directory not found: ${IMAGES_DIR}`);
    process.exit(1);
  }

  console.log(`Hero-srcset generator`);
  console.log(`Target dir: ${IMAGES_DIR}`);
  console.log(`Widths:     ${WIDTHS.join(', ')}w`);
  console.log(`WebP:       quality ${WEBP_OPTIONS.quality}, effort ${WEBP_OPTIONS.effort}`);

  for (const src of SOURCES) {
    await processSource(src);
  }

  if (process.exitCode === 1) {
    console.error('\n✗ Completed with errors. Check missing sources above.');
  } else {
    console.log('\n✓ Asset generation complete.');
  }
}

main().catch((err) => {
  console.error('\n✗ Fatal error:', err);
  process.exit(1);
});
