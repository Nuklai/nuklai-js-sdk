import { Id } from "@avalabs/avalanchejs";
import { Codec } from "../utils/codec";
import { Action } from "./action";
import { ID_LEN, UINT64_LEN } from "../constants/consts";
import {
  STORAGE_BALANCE_CHUNKS,
  TRANSFER_COMPUTE_UNITS,
  TRANSFER_ID
} from "../constants/nuklaivm";

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
    // Size of value (bigint) is 8 bytes
    const bigintSize = UINT64_LEN;

    // Size of to and memo (length of Uint8Array)
    const toSize = this.to.length;
    const memoSize = this.memo.length;

    // Size of asset
    const assetSize = ID_LEN;

    return toSize + assetSize + bigintSize + memoSize;
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
    codec.addBytes(this.to);
    codec.addBytes(this.asset.toBytes());
    codec.addBigInt(this.value);
    codec.addBytes(this.memo);
    return codec.toBytes();
  }

  static fromBytes(bytes: Uint8Array): Transfer {
    const codec = Codec.newReader(bytes, bytes.length);
    const to = codec.getBytes();
    const [asset, _] = Id.fromBytes(codec.getBytes());
    const value = codec.getBigInt();
    const memo = codec.getBytes();
    return new Transfer(to, asset, value, memo);
  }
}
