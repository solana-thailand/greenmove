use anchor_lang::prelude::*;

use crate::constants::SOLAR_DEVICE_SEED;
use crate::error::ErrorCode;
use crate::state::SolarDevice;

/// Accounts required to update a solar device.
#[derive(Accounts)]
#[instruction()]
pub struct UpdateDevice<'info> {
    /// The owner of the solar device. Must be a signer and match the device's owner.
    #[account(mut)]
    pub owner: Signer<'info>,

    /// The solar device account to update.
    /// Seeds: ["solar_device", owner.key(), unique_id]
    #[account(
        mut,
        seeds = [SOLAR_DEVICE_SEED.as_bytes(), device.owner.as_ref(), device.unique_id.as_bytes()],
        bump = device.bump,
        constraint = device.owner == owner.key() @ ErrorCode::NotDeviceOwner,
    )]
    pub device: Account<'info, SolarDevice>,

    pub system_program: Program<'info, System>,
}

/// Parameters for updating a solar device.
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct UpdateDeviceParams {
    /// Optional new name for the device. None means no change.
    pub new_name: Option<String>,

    /// Optional new active status. None means no change.
    pub new_active: Option<bool>,
}

pub fn update_device_handler(ctx: Context<UpdateDevice>, params: UpdateDeviceParams) -> Result<()> {
    let device = &mut ctx.accounts.device;

    if let Some(new_name) = params.new_name {
        require!(
            new_name.len() <= crate::constants::MAX_NAME_LEN,
            ErrorCode::DeviceNameTooLong
        );
        device.name = new_name;
    }

    if let Some(new_active) = params.new_active {
        device.active = new_active;
    }

    msg!(
        "Device '{}' updated. Active: {}",
        device.name,
        device.active
    );

    Ok(())
}
