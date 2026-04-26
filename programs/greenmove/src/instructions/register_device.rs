use anchor_lang::prelude::*;

use crate::constants::SOLAR_DEVICE_SEED;
use crate::state::SolarDevice;

/// Registers a new solar device on-chain.
///
/// # Arguments
///
/// * `ctx` - The context containing the accounts
/// * `unique_id` - A unique identifier for the device (e.g., serial number)
/// * `name` - A human-readable name for the device
///
/// # Accounts
///
/// * `owner` - The signer who will own this device (payer)
/// * `solar_device` - The new SolarDevice account to be created (PDA)
/// * `system_program` - Required for account creation
#[derive(Accounts)]
#[instruction(unique_id: String, name: String)]
pub struct RegisterDevice<'info> {
    /// The owner and payer for the new device account
    #[account(mut)]
    pub owner: Signer<'info>,

    /// The new SolarDevice account, derived from ["solar_device", owner.key(), unique_id]
    #[account(
        init,
        payer = owner,
        space = SolarDevice::INIT_SPACE,
        seeds = [
            SOLAR_DEVICE_SEED.as_bytes(),
            owner.key().as_ref(),
            unique_id.as_bytes(),
        ],
        bump,
    )]
    pub solar_device: Account<'info, SolarDevice>,

    /// Required for account creation
    pub system_program: Program<'info, System>,
}

pub fn register_device_handler(
    ctx: Context<RegisterDevice>,
    unique_id: String,
    name: String,
) -> Result<()> {
    let clock = Clock::get()?;
    let solar_device = &mut ctx.accounts.solar_device;

    solar_device.owner = ctx.accounts.owner.key();
    solar_device.unique_id = unique_id;
    solar_device.name = name;
    solar_device.total_energy_wh = 0;
    solar_device.current_wattage_mw = 0;
    solar_device.record_count = 0;
    solar_device.active = true;
    solar_device.registered_at = clock.unix_timestamp;
    solar_device.last_record_at = 0;
    solar_device.bump = ctx.bumps.solar_device;

    emit!(DeviceRegisteredEvent {
        owner: solar_device.owner,
        unique_id: solar_device.unique_id.clone(),
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}

/// Event emitted when a new solar device is registered.
#[event]
pub struct DeviceRegisteredEvent {
    /// The owner of the newly registered device
    pub owner: Pubkey,
    /// The unique ID of the device
    pub unique_id: String,
    /// Unix timestamp of registration
    pub timestamp: i64,
}
