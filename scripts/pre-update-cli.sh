#!/usr/bin/env bash

# This script runs in the exampleProjectPath directory before the CLI update process begins.
# It executes before the "but restore" command, allowing you to set up the project state.

# Exit on error
set -e

echo "Running pre-update-cli setup..."

# Example: Pull latest changes from a remote
git push -f origin 204e309:main

# Example: Ensure the GitButler workspace is in a clean state
# but status

# Example: Set up environment variables
# export SOME_VAR="value"

# Example: Run a cleanup command
# git clean -fd

# Example: Ensure certain files exist
# touch some-file.txt

echo "Pre-update-cli setup completed"
