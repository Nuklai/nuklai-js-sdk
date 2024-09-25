// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Id } from '@avalabs/avalanchejs'
import {actions, codec, consts, utils} from '@nuklai/hyperchain-sdk'
import {
    MINTASSET_COMPUTE_UNITS,
    MINTASSET_FT_ID,
    STORAGE_ASSET_CHUNKS,
    STORAGE_BALANCE_CHUNKS
} from '../constants'

export const MintAssetFTTxSize =
    consts.ADDRESS_LEN + consts.ID_LEN + consts.UINT64_LEN

export class MintAssetFT implements actions.Action {
    public to: utils.Address
    public asset: Id
    public value: bigint

    constructor(to: string, asset: string, value: bigint) {
        this.to = utils.Address.fromString(to)
        this.asset = utils.toAssetID(asset)
        this.value = value
    }

    getTypeId(): number {
        return MINTASSET_FT_ID
    }

    size(): number {
        return MintAssetFTTxSize
    }

    computeUnits(): number {
        return MINTASSET_COMPUTE_UNITS
    }

    stateKeysMaxChunks(): number[] {
        return [STORAGE_ASSET_CHUNKS, STORAGE_BALANCE_CHUNKS]
    }

    toJSON(): object {
        return {
            to: this.to.toString(),
            asset: this.asset.toString(),
            value: this.value.toString()
        }
    }

    toString(): string {
        return JSON.stringify(this.toJSON())
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size())
        codec.packAddress(this.to)
        codec.packID(this.asset)
        codec.packUint64(this.value)
        return codec.toBytes()
    }

    static fromBytes(bytes: Uint8Array): [MintAssetFT, Error?] {
        const codec = utils.Codec.newReader(bytes, bytes.length)
        const to = codec.unpackAddress()
        const asset = codec.unpackID(false)
        const value = codec.unpackUint64(true)
        const action = new MintAssetFT(to.toString(), asset.toString(), value)
        return [action, codec.getError()]
    }

    static fromBytesCodec(codec: utils.Codec): [MintAssetFT, utils.Codec] {
        const to = codec.unpackAddress()
        const asset = codec.unpackID(false)
        const value = codec.unpackUint64(true)
        const action = new MintAssetFT(to.toString(), asset.toString(), value)
        return [action, codec]
    }
}