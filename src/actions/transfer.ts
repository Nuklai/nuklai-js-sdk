// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { actions, utils, consts } from '@nuklai/hyperchain-sdk';
import { Address } from "@nuklai/hyperchain-sdk/dist/utils";
import {
  TRANSFER_COMPUTE_UNITS,
  TRANSFER_ID,
  STORAGE_ASSET_CHUNKS,
  STORAGE_BALANCE_CHUNKS,
  MAX_TEXT_SIZE,
  ADDRESS_LEN,
  UINT64_LEN
} from '../constants';

export class Transfer implements actions.Action {
  public to: Address;
  public assetAddress: Address;
  public value: bigint;
  public memo: string;

  constructor(to: string, assetAddress: string, value: bigint, memo: string) {
    this.to = Address.fromString(to);
    this.assetAddress = Address.fromString(assetAddress);
    this.value = value;
    this.memo = memo;

    this.validate();
  }

  private validate(): void {
    if (this.memo.length > MAX_TEXT_SIZE) {
      throw new Error('Memo is too large');
    }
    if (this.value === 0n) {
      throw new Error('Value is zero');
    }
  }

  getTypeId(): number {
    return TRANSFER_ID;
  }

  size(): number {
    return ADDRESS_LEN * 2 + UINT64_LEN + 2 + this.memo.length; // 2 for string length prefix
  }

  computeUnits(): number {
    return TRANSFER_COMPUTE_UNITS;
  }

  stateKeysMaxChunks(): number[] {
    return [STORAGE_ASSET_CHUNKS, STORAGE_BALANCE_CHUNKS, STORAGE_BALANCE_CHUNKS];
  }

  toJSON(): object {
    return {
      to: this.to.toString(),
      assetAddress: this.assetAddress.toString(),
      value: this.value.toString(),
      memo: this.memo
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
    codec.packString(this.memo);
    return codec.toBytes();
  }

  static fromBytes(bytes: Uint8Array): [Transfer | null, Error | null] {
    const codec = utils.Codec.newReader(bytes, bytes.length);
    const to = codec.unpackAddress();
    const assetAddress = codec.unpackAddress();
    const value = codec.unpackUint64(true);
    const memo = codec.unpackString(false);

    const error = codec.getError();
    if (error) {
      return [null, error];
    }

    const action = new Transfer(
        to.toString(),
        assetAddress.toString(),
        value,
        memo
    );
    return [action, null];
  }
}
