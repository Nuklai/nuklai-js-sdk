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
    const codec = new Codec();
    codec.addBigInt(this.timestamp);
    codec.addBytes(this.chainId.toBytes());
    codec.addBigInt(this.maxFee);
    return codec.toBytes();
  }

  static fromBytes(bytes: Uint8Array): BaseTx {
    const codec = new Codec(bytes);
    const timestamp = codec.getBigInt();
    const [chainId, _] = Id.fromBytes(codec.getBytes());
    const maxFee = codec.getBigInt();
    return new BaseTx(timestamp, chainId, maxFee);
  }
}
