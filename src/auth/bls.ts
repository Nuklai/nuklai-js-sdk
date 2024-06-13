import { bls, utils } from '@avalabs/avalanchejs'
import { bls12_381 } from '@noble/curves/bls12-381'
import { randomBytes } from '@noble/hashes/utils'
import { ADDRESS_LEN, BLS_ID, HRP } from '../constants/nuklaivm'
import { Auth } from '../types/auth'
import { Codec } from '../utils/codec'

export class BLS implements Auth {
  private privateKey: bls.SecretKey
  public publicKey: bls.PublicKey
  public address: string

  constructor(privateKey: bls.SecretKey) {
    this.privateKey = privateKey
    this.publicKey = BLS.getPublicKey(privateKey)
    this.address = BLS.generateAddress(this.publicKey)
  }

  static async generatePrivateKey(): Promise<bls.SecretKey> {
    return bls.secretKeyFromBytes(randomBytes(32)) // 32 bytes for a private key
  }

  static getPublicKey(secretKey: bls.SecretKey): bls.PublicKey {
    const publicKeyBytes = bls12_381.getPublicKey(secretKey)
    return bls.publicKeyFromBytes(publicKeyBytes)
  }

  static async generateKeyPair(): Promise<{
    privateKey: bls.SecretKey
    publicKey: bls.PublicKey
  }> {
    const privateKey = await BLS.generatePrivateKey()
    const publicKey = BLS.getPublicKey(privateKey)
    return { privateKey, publicKey }
  }

  static secretKeyToHex(secretKey: bls.SecretKey): string {
    return Buffer.from(bls.secretKeyToBytes(secretKey)).toString('hex')
  }

  static hexToSecretKey(hex: string): bls.SecretKey {
    return bls.secretKeyFromBytes(Buffer.from(hex, 'hex'))
  }

  static publicKeyToHex(publicKey: bls.PublicKey): string {
    return Buffer.from(bls.publicKeyToBytes(publicKey)).toString('hex')
  }

  static hexToPublicKey(hex: string): bls.PublicKey {
    return bls.publicKeyFromBytes(Buffer.from(hex, 'hex'))
  }

  static generateAddress(publicKey: bls.PublicKey): string {
    const address = new Uint8Array(ADDRESS_LEN)
    address[0] = BLS_ID
    address.set(bls.publicKeyToBytes(publicKey).slice(1, ADDRESS_LEN), 1)
    return utils.formatBech32(HRP, address)
  }

  static parseAddress(address: string): Uint8Array {
    return utils.parseBech32(address)[1]
  }

  async sign(msg: Uint8Array): Promise<Uint8Array> {
    return BLS.sign(msg, this.privateKey)
  }

  static sign(message: Uint8Array, privateKey: bls.SecretKey): Uint8Array {
    return bls.sign(message, privateKey)
  }

  async verify(msg: Uint8Array, signature: Uint8Array): Promise<boolean> {
    return BLS.verify(msg, this.publicKey, signature)
  }

  static verify(
    message: Uint8Array,
    publicKey: bls.PublicKey,
    signature: Uint8Array
  ): boolean {
    const sig = bls.signatureFromBytes(signature)
    return bls.verify(publicKey, sig, message)
  }

  getAddress(): string {
    return this.address
  }

  toBytes(): Uint8Array {
    // Implement method to convert BLS instance to bytes
    const codec = new Codec()
    codec.addBytes(bls.secretKeyToBytes(this.privateKey))
    codec.addBytes(bls.publicKeyToBytes(this.publicKey))
    codec.addString(this.address)
    return codec.toBytes()
  }

  static fromBytes(bytes: Uint8Array): BLS {
    // Implement method to create BLS instance from bytes
    const codec = new Codec(bytes)
    const privateKey = bls.secretKeyFromBytes(codec.getBytes())
    const publicKey = bls.publicKeyFromBytes(codec.getBytes())
    const address = codec.getString()
    const blsInstance = new BLS(privateKey)
    blsInstance.publicKey = publicKey
    blsInstance.address = address
    return blsInstance
  }
}
