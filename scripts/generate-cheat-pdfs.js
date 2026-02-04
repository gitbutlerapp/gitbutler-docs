#!/usr/bin/env node

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_FILE = path.join(path.dirname(__dirname), 'content', 'cheat.json');
const OUTPUT_DIR = path.join(path.dirname(__dirname), 'public');

// Colors
const TEAL_PRIMARY = '#22B2B1';
const TEAL_DARK = '#1a8a89';
const GRAY_DARK = '#1f2937';
const GRAY_LIGHT = '#6b7280';
const GRAY_BG = '#f3f4f6';

function loadCheatSheet() {
  const content = fs.readFileSync(CONTENT_FILE, 'utf8');
  return JSON.parse(content);
}

function createPDF(filename, sections) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 36, bottom: 36, left: 36, right: 36 }
      });

      const outputPath = path.join(OUTPUT_DIR, filename);
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      const pageWidth = doc.page.width;
      const margin = 36;
      const contentWidth = pageWidth - (margin * 2);

      // Header with teal background
      doc.rect(0, 0, pageWidth, 120)
         .fill(TEAL_PRIMARY);

      doc.fillColor('white')
         .fontSize(32)
         .font('Helvetica-Bold')
         .text('GitButler CLI Cheat Sheet', margin, 30, { width: contentWidth });

      doc.fontSize(14)
         .font('Helvetica')
         .text('Essential commands for working with GitButler', margin, 70, { width: contentWidth });

      // Description
      doc.fillColor(GRAY_DARK)
         .fontSize(11)
         .text(
           'GitButler is a Git client that allows you to work on multiple branches simultaneously. This cheat sheet features the most important and commonly used GitButler CLI commands for easy reference.',
           margin,
           140,
           { width: contentWidth, align: 'left' }
         );

      const columnWidth = (contentWidth - 20) / 2;
      const startY = 180;
      const columnGap = 20;

      // Track y position for each column
      const columnY = [startY, startY];
      let currentColumn = 0;

      sections.forEach((section, sectionIndex) => {
        const xPosition = margin + (currentColumn * (columnWidth + columnGap));
        let yPosition = columnY[currentColumn];

        // Check if we need a new page
        if (yPosition > doc.page.height - 150) {
          doc.addPage();
          // Reset header on new page
          doc.rect(0, 0, pageWidth, 80)
             .fill(TEAL_PRIMARY);
          doc.fillColor('white')
             .fontSize(24)
             .font('Helvetica-Bold')
             .text('GitButler CLI Cheat Sheet', margin, 25, { width: contentWidth });

          yPosition = 100;
          columnY[0] = yPosition;
          columnY[1] = yPosition;
          currentColumn = 0;
        }

        // Section title
        doc.fillColor(GRAY_DARK)
           .fontSize(16)
           .font('Helvetica-Bold')
           .text(section.title, xPosition, yPosition, { width: columnWidth });

        yPosition += 20;

        // Section description
        doc.fillColor(GRAY_LIGHT)
           .fontSize(9)
           .font('Helvetica')
           .text(section.description, xPosition, yPosition, { width: columnWidth });

        yPosition += 25;

        // Commands
        section.items.forEach((item, itemIndex) => {
          // Check if this item would go off the page
          if (yPosition > doc.page.height - 80) {
            doc.addPage();
            // Add smaller header on continuation pages
            doc.rect(0, 0, pageWidth, 80)
               .fill(TEAL_PRIMARY);
            doc.fillColor('white')
               .fontSize(24)
               .font('Helvetica-Bold')
               .text('GitButler CLI Cheat Sheet', margin, 25, { width: contentWidth });

            yPosition = 100;
            columnY[0] = yPosition;
            columnY[1] = yPosition;
            currentColumn = 0;
          }

          const xPos = margin + (currentColumn * (columnWidth + columnGap));

          // Command box
          doc.rect(xPos, yPosition, columnWidth, 25)
             .fill(GRAY_DARK);

          doc.fillColor('white')
             .fontSize(9)
             .font('Courier')
             .text(item.command, xPos + 8, yPosition + 8, { width: columnWidth - 16 });

          yPosition += 30;

          // Command description
          doc.fillColor(GRAY_DARK)
             .fontSize(9)
             .font('Helvetica')
             .text(item.description, xPos, yPosition, { width: columnWidth });

          yPosition += 25;
        });

        // Add spacing between sections
        yPosition += 15;

        // Update column position
        columnY[currentColumn] = yPosition;

        // Move to next column
        currentColumn = (currentColumn + 1) % 2;
      });

      doc.end();
      stream.on('finish', () => {
        console.log(`✓ Saved ${filename}`);
        resolve();
      });
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

async function main() {
  try {
    console.log('Starting PDF generation with PDFKit...');

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Load cheat sheet data
    const cheatSheet = loadCheatSheet();

    // Generate basic version
    const basicSections = cheatSheet.sections.filter(s => s.level === 'basic');
    await createPDF('gitbutler-cheat-sheet-basic.pdf', basicSections);

    // Generate all version
    await createPDF('gitbutler-cheat-sheet-all.pdf', cheatSheet.sections);

    console.log('\n✓ PDF generation complete!');
    console.log('PDFs saved to:', OUTPUT_DIR);
  } catch (error) {
    console.error('Error generating PDFs:', error);
    process.exit(1);
  }
}

main();
