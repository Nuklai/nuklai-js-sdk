// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Id } from '@avalabs/avalanchejs'
import { actions, consts, utils } from '@nuklai/hyperchain-sdk'
import {
    BURNASSET_COMPUTE_UNITS,
    BURNASSET_NFT_ID,
    STORAGE_ASSET_CHUNKS,
    STORAGE_ASSET_NFT_CHUNKS,
    STORAGE_BALANCE_CHUNKS
} from '../constants'

export const BurnAssetNFTTxSize = consts.ID_LEN * 2

export class BurnAssetNFT implements actions.Action {
    public asset: Id
    public nftID: Id

    constructor(asset: string, nftID: string) {
        this.asset = utils.toAssetID(asset)
        this.nftID = utils.toAssetID(nftID)
    }

    getTypeId(): number {
        return BURNASSET_NFT_ID
    }

    size(): number {
        return BurnAssetNFTTxSize
    }

    computeUnits(): number {
        return BURNASSET_COMPUTE_UNITS
    }

    stateKeysMaxChunks(): number[] {
        return [STORAGE_ASSET_CHUNKS, STORAGE_ASSET_NFT_CHUNKS, STORAGE_BALANCE_CHUNKS, STORAGE_BALANCE_CHUNKS]
    }

    toJSON(): object {
        return {
            asset: this.asset.toString(),
            nftID: this.nftID.toString()
        }
    }

    toString(): string {
        return JSON.stringify(this.toJSON())
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size())
        codec.packID(this.asset)
        codec.packID(this.nftID)
        return codec.toBytes()
    }

    static fromBytes(bytes: Uint8Array): [BurnAssetNFT, Error?] {
        const codec = utils.Codec.newReader(bytes, bytes.length)
        const asset = codec.unpackID(false)
        const nftID = codec.unpackID(false)
        const action = new BurnAssetNFT(asset.toString(), nftID.toString())
        return [action, codec.getError()]
    }

    static fromBytesCodec(codec: utils.Codec): [BurnAssetNFT, utils.Codec] {
        const asset = codec.unpackID(false)
        const nftID = codec.unpackID(false)
        const action = new BurnAssetNFT(asset.toString(), nftID.toString())
        return [action, codec]
    }
}