// transaction.ts

import { Id } from "@avalabs/avalanchejs";
import { Codec } from "../utils/codec";
import { BLS, BlsAuthSize } from "../auth/bls";
import { Auth, AuthFactory } from "../auth/auth";
import { BaseTx, BaseTxSize } from "./baseTx";
import { Action } from "../actions/action";
import { BYTE_LEN, NETWORK_SIZE_LIMIT, UINT8_LEN } from "../constants/consts";
import { BLS_ID, TRANSFER_ID } from "../constants/nuklaivm";
import { Transfer, TransferTxSize } from "../actions/transfer";

export class Transaction {
  public base: BaseTx;
  public actions: Action[];
  public auth?: Auth;

  private bytes: Uint8Array = new Uint8Array();

  constructor(base: BaseTx, actions: Action[]) {
    this.base = base;
    this.actions = actions;
  }

  calculateDigest(): Uint8Array {
    const codec = Codec.newWriter(this.size(), NETWORK_SIZE_LIMIT);
    codec.addFixedBytes(BaseTxSize, this.base.toBytes());
    codec.addByte(this.actions.length);
    this.actions.forEach((action) => {
      const actionTypeId = action.getTypeId();
      codec.addByte(actionTypeId);
      let actionSize = 0;
      if (actionTypeId === TRANSFER_ID) {
        actionSize = TransferTxSize;
      } else {
        throw new Error(`Invalid action type: ${actionTypeId}`);
      }
      codec.addFixedBytes(actionSize, action.toBytes());
    });

    return codec.toBytes();
  }

  sign(factory: AuthFactory): Transaction {
    const msg = this.calculateDigest();
    this.auth = factory.sign(msg);
    this.bytes = this.toBytes();
    return this;
  }

  toBytes(): Uint8Array {
    if (this.bytes.length > 0) {
      return this.bytes;
    }

    const codec = Codec.newWriter(this.size(), NETWORK_SIZE_LIMIT);
    codec.addFixedBytes(BaseTxSize, this.base.toBytes());
    codec.addByte(this.actions.length);
    this.actions.forEach((action) => {
      const actionTypeId = action.getTypeId();
      codec.addByte(actionTypeId);
      let actionSize = 0;
      if (actionTypeId === TRANSFER_ID) {
        actionSize = TransferTxSize;
      } else {
        throw new Error(`Invalid action type: ${actionTypeId}`);
      }
      codec.addFixedBytes(actionSize, action.toBytes());
    });
    if (this.auth) {
      const authTypeId = this.auth.getTypeId();
      codec.addByte(authTypeId);
      let authSize = 0;
      if (authTypeId === BLS_ID) {
        authSize = BlsAuthSize;
      } else {
        throw new Error(`Invalid auth type: ${authTypeId}`);
      }
      codec.addFixedBytes(authSize, this.auth.toBytes());
    }

    return codec.toBytes();
  }

  static fromBytes(bytes: Uint8Array): Transaction {
    const codec = Codec.newReader(bytes, bytes.length);
    const baseBytes = codec.getFixedBytes(BaseTxSize);
    const base = BaseTx.fromBytes(baseBytes);

    let currentSize = BaseTxSize;

    const numActions = codec.getByte();
    currentSize += BYTE_LEN;
    if (numActions === 0) {
      throw new Error("no actions");
    }
    const actions: Action[] = [];
    for (let i = 0; i < numActions; i++) {
      const actionTypeId = codec.getByte();
      currentSize += BYTE_LEN;
      if (actionTypeId === TRANSFER_ID) {
        const actionBytes = codec.getFixedBytes(TransferTxSize);
        const action = Transfer.fromBytes(actionBytes);
        actions.push(action);
        currentSize += TransferTxSize;
      } else {
        throw new Error(`Invalid action type: ${actionTypeId}`);
      }
    }

    const transaction = new Transaction(base, actions);
    // First check to ensure auth is also part of transactino
    if (bytes.length > currentSize) {
      const authTypeId = codec.getByte();
      let auth: Auth;
      if (authTypeId === BLS_ID) {
        const authBytes = codec.getFixedBytes(BlsAuthSize);
        auth = BLS.fromBytes(authBytes);
      } else {
        throw new Error(`Invalid auth type: ${authTypeId}`);
      }
      transaction.auth = auth;
    }

    transaction.bytes = codec.toBytes();
    return transaction;
  }

  id(): Id {
    const [id] = Id.fromBytes(this.bytes);
    return id;
  }

  size(): number {
    let size = BaseTxSize + BYTE_LEN;
    this.actions.forEach((action) => {
      const actionTypeId = action.getTypeId();
      let actionSize = 0;
      if (actionTypeId === TRANSFER_ID) {
        actionSize = TransferTxSize;
      } else {
        throw new Error(`Invalid action type: ${actionTypeId}`);
      }
      size += BYTE_LEN + actionSize; // for typeid + action
    });
    if (this.auth) {
      const authTypeId = this.auth.getTypeId();
      let authSize = 0;
      if (authTypeId === BLS_ID) {
        authSize = BlsAuthSize;
      } else {
        throw new Error(`Invalid auth type: ${authTypeId}`);
      }
      size += BYTE_LEN + authSize; // for typeid + auth
    }
    return size;
  }
}
