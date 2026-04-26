#!/usr/bin/env bash
set -euo pipefail

kill_surfpool() {
  pkill -x "surfpool" 2>/dev/null || true
  sleep 1
  if pgrep -x "surfpool" > /dev/null 2>&1; then
    pkill -9 -x "surfpool" 2>/dev/null || true
    sleep 1
  fi
}

if pgrep -x "surfpool" > /dev/null 2>&1; then
  echo "▶ stopping surfpool"
  kill_surfpool
  if pgrep -x "surfpool" > /dev/null 2>&1; then
    echo "  ❌ surfpool still running"
    exit 1
  fi
  echo "  ✅ surfpool stopped"
else
  echo "surfpool not running"
fi
