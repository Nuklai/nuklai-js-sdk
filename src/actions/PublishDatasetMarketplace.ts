import { actions, consts, utils } from "@nuklai/hyperchain-sdk";

import {
    PUBLISH_DATASET_MARKETPLACE_COMPUTE_UNITS,
    PUBLISH_DATASET_MARKETPLACE_ID,
    STORAGE_DATASET_CHUNKS,
    STORAGE_ASSET_CHUNKS
} from '../constants'

export class PublishDatasetMarketplace implements actions.Action {
    public datasetAddress: utils.Address
    public paymentAssetAddress: utils.Address
    public datasetPricePerBlock: bigint

    constructor(
        datasetAddress: string,
        paymentAssetAddress: string,
        datasetPricePerBlock: bigint
    ) {
        this.datasetAddress = utils.Address.fromString(datasetAddress)
        this.paymentAssetAddress = utils.Address.fromString(paymentAssetAddress)
        this.datasetPricePerBlock = datasetPricePerBlock
    }

    getTypeId(): number {
        return PUBLISH_DATASET_MARKETPLACE_ID
    }

    size(): number {
        return consts.ADDRESS_LEN * 2 + consts.UINT64_LEN
    }

    computeUnits(): number {
        return PUBLISH_DATASET_MARKETPLACE_COMPUTE_UNITS
    }

    stateKeysMaxChunks(): number[] {
        return [STORAGE_DATASET_CHUNKS, STORAGE_ASSET_CHUNKS]
    }

    toJSON(): object {
        return {
            datasetAddress: this.datasetAddress.toString(),
            paymentAssetAddress: this.paymentAssetAddress.toString(),
            datasetPricePerBlock: this.datasetPricePerBlock.toString()
        }
    }

    toString(): string {
        return JSON.stringify(this.toJSON())
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size())
        codec.packAddress(this.datasetAddress)
        codec.packAddress(this.paymentAssetAddress)
        codec.packUint64(this.datasetPricePerBlock)
        return codec.toBytes()
    }

    static fromBytes(bytes: Uint8Array): [PublishDatasetMarketplace | null, Error | null] {
        const codec = utils.Codec.newReader(bytes, bytes.length)
        const datasetAddress = codec.unpackAddress()
        const paymentAssetAddress = codec.unpackAddress()
        const datasetPricePerBlock = codec.unpackUint64(false)

        const error = codec.getError()
        if (error) {
            return [null, error]
        }

        const action = new PublishDatasetMarketplace(
            datasetAddress.toString(),
            paymentAssetAddress.toString(),
            datasetPricePerBlock
        )
        return [action, null]
    }
}