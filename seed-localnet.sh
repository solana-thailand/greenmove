#!/usr/bin/env bash
set -euo pipefail

RPC_URL="http://127.0.0.1:8899"
PROGRAM_ID="36D7U8McCLZF9ahuGmoiXehXzFLFm6v8N1gQVAfricSY"
CLI_DIR=".mock_device_solar"
DEPLOY_DIR="target/deploy"
SO_FILE="${DEPLOY_DIR}/greenmove.so"
KEYPAIR_FILE="${DEPLOY_DIR}/greenmove-keypair.json"

PASSED=0
FAILED=0

log_step()   { echo ""; echo "▶ $1"; }
log_pass()   { echo "  ✅ $1"; PASSED=$((PASSED + 1)); }
log_fail()   { echo "  ❌ $1"; FAILED=$((FAILED + 1)); }
log_record() { echo "    record #$1: wattage=${2}mW energy=${3}Wh"; }

is_healthy() {
  curl -sf "${RPC_URL}" \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' 2>/dev/null | grep -q '"ok"'
}

cli() {
  cargo run --manifest-path "${CLI_DIR}/Cargo.toml" --quiet -- "$@"
}

cmd_ensure_surfpool() {
  if is_healthy; then
    echo "surfpool running on ${RPC_URL}"
    return 0
  fi
  log_step "starting surfpool"
  bash surfpool-dev.sh start
}

cmd_deploy() {
  if [ ! -f "${SO_FILE}" ]; then
    log_step "building program"
    anchor build
  fi
  log_step "deploying program"
  solana program deploy --url "${RPC_URL}" "${SO_FILE}" --program-id "${KEYPAIR_FILE}"
}

cmd_seed() {
  log_step "registering devices"

  cli register --unique-id "PANEL-ROOF-01" --name "Rooftop Solar Array"   && log_pass "PANEL-ROOF-01"  || log_fail "PANEL-ROOF-01"
  cli register --unique-id "PANEL-BALC-01" --name "Balcony Panel"         && log_pass "PANEL-BALC-01"  || log_fail "PANEL-BALC-01"
  cli register --unique-id "PANEL-GARAGE"  --name "Garage Roof Panel"     && log_pass "PANEL-GARAGE"   || log_fail "PANEL-GARAGE"

  log_step "recording energy — PANEL-ROOF-01 (8 records)"
  local i
  for i in $(seq 1 8); do
    local wattage=$((3000 + (i * 200) + (RANDOM % 500)))
    local energy=$((15 + i * 3))
    cli record --unique-id "PANEL-ROOF-01" --wattage "${wattage}" --energy "${energy}" && log_record "${i}" "${wattage}" "${energy}" || log_fail "record #${i}"
  done

  log_step "recording energy — PANEL-BALC-01 (5 records)"
  for i in $(seq 1 5); do
    local wattage=$((1500 + (i * 150) + (RANDOM % 300)))
    local energy=$((5 + i * 2))
    cli record --unique-id "PANEL-BALC-01" --wattage "${wattage}" --energy "${energy}" && log_record "${i}" "${wattage}" "${energy}" || log_fail "record #${i}"
  done

  log_step "recording energy — PANEL-GARAGE (3 records)"
  for i in $(seq 1 3); do
    local wattage=$((2000 + (i * 300) + (RANDOM % 400)))
    local energy=$((8 + i * 4))
    cli record --unique-id "PANEL-GARAGE" --wattage "${wattage}" --energy "${energy}" && log_record "${i}" "${wattage}" "${energy}" || log_fail "record #${i}"
  done

  log_step "device info"
  echo ""
  cli info --unique-id "PANEL-ROOF-01"
  echo ""
  cli info --unique-id "PANEL-BALC-01"
  echo ""
  cli info --unique-id "PANEL-GARAGE"

  echo ""
  echo "═══════════════════════════════════════"
  echo "  seeded: ${PASSED} ok, ${FAILED} failed"
  echo "═══════════════════════════════════════"
}

cmd_clean() {
  log_step "clean slate: stop + build + start + deploy + seed"
  bash surfpool-dev.sh stop 2>/dev/null || true
  anchor build
  bash surfpool-dev.sh start
  solana program deploy --url "${RPC_URL}" "${SO_FILE}" --program-id "${KEYPAIR_FILE}"
  cmd_seed
}

cmd_status() {
  if is_healthy; then
    echo "surfpool: running on ${RPC_URL}"
  else
    echo "surfpool: not running"
  fi
}

usage() {
  echo "usage: $0 <command>"
  echo ""
  echo "commands:"
  echo "  ensure   start surfpool if not running"
  echo "  deploy   deploy greenmove program to surfpool"
  echo "  seed     register devices + record energy data"
  echo "  clean    stop → build → start → deploy → seed"
  echo "  status   show surfpool status"
}

case "${1:-}" in
  ensure)  cmd_ensure_surfpool ;;
  deploy)  cmd_deploy          ;;
  seed)    cmd_ensure_surfpool && cmd_deploy && cmd_seed ;;
  clean)   cmd_clean           ;;
  status)  cmd_status          ;;
  *)       usage               ;;
esac
