"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Codec = void 0;
const avalanchejs_1 = require("@avalabs/avalanchejs");
const consts_1 = require("../constants/consts");
const address_1 = require("./address");
const utils_1 = require("./utils");
const ErrInsufficientLength = new Error('packer has insufficient length for input');
const errNegativeOffset = new Error('negative offset');
const errInvalidInput = new Error('input does not match expected format');
const errBadBool = new Error('unexpected value when unpacking bool');
const errOversized = new Error('size is larger than limit');
const errFieldNotPopulated = new Error('field is not populated');
class Codec {
    constructor(bytes, maxSize = Infinity) {
        this.buffer = bytes || new Uint8Array();
        this.offset = 0;
        this.maxSize = maxSize;
    }
    static newWriter(initialBufferSize, maxSize) {
        return new Codec(new Uint8Array(initialBufferSize), maxSize);
    }
    static newReader(bytes, maxSize) {
        return new Codec(bytes, maxSize);
    }
    checkSpace(bytes) {
        if (this.offset < 0) {
            this.error = errNegativeOffset;
        }
        else if (bytes < 0) {
            this.error = errInvalidInput;
        }
        else if (this.buffer.length - this.offset < bytes) {
            this.error = ErrInsufficientLength;
        }
    }
    expand(bytes) {
        const neededSize = bytes + this.offset;
        if (neededSize <= this.buffer.length) {
            return;
        }
        if (neededSize > this.maxSize) {
            this.error = ErrInsufficientLength;
            return;
        }
        if (neededSize <= this.buffer.byteLength) {
            const newBuffer = new Uint8Array(this.buffer.byteLength);
            newBuffer.set(this.buffer);
            this.buffer = newBuffer.subarray(0, neededSize);
            return;
        }
        const newBuffer = new Uint8Array(neededSize);
        newBuffer.set(this.buffer);
        this.buffer = newBuffer;
    }
    packByte(value) {
        this.expand(consts_1.BYTE_LEN);
        if (this.error)
            return;
        this.buffer[this.offset] = value;
        this.offset += consts_1.BYTE_LEN;
    }
    unpackByte() {
        this.checkSpace(consts_1.BYTE_LEN);
        if (this.error)
            return 0;
        const value = this.buffer[this.offset];
        this.offset += consts_1.BYTE_LEN;
        return value;
    }
    packShort(value) {
        this.expand(consts_1.SHORT_LEN);
        if (this.error)
            return;
        new DataView(this.buffer.buffer).setUint16(this.offset, value, false);
        this.offset += consts_1.SHORT_LEN;
    }
    unpackShort() {
        this.checkSpace(consts_1.SHORT_LEN);
        if (this.error)
            return 0;
        const value = new DataView(this.buffer.buffer).getUint16(this.offset, false);
        this.offset += consts_1.SHORT_LEN;
        return value;
    }
    packInt(value) {
        this.expand(consts_1.INT_LEN);
        if (this.error)
            return;
        new DataView(this.buffer.buffer).setUint32(this.offset, value, false);
        this.offset += consts_1.INT_LEN;
    }
    unpackInt() {
        this.checkSpace(consts_1.INT_LEN);
        if (this.error)
            return 0;
        const value = new DataView(this.buffer.buffer).getUint32(this.offset, false);
        this.offset += consts_1.INT_LEN;
        return value;
    }
    packLong(value) {
        this.expand(consts_1.LONG_LEN);
        if (this.error)
            return;
        new DataView(this.buffer.buffer).setBigUint64(this.offset, value, false);
        this.offset += consts_1.LONG_LEN;
    }
    unpackLong() {
        this.checkSpace(consts_1.LONG_LEN);
        if (this.error)
            return 0n;
        const value = new DataView(this.buffer.buffer).getBigUint64(this.offset, false);
        this.offset += consts_1.LONG_LEN;
        return value;
    }
    packBool(value) {
        this.packByte(value ? 1 : 0);
    }
    unpackBool() {
        const b = this.unpackByte();
        if (b === 0)
            return false;
        if (b === 1)
            return true;
        this.error = errBadBool;
        return false;
    }
    packFixedBytes(bytes) {
        this.expand(bytes.length);
        if (this.error)
            return;
        this.buffer.set(bytes, this.offset);
        this.offset += bytes.length;
    }
    unpackFixedBytes(size) {
        this.checkSpace(size);
        if (this.error)
            return new Uint8Array();
        const bytes = this.buffer.slice(this.offset, this.offset + size);
        this.offset += size;
        return bytes;
    }
    packBytes(bytes) {
        this.packInt(bytes.length);
        this.packFixedBytes(bytes);
    }
    unpackBytes() {
        const size = this.unpackInt();
        return this.unpackFixedBytes(size);
    }
    unpackLimitedBytes(limit) {
        const size = this.unpackInt();
        if (size > limit) {
            this.error = errOversized;
            return new Uint8Array();
        }
        return this.unpackFixedBytes(size);
    }
    packStr(value) {
        const strBytes = new TextEncoder().encode(value);
        if (strBytes.length > consts_1.MaxStringLen) {
            this.error = errInvalidInput;
            return;
        }
        this.packShort(strBytes.length);
        this.packFixedBytes(strBytes);
    }
    unpackStr() {
        const length = this.unpackShort();
        return new TextDecoder().decode(this.unpackFixedBytes(length));
    }
    unpackLimitedStr(limit) {
        const length = this.unpackShort();
        if (length > limit) {
            this.error = errOversized;
            return '';
        }
        return new TextDecoder().decode(this.unpackFixedBytes(length));
    }
    packID(id) {
        this.packFixedBytes(id.toBytes());
    }
    unpackID(required) {
        const id = this.unpackFixedBytes(consts_1.ID_LEN);
        if (required && (0, utils_1.bufferEquals)(id, consts_1.EMPTY_ID.toBytes())) {
            this.addError(new Error('Id field is not populated'));
        }
        return avalanchejs_1.Id.fromBytes(id)[0];
    }
    packUint64(value) {
        this.packLong(value);
    }
    unpackUint64(required) {
        const value = this.unpackLong();
        if (required && value === 0n) {
            this.addError(new Error('Uint64 field is not populated'));
        }
        return value;
    }
    packInt64(value) {
        this.packLong(value);
    }
    unpackInt64(required) {
        const value = this.unpackLong();
        if (required && value === 0n) {
            this.addError(new Error('Int64 field is not populated'));
        }
        return value;
    }
    packString(value) {
        this.packStr(value);
    }
    unpackString(required) {
        const value = this.unpackStr();
        if (required && value === '') {
            this.addError(new Error('String field is not populated'));
        }
        return value;
    }
    packAddress(address) {
        this.packFixedBytes(address.toBytes());
    }
    unpackAddress() {
        const address = this.unpackFixedBytes(consts_1.ADDRESS_LEN);
        if ((0, utils_1.bufferEquals)(address, consts_1.EMPTY_ADDRESS.toBytes())) {
            this.addError(new Error('Address field is not populated'));
        }
        return address_1.Address.fromBytes(address)[0];
    }
    toBytes() {
        return this.buffer.slice(0, this.offset);
    }
    getOffset() {
        return this.offset;
    }
    hasError() {
        return this.error !== null;
    }
    getError() {
        return this.error;
    }
    addError(err) {
        if (!this.error) {
            this.error = err;
        }
    }
    empty() {
        return this.offset === this.buffer.length;
    }
}
exports.Codec = Codec;
//# sourceMappingURL=codec.js.map