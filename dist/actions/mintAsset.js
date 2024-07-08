// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
import { consts, utils } from '@nuklai/hyperchain-sdk';
import { MINTASSET_COMPUTE_UNITS, MINTASSET_ID, STORAGE_ASSET_CHUNKS, STORAGE_BALANCE_CHUNKS } from '../constants/nuklaivm';
export const MintAssetTxSize = consts.ADDRESS_LEN + consts.ID_LEN + consts.UINT64_LEN;
export class MintAsset {
    to;
    asset;
    value;
    constructor(to, asset, value) {
        this.to = utils.Address.fromString(to);
        // Default asset to NAI if asset is "NAI"
        this.asset = utils.toAssetID(asset);
        this.value = value;
    }
    getTypeId() {
        return MINTASSET_ID;
    }
    size() {
        return consts.ADDRESS_LEN + consts.ID_LEN + consts.UINT64_LEN;
    }
    computeUnits() {
        return MINTASSET_COMPUTE_UNITS;
    }
    stateKeysMaxChunks() {
        return [STORAGE_ASSET_CHUNKS, STORAGE_BALANCE_CHUNKS];
    }
    toBytes() {
        const codec = utils.Codec.newWriter(this.size(), this.size());
        codec.packAddress(this.to);
        codec.packID(this.asset);
        codec.packUint64(this.value);
        const bytes = codec.toBytes();
        return bytes;
    }
    static fromBytes(bytes) {
        const codec = utils.Codec.newReader(bytes, bytes.length);
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
//# sourceMappingURL=mintAsset.js.map