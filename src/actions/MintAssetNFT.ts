// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { actions, consts, utils } from '@nuklai/hyperchain-sdk'
import {
    MINT_ASSET_COMPUTE_UNITS,
    MINT_ASSET_NFT_ID,
    STORAGE_ASSET_CHUNKS,
    STORAGE_BALANCE_CHUNKS,
    MAX_ASSET_METADATA_SIZE
} from '../constants'

export const MintAssetNFTTxSize =
    consts.ADDRESS_LEN + // AssetAddress
    consts.MaxStringLen + MAX_ASSET_METADATA_SIZE + // Metadata
    consts.ADDRESS_LEN // To

export class MintAssetNFT implements actions.Action {
    public assetAddress: utils.Address
    public metadata: string
    public to: utils.Address

    constructor(assetAddress: string, metadata: string, to: string) {
        this.assetAddress = utils.Address.fromString(assetAddress)
        this.metadata = metadata
        this.to = utils.Address.fromString(to)

        this.validate()
    }

    private validate(): void {
        if (this.metadata.length > MAX_ASSET_METADATA_SIZE) {
            throw new Error('Invalid metadata length')
        }
    }

    getTypeId(): number {
        return MINT_ASSET_NFT_ID
    }

    size(): number {
        return MintAssetNFTTxSize
    }

    computeUnits(): number {
        return MINT_ASSET_COMPUTE_UNITS
    }

    stateKeysMaxChunks(): number[] {
        return [STORAGE_ASSET_CHUNKS, STORAGE_BALANCE_CHUNKS]
    }

    toJSON(): object {
        return {
            assetAddress: this.assetAddress.toString(),
            metadata: this.metadata,
            to: this.to.toString()
        }
    }

    toString(): string {
        return JSON.stringify(this.toJSON())
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size())
        codec.packAddress(this.assetAddress)
        codec.packString(this.metadata)
        codec.packAddress(this.to)
        return codec.toBytes()
    }

    static fromBytes(bytes: Uint8Array): [MintAssetNFT | null, Error | null] {
        const codec = utils.Codec.newReader(bytes, bytes.length)
        const assetAddress = codec.unpackAddress()
        const metadata = codec.unpackString(true)
        const to = codec.unpackAddress()

        const error = codec.getError()
        if (error) {
            return [null, error]
        }

        const action = new MintAssetNFT(
            assetAddress.toString(),
            metadata,
            to.toString()
        )
        return [action, null]
    }
}