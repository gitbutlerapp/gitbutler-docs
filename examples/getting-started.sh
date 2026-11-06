#!/usr/bin/env bash

source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

new_repo

mkdir src
printf '# Storefront\n' > README.md
git add .
git commit -qm "Initial commit"
git push -q origin main

printf 'export function LoginPage() {\n  return null;\n}\n' > src/login.ts
printf 'export async function getProducts() {\n  return [];\n}\n' > src/api.ts
but commit -b login-page -m "Add login page" src/login.ts > /dev/null
but commit -b api-client -m "Add API client" src/api.ts > /dev/null
but worktree new checkout-redesign > /dev/null

capture getting-started-but-status-1 'but status'
