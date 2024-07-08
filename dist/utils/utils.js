"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBalance = parseBalance;
exports.formatBalance = formatBalance;
exports.getUnixRMilli = getUnixRMilli;
exports.bufferEquals = bufferEquals;
exports.toAssetID = toAssetID;
const avalanchejs_1 = require("@avalabs/avalanchejs");
const consts_1 = require("../constants/consts");
const nuklaivm_1 = require("../constants/nuklaivm");
function parseBalance(amount, decimals) {
    const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return BigInt(Math.floor(parsedAmount * Math.pow(10, decimals)));
}
function formatBalance(parsedAmount, decimals) {
    const factor = Math.pow(10, decimals);
    const parsedBigInt = typeof parsedAmount === 'bigint' ? parsedAmount : BigInt(parsedAmount);
    const wholePart = Number(parsedBigInt / BigInt(factor));
    const fractionalPart = Number(parsedBigInt % BigInt(factor)) / factor;
    return wholePart + fractionalPart;
}
function getUnixRMilli(now, add) {
    let currentTime = now;
    if (currentTime < 0) {
        currentTime = Date.now();
    }
    const t = BigInt(currentTime) + BigInt(add);
    return t - (t % consts_1.MillisecondsPerSecond);
}
function bufferEquals(buf1, buf2) {
    if (buf1.length !== buf2.length)
        return false;
    for (let i = 0; i < buf1.length; i++) {
        if (buf1[i] !== buf2[i])
            return false;
    }
    return true;
}
function toAssetID(asset) {
    return asset.toUpperCase() === nuklaivm_1.SYMBOL ? consts_1.EMPTY_ID : avalanchejs_1.Id.fromString(asset);
}
//# sourceMappingURL=utils.js.map