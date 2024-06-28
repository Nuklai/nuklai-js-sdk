// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Id } from '@avalabs/avalanchejs'
import { actions, consts, utils } from '@nuklai/hyperchain-sdk'
import {
  MINTASSET_COMPUTE_UNITS,
  MINTASSET_ID,
  STORAGE_ASSET_CHUNKS,
  STORAGE_BALANCE_CHUNKS
} from '../constants/nuklaivm'

export const MintAssetTxSize =
  consts.ADDRESS_LEN + consts.ID_LEN + consts.UINT64_LEN

export class MintAsset implements actions.Action {
  public to: utils.Address
  public asset: Id
  public value: bigint

  constructor(to: string, asset: string, value: bigint) {
    this.to = utils.Address.fromString(to)
    // Default asset to NAI if asset is "NAI"
    this.asset = utils.toAssetID(asset)
    this.value = value
  }

  getTypeId(): number {
    return MINTASSET_ID
  }

  size(): number {
    return consts.ADDRESS_LEN + consts.ID_LEN + consts.UINT64_LEN
  }

  computeUnits(): number {
    return MINTASSET_COMPUTE_UNITS
  }

  stateKeysMaxChunks(): number[] {
    return [STORAGE_ASSET_CHUNKS, STORAGE_BALANCE_CHUNKS]
  }

  toBytes(): Uint8Array {
    const codec = utils.Codec.newWriter(this.size(), this.size())
    codec.packAddress(this.to)
    codec.packID(this.asset)
    codec.packUint64(this.value)
    const bytes = codec.toBytes()
    return bytes
  }

  static fromBytes(bytes: Uint8Array): [MintAsset, Error?] {
    const codec = utils.Codec.newReader(bytes, bytes.length)
    const to = codec.unpackAddress()
    const asset = codec.unpackID(false)
    const value = codec.unpackUint64(true)
    const action = new MintAsset(to.toString(), asset.toString(), value)
    return [action, codec.getError()]
  }

  static fromBytesCodec(codec: utils.Codec): [MintAsset, utils.Codec] {
    const codecResult = codec
    const to = codecResult.unpackAddress()
    const asset = codecResult.unpackID(false)
    const value = codecResult.unpackUint64(true)
    const action = new MintAsset(to.toString(), asset.toString(), value)
    return [action, codecResult]
  }
}
