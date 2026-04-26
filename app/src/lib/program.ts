greenmove/app/src/lib/program.ts
export const PROGRAM_ID = "36D7U8McCLZF9ahuGmoiXehXzFLFm6v8N1gQVAfricSY";

export const SOLAR_DEVICE_SEED = "solar_device";
export const ENERGY_RECORD_SEED = "energy_record";

export const ANCHOR_DISCRIMINATOR_SIZE = 8;
export const PUBKEY_SIZE = 32;
export const U64_SIZE = 8;
export const I64_SIZE = 8;
export const BOOL_SIZE = 1;
export const U8_SIZE = 1;
export const BORSH_STRING_PREFIX_SIZE = 4;

export const MAX_UNIQUE_ID_LEN = 64;
export const MAX_NAME_LEN = 128;

export const SOLAR_DEVICE_ACCOUNT_SIZE =
  ANCHOR_DISCRIMINATOR_SIZE +
  PUBKEY_SIZE +
  (BORSH_STRING_PREFIX_SIZE + MAX_UNIQUE_ID_LEN) +
  (BORSH_STRING_PREFIX_SIZE + MAX_NAME_LEN) +
  U64_SIZE +
  U64_SIZE +
  U64_SIZE +
  BOOL_SIZE +
  I64_SIZE +
  I64_SIZE +
  U8_SIZE;

export const ENERGY_RECORD_ACCOUNT_SIZE =
  ANCHOR_DISCRIMINATOR_SIZE +
  PUBKEY_SIZE +
  PUBKEY_SIZE +
  U64_SIZE +
  U64_SIZE +
  U64_SIZE +
  U64_SIZE +
  I64_SIZE +
  U8_SIZE;

export const SOLAR_DEVICE_DISCRIMINATOR = [
  102, 35, 85, 189, 139, 116, 177, 127,
] as const;

export const ENERGY_RECORD_DISCRIMINATOR = [
  45, 68, 187, 125, 120, 133, 73, 162,
] as const;

export const ENERGY_RECORD_DEVICE_OFFSET = ANCHOR_DISCRIMINATOR_SIZE;

export interface OnchainSolarDevice {
  owner: string;
  uniqueId: string;
  name: string;
  totalEnergyWh: number;
  currentWattageMw: number;
  recordCount: number;
  active: boolean;
  registeredAt: number;
  lastRecordAt: number;
  bump: number;
  pubkey: string;
}

export interface OnchainEnergyRecord {
  device: string;
  owner: string;
  wattageMw: number;
  energyWh: number;
  cumulativeEnergyWh: number;
  recordIndex: number;
  timestamp: number;
  bump: number;
  pubkey: string;
}
