// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
import { consts, utils } from '@nuklai/hyperchain-sdk';
import { CREATEASSET_COMPUTE_UNITS, CREATEASSET_ID, MAX_MEMO_SIZE, MAX_METADATA_SIZE, MAX_SYMBOL_SIZE, STORAGE_ASSET_CHUNKS } from '../constants/nuklaivm';
export const CreateAssetTxSize = consts.INT_LEN +
    MAX_SYMBOL_SIZE +
    consts.BYTE_LEN +
    consts.INT_LEN +
    MAX_MEMO_SIZE;
export class CreateAsset {
    symbol;
    decimals;
    metadata;
    constructor(symbol, decimals, metadata) {
        this.symbol = new TextEncoder().encode(symbol);
        this.decimals = decimals;
        this.metadata = new TextEncoder().encode(metadata);
    }
    getTypeId() {
        return CREATEASSET_ID;
    }
    size() {
        // We have to add INT_LEN because when packing bytes, we pack the length of the bytes
        return (consts.INT_LEN +
            this.symbol.length +
            consts.BYTE_LEN +
            consts.INT_LEN +
            this.metadata.length);
    }
    computeUnits() {
        return CREATEASSET_COMPUTE_UNITS;
    }
    stateKeysMaxChunks() {
        return [STORAGE_ASSET_CHUNKS];
    }
    toBytes() {
        const codec = utils.Codec.newWriter(this.size(), this.size());
        codec.packBytes(this.symbol);
        codec.packByte(this.decimals);
        codec.packBytes(this.metadata);
        const bytes = codec.toBytes();
        return bytes;
    }
    static fromBytes(bytes) {
        const codec = utils.Codec.newReader(bytes, bytes.length);
        // Ensure the symbol is unpacked as fixed bytes of MAX_SYMBOL_SIZE
        const symbolBytes = codec.unpackLimitedBytes(MAX_SYMBOL_SIZE);
        const symbol = new TextDecoder().decode(symbolBytes);
        const decimals = codec.unpackByte();
        // Ensure the metadata is unpacked as fixed bytes of MAX_METADATA_SIZE
        const metadataBytes = codec.unpackLimitedBytes(MAX_METADATA_SIZE);
        const metadata = new TextDecoder().decode(metadataBytes);
        const action = new CreateAsset(symbol, decimals, metadata);
        return [action, codec.getError()];
    }
    static fromBytesCodec(codec) {
        const codecResult = codec;
        // Ensure the symbol is unpacked as fixed bytes of MAX_SYMBOL_SIZE
        const symbolBytes = codecResult.unpackLimitedBytes(MAX_SYMBOL_SIZE);
        const symbol = new TextDecoder().decode(symbolBytes);
        const decimals = codecResult.unpackByte();
        // Ensure the metadata is unpacked as fixed bytes of MAX_METADATA_SIZE
        const metadataBytes = codecResult.unpackLimitedBytes(MAX_METADATA_SIZE);
        const metadata = new TextDecoder().decode(metadataBytes);
        const action = new CreateAsset(symbol, decimals, metadata);
        return [action, codecResult];
    }
}
//# sourceMappingURL=createAsset.js.map