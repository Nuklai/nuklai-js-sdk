// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Id } from '@avalabs/avalanchejs'
import { actions, consts, utils } from '@nuklai/hyperchain-sdk'
import {
    MINTASSET_COMPUTE_UNITS,
    MINTASSET_NFT_ID,
    STORAGE_ASSET_CHUNKS,
    STORAGE_BALANCE_CHUNKS,
    MAX_METADATA_SIZE
} from '../constants'

export class MintAssetNFT implements actions.Action {
    public to: utils.Address
    public asset: Id
    public uniqueID: bigint
    public uri: Uint8Array
    public metadata: Uint8Array

    constructor(to: string, asset: string, uniqueID: bigint, uri: string, metadata: string) {
        this.to = utils.Address.fromString(to)
        this.asset = utils.toAssetID(asset)
        this.uniqueID = uniqueID
        this.uri = new TextEncoder().encode(uri)
        this.metadata = new TextEncoder().encode(metadata)
    }

    getTypeId(): number {
        return MINTASSET_NFT_ID
    }

    size(): number {
        return consts.ADDRESS_LEN + consts.ID_LEN + consts.UINT64_LEN +
            consts.UINT16_LEN + this.uri.length +
            consts.UINT16_LEN + this.metadata.length
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
            uniqueID: this.uniqueID.toString(),
            uri: new TextDecoder().decode(this.uri),
            metadata: new TextDecoder().decode(this.metadata)
        }
    }

    toString(): string {
        return JSON.stringify(this.toJSON())
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size())
        codec.packAddress(this.to)
        codec.packID(this.asset)
        codec.packUint64(this.uniqueID)
        codec.packBytes(this.uri)
        codec.packBytes(this.metadata)
        return codec.toBytes()
    }

    static fromBytes(bytes: Uint8Array): [MintAssetNFT, Error?] {
        const codec = utils.Codec.newReader(bytes, bytes.length)
        const to = codec.unpackAddress()
        const asset = codec.unpackID(false)
        const uniqueID = codec.unpackUint64(false)
        const uri = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
        const metadata = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
        const action = new MintAssetNFT(
            to.toString(),
            asset.toString(),
            uniqueID,
            new TextDecoder().decode(uri),
            new TextDecoder().decode(metadata)
        )
        return [action, codec.getError()]
    }

    static fromBytesCodec(codec: utils.Codec): [MintAssetNFT, utils.Codec] {
        const to = codec.unpackAddress()
        const asset = codec.unpackID(false)
        const uniqueID = codec.unpackUint64(false)
        const uri = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
        const metadata = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
        const action = new MintAssetNFT(
            to.toString(),
            asset.toString(),
            uniqueID,
            new TextDecoder().decode(uri),
            new TextDecoder().decode(metadata)
        )
        return [action, codec]
    }
}