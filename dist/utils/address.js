"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const avalanchejs_1 = require("@avalabs/avalanchejs");
const consts_1 = require("../constants/consts");
const nuklaivm_1 = require("../constants/nuklaivm");
const hashing_1 = require("./hashing");
class Address {
    constructor(address) {
        this.address = address;
        this._type = avalanchejs_1.TypeSymbols.Address;
        this.address = address;
    }
    static fromBytes(buf) {
        return [new Address(buf.slice(0, consts_1.ADDRESS_LEN)), buf.slice(consts_1.ADDRESS_LEN)];
    }
    toJSON(hrp = nuklaivm_1.HRP) {
        return this.toString(hrp);
    }
    //decodes from bech32 Addresses
    static fromString(addr) {
        return new Address(avalanchejs_1.utils.parseBech32(addr)[1]);
    }
    static fromHex(hex) {
        return new Address(avalanchejs_1.utils.hexToBuffer(hex));
    }
    toHex() {
        return avalanchejs_1.utils.bufferToHex(this.address);
    }
    toBytes() {
        return avalanchejs_1.utils.padLeft(this.address, consts_1.ADDRESS_LEN);
    }
    toString(hrp = nuklaivm_1.HRP) {
        return avalanchejs_1.utils.formatBech32(hrp, this.address);
    }
    value() {
        return this.toString();
    }
    static newAddress(authTypeID, publicKeyBytes) {
        if (![nuklaivm_1.ED25519_ID, nuklaivm_1.SECP256R1_ID, nuklaivm_1.BLS_ID].includes(authTypeID)) {
            throw new Error('invalid auth type');
        }
        const address = new Uint8Array(consts_1.ADDRESS_LEN);
        address[0] = authTypeID;
        address.set((0, hashing_1.ToID)(publicKeyBytes), 1);
        return Address.fromBytes(address)[0];
    }
    static formatAddress(address) {
        return avalanchejs_1.utils.formatBech32(nuklaivm_1.HRP, address);
    }
    static parseAddress(address) {
        return avalanchejs_1.utils.parseBech32(address)[1];
    }
}
exports.Address = Address;
//# sourceMappingURL=address.js.map