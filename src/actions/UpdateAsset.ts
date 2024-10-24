// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { actions, consts, utils } from '@nuklai/hyperchain-sdk'
import {
    UPDATE_ASSET_COMPUTE_UNITS,
    UPDATE_ASSET_ID,
    STORAGE_ASSET_CHUNKS,
    MAX_NAME_SIZE,
    MAX_SYMBOL_SIZE,
    MAX_DATASET_METADATA_SIZE
} from '../constants/'

export class UpdateAsset implements actions.Action {
    public assetAddress: utils.Address
    public name: string
    public symbol: string
    public metadata: string
    public maxSupply: bigint
    public owner: string
    public mintAdmin: string
    public pauseUnpauseAdmin: string
    public freezeUnfreezeAdmin: string
    public enableDisableKYCAccountAdmin: string

    constructor(
        assetAddress: string,
        name: string,
        symbol: string,
        metadata: string,
        maxSupply: bigint,
        owner: string,
        mintAdmin: string,
        pauseUnpauseAdmin: string,
        freezeUnfreezeAdmin: string,
        enableDisableKYCAccountAdmin: string
    ) {
        this.assetAddress = utils.Address.fromString(assetAddress)
        this.name = name
        this.symbol = symbol
        this.metadata = metadata
        this.maxSupply = maxSupply
        this.owner = owner
        this.mintAdmin = mintAdmin
        this.pauseUnpauseAdmin = pauseUnpauseAdmin
        this.freezeUnfreezeAdmin = freezeUnfreezeAdmin
        this.enableDisableKYCAccountAdmin = enableDisableKYCAccountAdmin

        this.validate()
    }

    private validate(): void {
        if (this.name && (this.name.length < 3 || this.name.length > MAX_NAME_SIZE)) {
            throw new Error('Invalid name length')
        }
        if (this.symbol && (this.symbol.length < 3 || this.symbol.length > MAX_SYMBOL_SIZE)) {
            throw new Error('Invalid symbol length')
        }
        if (this.metadata && this.metadata.length > MAX_DATASET_METADATA_SIZE) {
            throw new Error('Invalid metadata length')
        }
    }

    getTypeId(): number {
        return UPDATE_ASSET_ID
    }

    size(): number {
        return (
            consts.ADDRESS_LEN +
            consts.MaxStringLen + this.name.length +
            consts.MaxStringLen + this.symbol.length +
            consts.MaxStringLen + this.metadata.length +
            consts.UINT64_LEN +
            consts.MaxStringLen + this.owner.length +
            consts.MaxStringLen + this.mintAdmin.length +
            consts.MaxStringLen + this.pauseUnpauseAdmin.length +
            consts.MaxStringLen + this.freezeUnfreezeAdmin.length +
            consts.MaxStringLen + this.enableDisableKYCAccountAdmin.length
        )
    }

    computeUnits(): number {
        return UPDATE_ASSET_COMPUTE_UNITS
    }

    stateKeysMaxChunks(): number[] {
        return [STORAGE_ASSET_CHUNKS]
    }

    toJSON(): object {
        return {
            assetAddress: this.assetAddress.toString(),
            name: this.name,
            symbol: this.symbol,
            metadata: this.metadata,
            maxSupply: this.maxSupply.toString(),
            owner: this.owner,
            mintAdmin: this.mintAdmin,
            pauseUnpauseAdmin: this.pauseUnpauseAdmin,
            freezeUnfreezeAdmin: this.freezeUnfreezeAdmin,
            enableDisableKYCAccountAdmin: this.enableDisableKYCAccountAdmin
        }
    }

    toString(): string {
        return JSON.stringify(this.toJSON())
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size())
        codec.packAddress(this.assetAddress)
        codec.packString(this.name)
        codec.packString(this.symbol)
        codec.packString(this.metadata)
        codec.packUint64(this.maxSupply)
        codec.packString(this.owner)
        codec.packString(this.mintAdmin)
        codec.packString(this.pauseUnpauseAdmin)
        codec.packString(this.freezeUnfreezeAdmin)
        codec.packString(this.enableDisableKYCAccountAdmin)
        return codec.toBytes()
    }

    static fromBytes(bytes: Uint8Array): [UpdateAsset | null, Error | null] {
        const codec = utils.Codec.newReader(bytes, bytes.length)
        const assetAddress = codec.unpackAddress()
        const name = codec.unpackString(false)
        const symbol = codec.unpackString(false)
        const metadata = codec.unpackString(false)
        const maxSupply = codec.unpackUint64(false)
        const owner = codec.unpackString(false)
        const mintAdmin = codec.unpackString(false)
        const pauseUnpauseAdmin = codec.unpackString(false)
        const freezeUnfreezeAdmin = codec.unpackString(false)
        const enableDisableKYCAccountAdmin = codec.unpackString(false)

        const error = codec.getError()
        if (error) {
            return [null, error]
        }

        const action = new UpdateAsset(
            assetAddress.toString(),
            name,
            symbol,
            metadata,
            maxSupply,
            owner,
            mintAdmin,
            pauseUnpauseAdmin,
            freezeUnfreezeAdmin,
            enableDisableKYCAccountAdmin
        )
        return [action, null]
    }
}