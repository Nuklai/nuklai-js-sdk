// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { actions, consts, codec, utils } from '@nuklai/hyperchain-sdk'
import {
  CREATEASSET_COMPUTE_UNITS,
  CREATEASSET_ID,
  MAX_METADATA_SIZE,
  MAX_SYMBOL_SIZE,
  STORAGE_ASSET_CHUNKS
} from '../constants'

export class CreateAsset implements actions.Action {
  public assetType: number
  public name: Uint8Array
  public symbol: Uint8Array
  public decimals: number
  public metadata: Uint8Array
  public uri: Uint8Array
  public maxSupply: bigint

  constructor(
      assetType: number,
      name: string,
      symbol: string,
      decimals: number,
      metadata: string,
      uri: string,
      maxSupply: bigint,
  ) {
    this.assetType = assetType
    this.name = new TextEncoder().encode(name)
    this.symbol = new TextEncoder().encode(symbol)
    this.decimals = decimals
    this.metadata = new TextEncoder().encode(metadata)
    this.uri = new TextEncoder().encode(uri)
    this.maxSupply = maxSupply
  }

  getTypeId(): number {
    return CREATEASSET_ID
  }

  size(): number {
    // We have to add INT_LEN because when packing bytes, we pack the length of the bytes
    return (
      consts.INT_LEN +
      this.symbol.length +
      consts.BYTE_LEN +
      consts.INT_LEN +
      this.metadata.length
    )
  }

  computeUnits(): number {
    return CREATEASSET_COMPUTE_UNITS
  }

  stateKeysMaxChunks(): number[] {
    return [STORAGE_ASSET_CHUNKS]
  }

  toJSON(): object {
    return {
      assetType: this.assetType,
      name: new TextDecoder().decode(this.name),
      symbol: new TextDecoder().decode(this.symbol),
      decimals: this.decimals,
      metadata: new TextDecoder().decode(this.metadata),
      uri: new TextDecoder().decode(this.uri),
      maxSupply: this.maxSupply.toString(),
    }
  }

  toString(): string {
    return JSON.stringify(this.toJSON())
  }

  static fromBytesCodec(codec: utils.Codec): [CreateAsset, utils.Codec] {
    const assetType = codec.unpackByte()
    const name = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
    const symbol = codec.unpackLimitedBytes(MAX_SYMBOL_SIZE, true)
    const decimals = codec.unpackByte()
    const metadata = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
    const uri = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
    const maxSupply = codec.unpackUint64(false)

    const action = new CreateAsset(
        assetType,
        new TextDecoder().decode(name),
        new TextDecoder().decode(symbol),
        decimals,
        new TextDecoder().decode(metadata),
        new TextDecoder().decode(uri),
        maxSupply
    )
    return [action, codec]
  }

  toBytes(): Uint8Array {
    const codec = utils.Codec.newWriter(this.size(), this.size())
    codec.packByte(this.assetType)
    codec.packBytes(this.name)
    codec.packBytes(this.symbol)
    codec.packByte(this.decimals)
    codec.packBytes(this.metadata)
    codec.packBytes(this.uri)
    codec.packUint64(this.maxSupply)
    return codec.toBytes()
  }
}