// src/transactions/transaction.ts

import { Id } from '@avalabs/avalanchejs'
import { Codec } from '../utils/codec'
import { Transfer } from './transfer'
import { Auth, BLSFactory } from '../auth/bls'

export class Transaction {
  public base: Base
  public actions: Transfer[]
  public auth?: Auth

  private digest?: Uint8Array
  private bytes?: Uint8Array
  private size?: number
  private id?: Id

  constructor(base: Base, actions: Transfer[]) {
    this.base = base
    this.actions = actions
  }

  async calculateDigest(): Promise<Uint8Array> {
    if (this.digest && this.digest.length > 0) return this.digest

    const codec = new Codec()
    codec.addNumber(this.base.timestamp)
    codec.addString(this.base.chainId)
    codec.addNumber(this.actions.length)
    this.actions.forEach((action) => {
      codec.addBytes(action.toBytes())
    })

    this.digest = codec.toBytes()
    return this.digest
  }

  async sign(factory: BLSFactory): Promise<Transaction> {
    const msg = await this.calculateDigest()
    this.auth = factory.sign(msg)

    const codec = new Codec()
    codec.addNumber(this.base.timestamp)
    codec.addString(this.base.chainId)
    codec.addNumber(this.actions.length)
    this.actions.forEach((action) => {
      codec.addBytes(action.toBytes())
    })
    codec.addBytes(this.auth.signature)

    this.bytes = codec.toBytes()
    this.size = this.bytes.length
    this.id = this.generateId(this.bytes)

    return this
  }

  toBytes(): Uint8Array {
    const codec = new Codec()
    codec.addNumber(this.base.timestamp)
    codec.addString(this.base.chainId)
    codec.addNumber(this.transfers.length)
    this.transfers.forEach((transfer) => {
      codec.addBytes(transfer.toBytes())
    })
    codec.addBytes(this.auth.signature)

    return codec.toBytes()
  }

  static fromBytes(bytes: Uint8Array): Transaction {
    const codec = new Codec(bytes)
    const timestamp = codec.getNumber()
    const chainId = codec.getString()
    const base = new Base(timestamp, chainId)

    const transferCount = codec.getNumber()
    const transfers: Transfer[] = []
    for (let i = 0; i < transferCount; i++) {
      const transferBytes = codec.getBytes()
      transfers.push(Transfer.fromBytes(transferBytes))
    }

    const authSignature = codec.getBytes()
    const auth: Auth = { signature: authSignature } // Adjust this part as per your actual Auth implementation

    const transaction = new Transaction(base, transfers)
    transaction.auth = auth
    transaction.bytes = bytes
    transaction.size = bytes.length
    transaction.id = transaction.generateId(bytes)

    return transaction
  }

  generateId(bytes: Uint8Array): string {
    // Implement your ID generation logic here
    return ''
  }
}

export class Base {
  timestamp: number
  chainId: string

  constructor(timestamp: number, chainId: string) {
    this.timestamp = timestamp
    this.chainId = chainId
  }

  toBytes(): Uint8Array {
    const codec = new Codec()
    codec.addNumber(this.timestamp)
    codec.addString(this.chainId)
    return codec.toBytes()
  }

  static fromBytes(bytes: Uint8Array): Base {
    const codec = new Codec(bytes)
    const timestamp = codec.getNumber()
    const chainId = codec.getString()
    return new Base(timestamp, chainId)
  }
}
