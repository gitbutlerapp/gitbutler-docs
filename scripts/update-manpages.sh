#!/bin/bash

# Script to update CLI documentation from the GitButler repository
# This script:
# 1. Changes to the GitButler repository
# 2. Removes old CLI documentation files
# 3. Regenerates them using cargo run --bin but-clap
# 4. Returns to docs repo and syncs the files locally

set -e

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get the project root (parent of scripts directory)
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Configuration
GITBUTLER_REPO="${1:-../gitbutler}"

echo "Starting manpage update process..."
echo "GitButler repository: $GITBUTLER_REPO"
echo

# Check if GitButler repository exists
if [ ! -d "$GITBUTLER_REPO" ]; then
    echo "Error: GitButler repository not found at '$GITBUTLER_REPO'"
    echo "Usage: $0 [gitbutler-repo-path]"
    exit 1
fi

# Change to GitButler repository
echo "Changing to GitButler repository..."
cd "$GITBUTLER_REPO"

# Remove old cli-docs files
echo "Removing old cli-docs files..."
rm -f cli-docs/*

# Regenerate documentation using cargo
echo "Regenerating CLI documentation with cargo..."
cargo run --bin but-clap

echo "Documentation files regenerated successfully!"
echo

# Return to docs repository and run sync script
echo "Returning to docs repository and syncing files..."
cd "$PROJECT_ROOT"

# Run the sync-commands.sh script
bash "$SCRIPT_DIR/sync-commands.sh" "$GITBUTLER_REPO/cli-docs"

echo
echo "Manpage update completed successfully!"
