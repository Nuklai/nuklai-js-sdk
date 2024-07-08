"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxStringLen = exports.MillisecondsPerSecond = exports.MaxUint64 = exports.MaxUint64Offset = exports.MaxInt = exports.MaxUint = exports.MaxUint8Offset = exports.MaxUint16 = exports.MaxUint8 = exports.NETWORK_SIZE_LIMIT = exports.EMPTY_ADDRESS = exports.EMPTY_ID = exports.ADDRESS_LEN = exports.ID_LEN = exports.LONG_LEN = exports.INT64_LEN = exports.UINT64_LEN = exports.UINT32_LEN = exports.INT_LEN = exports.UINT16_LEN = exports.UINT8_LEN = exports.SHORT_LEN = exports.BYTE_LEN = exports.BOOL_LEN = void 0;
const avalanchejs_1 = require("@avalabs/avalanchejs");
const address_1 = require("../utils/address");
exports.BOOL_LEN = 1;
exports.BYTE_LEN = 1;
exports.SHORT_LEN = 1;
exports.UINT8_LEN = 1;
exports.UINT16_LEN = 2;
exports.INT_LEN = 4;
exports.UINT32_LEN = 4;
exports.UINT64_LEN = 8;
exports.INT64_LEN = 8;
exports.LONG_LEN = 8;
exports.ID_LEN = 32;
exports.ADDRESS_LEN = 33;
exports.EMPTY_ID = new avalanchejs_1.Id(new Uint8Array(exports.ID_LEN));
exports.EMPTY_ADDRESS = new address_1.Address(new Uint8Array(exports.ADDRESS_LEN));
// AvalancheGo imposes a limit of 2 MiB on the network, so we limit at
// 2 MiB - ProposerVM header - Protobuf encoding overhead (we assume this is
// no more than 50 KiB of overhead but is likely much less)
exports.NETWORK_SIZE_LIMIT = 2044723; // 1.95 MiB
exports.MaxUint8 = 0xff; // 255
exports.MaxUint16 = 0xffff; // 65535
exports.MaxUint8Offset = 7;
exports.MaxUint = Number.MAX_SAFE_INTEGER; // 9007199254740991 (Note: JavaScript does not have a direct equivalent for 64-bit unsigned integers)
exports.MaxInt = Math.floor(exports.MaxUint / 2); // 4503599627370495
exports.MaxUint64Offset = 63;
exports.MaxUint64 = BigInt('0xFFFFFFFFFFFFFFFF'); // 18446744073709551615n
exports.MillisecondsPerSecond = BigInt(1000);
exports.MaxStringLen = 65535; // math.MaxUint16 in Go
//# sourceMappingURL=consts.js.map