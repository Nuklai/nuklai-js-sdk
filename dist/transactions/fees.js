"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mulSum = mulSum;
exports.estimateUnits = estimateUnits;
const big_integer_1 = __importDefault(require("big-integer"));
const baseTx_1 = require("./baseTx");
const consts_1 = require("../constants/consts");
const nuklaivm_1 = require("../constants/nuklaivm");
const FeeDimensions = 5;
function mul64(a, b) {
    return BigInt(a) * BigInt(b);
}
function add64(a, b) {
    return a + b;
}
function mulSum(a, b) {
    let val = 0n;
    for (let i = 0; i < FeeDimensions; i++) {
        try {
            const v = mul64(a[i], b[i]);
            val = add64(val, v);
        }
        catch (err) {
            return [0n, err];
        }
    }
    return [val];
}
function estimateUnits(genesisInfo, actions, authFactory) {
    let bandwidth = baseTx_1.BaseTxSize;
    let stateKeysMaxChunks = [];
    let computeOp = (0, big_integer_1.default)(genesisInfo.baseUnits);
    let readsOp = (0, big_integer_1.default)(0);
    let allocatesOp = (0, big_integer_1.default)(0);
    let writesOp = (0, big_integer_1.default)(0);
    // Calculate over action/auth
    bandwidth += consts_1.UINT8_LEN;
    actions.forEach((action) => {
        bandwidth += consts_1.BYTE_LEN + action.size();
        const actionStateKeysMaxChunks = action.stateKeysMaxChunks();
        stateKeysMaxChunks = [...stateKeysMaxChunks, ...actionStateKeysMaxChunks];
        computeOp = computeOp.add(action.computeUnits());
    });
    bandwidth += consts_1.BYTE_LEN + authFactory.bandwidth();
    const sponsorStateKeyMaxChunks = [nuklaivm_1.STORAGE_BALANCE_CHUNKS];
    stateKeysMaxChunks = [...stateKeysMaxChunks, ...sponsorStateKeyMaxChunks];
    computeOp = computeOp.add(authFactory.computeUnits());
    // Estimate compute costs
    const compute = computeOp.valueOf();
    // Estimate storage costs
    for (const maxChunks of stateKeysMaxChunks) {
        // Compute key costs
        readsOp = readsOp.add(genesisInfo.storageKeyReadUnits);
        allocatesOp = allocatesOp.add(genesisInfo.storageKeyAllocateUnits);
        writesOp = writesOp.add(genesisInfo.storageKeyWriteUnits);
        // Compute value costs
        readsOp = readsOp.add((0, big_integer_1.default)(maxChunks).multiply((0, big_integer_1.default)(genesisInfo.storageValueReadUnits)));
        allocatesOp = allocatesOp.add((0, big_integer_1.default)(maxChunks).multiply((0, big_integer_1.default)(genesisInfo.storageValueAllocateUnits)));
        writesOp = writesOp.add((0, big_integer_1.default)(maxChunks).multiply((0, big_integer_1.default)(genesisInfo.storageValueWriteUnits)));
    }
    const reads = readsOp.valueOf();
    const allocates = allocatesOp.valueOf();
    const writes = writesOp.valueOf();
    return [bandwidth, compute, reads, allocates, writes];
}
//# sourceMappingURL=fees.js.map