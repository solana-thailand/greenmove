# GreenMove

Solar energy tracking on Solana. Register solar devices, record energy generation, and visualize real-time data on-chain.

## Architecture

```
┌─────────────────────────┐
│  .mock_device_solar CLI  │
│  register / record / run │
└───────────┬─────────────┘
            │ RPC
            ▼
┌─────────────────────────┐
│   Solana Program         │
│   SolarDevice account    │
│   EnergyRecord account   │
└───────────┬─────────────┘
            │ getProgramAccounts
            ▼
┌─────────────────────────┐
│   React Frontend         │
│   Dashboard / Blockchain │
│   Network Switcher       │
└─────────────────────────┘
```

## On-Chain Program

Program ID: `36D7U8McCLZF9ahuGmoiXehXzFLFm6v8N1gQVAfricSY`

### Instructions

| Instruction | Description |
|---|---|
| `initialize` | Initialize the program |
| `register_device` | Create a SolarDevice PDA |
| `record_energy` | Record energy generation for a device |
| `update_device` | Update device name or active status |

### Accounts

**SolarDevice** — PDA seeds: `["solar_device", owner, unique_id]`

| Field | Type | Description |
|---|---|---|
| owner | Pubkey | Device owner |
| unique_id | String | Hardware serial |
| name | String | Human-readable name |
| total_energy_wh | u64 | Cumulative energy (Wh) |
| current_wattage_mw | u64 | Latest wattage (mW) |
| record_count | u64 | Number of records |
| active | bool | Device status |
| registered_at | i64 | Registration timestamp |
| last_record_at | i64 | Last record timestamp |

**EnergyRecord** — PDA seeds: `["energy_record", device, record_index]`

| Field | Type | Description |
|---|---|---|
| device | Pubkey | Parent SolarDevice |
| owner | Pubkey | Device owner |
| wattage_mw | u64 | Wattage reading (mW) |
| energy_wh | u64 | Energy since last record (Wh) |
| cumulative_energy_wh | u64 | Running total (Wh) |
| record_index | u64 | Sequential index |
| timestamp | i64 | Record timestamp |

## Quick Start

### Prerequisites

- Rust 1.89+
- Solana CLI 2.2+
- Anchor CLI
- Node.js 24+
- Surfpool CLI

### 1. Start Local Network

```sh
bash surfpool-dev.sh start
bash surfpool-dev.sh deploy
```

### 2. Seed Mock Device Data

```sh
bash seed-localnet.sh seed
```

This registers 3 devices and records energy data:

| Device | Records | Total Energy |
|---|---|---|
| PANEL-ROOF-01 | 8 | ~228 Wh |
| PANEL-BALC-01 | 5 | ~55 Wh |
| PANEL-GARAGE | 3 | ~48 Wh |

### 3. Start Frontend

```sh
cd app && npm install && npm run dev
```

Switch to **Local** network in the UI to see on-chain data.

## Mock Device CLI

```sh
cd .mock_device_solar

# Register a device
cargo run -- register --unique-id "MY-PANEL" --name "My Solar Panel"

# Record energy
cargo run -- record --unique-id "MY-PANEL" --wattage 3500 --energy 25

# Continuous recording (every 5s)
cargo run -- run --unique-id "MY-PANEL" --interval 5

# View device info
cargo run -- info --unique-id "MY-PANEL"
```

Options:
- `--rpc <URL>` — RPC endpoint (default: `http://127.0.0.1:8899`)
- `--keypair <PATH>` — Signer keypair (default: `~/.config/solana/id.json`)

## Frontend Networks

| Network | RPC | Description |
|---|---|---|
| Mock | — | Local mock data, no blockchain |
| Local | `http://127.0.0.1:8899` | Surfpool local network |
| Testnet | `https://api.devnet.solana.com` | Solana devnet |

## Project Structure

```
greenmove/
├── programs/greenmove/src/       # Anchor on-chain program
│   ├── lib.rs                    # Program entrypoint
│   ├── state.rs                  # SolarDevice, EnergyRecord
│   ├── instructions/             # Instruction handlers
│   ├── constants.rs              # PDA seeds, limits
│   └── error.rs                  # Error codes
├── .mock_device_solar/src/       # Mock device CLI
│   ├── main.rs                   # CLI (register/record/run/info)
│   ├── instruction.rs            # Anchor instruction builders
│   ├── pda.rs                    # PDA derivation
│   ├── rpc.rs                    # RPC client + account parser
│   └── device.rs                 # Device trait + mock impl
├── app/src/                      # React frontend
│   ├── lib/
│   │   ├── program.ts            # Program constants + types
│   │   ├── accountParser.ts      # Deserialize on-chain accounts
│   │   └── SolanaContext.tsx      # Wallet provider
│   ├── hooks/
│   │   ├── useOnchainDevices.ts  # Fetch SolarDevice accounts
│   │   ├── useOnchainRecords.ts  # Fetch EnergyRecord accounts
│   │   ├── useDashboardData.ts   # Dashboard data (mock/on-chain)
│   │   └── useBlockchainData.ts  # Blockchain history (mock/on-chain)
│   ├── pages/                    # Dashboard, Consumption, Blockchain, etc.
│   └── stores/                   # Zustand state (network, wallet)
├── surfpool-dev.sh               # Surfpool lifecycle (start/stop/deploy/test)
├── seed-localnet.sh              # Seed mock device data
└── Anchor.toml                   # Anchor config
```

## Development

### Build & Test Program

```sh
anchor build
cargo test    # 7 litesvm integration tests
```

### E2E Tests

```sh
bash surfpool-dev.sh test
```

### Full Reset

```sh
bash surfpool-dev.sh reset
```

### Frontend Build

```sh
cd app && npm run build
```

## Plans

Development progress tracked in `.plans/`:

| # | Plan | Status |
|---|---|---|
| 01 | Solar cell device model | Done |
| 02 | Network switcher + Surfpool integration | Done |
| 03 | Solana wallet integration | Done |
| 04 | Mock device → blockchain → frontend | Done |

## License

ISC