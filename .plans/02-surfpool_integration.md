# 02 - Surfpool Integration

## Status: DONE

## Goal
Integrate Surfpool CLI as the local Solana development environment for the greenmove project, replacing direct litesvm usage for manual testing workflows.

## Tasks

- [x] Fix Cargo.lock build issue (downgrade proc-macro-crate to 3.4.0)
- [x] Build program via `anchor build`
- [x] Create `txtx.yml` manifest for surfpool IaC
- [x] Create `deployment/main.txtx` runbook
- [x] Deploy greenmove program to surfpool local network
- [x] Test `initialize` instruction via surfpool RPC
- [x] Test `register_device` instruction via surfpool RPC
- [x] Test `record_energy` instruction via surfpool RPC

## Usage

### Start surfpool
```sh
surfpool start --ci --offline --yes
```

### Deploy program
```sh
anchor build
solana program deploy --url http://127.0.0.1:8899 target/deploy/greenmove.so \
  --program-id target/deploy/greenmove-keypair.json
```

### Stop surfpool
```sh
pkill -f surfpool
```

## Files Changed
- `Cargo.lock` - pinned proc-macro-crate to 3.4.0 (compat with SBF toolchain)
- `txtx.yml` - surfpool IaC manifest
- `deployment/main.txtx` - deploy runbook with signer + deploy action