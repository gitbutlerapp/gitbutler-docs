# GitButler CLI Cheat Sheet System

This system allows you to maintain a cheat sheet in JSON format and render it as both a beautiful HTML page and a downloadable PDF.

## File Structure

```
content/
  └── cheat.json              # Cheat sheet content (edit this!)

types/
  └── cheat.ts                # TypeScript interfaces

app/(docs)/cli/cheat/
  ├── page.tsx                # Main cheat sheet page
  └── print-button.tsx        # Print/PDF download buttons

app/api/cheat/pdf/
  └── route.ts                # PDF generation API endpoint

app/global.css                # Includes print styles for PDF
```

## Cheat Sheet JSON Structure

The `content/cheat.json` file follows this structure:

```typescript
{
  "title": "string",           // Main title
  "subtitle": "string",        // Optional subtitle
  "description": "string",     // Introductory description
  "sections": [                // Array of sections
    {
      "title": "string",       // Section title
      "description": "string", // Section description
      "diagram": {             // Optional diagram
        "type": "ascii" | "mermaid",
        "content": "string"
      },
      "items": [               // Array of commands
        {
          "command": "string",      // Command text
          "description": "string"   // Command description
        }
      ]
    }
  ]
}
```

## Features

### HTML Page
- Accessible at `/cli/cheat`
- Responsive two-column layout on desktop
- Dark mode support
- Print-optimized styling
- Automatic section formatting

### PDF Generation

Two methods to generate PDFs:

1. **Browser Print (No setup required)**
   - Click "Print" button
   - Use browser's print dialog
   - Select "Save as PDF"
   - Styled specifically for print output

2. **Direct PDF Download (Requires Puppeteer)**
   - Click "Download PDF" button
   - Generates PDF server-side using Puppeteer
   - Professional output with exact colors

## Generating PDFs

PDFs are pre-generated as static files and stored in the `public/` directory. This provides better performance than on-demand generation.

### Generate PDFs

Run this command to generate both basic and advanced PDFs:

```bash
pnpm generate-cheat-pdfs
```

This will create:
- `public/gitbutler-cheat-sheet-basic.pdf` - Basic commands only
- `public/gitbutler-cheat-sheet-all.pdf` - All commands

**Important:** The dev server must be running for PDF generation to work:

```bash
# Terminal 1: Start dev server
pnpm dev

# Terminal 2: Generate PDFs
pnpm generate-cheat-pdfs
```

### For Production

Before deploying, generate the PDFs:

```bash
# Build the site
pnpm build

# Start production server
pnpm start &

# Generate PDFs
NEXT_PUBLIC_BASE_URL=http://localhost:3000 pnpm generate-cheat-pdfs

# Or set your production URL
NEXT_PUBLIC_BASE_URL=https://yourdomain.com pnpm generate-cheat-pdfs
```

### Environment Variables

- `NEXT_PUBLIC_BASE_URL` - The base URL where your site is running (default: `http://localhost:3000`)

### Docker/Production Notes

If deploying in Docker or a restricted environment, you may need to install Chrome dependencies for Puppeteer:

```dockerfile
# Add to your Dockerfile
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-sandbox \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/*
```

## Customization

### Styling

The cheat sheet uses Tailwind CSS classes. Key customization points:

1. **Header gradient**: `app/(docs)/cli/cheat/page.tsx`
   ```tsx
   className="bg-gradient-to-r from-teal-600 to-teal-700"
   ```

2. **Print styles**: `app/global.css`
   - Page size: `@page { size: letter; }`
   - Margins: `margin: 0.5in;`

3. **Colors**: Modify the Tailwind classes in `page.tsx`

### Adding Diagrams

#### ASCII Diagrams
```json
{
  "diagram": {
    "type": "ascii",
    "content": "    Workspace\n       |\n   +---+---+\n   |   |   |\nBranch1 Branch2 Branch3"
  }
}
```

#### Mermaid Diagrams
```json
{
  "diagram": {
    "type": "mermaid",
    "content": "graph TD\n    A[Start] --> B[Process]\n    B --> C[End]"
  }
}
```

Note: Mermaid diagrams require adding the Mermaid library. Add to your layout:

```tsx
<Script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js" />
```

## Usage

### Editing the Cheat Sheet

1. Edit `content/cheat.json`
2. Add/remove sections and commands
3. Save the file
4. The page automatically updates (after dev server reload)

### Viewing

- **Local development**: `http://localhost:3000/cli/cheat`
- **Production**: `https://yourdomain.com/cli/cheat`

### Sharing

- Link users to `/cli/cheat` from documentation
- The page is already linked from the CLI Overview page
- Users can print or download PDF directly from the page

## Examples

See the current `content/cheat.json` for a complete example with:
- Multiple sections
- Various command formats
- ASCII diagram
- Proper descriptions

## Troubleshooting

### PDF Download Shows "503" Error
- Install Puppeteer: `pnpm add puppeteer`
- Restart your dev server

### PDF is Blank or Incomplete
- Check `NEXT_PUBLIC_BASE_URL` environment variable
- Ensure the page loads correctly in browser first
- Check browser console for errors

### Print Styling Issues
- Open browser print preview to test
- Modify print styles in `app/global.css` under `@media print`
- Use `print:` Tailwind utilities in the page component

### Colors Don't Show in PDF
- Ensure `printBackground: true` is set in the PDF generation code
- Use `print-color-adjust: exact` CSS property (already included)

## Future Enhancements

Possible improvements:

- Multiple cheat sheets (commands, shortcuts, etc.)
- Interactive command examples
- Search functionality
- Versioned cheat sheets
- Multi-language support
- Custom color themes
- Export to other formats (SVG, PNG)
