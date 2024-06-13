import { Codec } from '../utils/codec'

export class Transfer {
  constructor(
    public to: Uint8Array,
    public asset: string,
    public value: bigint,
    public memo: Uint8Array
  ) {}

  toBytes(): Uint8Array {
    const codec = new Codec()
    codec.addBytes(this.to)
    codec.addString(this.asset)
    codec.addBigInt(this.value)
    codec.addBytes(this.memo)
    return codec.toBytes()
  }

  static fromBytes(bytes: Uint8Array): Transfer {
    const codec = new Codec(bytes)
    const to = codec.getBytes()
    const asset = codec.getString()
    const value = codec.getBigInt()
    const memo = codec.getBytes()
    return new Transfer(to, asset, value, memo)
  }
}
