// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { actions, consts, utils } from "@nuklai/hyperchain-sdk";
import {
  MINT_ASSET_COMPUTE_UNITS,
  MINT_ASSET_FT_ID,
  STORAGE_ASSET_CHUNKS,
  STORAGE_BALANCE_CHUNKS,
  ASSET_FRACTIONAL_TOKEN_ID,
} from "../constants";

export class MintDataset implements actions.Action {
  public assetAddress: utils.Address;
  public to: utils.Address;
  public value: bigint;

  constructor(assetAddress: string, to: string, value: bigint) {
    this.assetAddress = utils.Address.fromString(assetAddress);
    this.to = utils.Address.fromString(to);
    this.value = value;
  }

  getTypeId(): number {
    return MINT_ASSET_FT_ID;
  }

  size(): number {
    return consts.ADDRESS_LEN + consts.ADDRESS_LEN + consts.UINT64_LEN;
  }

  computeUnits(): number {
    return MINT_ASSET_COMPUTE_UNITS;
  }

  stateKeysMaxChunks(): number[] {
    return [STORAGE_ASSET_CHUNKS, STORAGE_BALANCE_CHUNKS];
  }

  toJSON(): object {
    return {
      assetAddress: this.assetAddress.toString(),
      to: this.to.toString(),
      value: this.value.toString(),
    };
  }

  toString(): string {
    return JSON.stringify(this.toJSON());
  }

  toBytes(): Uint8Array {
    const codec = utils.Codec.newWriter(this.size(), this.size());
    codec.packAddress(this.assetAddress);
    codec.packAddress(this.to);
    codec.packUint64(this.value);
    return codec.toBytes();
  }

  static fromBytes(bytes: Uint8Array): [MintDataset | null, Error | null] {
    const codec = utils.Codec.newReader(bytes, bytes.length);
    const assetAddress = codec.unpackAddress();
    const to = codec.unpackAddress();
    const value = codec.unpackUint64(true);

    const error = codec.getError();
    if (error) {
      return [null, error];
    }

    const action = new MintDataset(
      assetAddress.toString(),
      to.toString(),
      value
    );
    return [action, null];
  }
}
