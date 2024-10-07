// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { actions, consts, codec, utils } from '@nuklai/hyperchain-sdk'
import { Id } from '@avalabs/avalanchejs'
import {
    CLAIM_MARKETPLACE_PAYMENT_COMPUTE_UNITS,
    CLAIM_MARKETPLACE_PAYMENT_ID,
    STORAGE_DATASET_CHUNKS,
    STORAGE_ASSET_CHUNKS,
    STORAGE_BALANCE_CHUNKS
} from '../constants'

export class ClaimMarketplacePayment implements actions.Action {
    public datasetID: Id
    public marketplaceAssetID: Id
    public assetForPayment: Id

    constructor(
        datasetID: string,
        marketplaceAssetID: string,
        assetForPayment: string
    ) {
        this.datasetID = utils.toAssetID(datasetID)
        this.marketplaceAssetID = utils.toAssetID(marketplaceAssetID)
        this.assetForPayment = utils.toAssetID(assetForPayment)
    }

    getTypeId(): number {
        return CLAIM_MARKETPLACE_PAYMENT_ID
    }

    size(): number {
        return consts.ID_LEN * 3
    }

    computeUnits(): number {
        return CLAIM_MARKETPLACE_PAYMENT_COMPUTE_UNITS
    }

    stateKeysMaxChunks(): number[] {
        return [STORAGE_DATASET_CHUNKS, STORAGE_ASSET_CHUNKS, STORAGE_BALANCE_CHUNKS]
    }

    toJSON(): object {
        return {
            datasetID: this.datasetID.toString(),
            marketplaceAssetID: this.marketplaceAssetID.toString(),
            assetForPayment: this.assetForPayment.toString()
        }
    }

    toString(): string {
        return JSON.stringify(this.toJSON())
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size())
        codec.packID(this.datasetID)
        codec.packID(this.marketplaceAssetID)
        codec.packID(this.assetForPayment)
        return codec.toBytes()
    }

    static fromBytesCodec(codec: utils.Codec): [ClaimMarketplacePayment, utils.Codec] {
        const datasetID = codec.unpackID(true)
        const marketplaceAssetID = codec.unpackID(true)
        const assetForPayment = codec.unpackID(false)

        const action = new ClaimMarketplacePayment(
            datasetID.toString(),
            marketplaceAssetID.toString(),
            assetForPayment.toString()
        )
        return [action, codec]
    }
}
