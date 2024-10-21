// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { actions, consts, utils } from '@nuklai/hyperchain-sdk'
import {
    UPDATE_DATASET_COMPUTE_UNITS,
    UPDATE_DATASET_ID,
    STORAGE_DATASET_CHUNKS,
    MAX_NAME_SIZE,
    MAX_TEXT_SIZE,
    MAX_SYMBOL_SIZE
} from '../constants'

export class UpdateDataset implements actions.Action {
    public datasetAddress: utils.Address
    public name: string
    public description: string
    public categories: string
    public licenseName: string
    public licenseSymbol: string
    public licenseURL: string
    public isCommunityDataset: boolean

    constructor(
        datasetAddress: string,
        name: string,
        description: string,
        categories: string,
        licenseName: string,
        licenseSymbol: string,
        licenseURL: string,
        isCommunityDataset: boolean
    ) {
        this.datasetAddress = utils.Address.fromString(datasetAddress)
        this.name = name
        this.description = description
        this.categories = categories
        this.licenseName = licenseName
        this.licenseSymbol = licenseSymbol
        this.licenseURL = licenseURL
        this.isCommunityDataset = isCommunityDataset

        this.validate()
    }

    private validate(): void {
        if (this.name && (this.name.length < 3 || this.name.length > MAX_NAME_SIZE)) {
            throw new Error('Invalid name length')
        }
        if (this.description && this.description.length > MAX_TEXT_SIZE) {
            throw new Error('Invalid description length')
        }
        if (this.categories && this.categories.length > MAX_TEXT_SIZE) {
            throw new Error('Invalid categories length')
        }
        if (this.licenseName && (this.licenseName.length < 3 || this.licenseName.length > MAX_NAME_SIZE)) {
            throw new Error('Invalid license name length')
        }
        if (this.licenseSymbol && (this.licenseSymbol.length < 3 || this.licenseSymbol.length > MAX_SYMBOL_SIZE)) {
            throw new Error('Invalid license symbol length')
        }
        if (this.licenseURL && this.licenseURL.length > MAX_TEXT_SIZE) {
            throw new Error('Invalid license URL length')
        }
    }

    getTypeId(): number {
        return UPDATE_DATASET_ID
    }

    size(): number {
        return (
            consts.ADDRESS_LEN +
            consts.MaxStringLen + this.name.length +
            consts.MaxStringLen + this.description.length +
            consts.MaxStringLen + this.categories.length +
            consts.MaxStringLen + this.licenseName.length +
            consts.MaxStringLen + this.licenseSymbol.length +
            consts.MaxStringLen + this.licenseURL.length +
            1 // isCommunityDataset (boolean)
        )
    }

    computeUnits(): number {
        return UPDATE_DATASET_COMPUTE_UNITS
    }

    stateKeysMaxChunks(): number[] {
        return [STORAGE_DATASET_CHUNKS]
    }

    toJSON(): object {
        return {
            datasetAddress: this.datasetAddress.toString(),
            name: this.name,
            description: this.description,
            categories: this.categories,
            licenseName: this.licenseName,
            licenseSymbol: this.licenseSymbol,
            licenseURL: this.licenseURL,
            isCommunityDataset: this.isCommunityDataset
        }
    }

    toString(): string {
        return JSON.stringify(this.toJSON())
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size())
        codec.packAddress(this.datasetAddress)
        codec.packString(this.name)
        codec.packString(this.description)
        codec.packString(this.categories)
        codec.packString(this.licenseName)
        codec.packString(this.licenseSymbol)
        codec.packString(this.licenseURL)
        codec.packBool(this.isCommunityDataset)
        return codec.toBytes()
    }

    static fromBytes(bytes: Uint8Array): [UpdateDataset | null, Error | null] {
        const codec = utils.Codec.newReader(bytes, bytes.length)
        const datasetAddress = codec.unpackAddress()
        const name = codec.unpackString(false)
        const description = codec.unpackString(false)
        const categories = codec.unpackString(false)
        const licenseName = codec.unpackString(false)
        const licenseSymbol = codec.unpackString(false)
        const licenseURL = codec.unpackString(false)
        const isCommunityDataset = codec.unpackBool()

        const error = codec.getError()
        if (error) {
            return [null, error]
        }

        const action = new UpdateDataset(
            datasetAddress.toString(),
            name,
            description,
            categories,
            licenseName,
            licenseSymbol,
            licenseURL,
            isCommunityDataset
        )
        return [action, null]
    }
}