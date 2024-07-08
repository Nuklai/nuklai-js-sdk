"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.BLSFactory = exports.BLS = exports.BlsAuthSize = void 0;
const avalanchejs_1 = require("@avalabs/avalanchejs");
const bls12_381_1 = require("@noble/curves/bls12-381");
const utils_1 = require("@noble/hashes/utils");
const consts_1 = require("../constants/consts");
const nuklaivm_1 = require("../constants/nuklaivm");
const address_1 = require("../utils/address");
const codec_1 = require("../utils/codec");
const utils_2 = require("../utils/utils");
exports.BlsAuthSize = avalanchejs_1.bls.PUBLIC_KEY_LENGTH + avalanchejs_1.bls.SIGNATURE_LENGTH;
class BLS {
    constructor(signer, signature) {
        this.addr = consts_1.EMPTY_ADDRESS;
        this.signer = signer;
        this.signature = signature;
    }
    address() {
        if ((0, utils_2.bufferEquals)(this.addr.toBytes(), consts_1.EMPTY_ADDRESS.toBytes())) {
            this.addr = address_1.Address.newAddress(nuklaivm_1.BLS_ID, avalanchejs_1.bls.publicKeyToBytes(this.signer));
        }
        return this.addr;
    }
    getTypeId() {
        return nuklaivm_1.BLS_ID;
    }
    async verify(message) {
        return avalanchejs_1.bls.verify(this.signer, this.signature, message);
    }
    actor() {
        return this.address();
    }
    sponsor() {
        return this.address();
    }
    size() {
        return exports.BlsAuthSize;
    }
    toBytes() {
        const size = this.size();
        const codec = codec_1.Codec.newWriter(size, size);
        const signerBytes = avalanchejs_1.bls.publicKeyToBytes(this.signer);
        codec.packFixedBytes(signerBytes);
        const signatureBytes = avalanchejs_1.bls.signatureToBytes(this.signature);
        codec.packFixedBytes(signatureBytes);
        return codec.toBytes();
    }
    static fromBytes(bytes) {
        const codec = codec_1.Codec.newReader(bytes, bytes.length);
        const signer = avalanchejs_1.bls.publicKeyFromBytes(codec.unpackFixedBytes(avalanchejs_1.bls.PUBLIC_KEY_LENGTH));
        const signature = avalanchejs_1.bls.signatureFromBytes(codec.unpackFixedBytes(avalanchejs_1.bls.SIGNATURE_LENGTH));
        return [new BLS(signer, signature), codec.getError()];
    }
    static publicKeyToHex(publicKey) {
        return Buffer.from(avalanchejs_1.bls.publicKeyToBytes(publicKey)).toString('hex');
    }
    static hexToPublicKey(hex) {
        return avalanchejs_1.bls.publicKeyFromBytes(Buffer.from(hex, 'hex'));
    }
}
exports.BLS = BLS;
class BLSFactory {
    constructor(privateKey) {
        let privKey = avalanchejs_1.bls.secretKeyFromBytes((0, utils_1.randomBytes)(32)); // 32 bytes for a private key
        if (privateKey) {
            privKey = privateKey;
        }
        this.privateKey = privKey;
    }
    sign(message) {
        const signer = BLSFactory.publicKeyFromPrivateKey(this.privateKey);
        const signature = avalanchejs_1.bls.sign(message, this.privateKey);
        return new BLS(signer, avalanchejs_1.bls.signatureFromBytes(signature));
    }
    computeUnits() {
        return nuklaivm_1.BLS_COMPUTE_UNITS;
    }
    bandwidth() {
        return exports.BlsAuthSize;
    }
    static generateKeyPair() {
        const privateKey = new BLSFactory().privateKey;
        const publicKey = BLSFactory.publicKeyFromPrivateKey(privateKey);
        return { privateKey, publicKey };
    }
    static publicKeyFromPrivateKey(privateKey) {
        const publicKeyBytes = bls12_381_1.bls12_381.getPublicKey(privateKey);
        return avalanchejs_1.bls.publicKeyFromBytes(publicKeyBytes);
    }
    static privateKeyToHex(privateKey) {
        return Buffer.from(avalanchejs_1.bls.secretKeyToBytes(privateKey)).toString('hex');
    }
    static hexToPrivateKey(hex) {
        return avalanchejs_1.bls.secretKeyFromBytes(Buffer.from(hex, 'hex'));
    }
}
exports.BLSFactory = BLSFactory;
//# sourceMappingURL=bls.js.map