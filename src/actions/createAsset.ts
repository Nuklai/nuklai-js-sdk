// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { actions, consts, codec, utils } from '@nuklai/hyperchain-sdk'
import {
  CREATEASSET_COMPUTE_UNITS,
  CREATEASSET_ID,
  MAX_METADATA_SIZE,
  MAX_SYMBOL_SIZE,
  STORAGE_ASSET_CHUNKS,
  ASSET_FUNGIBLE_TOKEN_ID,
  ASSET_NON_FUNGIBLE_TOKEN_ID,
  ASSET_DATASET_TOKEN_ID,
} from '../constants'

export class CreateAsset implements actions.Action {
  public assetType: number
  public name: Uint8Array
  public symbol: Uint8Array
  public decimals: number
  public metadata: Uint8Array
  public uri: Uint8Array
  public maxSupply: bigint
  public parentNFTMetadata?: Uint8Array

  constructor(
      assetType: number,
      name: string,
      symbol: string,
      decimals: number,
      metadata: string,
      uri: string,
      maxSupply: bigint,
      parentNFTMetadata?: string
  ) {
    this.assetType = assetType;
    this.name = new TextEncoder().encode(name.slice(0, 64)); // Limit name to 64 bytes
    this.symbol = new TextEncoder().encode(symbol.slice(0, 8)); // Limit symbol to 8 bytes
    this.decimals = decimals;
    this.metadata = new TextEncoder().encode(metadata.slice(0, 256)); // Limit metadata to 256 bytes
    this.uri = new TextEncoder().encode(uri.slice(0, 128)); // Limit URI to 128 bytes
    this.maxSupply = maxSupply;
    if (parentNFTMetadata) {
      this.parentNFTMetadata = new TextEncoder().encode(parentNFTMetadata.slice(0, 256)); // Limit parentNFTMetadata to 256 bytes
    }
  }

  getTypeId(): number {
    return CREATEASSET_ID
  }

  size(): number {
    let size = consts.BYTE_LEN + // assetType
        consts.INT_LEN + this.name.length +
        consts.INT_LEN + this.symbol.length +
        consts.BYTE_LEN + // decimals
        consts.INT_LEN + this.metadata.length +
        consts.INT_LEN + this.uri.length +
        consts.LONG_LEN; // maxSupply

    if (this.parentNFTMetadata) {
      size += consts.INT_LEN + this.parentNFTMetadata.length;
    }

    return size;
  }

  computeUnits(): number {
    return CREATEASSET_COMPUTE_UNITS
  }

  stateKeysMaxChunks(): number[] {
    return [STORAGE_ASSET_CHUNKS]
  }

  toJSON(): object {
    const json: any = {
      assetType: this.assetType,
      name: new TextDecoder().decode(this.name),
      symbol: new TextDecoder().decode(this.symbol),
      decimals: this.decimals,
      metadata: new TextDecoder().decode(this.metadata),
      uri: new TextDecoder().decode(this.uri),
      maxSupply: this.maxSupply.toString(),
    }
    if (this.assetType === ASSET_DATASET_TOKEN_ID && this.parentNFTMetadata) {
      json.parentNFTMetadata = new TextDecoder().decode(this.parentNFTMetadata)
    }
    return json
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

    let parentNFTMetadata: Uint8Array | undefined
    if (assetType === ASSET_DATASET_TOKEN_ID) {
      parentNFTMetadata = codec.unpackLimitedBytes(MAX_METADATA_SIZE, false)
    }

    const action = new CreateAsset(
        assetType,
        new TextDecoder().decode(name),
        new TextDecoder().decode(symbol),
        decimals,
        new TextDecoder().decode(metadata),
        new TextDecoder().decode(uri),
        maxSupply,
        parentNFTMetadata ? new TextDecoder().decode(parentNFTMetadata) : undefined
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

    if (this.assetType === ASSET_DATASET_TOKEN_ID && this.parentNFTMetadata) {
      codec.packBytes(this.parentNFTMetadata)
    }

    return codec.toBytes()
  }
}