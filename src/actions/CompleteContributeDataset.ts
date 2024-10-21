// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Id } from '@avalabs/avalanchejs';
import { actions, consts, utils } from '@nuklai/hyperchain-sdk'
import {
    COMPLETE_CONTRIBUTE_DATASET_COMPUTE_UNITS,
    COMPLETE_CONTRIBUTE_DATASET_ID,
    STORAGE_ASSET_CHUNKS,
    STORAGE_ASSET_NFT_CHUNKS,
    STORAGE_DATASET_CHUNKS,
    STORAGE_BALANCE_CHUNKS
} from '../constants'

export class CompleteContributeDataset implements actions.Action {
    public datasetContributionID: Id;
    public datasetAddress: utils.Address
    public datasetContributor: utils.Address

    constructor(
        datasetContributionID: string,
        datasetAddress: string,
        datasetContributor: string
    ) {
        this.datasetContributionID = Id.fromString(datasetContributionID);
        this.datasetAddress = utils.Address.fromString(datasetAddress)
        this.datasetContributor = utils.Address.fromString(datasetContributor)
    }

    getTypeId(): number {
        return COMPLETE_CONTRIBUTE_DATASET_ID
    }

    size(): number {
        return consts.ID_LEN + consts.ADDRESS_LEN * 2
    }

    computeUnits(): number {
        return COMPLETE_CONTRIBUTE_DATASET_COMPUTE_UNITS
    }

    stateKeysMaxChunks(): number[] {
        return [
            STORAGE_ASSET_CHUNKS,
            STORAGE_ASSET_NFT_CHUNKS,
            STORAGE_DATASET_CHUNKS,
            STORAGE_BALANCE_CHUNKS,
            STORAGE_BALANCE_CHUNKS,
            STORAGE_BALANCE_CHUNKS
        ]
    }

    toJSON(): object {
        return {
            datasetContributionID: this.datasetContributionID.toString(),
            datasetAddress: this.datasetAddress.toString(),
            datasetContributor: this.datasetContributor.toString()
        }
    }

    toString(): string {
        return JSON.stringify(this.toJSON())
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size())
        codec.packID(this.datasetContributionID)
        codec.packAddress(this.datasetAddress)
        codec.packAddress(this.datasetContributor)
        return codec.toBytes()
    }

    static fromBytes(bytes: Uint8Array): [CompleteContributeDataset | null, Error | null] {
        const codec = utils.Codec.newReader(bytes, bytes.length)
        const datasetContributionID = codec.unpackID(true)
        const datasetAddress = codec.unpackAddress()
        const datasetContributor = codec.unpackAddress()

        const error = codec.getError()
        if (error) {
            return [null, error]
        }

        const action = new CompleteContributeDataset(
            datasetContributionID.toString(),
            datasetAddress.toString(),
            datasetContributor.toString()
        )
        return [action, null]
    }
}