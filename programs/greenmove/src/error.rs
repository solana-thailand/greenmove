use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Custom error message")]
    CustomError,

    #[msg("You are not the owner of this device")]
    NotDeviceOwner,

    #[msg("Device with this unique_id already exists")]
    DeviceAlreadyExists,

    #[msg("Device is not active")]
    DeviceInactive,

    #[msg("Device name is too long")]
    DeviceNameTooLong,

    #[msg("Unique ID is too long")]
    UniqueIdTooLong,

    #[msg("Wattage value is invalid")]
    InvalidWattage,

    #[msg("Energy value is invalid")]
    InvalidEnergy,

    #[msg("Device not found")]
    DeviceNotFound,

    #[msg("Record not found")]
    RecordNotFound,

    #[msg("Overflow in energy calculation")]
    Overflow,
}
