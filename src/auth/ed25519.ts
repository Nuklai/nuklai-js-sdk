// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { utils } from '@avalabs/avalanchejs'
import { getPublicKey } from '@noble/ed25519'
import { randomBytes } from '@noble/hashes/utils'
import { EMPTY_ADDRESS } from '../constants/consts'
import { ED25519_COMPUTE_UNITS, ED25519_ID, HRP } from '../constants/nuklaivm'
import {
  PUBLIC_KEY_LENGTH,
  PublicKey,
  SIGNATURE_LENGTH,
  SecretKey,
  Signature,
  sign,
  verify
} from '../crypto/ed25519'
import { Address } from '../utils/address'
import { Codec } from '../utils/codec'
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

  static publicKeyToHex(publicKey: PublicKey): string {
    return Buffer.from(publicKey).toString('hex')
  }

  static hexToPublicKey(hex: string): PublicKey {
    return Buffer.from(hex, 'hex')
  }

  static formatAddress(address: Uint8Array): string {
    return utils.formatBech32(HRP, address)
  }

  static parseAddress(address: string): Uint8Array {
    return utils.parseBech32(address)[1]
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
    return PUBLIC_KEY_LENGTH + SIGNATURE_LENGTH
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
    return Buffer.from(hex, 'hex')
  }
}
