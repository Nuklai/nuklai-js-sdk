
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { actions, consts, utils } from '@nuklai/hyperchain-sdk';
import {
    BURNASSET_COMPUTE_UNITS,
    BURNASSET_FT_ID,
    STORAGE_ASSET_CHUNKS,
    STORAGE_BALANCE_CHUNKS
} from '../constants';

export const BurnAssetFTTxSize = consts.ADDRESS_LEN + consts.UINT64_LEN;

export class BurnAssetFT implements actions.Action {
    public assetAddress: utils.Address;
    public value: bigint;

    constructor(assetAddress: string, value: bigint) {
        this.assetAddress = utils.Address.fromString(assetAddress);
        this.value = value;
    }

    getTypeId(): number {
        return BURNASSET_FT_ID;
    }

    size(): number {
        return BurnAssetFTTxSize;
    }

    computeUnits(): number {
        return BURNASSET_COMPUTE_UNITS;
    }

    stateKeysMaxChunks(): number[] {
        return [STORAGE_ASSET_CHUNKS, STORAGE_BALANCE_CHUNKS];
    }

    toJSON(): object {
        return {
            assetAddress: this.assetAddress.toString(),
            value: this.value.toString()
        };
    }

    toString(): string {
        return JSON.stringify(this.toJSON());
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size());
        codec.packAddress(this.assetAddress);
        codec.packUint64(this.value);
        return codec.toBytes();
    }

    static fromBytes(bytes: Uint8Array): [BurnAssetFT | null, Error | null] {
        const codec = utils.Codec.newReader(bytes, bytes.length);
        const assetAddress = codec.unpackAddress();
        const value = codec.unpackUint64(true);

        const error = codec.getError();
        if (error) {
            return [null, error];
        }

        const action = new BurnAssetFT(assetAddress.toString(), value);
        return [action, null];
    }
}
