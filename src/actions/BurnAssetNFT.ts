// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { actions, consts, utils } from '@nuklai/hyperchain-sdk';
import {
    BURNASSET_COMPUTE_UNITS,
    BURNASSET_NFT_ID,
    STORAGE_ASSET_CHUNKS,
    STORAGE_ASSET_NFT_CHUNKS,
    STORAGE_BALANCE_CHUNKS
} from '../constants';

export const BurnAssetNFTTxSize = consts.ADDRESS_LEN * 2;

export class BurnAssetNFT implements actions.Action {
    public assetAddress: utils.Address;
    public assetNftAddress: utils.Address;

    constructor(assetAddress: string, assetNftAddress: string) {
        this.assetAddress = utils.Address.fromString(assetAddress);
        this.assetNftAddress = utils.Address.fromString(assetNftAddress);
    }

    getTypeId(): number {
        return BURNASSET_NFT_ID;
    }

    size(): number {
        return BurnAssetNFTTxSize;
    }

    computeUnits(): number {
        return BURNASSET_COMPUTE_UNITS;
    }

    stateKeysMaxChunks(): number[] {
        return [STORAGE_ASSET_CHUNKS, STORAGE_ASSET_NFT_CHUNKS, STORAGE_BALANCE_CHUNKS, STORAGE_BALANCE_CHUNKS];
    }

    toJSON(): object {
        return {
            assetAddress: this.assetAddress.toString(),
            assetNftAddress: this.assetNftAddress.toString()
        };
    }

    toString(): string {
        return JSON.stringify(this.toJSON());
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size());
        codec.packAddress(this.assetAddress);
        codec.packAddress(this.assetNftAddress);
        return codec.toBytes();
    }

    static fromBytes(bytes: Uint8Array): [BurnAssetNFT | null, Error | null] {
        const codec = utils.Codec.newReader(bytes, bytes.length);
        const assetAddress = codec.unpackAddress();
        const assetNftAddress = codec.unpackAddress();

        const error = codec.getError();
        if (error) {
            return [null, error];
        }

        const action = new BurnAssetNFT(assetAddress.toString(), assetNftAddress.toString());
        return [action, null];
    }
}