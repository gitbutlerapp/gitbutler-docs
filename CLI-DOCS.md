# CLI Output Management System

This system automatically captures and caches CLI command outputs in MDX files, converting them to SVG format for consistent rendering.

## Setup

1. Configure `ansi-run.json` with your example project path and starting commit hash:

```json
{
  "exampleProjectPath": "/path/to/example/project",
  "startingHash": "initial-commit-hash",
  "config": {
    "cacheDir": "content/cache",
    "outputFormat": "svg"
  }
}
```

2. Install dependencies:

```bash
pnpm install
```

## Usage

### Adding CLI Commands to MDX

Use special `cli` code blocks in your MDX files:

````mdx
Here's how to check status:

```cli
but status
```
````

The output will be automatically captured and cached.

````

### Restore Commands

To restore to a specific state before running commands, add a restore comment:

```mdx
{/* restore [commit-hash] */}

```cli
but status
````

This will run `but restore [commit-hash]` before executing the cli command.

````

### Updating CLI Outputs

Run the update script to process all MDX files and update CLI outputs:

```bash
pnpm update-cli
````

This will:

- Read your `ansi-run.json` configuration
- Change to your example project directory
- Restore to the starting hash
- Process all MDX files in `content/docs/`
- Execute CLI commands and capture outputs
- Convert outputs to SVG using ansi2html
- Cache outputs in `content/cache/[hash].svg`
- Update MDX files with hash references: ```cli [hash]
- Report any changes detected

### How It Works

1. **Processing**: The script finds all ````cli` blocks in MDX files
2. **Execution**: Commands are run in your configured example project
3. **Caching**: Output is converted to SVG and stored with a content hash
4. **Updates**: MDX blocks are updated with hash references
5. **Rendering**: The CliBlock component renders cached SVGs or shows placeholders

### File Structure

```
├── ansi-run.json                    # Configuration
├── content/
│   ├── cache/                       # Cached SVG outputs
│   │   ├── abc123def456.svg
│   │   └── def789ghi012.svg
│   └── docs/                        # MDX documentation files
│       └── commands/
│           └── status.mdx
├── scripts/
│   └── update-cli-outputs.js        # Main processing script
└── app/
    └── components/
        ├── CliBlock.tsx             # Rendering component
        └── remark-cli.ts            # MDX transformer
```

### Example Workflow

1. Create a new MDX file with CLI commands:

````mdx
# Status Command

Check your workspace status:

```cli
but status
```
````

````

2. Run the update script:
```bash
pnpm update-cli
````

3. The script will show output like:

```
Processing: content/docs/commands/status.mdx
Found CLI command: but status
New CLI block found: but status
Updated: content/docs/commands/status.mdx
```

4. Your MDX file is now updated:

````mdx
# Status Command

Check your workspace status:

```cli [abc123def456]
but status
```
````

````

5. When rendered, users see the actual command output in SVG format.

## Troubleshooting

- **Missing outputs**: Run `pnpm update-cli` to generate missing cache files
- **Outdated outputs**: The script will detect hash changes and notify you
- **Command failures**: Failed commands will still be cached to show error output
- **Path issues**: Ensure your `ansi-run.json` paths are absolute and correct

### Updating CLI Outputs

Run the update script to process all MDX files and update CLI outputs:

```bash
export CLICOLOR_FORCE=1
export GIT_AUTHOR_DATE="2020-09-09 09:06:03 +0800"
export GIT_COMMITTER_DATE="2020-10-09 09:06:03 +0800"
export NO_BG_TASKS=1
git config gitbutler.testing.changeId 42
pnpm update-cli
````

## Commands

The command "man pages" are copied from `../gitbutler/cli-docs` so that changes to the commands docs can be included in changes with the code.

To update the command man-pages, you can run ./scripts/sync-commands.sh

## Manual Runs

You can also simply run `ansi-senor <command>` and ansi-senor will output an html file that you can copy to the `public/cli-examples/` directory and reference in a doc with this syntax:

```ansi but-setup-5faf7f36
but setup
```
