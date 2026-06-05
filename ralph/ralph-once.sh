#!/usr/bin/env bash
# One Ralph iteration (HITL). Implements the next ready issue end-to-end, then STOPS
# so a human can review before the AFK loop continues.
#
# Usage: ./ralph/ralph-once.sh
set -uo pipefail
cd "$(dirname "$0")/.."

mkdir -p ralph
ts=$(date +%Y%m%d-%H%M%S)
log="ralph/iteration-$ts.log"

echo "===== Ralph (HITL) single iteration -> $log ====="
claude -p "$(cat ralph/PROMPT.md)" \
  --dangerously-skip-permissions \
  2>&1 | tee "$log"

echo "===== Iteration done. Review the commit + issue before running afk-ralph.sh ====="
