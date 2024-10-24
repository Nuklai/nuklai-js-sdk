// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { actions, consts, utils } from '@nuklai/hyperchain-sdk'
import {
    INITIATE_CONTRIBUTE_DATASET_COMPUTE_UNITS,
    INITIATE_CONTRIBUTE_DATASET_ID,
    STORAGE_DATASET_CHUNKS,
    STORAGE_BALANCE_CHUNKS,
    MAX_DATASET_DATA_LOCATION_SIZE,
    MAX_ASSET_METADATA_SIZE
} from '../constants'

export class InitiateContributeDataset implements actions.Action {
    public datasetAddress: utils.Address
    public dataLocation: string
    public dataIdentifier: string

    constructor(
        datasetAddress: string,
        dataLocation: string,
        dataIdentifier: string
    ) {
        this.datasetAddress = utils.Address.fromString(datasetAddress)
        this.dataLocation = dataLocation || 'default'
        this.dataIdentifier = dataIdentifier

        this.validate()
    }

    private validate(): void {
        if (this.dataLocation.length > MAX_DATASET_DATA_LOCATION_SIZE) {
            throw new Error('Invalid data location length')
        }
        if (this.dataIdentifier.length === 0 || this.dataIdentifier.length > (MAX_ASSET_METADATA_SIZE - MAX_DATASET_DATA_LOCATION_SIZE)) {
            throw new Error('Invalid data identifier length')
        }
    }

    getTypeId(): number {
        return INITIATE_CONTRIBUTE_DATASET_ID
    }

    size(): number {
        return (
            consts.ADDRESS_LEN +
            consts.MaxStringLen + this.dataLocation.length +
            consts.MaxStringLen + this.dataIdentifier.length
        )
    }

    computeUnits(): number {
        return INITIATE_CONTRIBUTE_DATASET_COMPUTE_UNITS
    }

    stateKeysMaxChunks(): number[] {
        return [STORAGE_DATASET_CHUNKS, STORAGE_BALANCE_CHUNKS]
    }

    toJSON(): object {
        return {
            datasetAddress: this.datasetAddress.toString(),
            dataLocation: this.dataLocation,
            dataIdentifier: this.dataIdentifier
        }
    }

    toString(): string {
        return JSON.stringify(this.toJSON())
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size())
        codec.packAddress(this.datasetAddress)
        codec.packString(this.dataLocation)
        codec.packString(this.dataIdentifier)
        return codec.toBytes()
    }

    static fromBytes(bytes: Uint8Array): [InitiateContributeDataset | null, Error | null] {
        const codec = utils.Codec.newReader(bytes, bytes.length)
        const datasetAddress = codec.unpackAddress()
        const dataLocation = codec.unpackString(false)
        const dataIdentifier = codec.unpackString(true)

        const error = codec.getError()
        if (error) {
            return [null, error]
        }

        const action = new InitiateContributeDataset(
            datasetAddress.toString(),
            dataLocation,
            dataIdentifier
        )
        return [action, null]
    }
}