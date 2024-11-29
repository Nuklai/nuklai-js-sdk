// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { getPublicKey } from '@noble/ed25519'
import { randomBytes } from '@noble/hashes/utils'
import { Buffer } from 'buffer'
import _ from 'lodash'
import { Codec } from '../codec/codec'
import { EMPTY_ADDRESS } from '../constants/consts'
import { ED25519_COMPUTE_UNITS, ED25519_ID } from '../constants/hypervm'
import {
  PRIVATE_KEY_LENGTH,
  PUBLIC_KEY_LENGTH,
  PublicKey,
  SIGNATURE_LENGTH,
  SecretKey,
  Signature,
  sign,
  verify
} from '../crypto/ed25519'
import { Address } from '../utils/address'
import { loadHex, toHex } from '../utils/hex'
import { bufferEquals } from '../utils/utils'
import { Auth, AuthFactory } from './auth'

export const Ed25519AuthSize = PUBLIC_KEY_LENGTH + SIGNATURE_LENGTH

export class ED25519 implements Auth {
  public signer: PublicKey
  public signature: Signature
  private addr: Address = EMPTY_ADDRESS

  constructor(signer: PublicKey, signature: Signature) {
    this.signer = signer
    this.signature = signature
  }

  address(): Address {
    if (bufferEquals(this.addr.toBytes(), EMPTY_ADDRESS.toBytes())) {
      this.addr = Address.newAddress(ED25519_ID, this.signer)
    }
    return this.addr
  }

  getTypeId(): number {
    return ED25519_ID
  }

  async verify(message: Uint8Array): Promise<boolean> {
    return verify(this.signer, this.signature, message)
  }

  actor(): Address {
    return this.address()
  }

  sponsor(): Address {
    return this.address()
  }

  size(): number {
    return Ed25519AuthSize
  }

  toJSON(): object {
    return {
      signer: ED25519.publicKeyToHex(this.signer),
      signature: Buffer.from(this.signature).toString('hex'),
      addr: this.address().toString()
    }
  }

  toString(): string {
    return JSON.stringify(this.toJSON())
  }

  toBytes(): Uint8Array {
    const size = this.size()
    const codec = Codec.newWriter(size, size)
    codec.packFixedBytes(this.signer)
    codec.packFixedBytes(this.signature)
    return codec.toBytes()
  }

  static fromBytes(bytes: Uint8Array): [ED25519, Error?] {
    const codec = Codec.newReader(bytes, bytes.length)
    const signer = codec.unpackFixedBytes(PUBLIC_KEY_LENGTH)
    const signature = codec.unpackFixedBytes(SIGNATURE_LENGTH)
    return [new ED25519(signer, signature), codec.getError()]
  }

  static fromBytesCodec(c: Codec): [ED25519, Codec] {
    const codec = _.cloneDeep(c)
    const signer = codec.unpackFixedBytes(PUBLIC_KEY_LENGTH)
    const signature = codec.unpackFixedBytes(SIGNATURE_LENGTH)
    return [new ED25519(signer, signature), codec]
  }

  static publicKeyToHex(publicKey: PublicKey): string {
    return Buffer.from(publicKey).toString('hex')
  }

  static hexToPublicKey(hex: string): PublicKey {
    return Buffer.from(hex, 'hex')
  }
}

export class ED25519Factory implements AuthFactory {
  privateKey: SecretKey

  constructor(privateKey?: SecretKey) {
    let privKey = randomBytes(32) // 32 bytes for a private key
    if (privateKey) {
      privKey = privateKey
    }
    this.privateKey = privKey
  }

  sign(message: Uint8Array): Auth {
    const publicKey = getPublicKey(this.privateKey)
    const signature = sign(message, this.privateKey)
    return new ED25519(publicKey, signature)
  }

  computeUnits(): number {
    return ED25519_COMPUTE_UNITS
  }

  bandwidth(): number {
    return Ed25519AuthSize
  }

  static generateKeyPair(): {
    privateKey: SecretKey
    publicKey: PublicKey
  } {
    const privateKey = new ED25519Factory().privateKey
    const publicKey = getPublicKey(privateKey)
    return { privateKey, publicKey }
  }

  static publicKeyFromPrivateKey(privateKey: SecretKey): PublicKey {
    return getPublicKey(privateKey)
  }

  static privateKeyToHex(privateKey: SecretKey): string {
    return Buffer.from(privateKey).toString('hex')
  }

  static hexToPrivateKey(hex: string): SecretKey {
    let privateKeyBytes = Buffer.from(hex, 'hex')
    if (privateKeyBytes.length === PRIVATE_KEY_LENGTH + PUBLIC_KEY_LENGTH) {
      privateKeyBytes = privateKeyBytes.subarray(0, PRIVATE_KEY_LENGTH)
      return loadHex(toHex(privateKeyBytes), PRIVATE_KEY_LENGTH)
    } else if (privateKeyBytes.length !== PRIVATE_KEY_LENGTH) {
      throw new Error('Invalid combined key size')
    }
    return loadHex(hex, PRIVATE_KEY_LENGTH)
  }
    static publicKeyToHex(publicKey: PublicKey): string {
    return Buffer.from(publicKey).toString('hex');
  }
}