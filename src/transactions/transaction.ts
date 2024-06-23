import { Id } from "@avalabs/avalanchejs";
import { Action } from "../actions/action";
import { Transfer, TransferTxSize } from "../actions/transfer";
import { Auth, AuthFactory } from "../auth/auth";
import { BLS, BlsAuthSize } from "../auth/bls";
import { BYTE_LEN, MaxInt, NETWORK_SIZE_LIMIT } from "../constants/consts";
import { BLS_ID, TRANSFER_ID } from "../constants/nuklaivm";
import { Codec } from "../utils/codec";
import { BaseTx, BaseTxSize } from "./baseTx";

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
    codec.packBytes(this.base.toBytes());
    codec.packByte(this.actions.length);
    this.actions.forEach((action) => {
      const actionTypeId = action.getTypeId();
      codec.packByte(actionTypeId);
      codec.packBytes(action.toBytes());
    });

    return codec.toBytes();
  }

  sign(factory: AuthFactory): Transaction {
    const msg = this.calculateDigest();
    this.auth = factory.sign(msg);
    this.bytes = this.toBytes();

    const codec = Codec.newReader(this.bytes, this.bytes.length);
    codec.unpackFixedBytes(this.bytes.length);
    return Transaction.fromBytes(codec.toBytes());
  }

  toBytes(): Uint8Array {
    const codec = Codec.newWriter(this.size(), NETWORK_SIZE_LIMIT);

    // Pack the base transaction
    const baseBytes = this.base.toBytes();
    codec.packBytes(baseBytes);

    // Pack the number of actions
    const numActions = this.actions.length;
    codec.packByte(numActions);

    // Pack each action
    this.actions.forEach((action) => {
      const actionTypeId = action.getTypeId();
      codec.packByte(actionTypeId);
      const actionBytes = action.toBytes();
      codec.packBytes(actionBytes);
    });

    // Pack the auth if present
    if (this.auth) {
      const authTypeId = this.auth.getTypeId();
      codec.packByte(authTypeId);
      const authBytes = this.auth.toBytes();
      codec.packBytes(authBytes);
    }

    // Get the final byte array
    const finalBytes = codec.toBytes();
    return finalBytes;
  }

  static fromBytes(bytes: Uint8Array): Transaction {
    const codec = Codec.newReader(bytes, bytes.length);

    // Unpack the base transaction
    const baseBytes = codec.unpackBytes();
    const base = BaseTx.fromBytes(baseBytes);

    // Unpack the number of actions
    const numActions = codec.unpackByte();
    if (numActions === 0) {
      throw new Error("No actions found");
    }

    // Unpack each action
    const actions: Action[] = [];
    for (let i = 0; i < numActions; i++) {
      const actionTypeId = codec.unpackByte();
      if (actionTypeId === TRANSFER_ID) {
        const actionBytes = codec.unpackBytes();
        const action = Transfer.fromBytes(actionBytes);
        actions.push(action);
      } else {
        throw new Error(`Invalid action type: ${actionTypeId}`);
      }
    }

    const transaction = new Transaction(base, actions);

    // Check if there are additional bytes for auth
    if (codec.getOffset() < bytes.length) {
      const authTypeId = codec.unpackByte();
      let auth: Auth;
      if (authTypeId === BLS_ID) {
        const authBytes = codec.unpackBytes();
        auth = BLS.fromBytes(authBytes);
      } else {
        throw new Error(`Invalid auth type: ${authTypeId}`);
      }
      transaction.auth = auth;
    }

    transaction.bytes = bytes;
    return transaction;
  }

  id(): Id {
    const [id] = Id.fromBytes(this.bytes);
    return id;
  }

  size(): number {
    let size = BaseTxSize + BYTE_LEN; // BaseTx size + number of actions byte
    this.actions.forEach((action) => {
      const actionSize = BYTE_LEN + action.size(); // Action type byte + action size
      size += actionSize;
    });
    if (this.auth) {
      const authSize = BYTE_LEN + this.auth.size(); // Auth type byte + auth size
      size += authSize;
    }
    return size;
  }
}
