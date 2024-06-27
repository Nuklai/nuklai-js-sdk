// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Id } from '@avalabs/avalanchejs'
import { ADDRESS_LEN, ID_LEN, UINT64_LEN } from '../constants/consts'
import {
  MINTASSET_COMPUTE_UNITS,
  MINTASSET_ID,
  STORAGE_ASSET_CHUNKS,
  STORAGE_BALANCE_CHUNKS
} from '../constants/nuklaivm'
import { Address } from '../utils/address'
import { Codec } from '../utils/codec'
import { toAssetID } from '../utils/utils'
import { Action } from './action'

export const MintAssetTxSize = ADDRESS_LEN + ID_LEN + UINT64_LEN

export class MintAsset implements Action {
  public to: Address
  public asset: Id
  public value: bigint

  constructor(to: string, asset: string, value: bigint) {
    this.to = Address.fromString(to)
    // Default asset to NAI if asset is "NAI"
    this.asset = toAssetID(asset)
    this.value = value
  }

  getTypeId(): number {
    return MINTASSET_ID
  }

  size(): number {
    return ADDRESS_LEN + ID_LEN + UINT64_LEN
  }

  computeUnits(): number {
    return MINTASSET_COMPUTE_UNITS
  }

  stateKeysMaxChunks(): number[] {
    return [STORAGE_ASSET_CHUNKS, STORAGE_BALANCE_CHUNKS]
  }

  toBytes(): Uint8Array {
    const codec = Codec.newWriter(this.size(), this.size())
    codec.packAddress(this.to)
    codec.packID(this.asset)
    codec.packUint64(this.value)
    const bytes = codec.toBytes()
    return bytes
  }

  static fromBytes(bytes: Uint8Array): [MintAsset, Error?] {
    const codec = Codec.newReader(bytes, bytes.length)
    const to = codec.unpackAddress()
    const asset = codec.unpackID(false)
    const value = codec.unpackUint64(true)
    const action = new MintAsset(to.toString(), asset.toString(), value)
    return [action, codec.getError()]
  }

  static fromBytesCodec(codec: Codec): [MintAsset, Codec] {
    const codecResult = codec
    const to = codecResult.unpackAddress()
    const asset = codecResult.unpackID(false)
    const value = codecResult.unpackUint64(true)
    const action = new MintAsset(to.toString(), asset.toString(), value)
    return [action, codecResult]
  }
}
