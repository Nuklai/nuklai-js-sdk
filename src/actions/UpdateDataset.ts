// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Id } from '@avalabs/avalanchejs'
import { actions, consts, codec, utils } from '@nuklai/hyperchain-sdk'
import {
    MAX_METADATA_SIZE,
    MAX_TEXT_SIZE,
    UPDATEDATASET_COMPUTE_UNITS,
    UPDATEDATASET_ID,
    STORAGE_DATASET_CHUNKS
} from '../constants/nuklaivm'

export class UpdateDataset implements actions.Action {
    public dataset: Id
    public name: Uint8Array
    public description: Uint8Array
    public categories: Uint8Array
    public licenseName: Uint8Array
    public licenseSymbol: Uint8Array
    public licenseURL: Uint8Array
    public metadata: Uint8Array
    public isCommunityDataset: boolean

    constructor(
        dataset: string,
        name: string,
        description: string,
        categories: string,
        licenseName: string,
        licenseSymbol: string,
        licenseURL: string,
        metadata: string,
        isCommunityDataset: boolean
    ) {
        this.dataset = utils.toAssetID(dataset)
        this.name = new TextEncoder().encode(name)
        this.description = new TextEncoder().encode(description)
        this.categories = new TextEncoder().encode(categories)
        this.licenseName = new TextEncoder().encode(licenseName)
        this.licenseSymbol = new TextEncoder().encode(licenseSymbol)
        this.licenseURL = new TextEncoder().encode(licenseURL)
        this.metadata = new TextEncoder().encode(metadata)
        this.isCommunityDataset = isCommunityDataset
    }

    getTypeId(): number {
        return UPDATEDATASET_ID
    }

    size(): number {
        return (
            consts.ID_LEN +
            codec.bytesLen(this.name) +
            codec.bytesLen(this.description) +
            codec.bytesLen(this.categories) +
            codec.bytesLen(this.licenseName) +
            codec.bytesLen(this.licenseSymbol) +
            codec.bytesLen(this.licenseURL) +
            codec.bytesLen(this.metadata) +
            consts.BOOL_LEN
        )
    }

    computeUnits(): number {
        return UPDATEDATASET_COMPUTE_UNITS
    }

    stateKeysMaxChunks(): number[] {
        return [STORAGE_DATASET_CHUNKS]
    }

    toJSON(): object {
        return {
            dataset: this.dataset.toString(),
            name: new TextDecoder().decode(this.name),
            description: new TextDecoder().decode(this.description),
            categories: new TextDecoder().decode(this.categories),
            licenseName: new TextDecoder().decode(this.licenseName),
            licenseSymbol: new TextDecoder().decode(this.licenseSymbol),
            licenseURL: new TextDecoder().decode(this.licenseURL),
            metadata: new TextDecoder().decode(this.metadata),
            isCommunityDataset: this.isCommunityDataset
        }
    }

    toString(): string {
        return JSON.stringify(this.toJSON())
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size())
        codec.packID(this.dataset)
        codec.packBytes(this.name)
        codec.packBytes(this.description)
        codec.packBytes(this.categories)
        codec.packBytes(this.licenseName)
        codec.packBytes(this.licenseSymbol)
        codec.packBytes(this.licenseURL)
        codec.packBytes(this.metadata)
        codec.packBool(this.isCommunityDataset)
        return codec.toBytes()
    }

    static fromBytes(bytes: Uint8Array): [UpdateDataset, Error?] {
        const codec = utils.Codec.newReader(bytes, bytes.length)
        const dataset = codec.unpackID(true)
        const name = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
        const description = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
        const categories = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
        const licenseName = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
        const licenseSymbol = codec.unpackLimitedBytes(MAX_TEXT_SIZE, true)
        const licenseURL = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
        const metadata = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
        const isCommunityDataset = codec.unpackBool()

        const action = new UpdateDataset(
            dataset.toString(),
            new TextDecoder().decode(name),
            new TextDecoder().decode(description),
            new TextDecoder().decode(categories),
            new TextDecoder().decode(licenseName),
            new TextDecoder().decode(licenseSymbol),
            new TextDecoder().decode(licenseURL),
            new TextDecoder().decode(metadata),
            isCommunityDataset
        )

        return [action, codec.getError()]
    }

    static fromBytesCodec(codec: utils.Codec): [UpdateDataset, utils.Codec] {
        const dataset = codec.unpackID(true)
        const name = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
        const description = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
        const categories = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
        const licenseName = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
        const licenseSymbol = codec.unpackLimitedBytes(MAX_TEXT_SIZE, true)
        const licenseURL = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
        const metadata = codec.unpackLimitedBytes(MAX_METADATA_SIZE, true)
        const isCommunityDataset = codec.unpackBool()

        const action = new UpdateDataset(
            dataset.toString(),
            new TextDecoder().decode(name),
            new TextDecoder().decode(description),
            new TextDecoder().decode(categories),
            new TextDecoder().decode(licenseName),
            new TextDecoder().decode(licenseSymbol),
            new TextDecoder().decode(licenseURL),
            new TextDecoder().decode(metadata),
            isCommunityDataset
        )

        return [action, codec]
    }
}