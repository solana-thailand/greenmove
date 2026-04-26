#!/usr/bin/env bash
set -euo pipefail

RPC_PORT=8899
WS_PORT=8900
HOST="127.0.0.1"
RPC_URL="http://${HOST}:${RPC_PORT}"
SLOT_TIME=400

PROGRAM_NAME="greenmove"
PROGRAM_ID="36D7U8McCLZF9ahuGmoiXehXzFLFm6v8N1gQVAfricSY"
DEPLOY_DIR="target/deploy"
SO_FILE="${DEPLOY_DIR}/${PROGRAM_NAME}.so"
KEYPAIR_FILE="${DEPLOY_DIR}/${PROGRAM_NAME}-keypair.json"
KEYPAIR_PATH="${HOME}/.config/solana/id.json"

PASSED=0
FAILED=0

# ─── helpers ──────────────────────────────────────────────────────────────────

log_step() { echo ""; echo "▶ $1"; }
log_pass() { echo "  ✅ PASS: $1"; PASSED=$((PASSED + 1)); }
log_fail() { echo "  ❌ FAIL: $1"; FAILED=$((FAILED + 1)); }

health_check() {
  curl -sf "${RPC_URL}" \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","id":1,"method":"getHealth"}' 2>/dev/null || echo ""
}

is_healthy() {
  health_check | grep -q '"ok"'
}

kill_surfpool() {
  pkill -x "surfpool" 2>/dev/null || true
  sleep 1
  if pgrep -x "surfpool" > /dev/null 2>&1; then
    pkill -9 -x "surfpool" 2>/dev/null || true
    sleep 1
  fi
}

# ─── commands ─────────────────────────────────────────────────────────────────

cmd_start() {
  if is_healthy; then
    echo "surfpool already running on ${RPC_URL}"
    return 0
  fi

  kill_surfpool

  log_step "starting surfpool on ${HOST}:${RPC_PORT}"
  surfpool start \
    --ci \
    --offline \
    --yes \
    --port "${RPC_PORT}" \
    --ws-port "${WS_PORT}" \
    --host "${HOST}" \
    --slot-time "${SLOT_TIME}" \
    &

  for i in $(seq 1 10); do
    sleep 1
    if is_healthy; then
      echo "surfpool healthy on ${RPC_URL}"
      return 0
    fi
  done

  echo "surfpool failed to start"
  exit 1
}

cmd_stop() {
  log_step "stopping surfpool"
  kill_surfpool

  if pgrep -x "surfpool" > /dev/null 2>&1; then
    echo "surfpool still running"
    exit 1
  fi
  echo "surfpool stopped"
}

cmd_build() {
  log_step "building ${PROGRAM_NAME}"
  anchor build
  if [ ! -f "${SO_FILE}" ]; then
    echo "build failed: ${SO_FILE} not found"
    exit 1
  fi
  echo "built: ${SO_FILE}"
}

cmd_deploy() {
  if ! is_healthy; then
    echo "surfpool not running. run: $0 start"
    exit 1
  fi

  if [ ! -f "${SO_FILE}" ]; then
    cmd_build
  fi

  log_step "deploying ${PROGRAM_NAME} (${PROGRAM_ID})"
  solana program deploy \
    --url "${RPC_URL}" \
    "${SO_FILE}" \
    --program-id "${KEYPAIR_FILE}"
  echo "deployed: ${PROGRAM_ID}"
}

run_e2e_test() {
  local test_name="$1"
  shift
  local node_script="$*"

  local result
  result=$(node -e "${node_script}" 2>&1) && {
    log_pass "${test_name}"
  } || {
    log_fail "${test_name}"
    echo "${result}" | tail -3 | sed 's/^/    /'
  }
}

cmd_test() {
  if ! is_healthy; then
    echo "surfpool not running. run: $0 start"
    exit 1
  fi

  cmd_deploy

  log_step "running e2e tests against ${RPC_URL}"

  run_e2e_test "initialize" "
const {Connection,Keypair,Transaction,TransactionInstruction,PublicKey}=require('@solana/web3.js');
const fs=require('fs');
(async()=>{
  const c=new Connection('${RPC_URL}','confirmed');
  const p=Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync('${KEYPAIR_PATH}','utf8'))));
  const d=Buffer.from([175,175,109,31,13,152,155,237]);
  const s=await c.sendTransaction(new Transaction().add(new TransactionInstruction({keys:[],programId:new PublicKey('${PROGRAM_ID}'),data:d})),[p]);
  await c.confirmTransaction(s,'confirmed');
  console.log('ok');
})();"

  run_e2e_test "register_device" "
