// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { bls, utils } from '@avalabs/avalanchejs'
import { bls12_381 } from '@noble/curves/bls12-381'
import { randomBytes } from '@noble/hashes/utils'
import { EMPTY_ADDRESS } from '../constants/consts'
import { BLS_COMPUTE_UNITS, BLS_ID, HRP } from '../constants/nuklaivm'
import { Address } from '../utils/address'
import { Codec } from '../utils/codec'
import { bufferEquals } from '../utils/utils'
import { Auth, AuthFactory } from './auth'

export const BlsAuthSize = bls.PUBLIC_KEY_LENGTH + bls.SIGNATURE_LENGTH

export class BLS implements Auth {
  public signer: bls.PublicKey
  public signature: bls.Signature
  private addr: Address = EMPTY_ADDRESS

  constructor(signer: bls.PublicKey, signature: bls.Signature) {
    this.signer = signer
    this.signature = signature
  }

  address(): Address {
    if (bufferEquals(this.addr.toBytes(), EMPTY_ADDRESS.toBytes())) {
      this.addr = Address.newAddress(BLS_ID, bls.publicKeyToBytes(this.signer))
    }
    return this.addr
  }

  getTypeId(): number {
    return BLS_ID
  }

  async verify(message: Uint8Array): Promise<boolean> {
    return bls.verify(this.signer, this.signature, message)
  }

  actor(): Address {
    return this.address()
  }

  sponsor(): Address {
    return this.address()
  }

  size(): number {
    return BlsAuthSize
  }

  toBytes(): Uint8Array {
    const size = this.size()
    const codec = Codec.newWriter(size, size)
    const signerBytes = bls.publicKeyToBytes(this.signer)
    codec.packFixedBytes(signerBytes)
    const signatureBytes = bls.signatureToBytes(this.signature)
    codec.packFixedBytes(signatureBytes)
    return codec.toBytes()
  }

  static fromBytes(bytes: Uint8Array): [BLS, Error?] {
    const codec = Codec.newReader(bytes, bytes.length)
    const signer = bls.publicKeyFromBytes(
      codec.unpackFixedBytes(bls.PUBLIC_KEY_LENGTH)
    )
    const signature = bls.signatureFromBytes(
      codec.unpackFixedBytes(bls.SIGNATURE_LENGTH)
    )
    return [new BLS(signer, signature), codec.getError()]
  }

  static publicKeyToHex(publicKey: bls.PublicKey): string {
    return Buffer.from(bls.publicKeyToBytes(publicKey)).toString('hex')
  }

  static hexToPublicKey(hex: string): bls.PublicKey {
    return bls.publicKeyFromBytes(Buffer.from(hex, 'hex'))
  }

  static formatAddress(address: Uint8Array): string {
    return utils.formatBech32(HRP, address)
  }

  static parseAddress(address: string): Uint8Array {
    return utils.parseBech32(address)[1]
  }
}

export class BLSFactory implements AuthFactory {
  privateKey: bls.SecretKey

  constructor(privateKey?: bls.SecretKey) {
    let privKey = bls.secretKeyFromBytes(randomBytes(32)) // 32 bytes for a private key
    if (privateKey) {
      privKey = privateKey
    }
    this.privateKey = privKey
  }

  sign(message: Uint8Array): Auth {
    const signer = BLSFactory.publicKeyFromPrivateKey(this.privateKey)
    const signature = bls.sign(message, this.privateKey)
    return new BLS(signer, bls.signatureFromBytes(signature))
  }

  computeUnits(): number {
    return BLS_COMPUTE_UNITS
  }

  bandwidth(): number {
    return bls.PUBLIC_KEY_LENGTH + bls.SIGNATURE_LENGTH
  }

  static generateKeyPair(): {
    privateKey: bls.SecretKey
    publicKey: bls.PublicKey
  } {
    const privateKey = new BLSFactory().privateKey
    const publicKey = BLSFactory.publicKeyFromPrivateKey(privateKey)
    return { privateKey, publicKey }
  }

  static publicKeyFromPrivateKey(privateKey: bls.SecretKey): bls.PublicKey {
    const publicKeyBytes = bls12_381.getPublicKey(privateKey)
    return bls.publicKeyFromBytes(publicKeyBytes)
  }

  static privateKeyToHex(privateKey: bls.SecretKey): string {
    return Buffer.from(bls.secretKeyToBytes(privateKey)).toString('hex')
  }

  static hexToPrivateKey(hex: string): bls.SecretKey {
    return bls.secretKeyFromBytes(Buffer.from(hex, 'hex'))
  }
}
