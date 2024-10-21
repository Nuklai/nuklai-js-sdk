// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { actions, utils, consts } from "@nuklai/hyperchain-sdk";
import { Address } from "@nuklai/hyperchain-sdk/dist/utils";
import {
    SUBSCRIBE_DATASET_MARKETPLACE_COMPUTE_UNITS,
    SUBSCRIBE_DATASET_MARKETPLACE_ID,
    STORAGE_DATASET_CHUNKS,
    STORAGE_ASSET_CHUNKS,
    STORAGE_BALANCE_CHUNKS
} from '../constants'

export class SubscribeDatasetMarketplace implements actions.Action {
    public marketplaceAssetAddress: Address
    public paymentAssetAddress: Address
    public numBlocksToSubscribe: bigint

    constructor(
        marketplaceAssetAddress: string,
        paymentAssetAddress: string,
        numBlocksToSubscribe: bigint
    ) {
        this.marketplaceAssetAddress = Address.fromString(marketplaceAssetAddress)
        this.paymentAssetAddress = Address.fromString(paymentAssetAddress)
        this.numBlocksToSubscribe = numBlocksToSubscribe
    }

    getTypeId(): number {
        return SUBSCRIBE_DATASET_MARKETPLACE_ID
    }

    size(): number {
        return consts.ADDRESS_LEN * 2 + consts.UINT64_LEN
    }

    computeUnits(): number {
        return SUBSCRIBE_DATASET_MARKETPLACE_COMPUTE_UNITS
    }

    stateKeysMaxChunks(): number[] {
        return [STORAGE_DATASET_CHUNKS, STORAGE_ASSET_CHUNKS, STORAGE_BALANCE_CHUNKS]
    }

    toJSON(): object {
        return {
            marketplaceAssetAddress: this.marketplaceAssetAddress.toString(),
            paymentAssetAddress: this.paymentAssetAddress.toString(),
            numBlocksToSubscribe: this.numBlocksToSubscribe.toString()
        }
    }

    toString(): string {
        return JSON.stringify(this.toJSON())
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size())
        codec.packAddress(this.marketplaceAssetAddress)
        codec.packAddress(this.paymentAssetAddress)
        codec.packUint64(this.numBlocksToSubscribe)
        return codec.toBytes()
    }

    static fromBytes(bytes: Uint8Array): [SubscribeDatasetMarketplace | null, Error | null] {
        const codec = utils.Codec.newReader(bytes, bytes.length)
        const marketplaceAssetAddress = codec.unpackAddress()
        const paymentAssetAddress = codec.unpackAddress()
        const numBlocksToSubscribe = codec.unpackUint64(true)

        const error = codec.getError()
        if (error) {
            return [null, error]
        }

        return [
            new SubscribeDatasetMarketplace(
                marketplaceAssetAddress.toString(),
                paymentAssetAddress.toString(),
                numBlocksToSubscribe
            ),
            null
        ]
    }
}