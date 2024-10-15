// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { actions, consts, codec, utils } from '@nuklai/hyperchain-sdk'
import { Id } from '@avalabs/avalanchejs';
import {
    COMPLETE_CONTRIBUTE_DATASET_COMPUTE_UNITS,
    COMPLETE_CONTRIBUTE_DATASET_ID,
    STORAGE_ASSET_CHUNKS,
    STORAGE_ASSET_NFT_CHUNKS,
    STORAGE_DATASET_CHUNKS,
    STORAGE_BALANCE_CHUNKS
} from '../constants'

export class CompleteContributeDataset implements actions.Action {
    public datasetID: Id
    public contributor: utils.Address
    public uniqueNFTIDForContributor: bigint
    public collateralAssetID: Id
    public collateralAmount: bigint
    public dataLocation: Uint8Array
    public dataIdentifier: Uint8Array

    constructor(
        datasetID: string,
        contributor: string,
        uniqueNFTIDForContributor: bigint,
        collateralAssetID: string,
        collateralAmount: bigint,
        dataLocation: string,
        dataIdentifier: string
    ) {
        this.datasetID = utils.toAssetID(datasetID)
        this.contributor = utils.Address.fromString(contributor)
        this.uniqueNFTIDForContributor = uniqueNFTIDForContributor
        this.collateralAssetID = utils.toAssetID(collateralAssetID)
        this.collateralAmount = collateralAmount
        this.dataLocation = new TextEncoder().encode(dataLocation)
        this.dataIdentifier = new TextEncoder().encode(dataIdentifier)
    }

    getTypeId(): number {
        return COMPLETE_CONTRIBUTE_DATASET_ID
    }

    size(): number {
        return consts.ID_LEN * 2 + consts.ADDRESS_LEN + consts.UINT64_LEN * 2 +
            consts.INT_LEN + this.dataLocation.length +
            consts.INT_LEN + this.dataIdentifier.length
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
            datasetID: this.datasetID.toString(),
            contributor: this.contributor.toString(),
            uniqueNFTIDForContributor: this.uniqueNFTIDForContributor.toString(),
            collateralAssetID: this.collateralAssetID.toString(),
            collateralAmount: this.collateralAmount.toString(),
            dataLocation: new TextDecoder().decode(this.dataLocation),
            dataIdentifier: new TextDecoder().decode(this.dataIdentifier)
        }
    }

    toString(): string {
        return JSON.stringify(this.toJSON())
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size())
        codec.packID(this.datasetID)
        codec.packAddress(this.contributor)
        codec.packUint64(this.uniqueNFTIDForContributor)
        codec.packID(this.collateralAssetID)
        codec.packUint64(this.collateralAmount)
        codec.packBytes(this.dataLocation)
        codec.packBytes(this.dataIdentifier)
        return codec.toBytes()
    }

    static fromBytesCodec(codec: utils.Codec): [CompleteContributeDataset, utils.Codec] {
        const datasetID = codec.unpackID(true)
        const contributor = codec.unpackAddress()
        const uniqueNFTIDForContributor = codec.unpackUint64(true)
        const collateralAssetID = codec.unpackID(false)
        const collateralAmount = codec.unpackUint64(true)
        const dataLocation = codec.unpackLimitedBytes(consts.MAX_METADATA_SIZE, true)
        const dataIdentifier = codec.unpackLimitedBytes(consts.MAX_METADATA_SIZE, true)

        const action = new CompleteContributeDataset(
            datasetID.toString(),
            contributor.toString(),
            uniqueNFTIDForContributor,
            collateralAssetID.toString(),
            collateralAmount,
            new TextDecoder().decode(dataLocation),
            new TextDecoder().decode(dataIdentifier)
        )
        return [action, codec]
    }
}