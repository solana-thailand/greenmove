use anchor_lang::prelude::*;

use crate::constants::{ENERGY_RECORD_SEED, SOLAR_DEVICE_SEED};
use crate::error::ErrorCode;
use crate::state::{EnergyRecord, SolarDevice};

#[derive(Accounts)]
#[instruction(wattage_mw: u64, energy_wh: u64)]
pub struct RecordEnergy<'info> {
    /// The owner of the solar device, must sign the transaction
    #[account(mut)]
    pub owner: Signer<'info>,

    /// The solar device account to record energy for
    #[account(
        mut,
        seeds = [SOLAR_DEVICE_SEED.as_bytes(), device.owner.as_ref(), device.unique_id.as_bytes()],
        bump = device.bump,
        constraint = device.owner == owner.key() @ ErrorCode::NotDeviceOwner,
        constraint = device.active @ ErrorCode::DeviceInactive,
    )]
    pub device: Account<'info, SolarDevice>,

    /// The new energy record PDA
    #[account(
        init,
        payer = owner,
        space = EnergyRecord::INIT_SPACE,
        seeds = [ENERGY_RECORD_SEED.as_bytes(), device.key().as_ref(), &device.record_count.to_le_bytes()],
        bump,
    )]
    pub energy_record: Account<'info, EnergyRecord>,

    pub system_program: Program<'info, System>,
}

pub fn record_energy_handler(
    ctx: Context<RecordEnergy>,
    wattage_mw: u64,
    energy_wh: u64,
) -> Result<()> {
    let device = &mut ctx.accounts.device;
    let energy_record = &mut ctx.accounts.energy_record;
    let clock = Clock::get()?;

    // Validate wattage
    require!(wattage_mw > 0, ErrorCode::InvalidWattage);

    // Update cumulative energy with overflow check
    let new_total = device
        .total_energy_wh
        .checked_add(energy_wh)
        .ok_or(ErrorCode::Overflow)?;

    // Populate the energy record
    energy_record.device = device.key();
    energy_record.owner = ctx.accounts.owner.key();
    energy_record.wattage_mw = wattage_mw;
    energy_record.energy_wh = energy_wh;
    energy_record.cumulative_energy_wh = new_total;
    energy_record.record_index = device.record_count;
    energy_record.timestamp = clock.unix_timestamp;
    energy_record.bump = ctx.bumps.energy_record;

    // Update the device
    device.total_energy_wh = new_total;
    device.current_wattage_mw = wattage_mw;
    device.record_count = device
        .record_count
        .checked_add(1)
        .ok_or(ErrorCode::Overflow)?;
    device.last_record_at = clock.unix_timestamp;

    msg!(
        "Energy recorded: device={}, record_index={}, wattage={}mW, energy={}Wh, cumulative={}Wh",
        device.unique_id,
        energy_record.record_index,
        wattage_mw,
        energy_wh,
        new_total
    );

    Ok(())
}
