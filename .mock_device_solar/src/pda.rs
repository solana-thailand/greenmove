use solana_sdk::pubkey::Pubkey;

const SEED_SOLAR_DEVICE: &[u8] = b"solar_device";
const SEED_ENERGY_RECORD: &[u8] = b"energy_record";

pub fn find_device_pda(owner: &Pubkey, unique_id: &str, program_id: &Pubkey) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[SEED_SOLAR_DEVICE, owner.as_ref(), unique_id.as_bytes()],
        program_id,
    )
}

pub fn find_energy_record_pda(
    device: &Pubkey,
    record_index: u64,
    program_id: &Pubkey,
) -> (Pubkey, u8) {
    Pubkey::find_program_address(
        &[
            SEED_ENERGY_RECORD,
            device.as_ref(),
            &record_index.to_le_bytes(),
        ],
        program_id,
    )
}
