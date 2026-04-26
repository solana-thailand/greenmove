use anchor_lang::prelude::*;

pub const SEED: &str = "anchor";

/// PDA seed for SolarDevice accounts
pub const SOLAR_DEVICE_SEED: &str = "solar_device";

/// PDA seed for EnergyRecord accounts
pub const ENERGY_RECORD_SEED: &str = "energy_record";

/// Maximum length for device unique_id
pub const MAX_UNIQUE_ID_LEN: usize = 64;

/// Maximum length for device name
pub const MAX_NAME_LEN: usize = 128;
