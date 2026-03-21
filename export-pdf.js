#!/usr/bin/env node
/**
 * Export pamphlet to high-quality A4 PDF using Puppeteer (headless Chrome).
 *
 * Usage:
 *   node export-pdf.js <pamphlet-file> [output.pdf]
 *
 * Examples:
 *   node export-pdf.js pamphlet-v7-gradient.html
 *   node export-pdf.js pamphlet-v3-minimalist.html output/v3.pdf
 *   node export-pdf.js all                          # exports all pamphlets
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function exportPDF(htmlFile, outputFile) {
  const absolutePath = path.resolve(htmlFile);
  if (!fs.existsSync(absolutePath)) {
    console.error('File not found:', absolutePath);
    return;
  }

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  // Set viewport to A4 width at 96dpi (210mm ≈ 794px)
  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

  await page.goto('file://' + absolutePath, { waitUntil: 'networkidle0' });

  // Wait for fonts and images to load
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 500));

  // Auto-scale each .page element if content overflows A4 height
  await page.evaluate(() => {
    const A4_HEIGHT_MM = 297;
    const A4_WIDTH_MM = 210;
    // Remove screen-only styles first
    document.body.style.background = 'white';
    document.body.style.padding = '0';

    const pages = document.querySelectorAll('.page');
    pages.forEach(pg => {
      pg.style.boxShadow = 'none';
      pg.style.margin = '0';
      // Temporarily remove height constraint to measure natural height
      pg.style.minHeight = 'auto';
      pg.style.height = 'auto';
      pg.style.overflow = 'visible';

      // Force layout recalc
      void pg.offsetHeight;

      const rect = pg.getBoundingClientRect();
      const contentHeightMM = (rect.height / 96) * 25.4; // px to mm

      if (contentHeightMM > A4_HEIGHT_MM) {
        const scale = (A4_HEIGHT_MM / contentHeightMM) * 0.98; // 2% safety margin
        pg.style.transform = 'scale(' + scale + ')';
        pg.style.transformOrigin = 'top left';
        pg.style.width = (A4_WIDTH_MM / scale) + 'mm';
        pg.style.height = A4_HEIGHT_MM + 'mm';
        pg.style.overflow = 'hidden';
      } else {
        pg.style.height = A4_HEIGHT_MM + 'mm';
        pg.style.overflow = 'hidden';
      }
    });
  });

  const output = outputFile || htmlFile.replace('.html', '.pdf');

  await page.pdf({
    path: output,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  await browser.close();
  console.log('Exported:', output);
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.log('Usage: node export-pdf.js <file.html | all> [output.pdf]');
    process.exit(1);
  }

  if (arg === 'all') {
    const dir = __dirname;
    const files = fs.readdirSync(dir).filter(f => f.startsWith('pamphlet-v') && f.endsWith('.html'));
    const outDir = path.join(dir, 'output');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
    for (const file of files) {
      await exportPDF(path.join(dir, file), path.join(outDir, file.replace('.html', '.pdf')));
    }
    console.log('\nAll PDFs exported to output/');
  } else {
    await exportPDF(arg, process.argv[3]);
  }
}

main().catch(console.error);
