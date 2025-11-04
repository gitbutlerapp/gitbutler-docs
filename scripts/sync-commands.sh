#!/bin/bash

# Script to sync command documentation from CLI repository
# Usage: ./scripts/sync-commands.sh [source-repo-path]
# Default source repo: ../gitbutler/cli-docs

set -e

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get the project root (parent of scripts directory)
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Change to project root to ensure relative paths work correctly
cd "$PROJECT_ROOT"

# Configuration
SOURCE_REPO="${1:-../gitbutler/cli-docs}"
TARGET_DIR="content/docs/commands"
CLI_EXAMPLES_DIR="public/cli-examples"
GROUPS_FILE="$TARGET_DIR/groups.json"
META_FILE="$TARGET_DIR/meta.json"

echo "Syncing command documentation..."
echo "Source: $SOURCE_REPO"
echo "Target: $TARGET_DIR"
echo

# Check if source directory exists
if [ ! -d "$SOURCE_REPO" ]; then
    echo "Error: Source directory '$SOURCE_REPO' does not exist"
    exit 1
fi

# Check if groups.json exists
if [ ! -f "$GROUPS_FILE" ]; then
    echo "Error: groups.json not found at $GROUPS_FILE"
    exit 1
fi

# Remove existing MDX files (but keep groups.json and meta.json)
echo "Removing existing MDX files..."
rm -f "$TARGET_DIR"/but-*.mdx

# Copy MDX files from source
echo "Copying MDX files from source repository..."
if ! cp "$SOURCE_REPO"/*.mdx "$TARGET_DIR/" 2>/dev/null; then
    echo "Warning: No MDX files found in source directory"
fi

# Count copied files
COPIED_FILES=$(ls -1 "$TARGET_DIR"/*.mdx 2>/dev/null | wc -l | tr -d ' ')
echo "Copied $COPIED_FILES MDX files"

# Sync cli-examples directory
echo
echo "Syncing cli-examples directory..."

# Check if source cli-examples directory exists
SOURCE_CLI_EXAMPLES="$SOURCE_REPO/cli-examples"
if [ -d "$SOURCE_CLI_EXAMPLES" ]; then
    # Create target cli-examples directory if it doesn't exist
    mkdir -p "$CLI_EXAMPLES_DIR"

    # Remove existing HTML files from target
    echo "Removing existing CLI example files..."
    rm -f "$CLI_EXAMPLES_DIR"/*.html

    # Copy HTML files from source
    echo "Copying CLI example files..."
    if cp "$SOURCE_CLI_EXAMPLES"/*.html "$CLI_EXAMPLES_DIR/" 2>/dev/null; then
        COPIED_EXAMPLES=$(ls -1 "$CLI_EXAMPLES_DIR"/*.html 2>/dev/null | wc -l | tr -d ' ')
        echo "Copied $COPIED_EXAMPLES CLI example files"
    else
        echo "Warning: No HTML files found in $SOURCE_CLI_EXAMPLES"
    fi
else
    echo "Warning: cli-examples directory not found at $SOURCE_CLI_EXAMPLES"
fi

# Generate meta.json using Node.js
echo "Generating meta.json..."
node -e "
const fs = require('fs');
const path = require('path');

// Read groups.json
const groupsPath = path.join('$TARGET_DIR', 'groups.json');
const groups = JSON.parse(fs.readFileSync(groupsPath, 'utf8'));

// Get all MDX files
const files = fs.readdirSync('$TARGET_DIR')
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace('.mdx', ''));

// Track which commands are assigned to groups
const assignedCommands = new Set();
Object.values(groups).forEach(commands => {
    commands.forEach(cmd => assignedCommands.add(cmd));
});

// Find unassigned commands
const unassignedCommands = files.filter(f => !assignedCommands.has(f)).sort();

// Build pages array
const pages = [];

// Add grouped commands
Object.entries(groups).forEach(([groupName, commands]) => {
    // Only add groups that have commands present in the files
    const presentCommands = commands.filter(cmd => files.includes(cmd));
    if (presentCommands.length > 0) {
        pages.push(\`---\${groupName}---\`);
        presentCommands.forEach(cmd => pages.push(cmd));
    }
});

// Add miscellaneous section if there are unassigned commands
if (unassignedCommands.length > 0) {
    pages.push('---Miscellaneous---');
    unassignedCommands.forEach(cmd => pages.push(cmd));
}

// Create meta.json structure
const meta = {
    title: 'Commands',
    defaultOpen: false,
    pages: pages
};

// Write meta.json
const metaPath = path.join('$TARGET_DIR', 'meta.json');
fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');

console.log('Generated meta.json with ' + pages.filter(p => !p.startsWith('---')).length + ' commands');
"

echo
echo "Sync completed successfully!"
echo "You can now view the updated commands in $TARGET_DIR"
