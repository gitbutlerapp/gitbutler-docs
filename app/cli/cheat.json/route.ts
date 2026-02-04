import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'content', 'cheat.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="gitbutler-cheat-sheet.json"',
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load cheat sheet' },
      { status: 500 }
    );
  }
}
