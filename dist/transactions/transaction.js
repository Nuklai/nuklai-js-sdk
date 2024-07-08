"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const avalanchejs_1 = require("@avalabs/avalanchejs");
const createAsset_1 = require("../actions/createAsset");
const mintAsset_1 = require("../actions/mintAsset");
const transfer_1 = require("../actions/transfer");
const bls_1 = require("../auth/bls");
const ed25519_1 = require("../auth/ed25519");
const consts_1 = require("../constants/consts");
const nuklaivm_1 = require("../constants/nuklaivm");
const codec_1 = require("../utils/codec");
const hashing_1 = require("../utils/hashing");
const baseTx_1 = require("./baseTx");
class Transaction {
    constructor(base, actions) {
        this.bytes = new Uint8Array();
        this.base = base;
        this.actions = actions;
    }
    calculateDigest() {
        const codec = codec_1.Codec.newWriter(this.size(), consts_1.NETWORK_SIZE_LIMIT);
        codec.packFixedBytes(this.base.toBytes());
        codec.packByte(this.actions.length);
        this.actions.forEach((action) => {
            const actionTypeId = action.getTypeId();
            codec.packByte(actionTypeId);
            codec.packFixedBytes(action.toBytes());
        });
        return [codec.toBytes(), codec.getError()];
    }
    sign(factory) {
        let [msg, err] = this.calculateDigest();
        if (err) {
            return [this, err];
        }
        this.auth = factory.sign(msg);
        [this.bytes, err] = this.toBytes();
        if (err) {
            return [this, err];
        }
        return Transaction.fromBytes(this.bytes);
    }
    toBytes() {
        if (this.bytes.length > 0) {
            return [this.bytes, undefined];
        }
        const codec = codec_1.Codec.newWriter(this.size(), consts_1.NETWORK_SIZE_LIMIT);
        // Pack the base transaction
        const baseBytes = this.base.toBytes();
        codec.packFixedBytes(baseBytes);
        // Pack the number of actions
        const numActions = this.actions.length;
        codec.packByte(numActions);
        // Pack each action
        this.actions.forEach((action) => {
            const actionTypeId = action.getTypeId();
            codec.packByte(actionTypeId);
            const actionBytes = action.toBytes();
            codec.packFixedBytes(actionBytes);
        });
        // Pack the auth if present
        if (this.auth) {
            const authTypeId = this.auth.getTypeId();
            codec.packByte(authTypeId);
            const authBytes = this.auth.toBytes();
            codec.packFixedBytes(authBytes);
        }
        return [codec.toBytes(), codec.getError()];
    }
    static fromBytes(bytes) {
        let codec = codec_1.Codec.newReader(bytes, bytes.length);
        // Unpack the base transaction
        const baseBytes = codec.unpackFixedBytes(baseTx_1.BaseTxSize);
        let [base, err] = baseTx_1.BaseTx.fromBytes(baseBytes);
        if (err) {
            return [
                new Transaction(base, []),
                new Error(`Failed to unpack base transaction: ${err}`)
            ];
        }
        // Unpack the number of actions
        const numActions = codec.unpackByte();
        if (numActions === 0) {
            return [
                new Transaction(base, []),
                new Error('Transaction must have at least one action')
            ];
        }
        // Unpack each action
        const actions = [];
        for (let i = 0; i < numActions; i++) {
            const actionTypeId = codec.unpackByte();
            let action;
            let codecAction;
            if (actionTypeId === nuklaivm_1.TRANSFER_ID) {
                const [actionTransfer, codecActionTransfer] = transfer_1.Transfer.fromBytesCodec(codec);
                if (codecActionTransfer.getError()) {
                    return [
                        new Transaction(base, []),
                        new Error(`Failed to unpack transfer action: ${err}`)
                    ];
                }
                codecAction = codecActionTransfer;
                action = actionTransfer;
            }
            else if (actionTypeId === nuklaivm_1.CREATEASSET_ID) {
                const [actionCreateAsset, codecActionCreateAsset] = createAsset_1.CreateAsset.fromBytesCodec(codec);
                if (codecActionCreateAsset.getError()) {
                    return [
                        new Transaction(base, []),
                        new Error(`Failed to unpack create asset action: ${err}`)
                    ];
                }
                codecAction = codecActionCreateAsset;
                action = actionCreateAsset;
            }
            else if (actionTypeId === nuklaivm_1.MINTASSET_ID) {
                const [actionMintAsset, codecActionMintAsset] = mintAsset_1.MintAsset.fromBytesCodec(codec);
                if (codecActionMintAsset.getError()) {
                    return [
                        new Transaction(base, []),
                        new Error(`Failed to unpack mint asset action: ${err}`)
                    ];
                }
                codecAction = codecActionMintAsset;
                action = actionMintAsset;
            }
            else {
                return [
                    new Transaction(base, []),
                    new Error(`Invalid action type: ${actionTypeId}`)
                ];
            }
            codec = codecAction;
            actions.push(action);
        }
        const transaction = new Transaction(base, actions);
        // Check if there are additional bytes for auth
        if (codec.getOffset() < bytes.length) {
            const authTypeId = codec.unpackByte();
            let auth;
            if (authTypeId === nuklaivm_1.BLS_ID) {
                const authBytes = codec.unpackFixedBytes(bls_1.BlsAuthSize);
                [auth, err] = bls_1.BLS.fromBytes(authBytes);
                if (err) {
                    return [transaction, new Error(`Failed to unpack BLS auth: ${err}`)];
                }
            }
            else if (authTypeId === nuklaivm_1.ED25519_ID) {
                const authBytes = codec.unpackFixedBytes(ed25519_1.Ed25519AuthSize);
                [auth, err] = ed25519_1.ED25519.fromBytes(authBytes);
                if (err) {
                    return [
                        transaction,
                        new Error(`Failed to unpack ED25519 auth: ${err}`)
                    ];
                }
            }
            else {
                return [transaction, new Error(`Invalid auth type: ${authTypeId}`)];
            }
            transaction.auth = auth;
        }
        transaction.bytes = bytes;
        return [transaction, codec.getError()];
    }
    id() {
        return avalanchejs_1.Id.fromBytes((0, hashing_1.ToID)(this.bytes))[0];
    }
    size() {
        let size = this.base.size() + consts_1.BYTE_LEN; // BaseTx size + number of actions byte
        this.actions.forEach((action) => {
            const actionSize = consts_1.BYTE_LEN + action.size(); // Action type byte + action size
            size += actionSize;
        });
        if (this.auth) {
            const authSize = consts_1.BYTE_LEN + this.auth.size(); // Auth type byte + auth size
            size += authSize;
        }
        return size;
    }
}
exports.Transaction = Transaction;
//# sourceMappingURL=transaction.js.map