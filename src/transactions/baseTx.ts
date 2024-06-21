// baseTx.ts

import { Id } from "@avalabs/avalanchejs";
import { ID_LEN, UINT64_LEN } from "../constants/consts";
import { Codec } from "../utils/codec";

export const BaseTxSize = 2 * UINT64_LEN + ID_LEN;

export class BaseTx {
  timestamp: bigint;
  chainId: Id;
  maxFee: bigint;

  constructor(timestamp: bigint, chainId: Id, maxFee: bigint) {
    this.timestamp = timestamp;
    this.chainId = chainId;
    this.maxFee = maxFee;
  }

  size(): number {
    return BaseTxSize;
  }

  toBytes(): Uint8Array {
    const size = this.size();
    const codec = Codec.newWriter(size, size);
    codec.addBigInt(this.timestamp);
    codec.addFixedBytes(ID_LEN, this.chainId.toBytes());
    codec.addBigInt(this.maxFee);
    const bytes = codec.toBytes();
    return bytes;
  }

  static fromBytes(bytes: Uint8Array): BaseTx {
    const codec = Codec.newReader(bytes, bytes.length);
    const timestamp = codec.getBigInt();
    const chainIdBytes = codec.getFixedBytes(ID_LEN);
    const chainId = Id.fromBytes(chainIdBytes)[0];
    const maxFee = codec.getBigInt();
    return new BaseTx(timestamp, chainId, maxFee);
  }
}
