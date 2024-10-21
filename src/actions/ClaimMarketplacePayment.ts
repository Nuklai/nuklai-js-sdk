// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { actions, consts, utils } from '@nuklai/hyperchain-sdk'
import {
    CLAIM_MARKETPLACE_PAYMENT_COMPUTE_UNITS,
    CLAIM_MARKETPLACE_PAYMENT_ID,
    STORAGE_ASSET_CHUNKS,
    STORAGE_BALANCE_CHUNKS
} from '../constants'

export class ClaimMarketplacePayment implements actions.Action {
    public marketplaceAssetAddress: utils.Address
    public paymentAssetAddress: utils.Address

    constructor(
        marketplaceAssetAddress: string,
        paymentAssetAddress: string
    ) {
        this.marketplaceAssetAddress = utils.Address.fromString(marketplaceAssetAddress)
        this.paymentAssetAddress = utils.Address.fromString(paymentAssetAddress)
    }

    getTypeId(): number {
        return CLAIM_MARKETPLACE_PAYMENT_ID
    }

    size(): number {
        return consts.ADDRESS_LEN * 2
    }

    computeUnits(): number {
        return CLAIM_MARKETPLACE_PAYMENT_COMPUTE_UNITS
    }

    stateKeysMaxChunks(): number[] {
        return [STORAGE_ASSET_CHUNKS, STORAGE_BALANCE_CHUNKS]
    }

    toJSON(): object {
        return {
            marketplaceAssetAddress: this.marketplaceAssetAddress.toString(),
            paymentAssetAddress: this.paymentAssetAddress.toString()
        }
    }

    toString(): string {
        return JSON.stringify(this.toJSON())
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size())
        codec.packAddress(this.marketplaceAssetAddress)
        codec.packAddress(this.paymentAssetAddress)
        return codec.toBytes()
    }

    static fromBytes(bytes: Uint8Array): [ClaimMarketplacePayment | null, Error | null] {
        const codec = utils.Codec.newReader(bytes, bytes.length)
        const marketplaceAssetAddress = codec.unpackAddress()
        const paymentAssetAddress = codec.unpackAddress()

        const error = codec.getError()
        if (error) {
            return [null, error]
        }

        return [
            new ClaimMarketplacePayment(
                marketplaceAssetAddress.toString(),
                paymentAssetAddress.toString()
            ),
            null
        ]
    }
}
