import fs from 'fs/promises';
import path from 'path';

interface CliBlockProps {
  hash?: string;
  height?: string;
  lang?: 'cli' | 'ansi';
  children: React.ReactNode;
}

export default async function CliBlock({ hash, height, lang = 'cli', children }: CliBlockProps) {
  // If no hash, render as regular code block
  if (!hash) {
    return (
      <div className="rounded-lg border bg-muted p-4 mb-4">
        <div className="font-mono text-base text-muted-foreground mb-2">$ {children}</div>
        <div className="text-sm text-muted-foreground">
          Run <code>pnpm update-cli</code> to generate output
        </div>
      </div>
    );
  }

  // Determine which directory to use based on lang
  const dir = lang === 'ansi'
    ? path.join(process.cwd(), 'public/cli-examples')
    : path.join(process.cwd(), 'public/cache/cli-output');
  const htmlPath = path.join(dir, `${hash}.html`);

  try {
    // Read the HTML file content
    const fullHtmlContent = await fs.readFile(htmlPath, 'utf8');

    // Extract content from body tag if present (for full HTML documents)
    const bodyMatch = fullHtmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const htmlContent = bodyMatch ? bodyMatch[1] : fullHtmlContent;

    return (
      <div className="rounded-lg border bg-muted overflow-hidden mb-4">
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b">
          <div className="font-mono text-base text-muted-foreground">$ {children}</div>
        </div>
        <div className="p-4 cli-output-container">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      </div>
    );
  } catch (error) {
    // HTML file not found, show placeholder
    const errorMessage = lang === 'ansi'
      ? 'Output not found. Run ./scripts/sync-commands.sh to sync examples.'
      : 'Output cache not found. Run pnpm update-cli to generate.';

    return (
      <div className="rounded-lg border bg-muted p-4 mb-4">
        <div className="font-mono text-base text-muted-foreground mb-2">$ {children}</div>
        <div className="text-sm text-muted-foreground">
          {errorMessage} (hash: {hash}{height && `, height: ${height}`})
        </div>
      </div>
    );
  }
}