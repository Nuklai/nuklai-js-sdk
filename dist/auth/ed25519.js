"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ED25519Factory = exports.ED25519 = exports.Ed25519AuthSize = void 0;
const ed25519_1 = require("@noble/ed25519");
const utils_1 = require("@noble/hashes/utils");
const consts_1 = require("../constants/consts");
const nuklaivm_1 = require("../constants/nuklaivm");
const ed25519_2 = require("../crypto/ed25519");
const address_1 = require("../utils/address");
const codec_1 = require("../utils/codec");
const hex_1 = require("../utils/hex");
const utils_2 = require("../utils/utils");
exports.Ed25519AuthSize = ed25519_2.PUBLIC_KEY_LENGTH + ed25519_2.SIGNATURE_LENGTH;
class ED25519 {
    constructor(signer, signature) {
        this.addr = consts_1.EMPTY_ADDRESS;
        this.signer = signer;
        this.signature = signature;
    }
    address() {
        if ((0, utils_2.bufferEquals)(this.addr.toBytes(), consts_1.EMPTY_ADDRESS.toBytes())) {
            this.addr = address_1.Address.newAddress(nuklaivm_1.ED25519_ID, this.signer);
        }
        return this.addr;
    }
    getTypeId() {
        return nuklaivm_1.ED25519_ID;
    }
    async verify(message) {
        return (0, ed25519_2.verify)(this.signer, this.signature, message);
    }
    actor() {
        return this.address();
    }
    sponsor() {
        return this.address();
    }
    size() {
        return exports.Ed25519AuthSize;
    }
    toBytes() {
        const size = this.size();
        const codec = codec_1.Codec.newWriter(size, size);
        codec.packFixedBytes(this.signer);
        codec.packFixedBytes(this.signature);
        return codec.toBytes();
    }
    static fromBytes(bytes) {
        const codec = codec_1.Codec.newReader(bytes, bytes.length);
        const signer = codec.unpackFixedBytes(ed25519_2.PUBLIC_KEY_LENGTH);
        const signature = codec.unpackFixedBytes(ed25519_2.SIGNATURE_LENGTH);
        return [new ED25519(signer, signature), codec.getError()];
    }
    static publicKeyToHex(publicKey) {
        return Buffer.from(publicKey).toString('hex');
    }
    static hexToPublicKey(hex) {
        return Buffer.from(hex, 'hex');
    }
}
exports.ED25519 = ED25519;
class ED25519Factory {
    constructor(privateKey) {
        let privKey = (0, utils_1.randomBytes)(32); // 32 bytes for a private key
        if (privateKey) {
            privKey = privateKey;
        }
        this.privateKey = privKey;
    }
    sign(message) {
        const publicKey = (0, ed25519_1.getPublicKey)(this.privateKey);
        const signature = (0, ed25519_2.sign)(message, this.privateKey);
        return new ED25519(publicKey, signature);
    }
    computeUnits() {
        return nuklaivm_1.ED25519_COMPUTE_UNITS;
    }
    bandwidth() {
        return exports.Ed25519AuthSize;
    }
    static generateKeyPair() {
        const privateKey = new ED25519Factory().privateKey;
        const publicKey = (0, ed25519_1.getPublicKey)(privateKey);
        return { privateKey, publicKey };
    }
    static publicKeyFromPrivateKey(privateKey) {
        return (0, ed25519_1.getPublicKey)(privateKey);
    }
    static privateKeyToHex(privateKey) {
        return Buffer.from(privateKey).toString('hex');
    }
    static hexToPrivateKey(hex) {
        let privateKeyBytes = Buffer.from(hex, 'hex');
        if (privateKeyBytes.length === ed25519_2.PRIVATE_KEY_LENGTH + ed25519_2.PUBLIC_KEY_LENGTH) {
            privateKeyBytes = privateKeyBytes.subarray(0, ed25519_2.PRIVATE_KEY_LENGTH);
            return (0, hex_1.loadHex)((0, hex_1.toHex)(privateKeyBytes), ed25519_2.PRIVATE_KEY_LENGTH);
        }
        else if (privateKeyBytes.length !== ed25519_2.PRIVATE_KEY_LENGTH) {
            throw new Error('Invalid combined key size');
        }
        return (0, hex_1.loadHex)(hex, ed25519_2.PRIVATE_KEY_LENGTH);
    }
}
exports.ED25519Factory = ED25519Factory;
//# sourceMappingURL=ed25519.js.map