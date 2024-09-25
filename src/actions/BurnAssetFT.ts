// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Id } from '@avalabs/avalanchejs'
import { actions, consts, utils } from '@nuklai/hyperchain-sdk'
import {
    BURNASSET_COMPUTE_UNITS,
    BURNASSET_FT_ID,
    STORAGE_ASSET_CHUNKS,
    STORAGE_BALANCE_CHUNKS
} from '../constants'

export const BurnAssetFTTxSize = consts.ID_LEN + consts.UINT64_LEN

export class BurnAssetFT implements actions.Action {
    public asset: Id
    public value: bigint

    constructor(asset: string, value: bigint) {
        this.asset = utils.toAssetID(asset)
        this.value = value
    }

    getTypeId(): number {
        return BURNASSET_FT_ID
    }

    size(): number {
        return BurnAssetFTTxSize
    }

    computeUnits(): number {
        return BURNASSET_COMPUTE_UNITS
    }

    stateKeysMaxChunks(): number[] {
        return [STORAGE_ASSET_CHUNKS, STORAGE_BALANCE_CHUNKS]
    }

    toJSON(): object {
        return {
            asset: this.asset.toString(),
            value: this.value.toString()
        }
    }

    toString(): string {
        return JSON.stringify(this.toJSON())
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size())
        codec.packID(this.asset)
        codec.packUint64(this.value)
        return codec.toBytes()
    }

    static fromBytes(bytes: Uint8Array): [BurnAssetFT, Error?] {
        const codec = utils.Codec.newReader(bytes, bytes.length)
        const asset = codec.unpackID(false)
        const value = codec.unpackUint64(false)
        const action = new BurnAssetFT(asset.toString(), value)
        return [action, codec.getError()]
    }

    static fromBytesCodec(codec: utils.Codec): [BurnAssetFT, utils.Codec] {
        const asset = codec.unpackID(false)
        const value = codec.unpackUint64(false)
        const action = new BurnAssetFT(asset.toString(), value)
        return [action, codec]
    }
}