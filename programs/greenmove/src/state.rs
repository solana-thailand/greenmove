use anchor_lang::prelude::*;

/// Represents a registered solar device on-chain.
///
/// Seeds: ["solar_device", owner.key(), unique_id]
#[account]
#[derive(InitSpace)]
pub struct SolarDevice {
    /// The owner/authority of the solar device
    pub owner: Pubkey,

    /// Unique identifier for the device (e.g., serial number, hardware ID)
    #[max_len(64)]
    pub unique_id: String,

    /// Human-readable name for the device
    #[max_len(128)]
    pub name: String,

    /// Total cumulative energy generated, in watt-hours
    pub total_energy_wh: u64,

    /// Latest wattage reading, in milliwatts (1 W = 1000 mW)
    pub current_wattage_mw: u64,

    /// Number of energy records submitted for this device
    pub record_count: u64,

    /// Whether the device is currently active
    pub active: bool,

    /// Unix timestamp of device registration
    pub registered_at: i64,

    /// Unix timestamp of the last energy record
    pub last_record_at: i64,

    /// PDA bump seed
    pub bump: u8,
}

/// Represents a single energy generation record for a solar device.
///
/// Seeds: ["energy_record", device.key(), record_index]
#[account]
#[derive(InitSpace)]
pub struct EnergyRecord {
    /// Reference to the SolarDevice account this record belongs to
    pub device: Pubkey,

    /// The owner of the device at the time of recording
    pub owner: Pubkey,

    /// Wattage reading at the time of recording, in milliwatts
    pub wattage_mw: u64,

    /// Energy generated since the previous record, in watt-hours
    pub energy_wh: u64,

    /// Cumulative total energy at this point, in watt-hours
    pub cumulative_energy_wh: u64,

    /// Sequential index of this record for the device
    pub record_index: u64,

    /// Unix timestamp of the record
    pub timestamp: i64,

    /// PDA bump seed
    pub bump: u8,
}
