// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Id } from '@avalabs/avalanchejs'
import { actions, consts, codec, utils } from '@nuklai/hyperchain-sdk'
import {
  MAX_METADATA_SIZE,
  MINTDATASET_COMPUTE_UNITS,
  MINTDATASET_ID,
  STORAGE_ASSET_CHUNKS,
  STORAGE_ASSET_NFT_CHUNKS,
  STORAGE_BALANCE_CHUNKS
} from '../constants/nuklaivm'

export class MintDataset implements actions.Action {
  public to: utils.Address
  public assetID: Id
  public name: Uint8Array
  public description: Uint8Array
  public metadata: Uint8Array
  public isCommunityDataset: boolean
  public parentNFTID: Id | null

  constructor(
      to: string,
      assetID: string,
      name: string,
      description: string,
      metadata: string,
      isCommunityDataset: boolean,
      parentNFTID?: string
  ) {
    this.to = utils.Address.fromString(to)
    this.assetID = utils.toAssetID(assetID)
    this.name = new TextEncoder().encode(name)
    this.description = new TextEncoder().encode(description)
    this.metadata = new TextEncoder().encode(metadata)
    this.isCommunityDataset = isCommunityDataset
    this.parentNFTID = parentNFTID ? utils.toAssetID(parentNFTID) : null
  }

  getTypeId(): number {
    return MINTDATASET_ID
  }

  size(): number {
    return (
        consts.ADDRESS_LEN +
        consts.ID_LEN +
        codec.bytesLen(this.name) +
        codec.bytesLen(this.description) +
        codec.bytesLen(this.metadata) +
        consts.BOOL_LEN +
        consts.BOOL_LEN + // For indicating if parentNFTID is present
        (this.parentNFTID ? consts.ID_LEN : 0)
    )
  }

  computeUnits(): number {
    return MINTDATASET_COMPUTE_UNITS
  }

  stateKeysMaxChunks(): number[] {
    return [STORAGE_ASSET_CHUNKS, STORAGE_BALANCE_CHUNKS, STORAGE_ASSET_NFT_CHUNKS]
  }

  toJSON(): object {
    return {
      to: this.to.toString(),
      assetID: this.assetID.toString(),
      name: new TextDecoder().decode(this.name),
      description: new TextDecoder().decode(this.description),
      metadata: new TextDecoder().decode(this.metadata),
      isCommunityDataset: this.isCommunityDataset,
      parentNFTID: this.parentNFTID ? this.parentNFTID.toString() : null
    }
  }

  toString(): string {
    return JSON.stringify(this.toJSON())
  }

  toBytes(): Uint8Array {
    const codec = utils.Codec.newWriter(this.size(), this.size())
    codec.packAddress(this.to)
    codec.packID(this.assetID)
    codec.packBytes(this.name)
    codec.packBytes(this.description)
    codec.packBytes(this.metadata)
    codec.packBool(this.isCommunityDataset)
    codec.packBool(this.parentNFTID !== null)
    if (this.parentNFTID) {
      codec.packID(this.parentNFTID)
    }
    return codec.toBytes()
  }

  static fromBytes(bytes: Uint8Array): [MintDataset, Error?] {
    const codec = utils.Codec.newReader(bytes, bytes.length)
    const to = codec.unpackAddress()
    const assetID = codec.unpackID(false)
    const name = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
    const description = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
    const metadata = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
    const isCommunityDataset = codec.unpackBool()
    const hasParentNFTID = codec.unpackBool()
    let parentNFTID: string | undefined
    if (hasParentNFTID) {
      parentNFTID = codec.unpackID(false).toString()
    }

    const action = new MintDataset(
        to.toString(),
        assetID.toString(),
        new TextDecoder().decode(name),
        new TextDecoder().decode(description),
        new TextDecoder().decode(metadata),
        isCommunityDataset,
        parentNFTID
    )

    return [action, codec.getError()]
  }

  static fromBytesCodec(codec: utils.Codec): [MintDataset, utils.Codec] {
    const to = codec.unpackAddress()
    const assetID = codec.unpackID(false)
    const name = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
    const description = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
    const metadata = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
    const isCommunityDataset = codec.unpackBool()
    const hasParentNFTID = codec.unpackBool()
    let parentNFTID: string | undefined
    if (hasParentNFTID) {
      parentNFTID = codec.unpackID(false).toString()
    }

    const action = new MintDataset(
        to.toString(),
        assetID.toString(),
        new TextDecoder().decode(name),
        new TextDecoder().decode(description),
        new TextDecoder().decode(metadata),
        isCommunityDataset,
        parentNFTID
    )
    return [action, codec]
  }
}