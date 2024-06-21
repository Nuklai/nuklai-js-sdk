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
    const codec = Codec.newWriter(this.size(), this.size())
    codec.packFixedBytes(this.to)
    codec.packID(this.asset)
    codec.packUint64(this.value)
    codec.packFixedBytes(this.memo) // Packing memo as fixed size
    const bytes = codec.toBytes()
    console.log('Action toBytes:', bytes, 'Length:', bytes.length)
    return bytes
  }

  static fromBytes(bytes: Uint8Array): Transfer {
    const codec = Codec.newReader(bytes, bytes.length)
    const to = codec.unpackFixedBytes(ADDRESS_LEN)
    const asset = codec.unpackID()
    const value = codec.unpackUint64(true)
    const memo = codec.unpackFixedBytes(MAX_MEMO_SIZE) // Unpacking memo as fixed size
    const action = new Transfer(to, asset, value, memo)
    console.log('Action fromBytes:', action)
    return action
  }
}
