# 04 - Mock Device → Blockchain → Frontend

## Status: DONE

## Goal
Connect `.mock_device_solar` CLI to the greenmove on-chain program via surfpool, and display real on-chain data in the frontend app when network is set to testnet/localnet.

## Architecture

```
.mock_device_solar (Rust CLI)
  │
  ├── register  → register_device(unique_id, name) → SolarDevice PDA
  ├── record    → record_energy(wattage_mw, energy_wh) → EnergyRecord PDA
  └── run       → continuous recording at interval
  │
  ▼
surfpool (local Solana) / devnet
  │
  ▼
app (React frontend)
  │
  ├── useOnchainDevices()  → fetch all SolarDevice accounts
  ├── useOnchainRecords()  → fetch EnergyRecord accounts for a device
  ├── Dashboard page       → show live totals from on-chain
  ├── Consumption page     → show device energy history from on-chain
  └── Blockchain page      → show energy records as history table
```

## Tasks

### Part A: Mock Device CLI (`.mock_device_solar`)

- [x] Add dependencies: `solana-sdk`, `solana-client`, `tokio`, `clap`, `borsh`, `bs58`
- [x] Create `src/main.rs` - CLI entrypoint with clap commands
- [x] Create `src/instruction.rs` - serialize Anchor instruction discriminators + args
- [x] Create `src/pda.rs` - derive PDA addresses for SolarDevice and EnergyRecord
- [x] Create `src/rpc.rs` - send transactions to surfpool RPC
- [x] Implement `register` subcommand
- [x] Implement `record` subcommand
- [x] Implement `run` subcommand (continuous recording loop)
- [x] `cargo check && cargo clippy` pass

### Part B: Frontend On-Chain Integration (`app`)

- [x] Create `app/src/lib/program.ts` - program ID, IDL types, account layout constants
- [x] Create `app/src/lib/accountParser.ts` - deserialize SolarDevice and EnergyRecord from buffer
- [x] Create `app/src/hooks/useOnchainDevices.ts` - fetch SolarDevice accounts via getProgramAccounts
- [x] Create `app/src/hooks/useOnchainRecords.ts` - fetch EnergyRecord accounts for a device
- [x] Update `useDashboardData.ts` - read real device totals when !isMock
- [x] Update `useBlockchainData.ts` - read real energy records when !isMock
- [x] Update `Consumption.tsx` - show on-chain solar generation data
- [x] Update `Dashboard.tsx` - show on-chain device stats
- [x] `vite build` passes

### Part C: End-to-End Verification

- [x] `surfpool-dev.sh reset` - start fresh surfpool + deploy
- [x] `cargo run -- register` - register a device on-chain (PANEL-001, PANEL-002)
- [x] `cargo run -- run` - record energy data
- [x] App in localnet mode shows real data from surfpool

## PDA Seeds

```
SolarDevice:  ["solar_device", owner_pubkey, unique_id_bytes]
EnergyRecord: ["energy_record", device_pubkey, record_index_u64_le]
```

## Account Layouts

### SolarDevice (discriminator: 8 bytes)

| Offset | Size | Field |
|--------|------|-------|
| 0 | 32 | owner (Pubkey) |
| 32 | 4+64 | unique_id (String) |
| 100 | 4+128 | name (String) |
| 232 | 8 | total_energy_wh (u64) |
| 240 | 8 | current_wattage_mw (u64) |
| 248 | 8 | record_count (u64) |
| 256 | 1 | active (bool) |
| 257 | 8 | registered_at (i64) |
| 265 | 8 | last_record_at (i64) |
| 273 | 1 | bump (u8) |

### EnergyRecord (discriminator: 8 bytes)

| Offset | Size | Field |
|--------|------|-------|
| 0 | 32 | device (Pubkey) |
| 32 | 32 | owner (Pubkey) |
| 64 | 8 | wattage_mw (u64) |
| 72 | 8 | energy_wh (u64) |
| 80 | 8 | cumulative_energy_wh (u64) |
| 88 | 8 | record_index (u64) |
| 96 | 8 | timestamp (i64) |
| 104 | 1 | bump (u8) |

## Instruction Discriminators (Anchor sighash global)

| Instruction | First 8 bytes (hex) |
|-------------|---------------------|
| initialize | 175,175,109,31,13,152,155,237 |
| register_device | 210,151,56,68,22,158,90,193 |
| record_energy | 34,104,150,219,24,196,56,204 |
| update_device | 30,154,166,184,200,216,194,74 |

## Files

### Modified
- `.mock_device_solar/Cargo.toml` - add solana/tokio/clap deps
- `.mock_device_solar/src/lib.rs` - add new modules
- `.mock_device_solar/src/device.rs` - keep existing, add onchain sync
- `app/src/hooks/useDashboardData.ts` - on-chain data path
- `app/src/hooks/useBlockchainData.ts` - on-chain data path
- `app/src/pages/Dashboard.tsx` - show device data
- `app/src/pages/Consumption.tsx` - show on-chain solar data

### New
- `.mock_device_solar/src/main.rs` - CLI entrypoint
- `.mock_device_solar/src/instruction.rs` - Anchor instruction builders
- `.mock_device_solar/src/pda.rs` - PDA derivation
- `.mock_device_solar/src/rpc.rs` - RPC client wrapper
- `app/src/lib/program.ts` - program constants and IDL types
- `app/src/lib/accountParser.ts` - deserialize on-chain accounts
- `app/src/hooks/useOnchainDevices.ts` - fetch SolarDevice accounts
- `app/src/hooks/useOnchainRecords.ts` - fetch EnergyRecord accounts