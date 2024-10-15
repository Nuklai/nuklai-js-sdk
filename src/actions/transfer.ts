// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { actions, utils, consts } from '@nuklai/hyperchain-sdk'
import { Id } from '@avalabs/avalanchejs'

export class Transfer extends actions.Transfer {
  public asset: Id
  public nftID?: Id

  constructor(to: string, asset: string, value: bigint, memo: string, nftID?: string) {
    super(to, asset, value, memo)
    this.asset = utils.toAssetID(asset)
    if (nftID) {
      this.nftID = utils.toAssetID(nftID)
    }
  }

  size(): number {
    return super.size() + (this.nftID ? consts.ID_LEN : 0)
  }

  toBytes(): Uint8Array {
    const parentBytes = super.toBytes()
    if (this.nftID) {
      const codec = utils.Codec.newWriter(this.size(), this.size())
      codec.packBytes(parentBytes)
      codec.packID(this.nftID)
      return codec.toBytes()
    }

    return parentBytes
  }

  static fromBytes(bytes: Uint8Array): [Transfer, Error?] {
    const [parentTransfer, err] = super.fromBytes(bytes)
    if (err) {
      return [parentTransfer as Transfer, err]
    }

    const codec = utils.Codec.newReader(bytes, bytes.length)

    // Unpack all fields of the parent transfer
    codec.unpackAddress() // to
    codec.unpackID(false) // asset
    codec.unpackUint64(false) // value
    codec.unpackBytes(false) // memo

    // For NFT transfers:
    let nftID: Id | undefined
    if (codec.getOffset() < bytes.length) {
      nftID = codec.unpackID(false)
    }

    return [new Transfer(
        parentTransfer.to.toString(),
        parentTransfer.asset.toString(),
        parentTransfer.value,
        new TextDecoder().decode(parentTransfer.memo),
        nftID?.toString()
    ), undefined]
  }

  toJSON(): object {
    const json = super.toJSON() as any
    if (this.nftID) {
      json.nftID = this.nftID.toString()
    }
    return json
  }
}