const {Connection,Keypair,Transaction,TransactionInstruction,PublicKey,SystemProgram}=require('@solana/web3.js');
const fs=require('fs');
(async()=>{
  const c=new Connection('${RPC_URL}','confirmed');
  const p=Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync('${KEYPAIR_PATH}','utf8'))));
  const pid=new PublicKey('${PROGRAM_ID}');
  const d=Buffer.from([210,151,56,68,22,158,90,193]);
  const uid='E2E-DEVICE-001',nm='E2E Panel';
  const enc=s=>{const b=Buffer.alloc(4+s.length);b.writeUInt32LE(s.length);Buffer.from(s).copy(b,4);return b;};
  const [pda]=PublicKey.findProgramAddressSync([Buffer.from('solar_device'),p.publicKey.toBuffer(),Buffer.from(uid)],pid);
  const ix=new TransactionInstruction({keys:[{pubkey:p.publicKey,isSigner:true,isWritable:true},{pubkey:pda,isSigner:false,isWritable:true},{pubkey:SystemProgram.programId,isSigner:false,isWritable:false}],programId:pid,data:Buffer.concat([d,enc(uid),enc(nm)])});
  const s=await c.sendTransaction(new Transaction().add(ix),[p]);
  await c.confirmTransaction(s,'confirmed');
  const a=await c.getAccountInfo(pda);
  if(!a||a.data.length===0)throw new Error('not created');
  console.log('ok size='+a.data.length);
})();"

  run_e2e_test "record_energy" "
const {Connection,Keypair,Transaction,TransactionInstruction,PublicKey,SystemProgram}=require('@solana/web3.js');
const fs=require('fs');
(async()=>{
  const c=new Connection('${RPC_URL}','confirmed');
  const p=Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync('${KEYPAIR_PATH}','utf8'))));
  const pid=new PublicKey('${PROGRAM_ID}');
  const uid='E2E-DEVICE-001';
  const [dp]=PublicKey.findProgramAddressSync([Buffer.from('solar_device'),p.publicKey.toBuffer(),Buffer.from(uid)],pid);
  const [rp]=PublicKey.findProgramAddressSync([Buffer.from('energy_record'),dp.toBuffer(),Buffer.alloc(8,0)],pid);
  const d=Buffer.from([34,104,150,219,24,196,56,204]);
  const w=Buffer.alloc(8);w.writeBigUInt64LE(5000n);
  const e=Buffer.alloc(8);e.writeBigUInt64LE(10n);
  const ix=new TransactionInstruction({keys:[{pubkey:p.publicKey,isSigner:true,isWritable:true},{pubkey:dp,isSigner:false,isWritable:true},{pubkey:rp,isSigner:false,isWritable:true},{pubkey:SystemProgram.programId,isSigner:false,isWritable:false}],programId:pid,data:Buffer.concat([d,w,e])});
  const s=await c.sendTransaction(new Transaction().add(ix),[p]);
  await c.confirmTransaction(s,'confirmed');
  const a=await c.getAccountInfo(rp);
  if(!a||a.data.length===0)throw new Error('not created');
  console.log('ok size='+a.data.length);
})();"

  run_e2e_test "update_device (deactivate)" "
const {Connection,Keypair,Transaction,TransactionInstruction,PublicKey,SystemProgram}=require('@solana/web3.js');
const fs=require('fs');
(async()=>{
  const c=new Connection('${RPC_URL}','confirmed');
  const p=Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync('${KEYPAIR_PATH}','utf8'))));
  const pid=new PublicKey('${PROGRAM_ID}');
  const uid='E2E-DEVICE-001';
  const [dp]=PublicKey.findProgramAddressSync([Buffer.from('solar_device'),p.publicKey.toBuffer(),Buffer.from(uid)],pid);
  const d=Buffer.from([30,154,166,184,200,216,194,74]);
  const nn='Deactivated Panel';
  const enc=s=>{const b=Buffer.alloc(4+s.length);b.writeUInt32LE(s.length);Buffer.from(s).copy(b,4);return b;};
  const data=Buffer.concat([d,Buffer.from([1]),enc(nn),Buffer.from([1,0])]);
  const ix=new TransactionInstruction({keys:[{pubkey:p.publicKey,isSigner:true,isWritable:true},{pubkey:dp,isSigner:false,isWritable:true},{pubkey:SystemProgram.programId,isSigner:false,isWritable:false}],programId:pid,data});
  const s=await c.sendTransaction(new Transaction().add(ix),[p]);
  await c.confirmTransaction(s,'confirmed');
  console.log('ok');
})();"

  run_e2e_test "duplicate device rejected" "
