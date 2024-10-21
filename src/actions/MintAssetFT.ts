// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { actions, consts, utils } from "@nuklai/hyperchain-sdk";
import {
  MINT_ASSET_COMPUTE_UNITS,
  MINT_ASSET_FT_ID,
  STORAGE_ASSET_CHUNKS,
  STORAGE_BALANCE_CHUNKS,
} from "../constants";

export const MintAssetFTTxSize =
  consts.ADDRESS_LEN + // to
  consts.ADDRESS_LEN + // assetAddress
  consts.UINT64_LEN; // value

export class MintAssetFT implements actions.Action {
  public to: utils.Address;
  public assetAddress: utils.Address;
  public value: bigint;

  constructor(to: string, assetAddress: string, value: bigint) {
    this.to = utils.Address.fromString(to);
    this.assetAddress = utils.Address.fromString(assetAddress);
    this.value = value;
  }

  getTypeId(): number {
    return MINT_ASSET_FT_ID;
  }

  size(): number {
    return MintAssetFTTxSize;
  }

  computeUnits(): number {
    return MINT_ASSET_COMPUTE_UNITS;
  }

  stateKeysMaxChunks(): number[] {
    return [STORAGE_ASSET_CHUNKS, STORAGE_BALANCE_CHUNKS];
  }

  toJSON(): object {
    return {
      to: this.to.toString(),
      assetAddress: this.assetAddress.toString(),
      value: this.value.toString(),
    };
  }

  toString(): string {
    return JSON.stringify(this.toJSON());
  }

  toBytes(): Uint8Array {
    const codec = utils.Codec.newWriter(this.size(), this.size());
    codec.packAddress(this.to);
    codec.packAddress(this.assetAddress);
    codec.packUint64(this.value);
    return codec.toBytes();
  }

  static fromBytes(bytes: Uint8Array): [MintAssetFT | null, Error | null] {
    const codec = utils.Codec.newReader(bytes, bytes.length);
    const to = codec.unpackAddress();
    const assetAddress = codec.unpackAddress();
    const value = codec.unpackUint64(true);

    const error = codec.getError();
    if (error) {
      return [null, error];
    }

    const action = new MintAssetFT(
      to.toString(),
      assetAddress.toString(),
      value
    );
    return [action, null];
  }
}
