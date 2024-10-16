// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { actions, consts, codec, utils } from '@nuklai/hyperchain-sdk';
import { Id } from '@avalabs/avalanchejs';
import {
    INITIATE_CONTRIBUTE_DATASET_COMPUTE_UNITS,
    INITIATE_CONTRIBUTE_DATASET_ID,
    STORAGE_DATASET_CHUNKS,
    STORAGE_BALANCE_CHUNKS,
    MAX_TEXT_SIZE,
    MAX_METADATA_SIZE
} from '../constants'

export class InitiateContributeDataset implements actions.Action {
    public datasetID: Id
    public dataLocation: Uint8Array
    public dataIdentifier: Uint8Array
    public collateralAssetID: Id
    public collateralAmount: bigint

    constructor(
        datasetID: string,
        dataLocation: string,
        dataIdentifier: string,
        collateralAssetID: string,
        collateralAmount: bigint
    ) {
        this.datasetID = utils.toAssetID(datasetID)
        this.dataLocation = new TextEncoder().encode(dataLocation)
        this.dataIdentifier = new TextEncoder().encode(dataIdentifier)
        this.collateralAssetID = utils.toAssetID(collateralAssetID)
        this.collateralAmount = collateralAmount
    }

    getTypeId(): number {
        return INITIATE_CONTRIBUTE_DATASET_ID
    }

    size(): number {
        return consts.ID_LEN * 2 +
            consts.INT_LEN + this.dataLocation.length +
            consts.INT_LEN + this.dataIdentifier.length +
            consts.UINT64_LEN
    }

    computeUnits(): number {
        return INITIATE_CONTRIBUTE_DATASET_COMPUTE_UNITS
    }

    stateKeysMaxChunks(): number[] {
        return [STORAGE_DATASET_CHUNKS, STORAGE_BALANCE_CHUNKS]
    }

    toJSON(): object {
        return {
            datasetID: this.datasetID.toString(),
            dataLocation: new TextDecoder().decode(this.dataLocation),
            dataIdentifier: new TextDecoder().decode(this.dataIdentifier),
            collateralAssetID: this.collateralAssetID.toString(),
            collateralAmount: this.collateralAmount.toString()
        }
    }

    toString(): string {
        return JSON.stringify(this.toJSON())
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size())
        codec.packID(this.datasetID)
        codec.packBytes(this.dataLocation)
        codec.packBytes(this.dataIdentifier)
        codec.packID(this.collateralAssetID)
        codec.packUint64(this.collateralAmount)
        return codec.toBytes()
    }

    static fromBytesCodec(codec: utils.Codec): [InitiateContributeDataset, utils.Codec] {
        const datasetID = codec.unpackID(true)
        const dataLocation = codec.unpackLimitedBytes(MAX_TEXT_SIZE, false)
        const dataIdentifier = codec.unpackLimitedBytes(MAX_METADATA_SIZE - MAX_TEXT_SIZE, true)
        const collateralAssetID = codec.unpackID(false)
        const collateralAmount = codec.unpackUint64(true)

        const action = new InitiateContributeDataset(
            datasetID.toString(),
            new TextDecoder().decode(dataLocation),
            new TextDecoder().decode(dataIdentifier),
            collateralAssetID.toString(),
            collateralAmount
        )
        return [action, codec]
    }
}