"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthFactory = getAuthFactory;
exports.getAuth = getAuth;
const avalanchejs_1 = require("@avalabs/avalanchejs");
const base64_1 = require("../utils/base64");
const hex_1 = require("../utils/hex");
const bls_1 = require("./bls");
const ed25519_1 = require("./ed25519");
function decodePrivateKey(privateKey) {
    if ((0, hex_1.isHex)(privateKey)) {
        return Buffer.from(privateKey, 'hex');
    }
    else if ((0, base64_1.isBase64)(privateKey)) {
        return (0, base64_1.base64ToUint8Array)(privateKey);
    }
    else {
        throw new Error('Unsupported private key format');
    }
}
function getAuthFactory(authType, privateKeyString) {
    const privateKeyBytes = decodePrivateKey(privateKeyString);
    const privateKeyHex = Buffer.from(privateKeyBytes).toString('hex');
    if (authType === 'bls') {
        const privateKey = bls_1.BLSFactory.hexToPrivateKey(privateKeyHex);
        return new bls_1.BLSFactory(privateKey);
    }
    else if (authType === 'ed25519') {
        const privateKey = ed25519_1.ED25519Factory.hexToPrivateKey(privateKeyHex);
        return new ed25519_1.ED25519Factory(privateKey);
    }
    else {
        throw new Error('Unsupported key type');
    }
}
function getAuth(authType, signer, signature) {
    if (authType === 'bls') {
        return new bls_1.BLS(avalanchejs_1.bls.publicKeyFromBytes(signer), avalanchejs_1.bls.signatureFromBytes(signature));
    }
    else if (authType === 'ed25519') {
        return new ed25519_1.ED25519(signer, signature);
    }
    else {
        throw new Error('Unsupported key type');
    }
}
//# sourceMappingURL=provider.js.map