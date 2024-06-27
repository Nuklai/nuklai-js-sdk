// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { BYTE_LEN, INT_LEN } from '../constants/consts'
import {
  CREATEASSET_COMPUTE_UNITS,
  CREATEASSET_ID,
  MAX_MEMO_SIZE,
  MAX_METADATA_SIZE,
  MAX_SYMBOL_SIZE,
  STORAGE_ASSET_CHUNKS
} from '../constants/nuklaivm'
import { Codec } from '../utils/codec'
import { Action } from './action'

export const CreateAssetTxSize =
  INT_LEN + MAX_SYMBOL_SIZE + BYTE_LEN + INT_LEN + MAX_MEMO_SIZE

export class CreateAsset implements Action {
  public symbol: Uint8Array
  public decimals: number
  public metadata: Uint8Array

  constructor(symbol: string, decimals: number, metadata: string) {
    this.symbol = new TextEncoder().encode(symbol)
    this.decimals = decimals
    this.metadata = new TextEncoder().encode(metadata)
  }

  getTypeId(): number {
    return CREATEASSET_ID
  }

  size(): number {
    // We have to add INT_LEN because when packing bytes, we pack the length of the bytes
    return (
      INT_LEN + this.symbol.length + BYTE_LEN + INT_LEN + this.metadata.length
    )
  }

  computeUnits(): number {
    return CREATEASSET_COMPUTE_UNITS
  }

  stateKeysMaxChunks(): number[] {
    return [STORAGE_ASSET_CHUNKS]
  }

  toBytes(): Uint8Array {
    const codec = Codec.newWriter(this.size(), this.size())
    codec.packBytes(this.symbol)
    codec.packByte(this.decimals)
    codec.packBytes(this.metadata)
    const bytes = codec.toBytes()
    return bytes
  }

  static fromBytes(bytes: Uint8Array): [CreateAsset, Error?] {
    const codec = Codec.newReader(bytes, bytes.length)
    // Ensure the symbol is unpacked as fixed bytes of MAX_SYMBOL_SIZE
    const symbolBytes = codec.unpackLimitedBytes(MAX_SYMBOL_SIZE)
    const symbol = new TextDecoder().decode(symbolBytes)
    const decimals = codec.unpackByte()
    // Ensure the metadata is unpacked as fixed bytes of MAX_METADATA_SIZE
    const metadataBytes = codec.unpackLimitedBytes(MAX_METADATA_SIZE)
    const metadata = new TextDecoder().decode(metadataBytes)
    const action = new CreateAsset(symbol, decimals, metadata)
    return [action, codec.getError()]
  }

  static fromBytesCodec(codec: Codec): [CreateAsset, Codec] {
    const codecResult = codec
    // Ensure the symbol is unpacked as fixed bytes of MAX_SYMBOL_SIZE
    const symbolBytes = codecResult.unpackLimitedBytes(MAX_SYMBOL_SIZE)
    const symbol = new TextDecoder().decode(symbolBytes)
    const decimals = codecResult.unpackByte()
    // Ensure the metadata is unpacked as fixed bytes of MAX_METADATA_SIZE
    const metadataBytes = codecResult.unpackLimitedBytes(MAX_METADATA_SIZE)
    const metadata = new TextDecoder().decode(metadataBytes)
    const action = new CreateAsset(symbol, decimals, metadata)
    return [action, codecResult]
  }
}
