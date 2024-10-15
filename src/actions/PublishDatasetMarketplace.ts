// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import {actions, consts, utils} from "@nuklai/hyperchain-sdk";
import { Id } from "@avalabs/avalanchejs";
import {
    PUBLISH_DATASET_MARKETPLACE_COMPUTE_UNITS,
    PUBLISH_DATASET_MARKETPLACE_ID,
    STORAGE_DATASET_CHUNKS,
    STORAGE_ASSET_CHUNKS
} from '../constants'

export class PublishDatasetMarketplace implements actions.Action {
    public datasetID: Id
    public baseAssetID: Id
    public basePrice: bigint

    constructor(
        datasetID: string,
        baseAssetID: string,
        basePrice: bigint
    ) {
        this.datasetID = utils.toAssetID(datasetID)
        this.baseAssetID = utils.toAssetID(baseAssetID)
        this.basePrice = basePrice
    }

    getTypeId(): number {
        return PUBLISH_DATASET_MARKETPLACE_ID
    }

    size(): number {
        return consts.ID_LEN + consts.ID_LEN + consts.UINT64_LEN
    }

    computeUnits(): number {
        return PUBLISH_DATASET_MARKETPLACE_COMPUTE_UNITS
    }

    stateKeysMaxChunks(): number[] {
        return [STORAGE_DATASET_CHUNKS, STORAGE_ASSET_CHUNKS, STORAGE_ASSET_CHUNKS]
    }

    toJSON(): object {
        return {
            datasetID: this.datasetID.toString(),
            baseAssetID: this.baseAssetID.toString(),
            basePrice: this.basePrice.toString()
        }
    }

    toString(): string {
        return JSON.stringify(this.toJSON())
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size())
        codec.packID(this.datasetID)
        codec.packID(this.baseAssetID)
        codec.packUint64(this.basePrice)
        return codec.toBytes()
    }

    static fromBytesCodec(codec: utils.Codec): [PublishDatasetMarketplace, utils.Codec] {
        const datasetID = codec.unpackID(true)
        const baseAssetID = codec.unpackID(false)
        const basePrice = codec.unpackUint64(false)

        const action = new PublishDatasetMarketplace(
            datasetID.toString(),
            baseAssetID.toString(),
            basePrice
        )
        return [action, codec]
    }
}