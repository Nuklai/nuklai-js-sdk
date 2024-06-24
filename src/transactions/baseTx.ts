// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Id } from '@avalabs/avalanchejs'
import {
  EMPTY_ID,
  ID_LEN,
  MillisecondsPerSecond,
  UINT64_LEN
} from '../constants/consts'
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
    const packedTimestampBytes = codec.toBytes()
    codec.packID(this.chainId)
    codec.packUint64(this.maxFee)
    return codec.toBytes()
  }

  static fromBytes(bytes: Uint8Array): [BaseTx, Error?] {
    const codec = Codec.newReader(bytes, bytes.length)
    const timestamp = codec.unpackInt64(true)
    if (timestamp % MillisecondsPerSecond !== 0n) {
      return [
        new BaseTx(0n, EMPTY_ID, 0n),
        new Error('Timestamp is misaligned')
      ]
    }
    const chainId = codec.unpackID(true)
    const maxFee = codec.unpackUint64(true)
    const baseTx = new BaseTx(timestamp, chainId, maxFee)
    return [baseTx, codec.getError()]
  }
}
