const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies for the export endpoint
app.use(express.json({ limit: '5mb' }));

// Serve static files
app.use(express.static(__dirname));

// PDF export endpoint
// Accepts { html: "<full html string>" } and returns a PDF buffer
app.post('/api/export-pdf', async (req, res) => {
  const { html } = req.body;
  if (!html) {
    return res.status(400).json({ error: 'Missing html field' });
  }

  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    await new Promise(r => setTimeout(r, 400));

    // Auto-scale pages that overflow A4
    await page.evaluate(() => {
      const A4_HEIGHT_MM = 297;
      const A4_WIDTH_MM = 210;
      document.body.style.background = 'white';
      document.body.style.padding = '0';

      const pages = document.querySelectorAll('.page');
      pages.forEach(pg => {
        pg.style.boxShadow = 'none';
        pg.style.margin = '0';
        pg.style.minHeight = 'auto';
        pg.style.height = 'auto';
        pg.style.overflow = 'visible';
        void pg.offsetHeight;

        const rect = pg.getBoundingClientRect();
        const contentHeightMM = (rect.height / 96) * 25.4;

        if (contentHeightMM > A4_HEIGHT_MM) {
          const scale = (A4_HEIGHT_MM / contentHeightMM) * 0.98;
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

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="pamphlet.pdf"',
      'Content-Length': pdfBuffer.length,
    });
    res.send(pdfBuffer);
  } catch (err) {
    if (browser) await browser.close();
    console.error('PDF export error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
