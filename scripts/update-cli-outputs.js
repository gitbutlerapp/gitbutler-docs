#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';
import crypto from 'crypto';
import { glob } from 'glob';

class CliOutputUpdater {
  constructor() {
    this.config = null;
    this.hasChanges = false;
    this.changedFiles = [];
    this.obsoletedCacheFiles = new Set();
    this.usedCacheFiles = new Set();
    this.commandCountsPerPage = {}; // Track command occurrences per page
  }

  async loadConfig() {
    try {
      const configContent = await fs.readFile('cli-examples-run.json', 'utf8');
      this.config = JSON.parse(configContent);
    } catch (error) {
      throw new Error(`Failed to load cli-examples-run.json: ${error.message}`);
    }
  }

  async ensureCacheDir() {
    const cacheDir = this.config.config.cacheDir;
    try {
      await fs.access(cacheDir);
    } catch {
      await fs.mkdir(cacheDir, { recursive: true });
    }
  }

  async cleanupObsoletedCacheFiles() {
    // Remove cache files that are still being used from the obsoleted set
    for (const usedFilename of this.usedCacheFiles) {
      this.obsoletedCacheFiles.delete(usedFilename);
    }

    // Delete remaining obsoleted cache files
    for (const obsoletedFilename of this.obsoletedCacheFiles) {
      const cacheFile = path.join(this.config.config.cacheDir, `${obsoletedFilename}.html`);
      try {
        await fs.unlink(cacheFile);
        console.log(`Removed obsoleted cache file: ${cacheFile}`);
      } catch (error) {
        // File might not exist, which is fine
        console.log(`Obsoleted cache file not found (already cleaned): ${cacheFile}`);
      }
    }

    if (this.obsoletedCacheFiles.size > 0) {
      console.log(`Cleaned up ${this.obsoletedCacheFiles.size} obsoleted cache files`);
    }
  }

  async initializeProject() {
    const { exampleProjectPath, startingHash } = this.config;

    // Store the original docs directory
    const docsDirectory = process.cwd();

    console.log(`Changing to example project: ${exampleProjectPath}`);
    process.chdir(exampleProjectPath);

    // Check for and execute setup script in docs directory
    const setupScriptPath = path.join(docsDirectory, 'scripts', 'pre-update-cli.sh');
    try {
      await fs.access(setupScriptPath);
      console.log(`Found setup script: ${setupScriptPath}`);
      console.log('Executing setup script...');
      execSync(`bash "${setupScriptPath}"`, {
        stdio: 'inherit',
        cwd: exampleProjectPath
      });
      console.log('Setup script completed');
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.warn(`Warning: Failed to execute setup script: ${error.message}`);
      }
      // If file doesn't exist (ENOENT), silently continue
    }

    console.log(`Restoring to starting hash: ${startingHash}`);
    try {
      const restoreCommand = this.replaceButCommand(`but oplog restore --force ${startingHash}`);
      execSync(restoreCommand, { stdio: 'inherit' });
    } catch (error) {
      console.warn(`Warning: Failed to restore to starting hash ${startingHash}: ${error.message}`);
    }