const {Connection,Keypair,Transaction,TransactionInstruction,PublicKey,SystemProgram}=require('@solana/web3.js');
const fs=require('fs');
(async()=>{
  const c=new Connection('${RPC_URL}','confirmed');
  const p=Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync('${KEYPAIR_PATH}','utf8'))));
  const pid=new PublicKey('${PROGRAM_ID}');
  const d=Buffer.from([210,151,56,68,22,158,90,193]);
  const uid='E2E-DEVICE-001',nm='Dup';
  const enc=s=>{const b=Buffer.alloc(4+s.length);b.writeUInt32LE(s.length);Buffer.from(s).copy(b,4);return b;};
  const [pda]=PublicKey.findProgramAddressSync([Buffer.from('solar_device'),p.publicKey.toBuffer(),Buffer.from(uid)],pid);
  const ix=new TransactionInstruction({keys:[{pubkey:p.publicKey,isSigner:true,isWritable:true},{pubkey:pda,isSigner:false,isWritable:true},{pubkey:SystemProgram.programId,isSigner:false,isWritable:false}],programId:pid,data:Buffer.concat([d,enc(uid),enc(nm)])});
  try{await c.sendTransaction(new Transaction().add(ix),[p]);throw new Error('should fail');}catch(e){if(e.message==='should fail')throw e;console.log('ok rejected');}
})();"

  run_e2e_test "energy on inactive device rejected" "
const {Connection,Keypair,Transaction,TransactionInstruction,PublicKey,SystemProgram}=require('@solana/web3.js');
const fs=require('fs');
(async()=>{
  const c=new Connection('${RPC_URL}','confirmed');
  const p=Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync('${KEYPAIR_PATH}','utf8'))));
  const pid=new PublicKey('${PROGRAM_ID}');
  const uid='E2E-DEVICE-001';
  const [dp]=PublicKey.findProgramAddressSync([Buffer.from('solar_device'),p.publicKey.toBuffer(),Buffer.from(uid)],pid);
  const [rp]=PublicKey.findProgramAddressSync([Buffer.from('energy_record'),dp.toBuffer(),Buffer.alloc(8,1)],pid);
  const d=Buffer.from([34,104,150,219,24,196,56,204]);
  const w=Buffer.alloc(8);w.writeBigUInt64LE(5000n);
  const e=Buffer.alloc(8);e.writeBigUInt64LE(10n);
  const ix=new TransactionInstruction({keys:[{pubkey:p.publicKey,isSigner:true,isWritable:true},{pubkey:dp,isSigner:false,isWritable:true},{pubkey:rp,isSigner:false,isWritable:true},{pubkey:SystemProgram.programId,isSigner:false,isWritable:false}],programId:pid,data:Buffer.concat([d,w,e])});
  try{await c.sendTransaction(new Transaction().add(ix),[p]);throw new Error('should fail');}catch(e){if(e.message==='should fail')throw e;console.log('ok rejected');}
})();"

  echo ""
  echo "════════════════════════════════════"
  echo "  e2e: ${PASSED} passed, ${FAILED} failed"
  echo "════════════════════════════════════"

  if [ "${FAILED}" -gt 0 ]; then
    exit 1
  fi
}

cmd_reset() {
  cmd_stop
  cmd_build
  cmd_start
  cmd_deploy
  echo ""
  echo "reset done. ${RPC_URL} ready."
}

cmd_status() {
  if is_healthy; then
    echo "surfpool: running on ${RPC_URL}"
  else
    echo "surfpool: not running"
  fi

  if [ -f "${SO_FILE}" ]; then
    local size
    size=$(stat -c%s "${SO_FILE}" 2>/dev/null || stat -f%z "${SO_FILE}" 2>/dev/null || echo "?")
    echo "binary:   ${SO_FILE} (${size} bytes)"
  else
    echo "binary:   not built"
  fi
}

# ─── usage ────────────────────────────────────────────────────────────────────

usage() {
  echo "usage: $0 <command>"
  echo ""
  echo "commands:"
  echo "  start    start surfpool local network"
  echo "  stop     stop surfpool"
  echo "  build    build the program (anchor build)"
  echo "  deploy   deploy program to surfpool"
  echo "  test     build + deploy + run e2e tests"
  echo "  reset    stop + build + start + deploy (clean slate)"
  echo "  status   show surfpool + build status"
}

# ─── main ─────────────────────────────────────────────────────────────────────

case "${1:-}" in
  start)   cmd_start   ;;
  stop)    cmd_stop    ;;
  build)   cmd_build   ;;
  deploy)  cmd_deploy  ;;
  test)    cmd_test    ;;
  reset)   cmd_reset   ;;
  status)  cmd_status  ;;
  *)       usage       ;;
esac
