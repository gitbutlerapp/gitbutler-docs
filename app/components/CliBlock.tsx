import fs from 'fs/promises';
import path from 'path';

interface CliBlockProps {
  hash?: string;
  height?: string;
  lang?: 'cli' | 'ansi' | 'example';
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
  const dir = {
    ansi: path.join(process.cwd(), 'public/cli-examples'),
    example: path.join(process.cwd(), 'public/examples'),
    cli: path.join(process.cwd(), 'public/cache/cli-output'),
  }[lang];
  const htmlPath = path.join(dir, `${hash}.html`);
  const darkHtmlPath = path.join(dir, `${hash}.dark.html`);

  const bodyOf = (html: string) => {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    return bodyMatch ? bodyMatch[1] : html;
  };

  try {
    const htmlContent = bodyOf(await fs.readFile(htmlPath, 'utf8'));
    const darkHtmlContent = await fs
      .readFile(darkHtmlPath, 'utf8')
      .then(bodyOf)
      .catch(() => undefined);

    return (
      <div className="rounded-lg border bg-muted overflow-hidden mb-4">
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b">
          <div className="font-mono text-base text-muted-foreground">$ {children}</div>
        </div>
        <div className="p-4 cli-output-container">
          <div
            className={darkHtmlContent ? 'dark:hidden' : undefined}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
          {darkHtmlContent && (
            <div
              className="hidden dark:block"
              dangerouslySetInnerHTML={{ __html: darkHtmlContent }}
            />
          )}
        </div>
      </div>
    );
  } catch {
    // HTML file not found, show placeholder
    const errorMessage = {
      ansi: 'Output not found. Run ./scripts/sync-commands.sh to sync examples.',
      example: 'Example output not found. Run pnpm examples to generate.',
      cli: 'Output cache not found. Run pnpm update-cli to generate.',
    }[lang];

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