#!/usr/bin/env bash

set -euo pipefail

EXAMPLES_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCS_ROOT="$(cd "$EXAMPLES_DIR/.." && pwd)"
OUTPUT_DIR="$DOCS_ROOT/public/examples"
BUT_VERSION="$(tr -d '[:space:]' < "$EXAMPLES_DIR/but-version")"
BUT_CACHE_DIR="${XDG_CACHE_HOME:-$HOME/.cache}/gitbutler-docs-examples/$BUT_VERSION"
BUT_BIN_DIR="$BUT_CACHE_DIR/bin"

ensure_but() {
  if [ -x "$BUT_BIN_DIR/but" ]; then
    return
  fi

  local os arch platform url
  case "$(uname -s)" in
    Darwin) os=darwin ;;
    Linux) os=linux ;;
    *) echo "Unsupported OS: $(uname -s)" >&2; exit 1 ;;
  esac
  case "$(uname -m)" in
    arm64 | aarch64) arch=aarch64 ;;
    x86_64) arch=x86_64 ;;
    *) echo "Unsupported architecture: $(uname -m)" >&2; exit 1 ;;
  esac
  platform="$os-$arch"

  url="$(curl -fsSL "https://app.gitbutler.com/releases/version/$BUT_VERSION" |
    node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const p=JSON.parse(s).platforms[process.argv[1]];if(!p){process.exit(1)}console.log(p.url)})' "$platform")"

  echo "Downloading GitButler $BUT_VERSION for $platform"
  mkdir -p "$BUT_BIN_DIR"
  if [ "$os" = darwin ]; then
    curl -fsSL "$url" | tar -xz -C "$BUT_CACHE_DIR"
    ln -sf "$BUT_CACHE_DIR/GitButler.app/Contents/MacOS/gitbutler-tauri" "$BUT_BIN_DIR/but"
  else
    curl -fsSL -o "$BUT_BIN_DIR/but" "$url"
    chmod +x "$BUT_BIN_DIR/but"
  fi
}

clean_env() {
  env -i \
    HOME="$HOME" \
    PATH="$BUT_BIN_DIR:$PATH" \
    TERM=xterm-256color \
    COLORTERM=truecolor \
    LANG="${LANG:-en_US.UTF-8}" \
    E2E_TEST_APP_DATA_DIR="$SCENARIO_APP_DATA" \
    "$@"
}

but() {
  clean_env but "$@"
}

new_repo() {
  ensure_but
  command -v ansi-senor >/dev/null || {
    echo "ansi-senor is required: cargo install ansi-senor" >&2
    exit 1
  }

  SCENARIO_DIR="$(mktemp -d)"
  SCENARIO_APP_DATA="$(mktemp -d)"
  trap 'rm -rf "$SCENARIO_DIR" "$SCENARIO_APP_DATA"' EXIT

  git init -q --bare "$SCENARIO_DIR/remote.git"
  git init -q -b main "$SCENARIO_DIR/app"
  cd "$SCENARIO_DIR/app"
  git config user.name "Markus Butler"
  git config user.email markus@example.com
  git remote add origin ../remote.git
  mkdir -p "$OUTPUT_DIR"
}

_render() {
  local name="$1" theme="$2" command="$3" out
  out="$OUTPUT_DIR/$name.html"
  [ "$theme" = dark ] && out="$OUTPUT_DIR/$name.dark.html"
  clean_env BUT_THEME="$theme" CLICOLOR_FORCE=1 ansi-senor -o "$out" -t "$theme" "$command" >/dev/null
  perl -0pi -e 's|<pre>(?:<[^>]*>)*[^<\n]*Initiated a background sync\.\.\.(?:<[^>]*>)*\n|<pre>|' "$out"
  echo "  $out"
}

capture() {
  _render "$1" light "$2"
}

capture_themed() {
  _render "$1" light "$2"
  _render "$1" dark "$2"
}
