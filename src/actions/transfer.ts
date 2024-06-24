import { HRP } from "./../constants/nuklaivm";
import { Id } from "@avalabs/avalanchejs";
import { ADDRESS_LEN, ID_LEN, UINT64_LEN } from "../constants/consts";
import {
  MAX_MEMO_SIZE,
  STORAGE_BALANCE_CHUNKS,
  TRANSFER_COMPUTE_UNITS,
  TRANSFER_ID
} from "../constants/nuklaivm";
import { Codec } from "../utils/codec";
import { Action } from "./action";
import { Address } from "../utils/address";

export const TransferTxSize = ADDRESS_LEN + ID_LEN + UINT64_LEN + MAX_MEMO_SIZE;

export class Transfer implements Action {
  constructor(
    public to: Address,
    public asset: Id,
    public value: bigint,
    public memo: string
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
    const codec = Codec.newWriter(this.size(), this.size());
    codec.packAddress(this.to);
    codec.packID(this.asset);
    codec.packUint64(this.value);
    codec.packBytes(new TextEncoder().encode(this.memo));
    const bytes = codec.toBytes();
    return bytes;
  }

  static fromBytes(bytes: Uint8Array): [Transfer, Error?] {
    const codec = Codec.newReader(bytes, bytes.length);
    const to = codec.unpackAddress();
    const asset = codec.unpackID(false);
    const value = codec.unpackUint64(true);
    const memo = codec.unpackLimitedBytes(MAX_MEMO_SIZE);
    const action = new Transfer(
      to,
      asset,
      value,
      new TextDecoder().decode(memo)
    );
    return [action, codec.getError()];
  }
}
