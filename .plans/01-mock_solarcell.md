# 01 - Mock Solar Cell Device

## Status: DONE

## Goal
Create a mock solar cell device that simulates energy generation data for testing the greenmove on-chain program.

## Tasks

- [x] Define `SolarDevice` account structure (owner, unique_id, name, total_energy_wh, current_wattage_mw, record_count, active, registered_at, last_record_at, bump)
- [x] Define `EnergyRecord` account structure (device, owner, wattage_mw, energy_wh, cumulative_energy_wh, record_index, timestamp, bump)
- [x] Implement `initialize` instruction
- [x] Implement `register_device` instruction with PDA seeds ["solar_device", owner, unique_id]
- [x] Implement `record_energy` instruction with PDA seeds ["energy_record", device, record_index]
- [x] Implement `update_device` instruction (name, active status)
- [x] Add error codes (NotDeviceOwner, DeviceAlreadyExists, DeviceInactive, etc.)
- [x] Add constants (SOLAR_DEVICE_SEED, ENERGY_RECORD_SEED, MAX_UNIQUE_ID_LEN, MAX_NAME_LEN)
- [x] Write litesvm tests for all instructions (7 tests passing)

## Files

- `programs/greenmove/src/lib.rs` - program entrypoint
- `programs/greenmove/src/state.rs` - SolarDevice + EnergyRecord accounts
- `programs/greenmove/src/instructions/initialize.rs`
- `programs/greenmove/src/instructions/register_device.rs`
- `programs/greenmove/src/instructions/record_energy.rs`
- `programs/greenmove/src/instructions/update_device.rs`
- `programs/greenmove/src/constants.rs` - seeds and limits
- `programs/greenmove/src/error.rs` - error codes
- `programs/greenmove/tests/test_initialize.rs` - 7 litesvm integration tests
- `.mock_device_solar/` - mock device simulator crate