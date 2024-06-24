import { Id } from '@avalabs/avalanchejs'
import {
  ADDRESS_LEN,
  EMPTY_ID,
  ID_LEN,
  INT_LEN,
  UINT64_LEN
} from '../constants/consts'
import {
  MAX_MEMO_SIZE,
  STORAGE_BALANCE_CHUNKS,
  TRANSFER_COMPUTE_UNITS,
  TRANSFER_ID
} from '../constants/nuklaivm'
import { Address } from '../utils/address'
import { Codec } from '../utils/codec'
import { Action } from './action'

export const TransferTxSize =
  ADDRESS_LEN + ID_LEN + UINT64_LEN + INT_LEN + MAX_MEMO_SIZE

export class Transfer implements Action {
  public to: Address
  public asset: Id
  public value: bigint
  public memo: Uint8Array

  constructor(to: string, asset: string, value: bigint, memo: string) {
    this.to = Address.fromString(to)
    // Default asset to NAI if asset is "NAI"
    this.asset = asset === 'NAI' ? EMPTY_ID : Id.fromString(asset)
    this.value = value
    this.memo = new TextEncoder().encode(memo)
  }

  getTypeId(): number {
    return TRANSFER_ID
  }

  size(): number {
    // We have to add INT_LEN because when packing bytes, we pack the length of the bytes
    return ADDRESS_LEN + ID_LEN + UINT64_LEN + INT_LEN + this.memo.length
  }

  computeUnits(): number {
    return TRANSFER_COMPUTE_UNITS
  }

  stateKeysMaxChunks(): number[] {
    return [STORAGE_BALANCE_CHUNKS, STORAGE_BALANCE_CHUNKS]
  }

  toBytes(): Uint8Array {
    const codec = Codec.newWriter(this.size(), this.size())
    codec.packAddress(this.to)
    codec.packID(this.asset)
    codec.packUint64(this.value)
    codec.packBytes(this.memo)
    const bytes = codec.toBytes()
    return bytes
  }

  static fromBytes(bytes: Uint8Array): [Transfer, Error?] {
    const codec = Codec.newReader(bytes, bytes.length)
    const to = codec.unpackAddress()
    const asset = codec.unpackID(false)
    const value = codec.unpackUint64(true)

    // Ensure the memo is unpacked as fixed bytes of MAX_MEMO_SIZE
    const memoBytes = codec.unpackLimitedBytes(MAX_MEMO_SIZE)
    const memo = new TextDecoder().decode(memoBytes)

    const action = new Transfer(to.toString(), asset.toString(), value, memo)
    return [action, codec.getError()]
  }

  static fromBytesCodec(codec: Codec): [Transfer, Codec] {
    const codecResult = codec
    const to = codecResult.unpackAddress()
    const asset = codecResult.unpackID(false)
    const value = codecResult.unpackUint64(true)

    // Ensure the memo is unpacked as fixed bytes of MAX_MEMO_SIZE
    const memoBytes = codecResult.unpackLimitedBytes(MAX_MEMO_SIZE)
    const memo = new TextDecoder().decode(memoBytes)

    const action = new Transfer(to.toString(), asset.toString(), value, memo)
    return [action, codecResult]
  }
}
