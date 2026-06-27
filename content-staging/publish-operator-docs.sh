#!/usr/bin/env bash
# Publish operator-gates + idiot docs to somarc/da-deep DA source.
# Requires: da auth login with somarc/da-deep write access.
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="$(pwd)"

if ! da auth status 2>/dev/null | rg -q '"valid": true'; then
  echo "Run: da auth login"
  exit 1
fi

da site info >/dev/null

put() {
  local da_path="$1"
  local file="$2"
  echo "── dry-run $da_path"
  da content put "$da_path" "$file"
  echo "── commit $da_path"
  da --commit content put "$da_path" "$file"
}

preview() {
  local path="$1"
  echo "── preview $path"
  da --commit preview page "$path"
  da preview explain "$path" --format json
}

put /cli/operator-gates.html "$ROOT/content-staging/cli/operator-gates.html"
put /cli/idiot.html "$ROOT/content-staging/cli/idiot.html"

preview /cli/operator-gates
preview /cli/idiot

echo ""
echo "Manual: merge content-staging/cli/index-operator-section.html into /cli/index.html in DA,"
echo "update hero count (22 → 24 surfaces), then:"
echo "  da --commit content put /cli/index.html <merged-index.html>"
echo "  da --commit preview page /cli/index"