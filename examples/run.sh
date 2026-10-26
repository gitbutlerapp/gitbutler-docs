#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

if [ "$#" -gt 0 ]; then
  scenarios=("$@")
else
  scenarios=()
  for file in *.sh; do
    case "$file" in
      lib.sh | run.sh) ;;
      *) scenarios+=("${file%.sh}") ;;
    esac
  done
fi

for scenario in "${scenarios[@]}"; do
  echo "Running $scenario"
  bash "./$scenario.sh"
done