    // Return to docs directory
    console.log(`Returning to docs directory: ${docsDirectory}`);
    process.chdir(docsDirectory);
  }

  hashContent(content) {
    return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
  }

  generateCacheFilename(pageName, command, ordinal) {
    // Extract just the command name (first word after 'but' or first word)
    const commandParts = command.trim().split(/\s+/);
    let commandName = commandParts[0];

    // If it's a 'but' command, include the first argument
    if (commandName === 'but' && commandParts.length > 1) {
      commandName = `but-${commandParts[1]}`;
    } else if (commandName.includes('/')) {
      // Handle full path to but command (e.g., /path/to/gitbutler-tauri)
      commandName = commandParts.length > 1 ? `but-${commandParts[1]}` : 'but';
    }

    // Sanitize the filename components
    const sanitize = (str) => str.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').toLowerCase();

    return `${sanitize(pageName)}-${sanitize(commandName)}-${ordinal}`;
  }

  getPageNameFromPath(filePath) {
    // Extract page name from file path (e.g., 'content/cli/inspecting.mdx' -> 'inspecting')
    const baseName = path.basename(filePath, '.mdx');
    return baseName;
  }

  replaceButCommand(command) {
    if (!this.config.but_path) {
      return command;
    }

    // Replace 'but ' at the beginning of the command
    if (command.startsWith('but ')) {
      return command.replace(/^but /, `${this.config.but_path} `);
    }

    // Replace standalone 'but' command
    if (command === 'but') {
      return this.config.but_path;
    }

    return command;
  }

  async runCommand(command, workingDir) {
    const originalDir = process.cwd();
    try {
      if (workingDir) {
        process.chdir(workingDir);
      }

      const output = execSync(command, {
        encoding: 'utf8',
        stdio: ['inherit', 'pipe', 'pipe'],
        env: {
          ...process.env,
          COLOR_OVERRIDE: 'true',
          GIT_AUTHOR_DATE: '2020-09-09 09:06:03 +0800',
          GIT_COMMITTER_DATE: '2020-10-09 09:06:03 +0800'
        }
      });

      return output;
    } catch (error) {
      // Return error output for display
      return error.stdout || error.stderr || `Command failed: ${command}`;
    } finally {
      process.chdir(originalDir);
    }
  }

  async convertToHtml(ansiOutput, hash, outputPath, command, workingDir) {
    // Use ansi-senor CLI to convert ANSI output to HTML
    // ansi-senor runs the command itself and captures output
    const ansiSenorPath = this.config.ansi_senor_path || 'ansi-senor';
    const fullCommand = `"${ansiSenorPath}" -o "${outputPath}" -t light '${command}'`;

    console.log(`Running ansi-senor command: ${fullCommand}`);
    console.log(`Working directory: ${workingDir}`);

    try {
      const result = execSync(fullCommand, {
        cwd: workingDir,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          CLICOLOR_FORCE: '1',
          GIT_AUTHOR_DATE: '2020-09-09 09:06:03 +0800',
          GIT_COMMITTER_DATE: '2020-10-09 09:06:03 +0800'
        }
      });

      console.log(`ansi-senor output: ${result}`);
      // HTML file is written by ansi-senor
    } catch (error) {
      console.error(`ansi-senor command: "${ansiSenorPath}" -o "${outputPath}" -t light '${command}'`);
      console.error(`ansi-senor stderr: ${error.stderr}`);
      console.error(`ansi-senor stdout: ${error.stdout}`);
      console.warn(`Failed to run ansi-senor: ${error.message}`);
      // Fallback: run command directly and create simple HTML
      try {
        const output = await this.runCommand(command, workingDir);
        const plainText = output.replace(/\x1b\[[0-9;]*m/g, '');
        const fallbackHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            margin: 0;
            padding: 16px;
            font-family: 'JetBrainsMono Nerd Font', 'JetBrains Mono', 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
            font-size: 14px;
            background-color: #F9FAFB;
            color: #24292e;
        }
        pre {
            margin: 0;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <pre>${plainText}</pre>
</body>
</html>`;
        await fs.writeFile(outputPath, fallbackHtml);
      } catch (fallbackError) {
        console.error(`Failed to create fallback HTML: ${fallbackError.message}`);
        throw error; // Re-throw original error
      }
    }
  }

  async processMdxFile(filePath) {
    //console.log(`Processing: ${filePath}`);

    const content = await fs.readFile(filePath, 'utf8');
    const lines = content.split('\n');
    let modified = false;
    let currentRestore = null;

    // Initialize command count for this page
    const pageName = this.getPageNameFromPath(filePath);
    if (!this.commandCountsPerPage[pageName]) {
      this.commandCountsPerPage[pageName] = {};
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for restore commands
      const restoreMatch = line.match(/^{\/\* restore \[([^\]]+)\] \*\/}$/);
      if (restoreMatch) {
        currentRestore = restoreMatch[1];
        console.log(`Found restore command: ${currentRestore}`);
        continue;
      }

      // Check for run commands
      const runMatch = line.match(/^{\/\* run (.+) \*\/}$/);
      if (runMatch) {
        const runCommand = runMatch[1].trim();
        console.log(`Found run command: ${runCommand}`);

        // Execute the command in the example project directory
        try {
          const output = await this.runCommand(runCommand, this.config.exampleProjectPath);
          console.log(`Run command output:\n${output}`);
        } catch (error) {
          console.warn(`Failed to execute run command "${runCommand}": ${error.message}`);
        }
        continue;
      }

      // Check for cli blocks
      const cliBlockStart = line.match(/^```cli(?:\s+\[([^\]]+)\])?$/);
      if (cliBlockStart) {
        const existingParams = cliBlockStart[1];
        let existingHash, existingHeight;

        if (existingParams) {
          const params = existingParams.split(',').map(p => p.trim());
          existingHash = params[0] || undefined;
          existingHeight = params[1] || undefined;
        }

        // Find the command and closing block
        let j = i + 1;
        let command = '';
        while (j < lines.length && !lines[j].startsWith('```')) {
          if (command) command += '\n';
          command += lines[j];
          j++;
        }

        if (j >= lines.length) {
          console.warn(`Unclosed cli block in ${filePath} at line ${i + 1}`);
          continue;
        }

        command = command.trim();
        if (!command) {
          console.warn(`Empty cli block in ${filePath} at line ${i + 1}`);
          continue;
        }

        console.log(`Found CLI command: ${command}`);

        // Run restore command if needed
        if (currentRestore) {
          console.log(`Running restore: but oplog restore ${currentRestore}`);
          const restoreCommand = this.replaceButCommand(`but oplog restore --force ${currentRestore}`);
          await this.runCommand(restoreCommand, this.config.exampleProjectPath);
          currentRestore = null; // Reset after use
        }

        // Execute the command via ansi-senor (replace but path if needed)
        const actualCommand = this.replaceButCommand(command);

        // Generate semantic cache filename first to get the base name
        const cacheFilenameBase = this.generateCacheFilename(pageName, actualCommand, 0);

        // Track command occurrence for this page using the full cache filename base as the key
        // This ensures each unique command has its own counter
        if (!this.commandCountsPerPage[pageName][cacheFilenameBase]) {
          this.commandCountsPerPage[pageName][cacheFilenameBase] = 0;
        }
        this.commandCountsPerPage[pageName][cacheFilenameBase]++;
        const ordinal = this.commandCountsPerPage[pageName][cacheFilenameBase];

        // Generate final cache filename with the correct ordinal
        const cacheFilename = this.generateCacheFilename(pageName, actualCommand, ordinal);
        console.log(`Cache filename for command "${command}": ${cacheFilename}`);

        // Generate HTML to a temporary file first
        const tmpHash = crypto.randomBytes(8).toString('hex');
        // Use absolute path so ansi-senor writes to the correct location
        const tmpHtmlPath = path.resolve(this.config.config.cacheDir, `tmp-${tmpHash}.html`);

        try {
          await this.convertToHtml(null, tmpHash, tmpHtmlPath, actualCommand, this.config.exampleProjectPath);

          // Check if the file was created
          try {
            await fs.access(tmpHtmlPath);
          } catch (error) {
            throw new Error(`ansi-senor did not create output file: ${tmpHtmlPath}`);
          }

          // Read the generated HTML and hash it
          const htmlContent = await fs.readFile(tmpHtmlPath, 'utf8');
          const contentHash = this.hashContent(htmlContent);

          // Calculate height based on line count in the body content (22px per line)
          const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
          const bodyContent = bodyMatch ? bodyMatch[1] : htmlContent;
          const lineCount = bodyContent.split('\n').length;
          const calculatedHeight = `${lineCount * 22}px`;
          console.log(`Calculated height: ${calculatedHeight} (${lineCount} lines)`);

          // Track all cache filenames being used in this run
          this.usedCacheFiles.add(cacheFilename);

          // Check if filename or height changed
          const filenameChanged = existingHash && existingHash !== cacheFilename;
          const heightChanged = existingHeight !== calculatedHeight;
          const isNewBlock = !existingHash;

          // Check if content actually changed by comparing with existing file
          let contentChanged = false;
          if (existingHash && !filenameChanged) {
            const existingPath = path.resolve(this.config.config.cacheDir, `${existingHash}.html`);
            try {
              const existingContent = await fs.readFile(existingPath, 'utf8');
              const existingContentHash = this.hashContent(existingContent);
              contentChanged = existingContentHash !== contentHash;
            } catch {
              // File doesn't exist, treat as changed
              contentChanged = true;
            }
          }

          if (filenameChanged) {
            console.log(`Filename changed for command "${command}" in ${filePath}`);
            console.log(`  Old filename: ${existingHash}`);
            console.log(`  New filename: ${cacheFilename}`);

            // Mark old filename as obsoleted
            this.obsoletedCacheFiles.add(existingHash);

            this.hasChanges = true;
            this.changedFiles.push({
              file: filePath,
              command,
              oldHash: existingHash,
              newHash: cacheFilename,
              height: calculatedHeight,
              heightChanged
            });
          } else if ((heightChanged || contentChanged) && existingHash) {
            console.log(`Content or height changed for command "${command}" in ${filePath}`);
            if (heightChanged) {
              console.log(`  Old height: ${existingHeight || 'none'}`);
              console.log(`  New height: ${calculatedHeight}`);
            }
            if (contentChanged) {
              console.log(`  Content hash changed`);
            }

            this.hasChanges = true;
            this.changedFiles.push({
              file: filePath,
              command,
              oldHash: existingHash,
              newHash: cacheFilename,
              height: calculatedHeight,
              heightChanged: heightChanged || contentChanged
            });
          } else if (isNewBlock) {
            console.log(`New CLI block found: ${command}`);
            this.hasChanges = true;
            this.changedFiles.push({
              file: filePath,
              command,
              oldHash: null,
              newHash: cacheFilename,
              height: calculatedHeight
            });
          }

          // Rename the temporary file to the final semantic name
          const htmlPath = path.resolve(this.config.config.cacheDir, `${cacheFilename}.html`);
          await fs.rename(tmpHtmlPath, htmlPath);

          // Update the MDX file line with cache filename and height
          if (filenameChanged || heightChanged || contentChanged || isNewBlock) {
            lines[i] = `\`\`\`cli [${cacheFilename}, ${calculatedHeight}]`;
            modified = true;
          }
        } catch (error) {
          // Clean up temporary file on error
          try {
            await fs.unlink(tmpHtmlPath);
          } catch {}
          throw error;
        }

        // Skip to after the closing ```
        i = j;
      }
    }

    if (modified) {
      await fs.writeFile(filePath, lines.join('\n'));
      console.log(`Updated: ${filePath}`);
    }
  }

  async findMdxFiles() {
    // Find all meta.json files
    const metaFiles = await glob('content/**/meta.json');
    const orderedFiles = [];
    const processedFiles = new Set();

    // Process files in the order specified in meta.json files
    for (const metaFile of metaFiles.sort()) {
      const metaContent = await fs.readFile(metaFile, 'utf8');
      const meta = JSON.parse(metaContent);

      if (meta.pages && Array.isArray(meta.pages)) {
        const metaDir = path.dirname(metaFile);

        for (const page of meta.pages) {
          const mdxFile = path.join(metaDir, `${page}.mdx`);

          // Check if file exists
          try {
            await fs.access(mdxFile);
            orderedFiles.push(mdxFile);
            processedFiles.add(mdxFile);
          } catch {
            // File doesn't exist, skip it
          }
        }
      }
    }

    // Add any remaining MDX files not listed in meta.json (in alphabetical order)
    const allMdxFiles = await glob('content/**/*.mdx');
    for (const file of allMdxFiles.sort()) {
      if (!processedFiles.has(file)) {
        orderedFiles.push(file);
      }
    }

    return orderedFiles;
  }

  async run() {
    console.log('Starting CLI output update process...');

    await this.loadConfig();
    await this.ensureCacheDir();
    await this.initializeProject();

    const mdxFiles = await this.findMdxFiles();
    console.log(`Found ${mdxFiles.length} MDX files`);

    for (const file of mdxFiles) {
      await this.processMdxFile(file);
    }

    if (this.hasChanges) {
      console.log('\n=== CHANGES DETECTED ===');
      for (const change of this.changedFiles) {
        console.log(`File: ${change.file}`);
        console.log(`Command: ${change.command}`);
        if (change.oldHash) {
          console.log(`Hash changed: ${change.oldHash} → ${change.newHash}`);
        } else {
          console.log(`New hash: ${change.newHash}`);
        }
        if (change.height) {
          console.log(`Height: ${change.height}`);
        }
        if (change.heightChanged) {
          console.log(`Height was updated automatically`);
        }
        console.log('---');
      }
    } else {
      console.log('No changes detected.');
    }

    // Clean up obsoleted cache files at the end
    console.log('\n=== CLEANING UP OBSOLETED CACHE FILES ===');
    await this.cleanupObsoletedCacheFiles();

    console.log('CLI output update process completed.');
  }
}

// Run the updater
const updater = new CliOutputUpdater();
updater.run().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});