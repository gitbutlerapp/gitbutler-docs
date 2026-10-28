#!/usr/bin/env bash

source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

new_repo

mkdir src
printf 'export const routes = [\n  "/home",\n];\n' > src/routes.ts
printf '# Tweeter\n' > README.md
git add .
git commit -qm "Initial commit"
git push -q origin main

printf 'export function addBookmark(id: string) {\n  return id;\n}\n' > src/bookmarks.ts
printf 'export function likeTweet(id: string) {\n  return id;\n}\n' > src/likes.ts
but commit -b user-bookmarks -m "Add bookmarks" src/bookmarks.ts > /dev/null
but commit -b liked-tweets -m "Add liked tweets" src/likes.ts > /dev/null

capture parallel-branches-but-status-1 'but status'
capture parallel-branches-git-log-1 'git log --oneline --graph --decorate --color=always'
capture_themed parallel-branches-but-diff-1 'but diff user-bookmarks'
capture_themed parallel-branches-but-diff-2 'but diff liked-tweets'

capture parallel-branches-but-unapply-1 'but unapply liked-tweets'
capture parallel-branches-but-status-2 'but status'
capture parallel-branches-git-log-2 'git log --oneline --graph --decorate --color=always'
capture parallel-branches-but-branch-1 'but branch'
capture parallel-branches-but-apply-1 'but apply liked-tweets'
