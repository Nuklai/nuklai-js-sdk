// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { actions, consts, utils } from '@nuklai/hyperchain-sdk'
import {
    CREATE_DATASET_COMPUTE_UNITS,
    CREATE_DATASET_ID,
    STORAGE_ASSET_CHUNKS,
    STORAGE_DATASET_CHUNKS,
    MAX_NAME_SIZE,
    MAX_TEXT_SIZE,
    MAX_DATASET_METADATA_SIZE,
    MAX_SYMBOL_SIZE
} from '../constants'

export class CreateDataset implements actions.Action {
    public assetAddress: utils.Address;
    public name: string;
    public description: string;
    public categories: string;
    public licenseName: string;
    public licenseSymbol: string;
    public licenseURL: string;
    public metadata: string;
    public isCommunityDataset: boolean;

    constructor(
        assetAddress: string,
        name: string,
        description: string,
        categories: string,
        licenseName: string,
        licenseSymbol: string,
        licenseURL: string,
        metadata: string,
        isCommunityDataset: boolean
    ) {
        this.assetAddress = utils.Address.fromString(assetAddress);
        this.name = name;
        this.description = description;
        this.categories = categories;
        this.licenseName = licenseName;
        this.licenseSymbol = licenseSymbol;
        this.licenseURL = licenseURL;
        this.metadata = metadata;
        this.isCommunityDataset = isCommunityDataset;

        this.validate();
    }

    private validate(): void {
        if (this.name.length < 3 || this.name.length > MAX_NAME_SIZE) {
            throw new Error('Invalid name length')
        }
        if (this.description.length > MAX_TEXT_SIZE) {
            throw new Error('Invalid description length')
        }
        if (this.categories.length > MAX_TEXT_SIZE) {
            throw new Error('Invalid categories length')
        }
        if (this.licenseName.length > MAX_NAME_SIZE) {
            throw new Error('Invalid license name length')
        }
        if (this.licenseSymbol.length > MAX_SYMBOL_SIZE) {
            throw new Error('Invalid license symbol length')
        }
        if (this.licenseURL.length > MAX_TEXT_SIZE) {
            throw new Error('Invalid license URL length')
        }
        if (this.metadata.length > MAX_DATASET_METADATA_SIZE) {
            throw new Error('Invalid metadata length')
        }
    }

    getTypeId(): number {
        return CREATE_DATASET_ID
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
            consts.MaxStringLen + this.metadata.length +
            1 // isCommunityDataset (boolean)
        )
    }

    computeUnits(): number {
        return CREATE_DATASET_COMPUTE_UNITS
    }

    stateKeysMaxChunks(): number[] {
        return [STORAGE_ASSET_CHUNKS, STORAGE_DATASET_CHUNKS]
    }

    toJSON(): object {
        return {
            assetAddress: this.assetAddress.toString(),
            name: this.name,
            description: this.description,
            categories: this.categories,
            licenseName: this.licenseName,
            licenseSymbol: this.licenseSymbol,
            licenseURL: this.licenseURL,
            metadata: this.metadata,
            isCommunityDataset: this.isCommunityDataset
        }
    }

    toString(): string {
        return JSON.stringify(this.toJSON())
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size())
        codec.packAddress(this.assetAddress)
        codec.packString(this.name)
        codec.packString(this.description)
        codec.packString(this.categories)
        codec.packString(this.licenseName)
        codec.packString(this.licenseSymbol)
        codec.packString(this.licenseURL)
        codec.packString(this.metadata)
        codec.packBool(this.isCommunityDataset)
        return codec.toBytes()
    }

    static fromBytes(bytes: Uint8Array): [CreateDataset | null, Error | null] {
        const codec = utils.Codec.newReader(bytes, bytes.length)
        const assetAddress = codec.unpackAddress()
        const name = codec.unpackString(true)
        const description = codec.unpackString(false)
        const categories = codec.unpackString(false)
        const licenseName = codec.unpackString(false)
        const licenseSymbol = codec.unpackString(false)
        const licenseURL = codec.unpackString(false)
        const metadata = codec.unpackString(false)
        const isCommunityDataset = codec.unpackBool()

        const error = codec.getError()
        if (error) {
            return [null, error]
        }

        const action = new CreateDataset(
            assetAddress.toString(),
            name,
            description,
            categories,
            licenseName,
            licenseSymbol,
            licenseURL,
            metadata,
            isCommunityDataset
        )
        return [action, null]
    }
}