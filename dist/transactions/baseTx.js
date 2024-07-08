"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTx = exports.BaseTxSize = void 0;
const consts_1 = require("../constants/consts");
const codec_1 = require("../utils/codec");
exports.BaseTxSize = 2 * consts_1.UINT64_LEN + consts_1.ID_LEN;
class BaseTx {
    constructor(timestamp, chainId, maxFee) {
        this.timestamp = timestamp;
        this.chainId = chainId;
        this.maxFee = maxFee;
    }
    size() {
        return exports.BaseTxSize;
    }
    toBytes() {
        const codec = codec_1.Codec.newWriter(this.size(), this.size());
        codec.packInt64(this.timestamp);
        const packedTimestampBytes = codec.toBytes();
        codec.packID(this.chainId);
        codec.packUint64(this.maxFee);
        return codec.toBytes();
    }
    static fromBytes(bytes) {
        const codec = codec_1.Codec.newReader(bytes, bytes.length);
        const timestamp = codec.unpackInt64(true);
        if (timestamp % consts_1.MillisecondsPerSecond !== 0n) {
            return [
                new BaseTx(0n, consts_1.EMPTY_ID, 0n),
                new Error('Timestamp is misaligned')
            ];
        }
        const chainId = codec.unpackID(true);
        const maxFee = codec.unpackUint64(true);
        const baseTx = new BaseTx(timestamp, chainId, maxFee);
        return [baseTx, codec.getError()];
    }
}
exports.BaseTx = BaseTx;
//# sourceMappingURL=baseTx.js.map