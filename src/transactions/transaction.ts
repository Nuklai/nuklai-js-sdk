// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Id } from '@avalabs/avalanchejs'
import { ED25519, Ed25519AuthSize } from 'auth/ed25519'
import { Action } from '../actions/action'
import { CreateAsset } from '../actions/createAsset'
import { Transfer } from '../actions/transfer'
import { Auth, AuthFactory } from '../auth/auth'
import { BLS, BlsAuthSize } from '../auth/bls'
import { BYTE_LEN, NETWORK_SIZE_LIMIT } from '../constants/consts'
import {
  BLS_ID,
  CREATEASSET_ID,
  ED25519_ID,
  TRANSFER_ID
} from '../constants/nuklaivm'
import { Codec } from '../utils/codec'
import { ToID } from '../utils/hashing'
import { BaseTx, BaseTxSize } from './baseTx'

export class Transaction {
  public base: BaseTx
  public actions: Action[]
  public auth?: Auth
  private bytes: Uint8Array = new Uint8Array()

  constructor(base: BaseTx, actions: Action[]) {
    this.base = base
    this.actions = actions
  }

  calculateDigest(): [Uint8Array, Error?] {
    const codec = Codec.newWriter(this.size(), NETWORK_SIZE_LIMIT)
    codec.packFixedBytes(this.base.toBytes())
    codec.packByte(this.actions.length)
    this.actions.forEach((action) => {
      const actionTypeId = action.getTypeId()
      codec.packByte(actionTypeId)
      codec.packFixedBytes(action.toBytes())
    })

    return [codec.toBytes(), codec.getError()]
  }

  sign(factory: AuthFactory): [Transaction, Error?] {
    let [msg, err] = this.calculateDigest()
    if (err) {
      return [this, err]
    }
    this.auth = factory.sign(msg)
    ;[this.bytes, err] = this.toBytes()
    if (err) {
      return [this, err]
    }

    return Transaction.fromBytes(this.bytes)
  }

  toBytes(): [Uint8Array, Error?] {
    if (this.bytes.length > 0) {
      return [this.bytes, undefined]
    }

    const codec = Codec.newWriter(this.size(), NETWORK_SIZE_LIMIT)

    // Pack the base transaction
    const baseBytes = this.base.toBytes()
    codec.packFixedBytes(baseBytes)

    // Pack the number of actions
    const numActions = this.actions.length
    codec.packByte(numActions)

    // Pack each action
    this.actions.forEach((action) => {
      const actionTypeId = action.getTypeId()
      codec.packByte(actionTypeId)
      const actionBytes = action.toBytes()
      codec.packFixedBytes(actionBytes)
    })

    // Pack the auth if present
    if (this.auth) {
      const authTypeId = this.auth.getTypeId()
      codec.packByte(authTypeId)
      const authBytes = this.auth.toBytes()
      codec.packFixedBytes(authBytes)
    }

    return [codec.toBytes(), codec.getError()]
  }

  static fromBytes(bytes: Uint8Array): [Transaction, Error?] {
    let codec = Codec.newReader(bytes, bytes.length)

    // Unpack the base transaction
    const baseBytes = codec.unpackFixedBytes(BaseTxSize)
    let [base, err] = BaseTx.fromBytes(baseBytes)
    if (err) {
      return [
        new Transaction(base, []),
        new Error(`Failed to unpack base transaction: ${err}`)
      ]
    }

    // Unpack the number of actions
    const numActions = codec.unpackByte()
    if (numActions === 0) {
      return [
        new Transaction(base, []),
        new Error('Transaction must have at least one action')
      ]
    }

    // Unpack each action
    const actions: Action[] = []
    for (let i = 0; i < numActions; i++) {
      const actionTypeId = codec.unpackByte()
      let action: Action
      let codecAction: Codec
      if (actionTypeId === TRANSFER_ID) {
        const [actionTransfer, codecActionTransfer] =
          Transfer.fromBytesCodec(codec)
        if (codecActionTransfer.getError()) {
          return [
            new Transaction(base, []),
            new Error(`Failed to unpack transfer action: ${err}`)
          ]
        }
        codecAction = codecActionTransfer
        action = actionTransfer
      } else if (actionTypeId === CREATEASSET_ID) {
        const [actionCreateAsset, codecActionCreateAsset] =
          CreateAsset.fromBytesCodec(codec)
        if (codecActionCreateAsset.getError()) {
          return [
            new Transaction(base, []),
            new Error(`Failed to unpack create asset action: ${err}`)
          ]
        }
        codecAction = codecActionCreateAsset
        action = actionCreateAsset
      } else {
        return [
          new Transaction(base, []),
          new Error(`Invalid action type: ${actionTypeId}`)
        ]
      }
      codec = codecAction
      actions.push(action)
    }

    const transaction = new Transaction(base, actions)
    // Check if there are additional bytes for auth
    if (codec.getOffset() < bytes.length) {
      const authTypeId = codec.unpackByte()
      let auth: Auth
      if (authTypeId === BLS_ID) {
        const authBytes = codec.unpackFixedBytes(BlsAuthSize)
        ;[auth, err] = BLS.fromBytes(authBytes)
        if (err) {
          return [transaction, new Error(`Failed to unpack BLS auth: ${err}`)]
        }
      } else if (authTypeId === ED25519_ID) {
        const authBytes = codec.unpackFixedBytes(Ed25519AuthSize)
        ;[auth, err] = ED25519.fromBytes(authBytes)
        if (err) {
          return [
            transaction,
            new Error(`Failed to unpack ED25519 auth: ${err}`)
          ]
        }
      } else {
        return [transaction, new Error(`Invalid auth type: ${authTypeId}`)]
      }
      transaction.auth = auth
    }
    transaction.bytes = bytes

    return [transaction, codec.getError()]
  }

  id(): Id {
    return Id.fromBytes(ToID(this.bytes))[0]
  }

  size(): number {
    let size = this.base.size() + BYTE_LEN // BaseTx size + number of actions byte
    this.actions.forEach((action) => {
      const actionSize = BYTE_LEN + action.size() // Action type byte + action size
      size += actionSize
    })
    if (this.auth) {
      const authSize = BYTE_LEN + this.auth.size() // Auth type byte + auth size
      size += authSize
    }
    return size
  }
}
