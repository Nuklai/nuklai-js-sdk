// transfer.ts

import { Id } from "@avalabs/avalanchejs";
import { Codec } from "../utils/codec";
import { Action } from "./action";
import { ID_LEN, UINT64_LEN } from "../constants/consts";
import {
  ADDRESS_LEN,
  MAX_MEMO_SIZE,
  STORAGE_BALANCE_CHUNKS,
  TRANSFER_COMPUTE_UNITS,
  TRANSFER_ID
} from "../constants/nuklaivm";

export const TransferTxSize = ADDRESS_LEN + ID_LEN + UINT64_LEN + MAX_MEMO_SIZE;

export class Transfer implements Action {
  constructor(
    public to: Uint8Array,
    public asset: Id,
    public value: bigint,
    public memo: Uint8Array
  ) {}

  getTypeId(): number {
    return TRANSFER_ID;
  }

  size(): number {
    return TransferTxSize;
  }

  computeUnits(): number {
    return TRANSFER_COMPUTE_UNITS;
  }

  stateKeysMaxChunks(): number[] {
    return [STORAGE_BALANCE_CHUNKS, STORAGE_BALANCE_CHUNKS];
  }

  toBytes(): Uint8Array {
    const size = this.size();
    const codec = Codec.newWriter(size, size);
    codec.addFixedBytes(ADDRESS_LEN, this.to);
    codec.addFixedBytes(ID_LEN, this.asset.toBytes());
    codec.addBigInt(this.value);
    codec.addFixedBytes(MAX_MEMO_SIZE, this.memo);
    return codec.toBytes();
  }

  static fromBytes(bytes: Uint8Array): Transfer {
    const codec = Codec.newReader(bytes, bytes.length);
    const to = codec.getFixedBytes(ADDRESS_LEN);
    const asset = Id.fromBytes(codec.getFixedBytes(ID_LEN))[0];
    const value = codec.getBigInt();
    const memo = codec.getFixedBytes(MAX_MEMO_SIZE);
    return new Transfer(to, asset, value, memo);
  }
}
