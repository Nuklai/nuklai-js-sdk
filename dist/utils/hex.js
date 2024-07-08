"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHex = isHex;
exports.toHex = toHex;
exports.loadHex = loadHex;
function isHex(str) {
    const hexRegex = /^[0-9a-fA-F]+$/;
    return hexRegex.test(str);
}
// ToHex converts a byte to a hex string.
function toHex(b) {
    return Buffer.from(b).toString('hex');
}
// LoadHex Converts hex encoded string into bytes. Returns
// an error if key is invalid.
function loadHex(s, expectedSize) {
    const bytes = Buffer.from(s, 'hex');
    if (expectedSize !== -1 && bytes.length !== expectedSize) {
        throw new Error('Invalid size');
    }
    return new Uint8Array(bytes);
}
//# sourceMappingURL=hex.js.map