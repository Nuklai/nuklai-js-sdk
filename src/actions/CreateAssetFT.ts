// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { actions, consts, utils } from '@nuklai/hyperchain-sdk';
import {
    CREATE_ASSET_COMPUTE_UNITS,
    CREATE_ASSET_FT_ID,
    STORAGE_ASSET_CHUNKS,
    MAX_NAME_SIZE,
    MAX_SYMBOL_SIZE,
    MAX_ASSET_METADATA_SIZE,
    MAX_ASSET_DECIMALS,
    ASSET_FUNGIBLE_TOKEN_ID
} from '../constants';

export const CreateAssetFTTxSize =
    1 + // assetType
    consts.MaxStringLen + MAX_NAME_SIZE +
    consts.MaxStringLen + MAX_SYMBOL_SIZE +
    1 + // decimals
    consts.MaxStringLen + MAX_ASSET_METADATA_SIZE +
    consts.UINT64_LEN + // maxSupply
    consts.ADDRESS_LEN + // mintAdmin
    consts.ADDRESS_LEN + // pauseUnpauseAdmin
    consts.ADDRESS_LEN + // freezeUnfreezeAdmin
    consts.ADDRESS_LEN; // enableDisableKYCAccountAdmin

export class CreateAssetFT implements actions.Action {
    public assetType: number;
    public name: string;
    public symbol: string;
    public decimals: number;
    public metadata: string;
    public maxSupply: bigint;
    public mintAdmin: utils.Address;
    public pauseUnpauseAdmin: utils.Address;
    public freezeUnfreezeAdmin: utils.Address;
    public enableDisableKYCAccountAdmin: utils.Address;

    constructor(
        name: string,
        symbol: string,
        decimals: number,
        metadata: string,
        maxSupply: bigint,
        mintAdmin: string,
        pauseUnpauseAdmin: string,
        freezeUnfreezeAdmin: string,
        enableDisableKYCAccountAdmin: string
    ) {
        this.assetType = ASSET_FUNGIBLE_TOKEN_ID;
        this.name = name;
        this.symbol = symbol;
        this.decimals = decimals;
        this.metadata = metadata;
        this.maxSupply = maxSupply;
        this.mintAdmin = utils.Address.fromString(mintAdmin);
        this.pauseUnpauseAdmin = utils.Address.fromString(pauseUnpauseAdmin);
        this.freezeUnfreezeAdmin = utils.Address.fromString(freezeUnfreezeAdmin);
        this.enableDisableKYCAccountAdmin = utils.Address.fromString(enableDisableKYCAccountAdmin);

        this.validate();
    }

    private validate(): void {
        if (this.name.length < 3 || this.name.length > MAX_NAME_SIZE) {
            throw new Error('Invalid name length');
        }
        if (this.symbol.length < 3 || this.symbol.length > MAX_SYMBOL_SIZE) {
            throw new Error('Invalid symbol length');
        }
        if (this.decimals > MAX_ASSET_DECIMALS) {
            throw new Error('Invalid decimals');
        }
        if (this.metadata.length > MAX_ASSET_METADATA_SIZE) {
            throw new Error('Invalid metadata length');
        }
    }

    getTypeId(): number {
        return CREATE_ASSET_FT_ID;
    }

    size(): number {
        return CreateAssetFTTxSize;
    }

    computeUnits(): number {
        return CREATE_ASSET_COMPUTE_UNITS;
    }

    stateKeysMaxChunks(): number[] {
        return [STORAGE_ASSET_CHUNKS];
    }

    toJSON(): object {
        return {
            assetType: this.assetType,
            name: this.name,
            symbol: this.symbol,
            decimals: this.decimals,
            metadata: this.metadata,
            maxSupply: this.maxSupply.toString(),
            mintAdmin: this.mintAdmin.toString(),
            pauseUnpauseAdmin: this.pauseUnpauseAdmin.toString(),
            freezeUnfreezeAdmin: this.freezeUnfreezeAdmin.toString(),
            enableDisableKYCAccountAdmin: this.enableDisableKYCAccountAdmin.toString()
        };
    }

    toString(): string {
        return JSON.stringify(this.toJSON());
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size());
        codec.packByte(this.assetType);
        codec.packString(this.name);
        codec.packString(this.symbol);
        codec.packByte(this.decimals);
        codec.packString(this.metadata);
        codec.packUint64(this.maxSupply);
        codec.packAddress(this.mintAdmin);
        codec.packAddress(this.pauseUnpauseAdmin);
        codec.packAddress(this.freezeUnfreezeAdmin);
        codec.packAddress(this.enableDisableKYCAccountAdmin);
        return codec.toBytes();
    }

    static fromBytes(bytes: Uint8Array): [CreateAssetFT | null, Error | null] {
        const codec = utils.Codec.newReader(bytes, bytes.length);
        const assetType = codec.unpackByte();
        const name = codec.unpackString(true);
        const symbol = codec.unpackString(true);
        const decimals = codec.unpackByte();
        const metadata = codec.unpackString(false);
        const maxSupply = codec.unpackUint64(false);
        const mintAdmin = codec.unpackAddress();
        const pauseUnpauseAdmin = codec.unpackAddress();
        const freezeUnfreezeAdmin = codec.unpackAddress();
        const enableDisableKYCAccountAdmin = codec.unpackAddress();

        if (assetType !== ASSET_FUNGIBLE_TOKEN_ID) {
            return [null, new Error('Invalid asset type for CreateAssetFT')];
        }

        const action = new CreateAssetFT(
            name,
            symbol,
            decimals,
            metadata,
            maxSupply,
            mintAdmin.toString(),
            pauseUnpauseAdmin.toString(),
            freezeUnfreezeAdmin.toString(),
            enableDisableKYCAccountAdmin.toString()
        );
        return [action, codec.getError() || null];
    }
}