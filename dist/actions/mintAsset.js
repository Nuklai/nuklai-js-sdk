"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MintAsset = exports.MintAssetTxSize = void 0;
const hyperchain_sdk_1 = require("@nuklai/hyperchain-sdk");
const nuklaivm_1 = require("../constants/nuklaivm");
exports.MintAssetTxSize = hyperchain_sdk_1.consts.ADDRESS_LEN + hyperchain_sdk_1.consts.ID_LEN + hyperchain_sdk_1.consts.UINT64_LEN;
class MintAsset {
    to;
    asset;
    value;
    constructor(to, asset, value) {
        this.to = hyperchain_sdk_1.utils.Address.fromString(to);
        // Default asset to NAI if asset is "NAI"
        this.asset = hyperchain_sdk_1.utils.toAssetID(asset);
        this.value = value;
    }
    getTypeId() {
        return nuklaivm_1.MINTASSET_ID;
    }
    size() {
        return hyperchain_sdk_1.consts.ADDRESS_LEN + hyperchain_sdk_1.consts.ID_LEN + hyperchain_sdk_1.consts.UINT64_LEN;
    }
    computeUnits() {
        return nuklaivm_1.MINTASSET_COMPUTE_UNITS;
    }
    stateKeysMaxChunks() {
        return [nuklaivm_1.STORAGE_ASSET_CHUNKS, nuklaivm_1.STORAGE_BALANCE_CHUNKS];
    }
    toBytes() {
        const codec = hyperchain_sdk_1.utils.Codec.newWriter(this.size(), this.size());
        codec.packAddress(this.to);
        codec.packID(this.asset);
        codec.packUint64(this.value);
        const bytes = codec.toBytes();
        return bytes;
    }
    static fromBytes(bytes) {
        const codec = hyperchain_sdk_1.utils.Codec.newReader(bytes, bytes.length);
        const to = codec.unpackAddress();
        const asset = codec.unpackID(false);
        const value = codec.unpackUint64(true);
        const action = new MintAsset(to.toString(), asset.toString(), value);
        return [action, codec.getError()];
    }
    static fromBytesCodec(codec) {
        const codecResult = codec;
        const to = codecResult.unpackAddress();
        const asset = codecResult.unpackID(false);
        const value = codecResult.unpackUint64(true);
        const action = new MintAsset(to.toString(), asset.toString(), value);
        return [action, codecResult];
    }
}
exports.MintAsset = MintAsset;
//# sourceMappingURL=mintAsset.js.map