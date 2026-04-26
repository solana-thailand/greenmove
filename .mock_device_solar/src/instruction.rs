pub const DISCRIMINATOR_INITIALIZE: [u8; 8] = [175, 175, 109, 31, 13, 152, 155, 237];
pub const DISCRIMINATOR_REGISTER_DEVICE: [u8; 8] = [210, 151, 56, 68, 22, 158, 90, 193];
pub const DISCRIMINATOR_RECORD_ENERGY: [u8; 8] = [34, 104, 150, 219, 24, 196, 56, 204];
pub const DISCRIMINATOR_UPDATE_DEVICE: [u8; 8] = [30, 154, 166, 184, 200, 216, 194, 74];

const BORSH_STRING_LENGTH_BYTES: usize = 4;
const U64_BYTES: usize = 8;

fn encode_borsh_string(val: &str) -> Vec<u8> {
    let len = val.len() as u32;
    let mut buf = Vec::with_capacity(BORSH_STRING_LENGTH_BYTES + val.len());
    buf.extend_from_slice(&len.to_le_bytes());
    buf.extend_from_slice(val.as_bytes());
    buf
}

pub fn build_initialize_ix() -> Vec<u8> {
    DISCRIMINATOR_INITIALIZE.to_vec()
}

pub fn build_register_device_ix(unique_id: &str, name: &str) -> Vec<u8> {
    let mut data = Vec::with_capacity(8 + BORSH_STRING_LENGTH_BYTES + unique_id.len() + BORSH_STRING_LENGTH_BYTES + name.len());
    data.extend_from_slice(&DISCRIMINATOR_REGISTER_DEVICE);
    data.extend(encode_borsh_string(unique_id));
    data.extend(encode_borsh_string(name));
    data
}

pub fn build_record_energy_ix(wattage_mw: u64, energy_wh: u64) -> Vec<u8> {
    let mut data = Vec::with_capacity(8 + U64_BYTES + U64_BYTES);
    data.extend_from_slice(&DISCRIMINATOR_RECORD_ENERGY);
    data.extend_from_slice(&wattage_mw.to_le_bytes());
    data.extend_from_slice(&energy_wh.to_le_bytes());
    data
}

pub fn build_update_device_ix() -> Vec<u8> {
    DISCRIMINATOR_UPDATE_DEVICE.to_vec()
}
