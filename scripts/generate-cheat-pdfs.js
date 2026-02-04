#!/usr/bin/env node

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const OUTPUT_DIR = path.join(path.dirname(__dirname), 'public');

async function generatePDF(level) {
  console.log(`Generating ${level} PDF...`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Navigate to the cheat sheet page with level parameter
  await page.goto(`${BASE_URL}/cli/cheat?level=${level}`, {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });

  // Wait for the sections to be rendered
  await page.waitForSelector('.break-inside-avoid', { timeout: 10000 });

  // Wait for any dynamic content (like Mermaid diagrams) to render
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Add print-specific styles to prevent page breaks
  await page.addStyleTag({
    content: `
      @media print {
        .break-inside-avoid {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }

        /* Prevent page breaks after headers */
        h1, h2 {
          page-break-after: avoid !important;
          break-after: avoid !important;
        }

        /* Keep header and content together */
        [style*="background: linear-gradient"] {
          page-break-after: avoid !important;
          break-after: avoid !important;
        }
      }
    `
  });

  // Generate PDF
  const pdf = await page.pdf({
    format: 'Letter',
    margin: {
      top: '0.5in',
      right: '0.5in',
      bottom: '0.5in',
      left: '0.5in',
    },
    printBackground: true,
  });

  await browser.close();

  // Save PDF
  const filename = `gitbutler-cheat-sheet-${level}.pdf`;
  const filepath = path.join(OUTPUT_DIR, filename);

  fs.writeFileSync(filepath, pdf);
  console.log(`✓ Saved ${filename}`);

  return filename;
}

async function main() {
  try {
    console.log('Starting PDF generation...');
    console.log(`Using base URL: ${BASE_URL}`);

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Generate both versions
    await generatePDF('basic');
    await generatePDF('all');

    console.log('\n✓ PDF generation complete!');
    console.log('PDFs saved to:', OUTPUT_DIR);
  } catch (error) {
    console.error('Error generating PDFs:', error);
    process.exit(1);
  }
}

main();
