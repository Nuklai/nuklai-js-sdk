"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_DECIMALS = exports.MAX_METADATA_SIZE = exports.MAX_MEMO_SIZE = exports.MAX_SYMBOL_SIZE = exports.DELEGATE_USER_STAKE_CHUNKS = exports.REGISTER_VALIDATOR_STAKE_CHUNKS = exports.STORAGE_ASSET_CHUNKS = exports.STORAGE_BALANCE_CHUNKS = exports.MINTASSET_COMPUTE_UNITS = exports.CREATEASSET_COMPUTE_UNITS = exports.TRANSFER_COMPUTE_UNITS = exports.MINTASSET_ID = exports.CREATEASSET_ID = exports.TRANSFER_ID = exports.BLS_COMPUTE_UNITS = exports.SECP256R1_COMPUTE_UNITS = exports.ED25519_COMPUTE_UNITS = exports.BLS_ID = exports.SECP256R1_ID = exports.ED25519_ID = exports.DECIMALS = exports.SYMBOL = exports.HRP = void 0;
exports.HRP = 'nuklai';
exports.SYMBOL = 'NAI';
exports.DECIMALS = 9;
// Auth TypeIDs
exports.ED25519_ID = 0;
exports.SECP256R1_ID = 1;
exports.BLS_ID = 2;
// Auth Units
exports.ED25519_COMPUTE_UNITS = 5;
exports.SECP256R1_COMPUTE_UNITS = 10;
exports.BLS_COMPUTE_UNITS = 10;
// Action TypeIDs
exports.TRANSFER_ID = 0;
exports.CREATEASSET_ID = 1;
exports.MINTASSET_ID = 2;
// Action Units
exports.TRANSFER_COMPUTE_UNITS = 1;
exports.CREATEASSET_COMPUTE_UNITS = 5;
exports.MINTASSET_COMPUTE_UNITS = 5;
// Storage Chunks
exports.STORAGE_BALANCE_CHUNKS = 1;
exports.STORAGE_ASSET_CHUNKS = 5;
exports.REGISTER_VALIDATOR_STAKE_CHUNKS = 5;
exports.DELEGATE_USER_STAKE_CHUNKS = 3;
exports.MAX_SYMBOL_SIZE = 8;
exports.MAX_MEMO_SIZE = 256;
exports.MAX_METADATA_SIZE = 256;
exports.MAX_DECIMALS = 9;
//# sourceMappingURL=nuklaivm.js.map