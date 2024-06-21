import { Id } from '@avalabs/avalanchejs'
import { ID_LEN, UINT64_LEN } from '../constants/consts'
import {
  ADDRESS_LEN,
  MAX_MEMO_SIZE,
  STORAGE_BALANCE_CHUNKS,
  TRANSFER_COMPUTE_UNITS,
  TRANSFER_ID
} from '../constants/nuklaivm'
import { Codec } from '../utils/codec'
import { Action } from './action'

export const TransferTxSize = ADDRESS_LEN + ID_LEN + UINT64_LEN + MAX_MEMO_SIZE

export class Transfer implements Action {
  constructor(
    public to: Uint8Array,
    public asset: Id,
    public value: bigint,
    public memo: Uint8Array
  ) {}

  getTypeId(): number {
    return TRANSFER_ID
  }

  size(): number {
    return TransferTxSize
  }

  computeUnits(): number {
    return TRANSFER_COMPUTE_UNITS
  }

  stateKeysMaxChunks(): number[] {
    return [STORAGE_BALANCE_CHUNKS, STORAGE_BALANCE_CHUNKS]
  }

  toBytes(): Uint8Array {
    const size = this.size()
    const codec = Codec.newWriter(size, size)
    codec.packFixedBytes(this.to)
    codec.packID(this.asset)
    codec.packUint64(this.value)
    codec.packBytes(this.memo)
    return codec.toBytes()
  }

  static fromBytes(bytes: Uint8Array): Transfer {
    const codec = Codec.newReader(bytes, bytes.length)
    const to = codec.unpackFixedBytes(ADDRESS_LEN)
    const asset = codec.unpackID()
    const value = codec.unpackUint64(true)
    const memo = codec.unpackFixedBytes(MAX_MEMO_SIZE)
    return new Transfer(to, asset, value, memo)
  }
}
