pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;

pub use instructions::*;
pub use state::*;

declare_id!("36D7U8McCLZF9ahuGmoiXehXzFLFm6v8N1gQVAfricSY");

#[program]
pub mod greenmove {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        initialize::handler(ctx)
    }

    /// Register a new solar device on-chain.
    ///
    /// Creates a new SolarDevice account owned by the signer.
    /// The account is a PDA derived from ["solar_device", owner.key(), unique_id].
    ///
    /// # Arguments
    /// * `unique_id` - A unique identifier for the device (e.g., serial number)
    /// * `name` - A human-readable name for the device
    pub fn register_device(
        ctx: Context<RegisterDevice>,
        unique_id: String,
        name: String,
    ) -> Result<()> {
        register_device::register_device_handler(ctx, unique_id, name)
    }

    /// Record energy generation data for a solar device.
    ///
    /// Creates a new EnergyRecord account and updates the device's cumulative totals.
    /// The energy record is a PDA derived from ["energy_record", device.key(), record_count].
    ///
    /// # Arguments
    /// * `wattage_mw` - Current wattage reading in milliwatts (1 W = 1000 mW)
    /// * `energy_wh` - Energy generated since the last record, in watt-hours
    pub fn record_energy(
        ctx: Context<RecordEnergy>,
        wattage_mw: u64,
        energy_wh: u64,
    ) -> Result<()> {
        record_energy::record_energy_handler(ctx, wattage_mw, energy_wh)
    }

    /// Update a solar device's metadata.
    ///
    /// Allows the device owner to update the device name or active status.
    ///
    /// # Arguments
    /// * `params` - Update parameters containing optional new name and active status
    pub fn update_device(ctx: Context<UpdateDevice>, params: UpdateDeviceParams) -> Result<()> {
        update_device::update_device_handler(ctx, params)
    }
}
