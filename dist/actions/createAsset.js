"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAsset = exports.CreateAssetTxSize = void 0;
const hyperchain_sdk_1 = require("@nuklai/hyperchain-sdk");
const nuklaivm_1 = require("../constants/nuklaivm");
exports.CreateAssetTxSize = hyperchain_sdk_1.consts.INT_LEN +
    nuklaivm_1.MAX_SYMBOL_SIZE +
    hyperchain_sdk_1.consts.BYTE_LEN +
    hyperchain_sdk_1.consts.INT_LEN +
    nuklaivm_1.MAX_MEMO_SIZE;
class CreateAsset {
    symbol;
    decimals;
    metadata;
    constructor(symbol, decimals, metadata) {
        this.symbol = new TextEncoder().encode(symbol);
        this.decimals = decimals;
        this.metadata = new TextEncoder().encode(metadata);
    }
    getTypeId() {
        return nuklaivm_1.CREATEASSET_ID;
    }
    size() {
        // We have to add INT_LEN because when packing bytes, we pack the length of the bytes
        return (hyperchain_sdk_1.consts.INT_LEN +
            this.symbol.length +
            hyperchain_sdk_1.consts.BYTE_LEN +
            hyperchain_sdk_1.consts.INT_LEN +
            this.metadata.length);
    }
    computeUnits() {
        return nuklaivm_1.CREATEASSET_COMPUTE_UNITS;
    }
    stateKeysMaxChunks() {
        return [nuklaivm_1.STORAGE_ASSET_CHUNKS];
    }
    toBytes() {
        const codec = hyperchain_sdk_1.utils.Codec.newWriter(this.size(), this.size());
        codec.packBytes(this.symbol);
        codec.packByte(this.decimals);
        codec.packBytes(this.metadata);
        const bytes = codec.toBytes();
        return bytes;
    }
    static fromBytes(bytes) {
        const codec = hyperchain_sdk_1.utils.Codec.newReader(bytes, bytes.length);
        // Ensure the symbol is unpacked as fixed bytes of MAX_SYMBOL_SIZE
        const symbolBytes = codec.unpackLimitedBytes(nuklaivm_1.MAX_SYMBOL_SIZE);
        const symbol = new TextDecoder().decode(symbolBytes);
        const decimals = codec.unpackByte();
        // Ensure the metadata is unpacked as fixed bytes of MAX_METADATA_SIZE
        const metadataBytes = codec.unpackLimitedBytes(nuklaivm_1.MAX_METADATA_SIZE);
        const metadata = new TextDecoder().decode(metadataBytes);
        const action = new CreateAsset(symbol, decimals, metadata);
        return [action, codec.getError()];
    }
    static fromBytesCodec(codec) {
        const codecResult = codec;
        // Ensure the symbol is unpacked as fixed bytes of MAX_SYMBOL_SIZE
        const symbolBytes = codecResult.unpackLimitedBytes(nuklaivm_1.MAX_SYMBOL_SIZE);
        const symbol = new TextDecoder().decode(symbolBytes);
        const decimals = codecResult.unpackByte();
        // Ensure the metadata is unpacked as fixed bytes of MAX_METADATA_SIZE
        const metadataBytes = codecResult.unpackLimitedBytes(nuklaivm_1.MAX_METADATA_SIZE);
        const metadata = new TextDecoder().decode(metadataBytes);
        const action = new CreateAsset(symbol, decimals, metadata);
        return [action, codecResult];
    }
}
exports.CreateAsset = CreateAsset;
//# sourceMappingURL=createAsset.js.map