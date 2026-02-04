import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check if Puppeteer is available
    let puppeteer;
    try {
      puppeteer = await import('puppeteer');
    } catch (error) {
      return new NextResponse(
        'PDF generation requires Puppeteer. Please install it with: pnpm add puppeteer',
        { status: 503 }
      );
    }

    // Launch browser
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    // Navigate to the cheat sheet page
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    await page.goto(`${baseUrl}/cli/cheat`, {
      waitUntil: 'networkidle0',
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

    // Return PDF
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="gitbutler-cheat-sheet.pdf"',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return new NextResponse(
      `Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    );
  }
}
