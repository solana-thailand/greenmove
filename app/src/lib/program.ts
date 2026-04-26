import { PublicKey } from "@solana/web3.js";

export const PROGRAM_ID = new PublicKey(
  "36D7U8McCLZF9ahuGmoiXehXzFLFm6v8N1gQVAfricSY"
);

export const SOLAR_DEVICE_SEED = "solar_device";
export const ENERGY_RECORD_SEED = "energy_record";

export const ANCHOR_DISCRIMINATOR_SIZE = 8;
export const PUBKEY_SIZE = 32;
export const U64_SIZE = 8;
export const I64_SIZE = 8;
export const BOOL_SIZE = 1;
export const BORSH_STRING_PREFIX_SIZE = 4;

export const SOLAR_DEVICE_DISCRIMINATOR = new Uint8Array([
  102, 35, 85, 189, 139, 116, 177, 127,
]);

export const ENERGY_RECORD_DISCRIMINATOR = new Uint8Array([
  45, 68, 187, 125, 120, 133, 73, 162,
]);

export const ENERGY_RECORD_DEVICE_OFFSET = ANCHOR_DISCRIMINATOR_SIZE;

const BS58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function encodeBs58(source: Uint8Array): string {
  if (source.length === 0) return "";
  const digits = [0];
  for (let i = 0; i < source.length; i++) {
    for (let j = 0; j < digits.length; j++) {
      digits[j] <<= 8;
    }
    digits[0] += source[i];
    let carry = 0;
    for (let j = 0; j < digits.length; j++) {
      digits[j] += carry;
      carry = (digits[j] / 58) | 0;
      digits[j] %= 58;
    }
    while (carry) {
      digits.push(carry % 58);
      carry = (carry / 58) | 0;
    }
  }
  let result = "";
  for (let i = 0; i < source.length && source[i] === 0; i++) {
    result += BS58_ALPHABET[0];
  }
  for (let i = digits.length - 1; i >= 0; i--) {
    result += BS58_ALPHABET[digits[i]];
  }
  return result;
}

export function createAccountFilter(discriminator: Uint8Array): {
  memcmp: { offset: number; bytes: string };
} {
  return {
    memcmp: {
      offset: 0,
      bytes: encodeBs58(discriminator),
    },
  };
}

export function createDeviceFilter(): ReturnType<typeof createAccountFilter> {
  return createAccountFilter(SOLAR_DEVICE_DISCRIMINATOR);
}

export function createEnergyRecordFilter(
  devicePubkey: string | null
): Array<{ memcmp: { offset: number; bytes: string } }> {
  const filters: Array<{ memcmp: { offset: number; bytes: string } }> = [
    createAccountFilter(ENERGY_RECORD_DISCRIMINATOR),
  ];

  if (devicePubkey) {
    filters.push({
      memcmp: {
        offset: ENERGY_RECORD_DEVICE_OFFSET,
        bytes: devicePubkey,
      },
    });
  }

  return filters;
}

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
