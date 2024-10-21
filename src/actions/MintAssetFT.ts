// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Address } from "@avalabs/avalanchego-utils";
import { Action, Codec } from "@nuklai/nuklai-sdk";
import {
  MINTASSET_FT_COMPUTE_UNITS,
  MINTASSET_FT_ID,
  STORAGE_ASSET_CHUNKS,
  STORAGE_BALANCE_CHUNKS,
} from "../constants";

export class MintAssetFT implements Action {
  public assetAddress: Address;
  public value: bigint;
  public to: Address;

  constructor(assetAddress: string, value: bigint, to: string) {
    this.assetAddress = Address.fromString(assetAddress);
    this.value = value;
    this.to = Address.fromString(to);
  }

  getTypeId(): number {
    return MINTASSET_FT_ID;
  }

  computeUnits(): number {
    return MINTASSET_FT_COMPUTE_UNITS;
  }

  static unmarshal(codec: Codec): MintAssetFT {
    const assetAddress = codec.unpackAddress();
    const value = codec.unpackUint64(false);
    const to = codec.unpackAddress();
    return new MintAssetFT(assetAddress.toString(), value, to.toString());
  }

  toJSON(): object {
    return {
      assetAddress: this.assetAddress.toString(),
      value: this.value.toString(),
      to: this.to.toString(),
    };
  }

  toString(): string {
    return JSON.stringify(this.toJSON());
  }

  stateKeysMaxChunks(): number[] {
    return [STORAGE_ASSET_CHUNKS, STORAGE_BALANCE_CHUNKS];
  }
}

export class MintAssetFTResult {
  public oldBalance: bigint;
  public newBalance: bigint;

  constructor(oldBalance: bigint, newBalance: bigint) {
    this.oldBalance = oldBalance;
    this.newBalance = newBalance;
  }

  getTypeId(): number {
    return MINTASSET_FT_ID;
  }

  marshal(codec: Codec): void {
    codec.packUint64(this.oldBalance);
    codec.packUint64(this.newBalance);
  }

  static unmarshal(codec: Codec): MintAssetFTResult {
    const oldBalance = codec.unpackUint64(false);
    const newBalance = codec.unpackUint64(true);
    return new MintAssetFTResult(oldBalance, newBalance);
  }

  toJSON(): object {
    return {
      oldBalance: this.oldBalance.toString(),
      newBalance: this.newBalance.toString(),
    };
  }

  toString(): string {
    return JSON.stringify(this.toJSON());
  }
}
