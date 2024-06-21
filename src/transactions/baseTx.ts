import { Id } from '@avalabs/avalanchejs'
import { ID_LEN, UINT64_LEN } from '../constants/consts'
import { Codec } from '../utils/codec'

export const BaseTxSize = 2 * UINT64_LEN + ID_LEN

export class BaseTx {
  timestamp: bigint
  chainId: Id
  maxFee: bigint

  constructor(timestamp: bigint, chainId: Id, maxFee: bigint) {
    this.timestamp = timestamp
    this.chainId = chainId
    this.maxFee = maxFee
  }

  size(): number {
    return BaseTxSize
  }

  toBytes(): Uint8Array {
    const codec = Codec.newWriter(this.size(), this.size())
    codec.packInt64(this.timestamp)
    codec.packID(this.chainId)
    codec.packUint64(this.maxFee)
    return codec.toBytes()
  }

  static fromBytes(bytes: Uint8Array): BaseTx {
    const codec = Codec.newReader(bytes, bytes.length)
    const timestamp = codec.unpackInt64(true)
    console.log('timestamp', timestamp)
    const chainId = codec.unpackID()
    console.log('chainId', chainId)
    const maxFee = codec.unpackUint64(true)
    console.log('maxFee', maxFee)
    const baseTx = new BaseTx(timestamp, chainId, maxFee)
    return baseTx
  }
}
