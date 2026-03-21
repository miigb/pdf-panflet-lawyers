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

  await page.goto('file://' + absolutePath, { waitUntil: 'networkidle0' });

  // Wait for fonts and images to load
  await page.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 500));

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
