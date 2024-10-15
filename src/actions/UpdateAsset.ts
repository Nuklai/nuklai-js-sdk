// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Id } from '@avalabs/avalanchejs'
import { actions, consts, codec, utils } from '@nuklai/hyperchain-sdk'
import {
    MAX_METADATA_SIZE,
    MAX_TEXT_SIZE,
    UPDATEASSET_COMPUTE_UNITS,
    UPDATEASSET_ID,
    STORAGE_ASSET_CHUNKS
} from '../constants/nuklaivm'

export class UpdateAsset implements actions.Action {
    public asset: Id
    public name: Uint8Array
    public symbol: Uint8Array
    public metadata: Uint8Array
    public uri: Uint8Array
    public maxSupply: bigint
    public admin: Uint8Array
    public mintActor: Uint8Array
    public pauseUnpauseActor: Uint8Array
    public freezeUnfreezeActor: Uint8Array
    public enableDisableKYCAccountActor: Uint8Array

    constructor(
        asset: string,
        name: string,
        symbol: string,
        metadata: string,
        uri: string,
        maxSupply: bigint,
        admin: string,
        mintActor: string,
        pauseUnpauseActor: string,
        freezeUnfreezeActor: string,
        enableDisableKYCAccountActor: string
    ) {
        this.asset = utils.toAssetID(asset)
        this.name = new TextEncoder().encode(name)
        this.symbol = new TextEncoder().encode(symbol)
        this.metadata = new TextEncoder().encode(metadata)
        this.uri = new TextEncoder().encode(uri)
        this.maxSupply = maxSupply
        this.admin = new TextEncoder().encode(admin)
        this.mintActor = new TextEncoder().encode(mintActor)
        this.pauseUnpauseActor = new TextEncoder().encode(pauseUnpauseActor)
        this.freezeUnfreezeActor = new TextEncoder().encode(freezeUnfreezeActor)
        this.enableDisableKYCAccountActor = new TextEncoder().encode(enableDisableKYCAccountActor)
    }

    getTypeId(): number {
        return UPDATEASSET_ID
    }

    size(): number {
        return (
            consts.ID_LEN +
            codec.bytesLen(this.name) +
            codec.bytesLen(this.symbol) +
            codec.bytesLen(this.metadata) +
            codec.bytesLen(this.uri) +
            consts.UINT64_LEN +
            codec.bytesLen(this.admin) +
            codec.bytesLen(this.mintActor) +
            codec.bytesLen(this.pauseUnpauseActor) +
            codec.bytesLen(this.freezeUnfreezeActor) +
            codec.bytesLen(this.enableDisableKYCAccountActor)
        )
    }

    computeUnits(): number {
        return UPDATEASSET_COMPUTE_UNITS
    }

    stateKeysMaxChunks(): number[] {
        return [STORAGE_ASSET_CHUNKS]
    }

    toJSON(): object {
        return {
            asset: this.asset.toString(),
            name: new TextDecoder().decode(this.name),
            symbol: new TextDecoder().decode(this.symbol),
            metadata: new TextDecoder().decode(this.metadata),
            uri: new TextDecoder().decode(this.uri),
            maxSupply: this.maxSupply.toString(),
            admin: new TextDecoder().decode(this.admin),
            mintActor: new TextDecoder().decode(this.mintActor),
            pauseUnpauseActor: new TextDecoder().decode(this.pauseUnpauseActor),
            freezeUnfreezeActor: new TextDecoder().decode(this.freezeUnfreezeActor),
            enableDisableKYCAccountActor: new TextDecoder().decode(this.enableDisableKYCAccountActor)
        }
    }

    toString(): string {
        return JSON.stringify(this.toJSON())
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size())
        codec.packID(this.asset)
        codec.packBytes(this.name)
        codec.packBytes(this.symbol)
        codec.packBytes(this.metadata)
        codec.packBytes(this.uri)
        codec.packUint64(this.maxSupply)
        codec.packBytes(this.admin)
        codec.packBytes(this.mintActor)
        codec.packBytes(this.pauseUnpauseActor)
        codec.packBytes(this.freezeUnfreezeActor)
        codec.packBytes(this.enableDisableKYCAccountActor)
        return codec.toBytes()
    }

    static fromBytes(bytes: Uint8Array): [UpdateAsset, Error?] {
        const codec = utils.Codec.newReader(bytes, bytes.length)
        const asset = codec.unpackID(true)
        const name = codec.unpackLimitedBytes(MAX_METADATA_SIZE, false)
        const symbol = codec.unpackLimitedBytes(MAX_TEXT_SIZE, false)
        const metadata = codec.unpackLimitedBytes(MAX_METADATA_SIZE, false)
        const uri = codec.unpackLimitedBytes(MAX_METADATA_SIZE, false)
        const maxSupply = codec.unpackUint64(false)
        const admin = codec.unpackLimitedBytes(consts.ADDRESS_LEN, false)
        const mintActor = codec.unpackLimitedBytes(consts.ADDRESS_LEN, false)
        const pauseUnpauseActor = codec.unpackLimitedBytes(consts.ADDRESS_LEN, false)
        const freezeUnfreezeActor = codec.unpackLimitedBytes(consts.ADDRESS_LEN, false)
        const enableDisableKYCAccountActor = codec.unpackLimitedBytes(consts.ADDRESS_LEN, false)

        const action = new UpdateAsset(
            asset.toString(),
            new TextDecoder().decode(name),
            new TextDecoder().decode(symbol),
            new TextDecoder().decode(metadata),
            new TextDecoder().decode(uri),
            maxSupply,
            new TextDecoder().decode(admin),
            new TextDecoder().decode(mintActor),
            new TextDecoder().decode(pauseUnpauseActor),
            new TextDecoder().decode(freezeUnfreezeActor),
            new TextDecoder().decode(enableDisableKYCAccountActor)
        )

        return [action, codec.getError()]
    }

    static fromBytesCodec(codec: utils.Codec): [UpdateAsset, utils.Codec] {
        const asset = codec.unpackID(true)
        const name = codec.unpackLimitedBytes(MAX_METADATA_SIZE, false)
        const symbol = codec.unpackLimitedBytes(MAX_TEXT_SIZE, false)
        const metadata = codec.unpackLimitedBytes(MAX_METADATA_SIZE, false)
        const uri = codec.unpackLimitedBytes(MAX_METADATA_SIZE, false)
        const maxSupply = codec.unpackUint64(false)
        const admin = codec.unpackLimitedBytes(consts.ADDRESS_LEN, false)
        const mintActor = codec.unpackLimitedBytes(consts.ADDRESS_LEN, false)
        const pauseUnpauseActor = codec.unpackLimitedBytes(consts.ADDRESS_LEN, false)
        const freezeUnfreezeActor = codec.unpackLimitedBytes(consts.ADDRESS_LEN, false)
        const enableDisableKYCAccountActor = codec.unpackLimitedBytes(consts.ADDRESS_LEN, false)

        const action = new UpdateAsset(
            asset.toString(),
            new TextDecoder().decode(name),
            new TextDecoder().decode(symbol),
            new TextDecoder().decode(metadata),
            new TextDecoder().decode(uri),
            maxSupply,
            new TextDecoder().decode(admin),
            new TextDecoder().decode(mintActor),
            new TextDecoder().decode(pauseUnpauseActor),
            new TextDecoder().decode(freezeUnfreezeActor),
            new TextDecoder().decode(enableDisableKYCAccountActor)
        )

        return [action, codec]
    }
}