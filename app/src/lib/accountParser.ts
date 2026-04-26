import { PublicKey } from "@solana/web3.js";
import type { OnchainSolarDevice, OnchainEnergyRecord } from "./program";

const TIMESTAMP_MIN = 1_577_836_800;
const TIMESTAMP_MAX = 4_102_444_800;

function readBorshString(data: Uint8Array, offset: number): [string, number] {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const len = view.getUint32(offset, true);
  const bytes = data.subarray(offset + 4, offset + 4 + len);
  return [new TextDecoder().decode(bytes), offset + 4 + len];
}

function readU64LE(data: Uint8Array, offset: number): number {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  return Number(view.getBigUint64(offset, true));
}

function readI64LE(data: Uint8Array, offset: number): number {
  const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  return Number(view.getBigInt64(offset, true));
}

export function parseSolarDevice(
  data: Uint8Array,
  pubkey: string
): OnchainSolarDevice | null {
  try {
    let offset = 8;

    const owner = new PublicKey(data.subarray(offset, offset + 32)).toBase58();
    offset += 32;

    const [uniqueId, afterUid] = readBorshString(data, offset);
    offset = afterUid;

    const [name, afterName] = readBorshString(data, offset);
    offset = afterName;

    const totalEnergyWh = readU64LE(data, offset);
    offset += 8;

    const currentWattageMw = readU64LE(data, offset);
    offset += 8;

    const recordCount = readU64LE(data, offset);
    offset += 8;

    const active = data[offset] === 1;
    offset += 1;

    const registeredAt = readI64LE(data, offset);
    offset += 8;

    const lastRecordAt = readI64LE(data, offset);
    offset += 8;

    const bump = data[offset];

    if (registeredAt < TIMESTAMP_MIN || registeredAt > TIMESTAMP_MAX)
      return null;

    return {
      owner,
      uniqueId,
      name,
      totalEnergyWh,
      currentWattageMw,
      recordCount,
      active,
      registeredAt,
      lastRecordAt,
      bump,
      pubkey,
    };
  } catch {
    return null;
  }
}

export function parseEnergyRecord(
  data: Uint8Array,
  pubkey: string
): OnchainEnergyRecord | null {
  try {
    let offset = 8;

    const device = new PublicKey(data.subarray(offset, offset + 32)).toBase58();
    offset += 32;

    const owner = new PublicKey(data.subarray(offset, offset + 32)).toBase58();
    offset += 32;

    const wattageMw = readU64LE(data, offset);
    offset += 8;

    const energyWh = readU64LE(data, offset);
    offset += 8;

    const cumulativeEnergyWh = readU64LE(data, offset);
    offset += 8;

    const recordIndex = readU64LE(data, offset);
    offset += 8;

    const timestamp = readI64LE(data, offset);
    offset += 8;

    const bump = data[offset];

    if (timestamp < TIMESTAMP_MIN || timestamp > TIMESTAMP_MAX) return null;

    return {
      device,
      owner,
      wattageMw,
      energyWh,
      cumulativeEnergyWh,
      recordIndex,
      timestamp,
      bump,
      pubkey,
    };
  } catch {
    return null;
  }
}
