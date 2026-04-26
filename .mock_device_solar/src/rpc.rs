use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    instruction::{AccountMeta, Instruction},
    pubkey::Pubkey,
    signature::{Keypair, Signer},
    transaction::Transaction,
};

const SYSTEM_PROGRAM: Pubkey = solana_sdk::pubkey!("11111111111111111111111111111111");

pub struct DeviceAccount {
    pub owner: Pubkey,
    pub unique_id: String,
    pub name: String,
    pub total_energy_wh: u64,
    pub current_wattage_mw: u64,
    pub record_count: u64,
    pub active: bool,
    pub registered_at: i64,
    pub last_record_at: i64,
    pub bump: u8,
}

pub fn create_rpc_client(rpc_url: &str) -> RpcClient {
    RpcClient::new(rpc_url.to_string())
}

fn shellexpand_home(path: &str) -> std::path::PathBuf {
    if let Some(rest) = path.strip_prefix("~/") {
        if let Ok(home) = std::env::var("HOME") {
            return std::path::PathBuf::from(home).join(rest);
        }
    }
    std::path::PathBuf::from(path)
}

fn parse_keypair_json(s: &str) -> Vec<u8> {
    let s = s.trim().trim_start_matches('[').trim_end_matches(']');
    s.split(',')
        .map(|v| v.trim().parse::<u8>().expect("invalid keypair byte"))
        .collect()
}

pub fn load_keypair(path: &str) -> Keypair {
    let expanded = shellexpand_home(path);
    let content = std::fs::read_to_string(&expanded).expect("failed to read keypair file");
    let bytes = parse_keypair_json(&content);
    Keypair::try_from(bytes.as_slice()).expect("invalid keypair bytes")
}

pub fn send_register_device(
    client: &RpcClient,
    keypair: &Keypair,
    program_id: &Pubkey,
    unique_id: &str,
    name: &str,
) -> solana_sdk::signature::Signature {
    let (device_pda, _) = crate::pda::find_device_pda(&keypair.pubkey(), unique_id, program_id);
    let data = crate::instruction::build_register_device_ix(unique_id, name);

    let ix = Instruction {
        program_id: *program_id,
        accounts: vec![
            AccountMeta::new(keypair.pubkey(), true),
            AccountMeta::new(device_pda, false),
            AccountMeta::new_readonly(SYSTEM_PROGRAM, false),
        ],
        data,
    };

    send_transaction(client, keypair, &[ix])
}

pub fn send_record_energy(
    client: &RpcClient,
    keypair: &Keypair,
    program_id: &Pubkey,
    unique_id: &str,
    wattage_mw: u64,
    energy_wh: u64,
) -> solana_sdk::signature::Signature {
    let (device_pda, _) = crate::pda::find_device_pda(&keypair.pubkey(), unique_id, program_id);
    let record_count = fetch_device_record_count(client, &keypair.pubkey(), program_id, unique_id);
    let (energy_record_pda, _) = crate::pda::find_energy_record_pda(&device_pda, record_count, program_id);
    let data = crate::instruction::build_record_energy_ix(wattage_mw, energy_wh);

    let ix = Instruction {
        program_id: *program_id,
        accounts: vec![
            AccountMeta::new(keypair.pubkey(), true),
            AccountMeta::new(device_pda, false),
            AccountMeta::new(energy_record_pda, false),
            AccountMeta::new_readonly(SYSTEM_PROGRAM, false),
        ],
        data,
    };

    send_transaction(client, keypair, &[ix])
}

fn send_transaction(
    client: &RpcClient,
    keypair: &Keypair,
    instructions: &[Instruction],
) -> solana_sdk::signature::Signature {
    let blockhash = client.get_latest_blockhash().expect("failed to get blockhash");
    let tx = Transaction::new_signed_with_payer(instructions, Some(&keypair.pubkey()), &[keypair], blockhash);
    client.send_and_confirm_transaction(&tx).expect("failed to send transaction")
}

fn read_u64_le(data: &[u8], offset: usize) -> Option<u64> {
    data.get(offset..offset + 8)
        .map(|s| u64::from_le_bytes(s.try_into().unwrap()))
}

fn read_i64_le(data: &[u8], offset: usize) -> Option<i64> {
    data.get(offset..offset + 8)
        .map(|s| i64::from_le_bytes(s.try_into().unwrap()))
}

fn read_borsh_string(data: &[u8], offset: usize) -> Option<(String, usize)> {
    let len = u32::from_le_bytes(data.get(offset..offset + 4)?.try_into().ok()?) as usize;
    let s = String::from_utf8(data.get(offset + 4..offset + 4 + len)?.to_vec()).ok()?;
    Some((s, 4 + len))
}

fn parse_device_account(data: &[u8]) -> Option<DeviceAccount> {
    if data.len() < 8 {
        return None;
    }
    let data = &data[8..];
    let mut offset = 0;

    let owner = Pubkey::try_from(data.get(offset..offset + 32)?).ok()?;
    offset += 32;

    let (unique_id, advanced) = read_borsh_string(data, offset)?;
    offset += advanced;

    let (name, advanced) = read_borsh_string(data, offset)?;
    offset += advanced;

    let total_energy_wh = read_u64_le(data, offset)?;
    offset += 8;

    let current_wattage_mw = read_u64_le(data, offset)?;
    offset += 8;

    let record_count = read_u64_le(data, offset)?;
    offset += 8;

    let active = data.get(offset)? != &0;
    offset += 1;

    let registered_at = read_i64_le(data, offset)?;
    offset += 8;

    let last_record_at = read_i64_le(data, offset)?;
    offset += 8;

    let bump = *data.get(offset)?;

    Some(DeviceAccount {
        owner,
        unique_id,
        name,
        total_energy_wh,
        current_wattage_mw,
        record_count,
        active,
        registered_at,
        last_record_at,
        bump,
    })
}

pub fn fetch_device_account(
    client: &RpcClient,
    owner: &Pubkey,
    program_id: &Pubkey,
    unique_id: &str,
) -> Option<DeviceAccount> {
    let (device_pda, _) = crate::pda::find_device_pda(owner, unique_id, program_id);
    let account_data = client.get_account_data(&device_pda).ok()?;
    parse_device_account(&account_data)
}

pub fn fetch_device_record_count(
    client: &RpcClient,
    owner: &Pubkey,
    program_id: &Pubkey,
    unique_id: &str,
) -> u64 {
    fetch_device_account(client, owner, program_id, unique_id)
        .map(|d| d.record_count)
        .unwrap_or(0)
}
