// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Id } from "@avalabs/avalanchejs";
import { actions, utils, consts } from "@nuklai/hyperchain-sdk";
import {
    SUBSCRIBE_DATASET_MARKETPLACE_COMPUTE_UNITS,
    SUBSCRIBE_DATASET_MARKETPLACE_ID,
    STORAGE_DATASET_CHUNKS,
    STORAGE_ASSET_CHUNKS,
    STORAGE_BALANCE_CHUNKS
} from '../constants'


export class SubscribeDatasetMarketplace implements actions.Action {
    public datasetID: Id
    public marketplaceAssetID: Id
    public assetForPayment: Id
    public numBlocksToSubscribe: bigint

    constructor(
        datasetID: string,
        marketplaceAssetID: string,
        assetForPayment: string,
        numBlocksToSubscribe: bigint
    ) {
        this.datasetID = utils.toAssetID(datasetID)
        this.marketplaceAssetID = utils.toAssetID(marketplaceAssetID)
        this.assetForPayment = utils.toAssetID(assetForPayment)
        this.numBlocksToSubscribe = numBlocksToSubscribe
    }

    getTypeId(): number {
        return SUBSCRIBE_DATASET_MARKETPLACE_ID
    }

    size(): number {
        return consts.ID_LEN + consts.ID_LEN + consts.ID_LEN + consts.UINT64_LEN
    }

    computeUnits(): number {
        return SUBSCRIBE_DATASET_MARKETPLACE_COMPUTE_UNITS
    }


    stateKeysMaxChunks(): number[] {
        return [STORAGE_DATASET_CHUNKS, STORAGE_ASSET_CHUNKS, STORAGE_BALANCE_CHUNKS]
    }

    toJSON(): object {
        return {
            datasetID: this.datasetID.toString(),
            marketplaceAssetID: this.marketplaceAssetID.toString(),
            assetForPayment: this.assetForPayment.toString(),
            numBlocksToSubscribe: this.numBlocksToSubscribe.toString()
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
        codec.packUint64(this.numBlocksToSubscribe)
        return codec.toBytes()
    }

    static fromBytesCodec(codec: utils.Codec): [SubscribeDatasetMarketplace, utils.Codec] {
        const datasetID = codec.unpackID(true)
        const marketplaceAssetID = codec.unpackID(true)
        const assetForPayment = codec.unpackID(true)
        const numBlocksToSubscribe = codec.unpackUint64(true)
        return [
            new SubscribeDatasetMarketplace(
                datasetID.toString(),
                marketplaceAssetID.toString(),
                assetForPayment.toString(),
                numBlocksToSubscribe
            ),
            codec
        ]
    }
}