import { Id } from "@avalabs/avalanchejs";
import { Codec } from "../utils/codec";
import { BLS, BLSFactory } from "../auth/bls";
import { Auth, AuthFactory } from "auth/auth";
import { BaseTx } from "./baseTx";
import { Action } from "actions/action";
import {
  BYTE_LEN,
  MaxInt,
  MaxUint,
  NETWORK_SIZE_LIMIT,
  UINT8_LEN
} from "constants/consts";
import {
  BLS_ID,
  CREATEASSET_ID,
  MINTASSET_ID,
  TRANSFER_ID
} from "constants/nuklaivm";
import { Transfer } from "actions/transfer";

export class Transaction {
  public base: BaseTx;
  public actions: Action[];
  public auth?: Auth;

  private digest?: Uint8Array;
  private bytes?: Uint8Array;
  private size?: number;
  private id?: Id;

  constructor(base: BaseTx, actions: Action[]) {
    this.base = base;
    this.actions = actions;
  }

  calculateDigest(): Uint8Array {
    if (this.digest && this.digest.length > 0) return this.digest;

    let size = this.base.size() + UINT8_LEN;
    this.actions.forEach((action) => {
      size += BYTE_LEN + action.size();
    });

    const codec = Codec.newWriter(size, NETWORK_SIZE_LIMIT);
    codec.addBytes(this.base.toBytes());
    codec.addByte(this.actions.length);
    this.actions.forEach((action) => {
      codec.addByte(action.getTypeId());
      codec.addBytes(action.toBytes());
    });

    this.digest = codec.toBytes();
    return this.digest;
  }

  sign(factory: AuthFactory): Transaction {
    const msg = this.calculateDigest();
    this.auth = factory.sign(msg);

    let size = msg.length + BYTE_LEN + this.auth!!.size();
    let codec = Codec.newWriter(size, NETWORK_SIZE_LIMIT);
    codec.addBytes(this.toBytes());

    this.bytes = codec.toBytes();
    this.size = this.bytes.length;
    this.id = this.generateId(this.bytes);

    codec = Codec.newReader(codec.toBytes(), MaxInt);
    return Transaction.fromBytes(codec.toBytes());
  }

  toBytes(): Uint8Array {
    if (this.bytes && this.size && this.bytes.length > 0) {
      const codec = Codec.newWriter(this.size, NETWORK_SIZE_LIMIT);
      codec.addFixedBytes(this.bytes);
      return codec.toBytes();
    }
    const codec = new Codec();
    codec.addBytes(this.base.toBytes());
    codec.addByte(this.actions.length);
    this.actions.forEach((action) => {
      codec.addByte(action.getTypeId());
      codec.addBytes(action.toBytes());
    });
    if (this.auth) {
      codec.addByte(this.auth.getTypeId());
      codec.addBytes(this.auth.toBytes());
    }
    return codec.toBytes();
  }

  static fromBytes(bytes: Uint8Array): Transaction {
    const codec = Codec.newReader(bytes, bytes.length);
    const start = codec.getOffset();

    const base = BaseTx.fromBytes(codec.getBytes());

    const numActions = codec.getNumber();
    if (numActions === 0) {
      throw new Error("no actions");
    }
    const actions: Action[] = [];
    for (let i = 0; i < numActions; i++) {
      const actionTypeId = codec.getByte();
      if (actionTypeId === TRANSFER_ID) {
        actions.push(Transfer.fromBytes(codec.getBytes()));
      } else {
        throw new Error(`Invalid action type: ${actionTypeId}`);
      }
    }
    const digest = codec.getOffset();

    let auth: Auth;
    const authTypeId = codec.getByte();
    if (authTypeId === BLS_ID) {
      auth = BLS.fromBytes(codec.getBytes());
    } else {
      throw new Error(`Invalid auth type: ${authTypeId}`);
    }

    const actorType = auth.actor()[0];
    if (actorType !== authTypeId) {
      throw new Error(
        `actorType ${actorType} did not match authType ${authTypeId}`
      );
    }

    const sponsorType = auth.sponsor()[0];
    if (sponsorType !== authTypeId) {
      throw new Error(
        `sponsorType ${sponsorType} did not match authType ${authTypeId}`
      );
    }

    const transaction = new Transaction(base, actions);
    transaction.auth = auth;
    const codecBytes = codec.toBytes();
    transaction.digest = codecBytes.slice(start, digest);
    transaction.bytes = codecBytes.slice(start, codec.getOffset());
    transaction.size = bytes.length;
    transaction.id = transaction.generateId(transaction.bytes);

    return transaction;
  }

  generateId(bytes: Uint8Array): Id {
    const [id, _] = Id.fromBytes(bytes);
    return id;
  }

  getId(): string {
    return this.id?.toString() || "";
  }
}
