import { bls, utils } from '@avalabs/avalanchejs'
import { bls12_381 } from '@noble/curves/bls12-381'
import { randomBytes } from '@noble/hashes/utils'
import { ADDRESS_LEN, BLS_ID, HRP } from '../constants/nuklaivm'
import { Codec } from '../utils/codec'

export interface Auth {
  verify(message: Uint8Array): Promise<boolean>
  toBytes(): Uint8Array
  actor(): Uint8Array
  sponsor(): Uint8Array
  size(): number
}

export class BLS implements Auth {
  public signer: bls.PublicKey
  public signature: Uint8Array
  private addr: Uint8Array

  constructor(signer: bls.PublicKey, signature: Uint8Array) {
    this.signer = signer
    this.signature = signature
    this.addr = new Uint8Array()
  }

  public address(): Uint8Array {
    if (this.addr.length === 0) {
      this.addr = NewBLSAddress(this.signer)
    }
    return this.addr
  }

  async verify(message: Uint8Array): Promise<boolean> {
    const sig = bls.signatureFromBytes(this.signature)
    return bls.verify(this.signer, sig, message)
  }

  actor(): Uint8Array {
    return this.addr
  }

  sponsor(): Uint8Array {
    return this.addr
  }

  size(): number {
    return bls.PUBLIC_KEY_LENGTH + bls.SIGNATURE_LENGTH
  }

  toBytes(): Uint8Array {
    const codec = new Codec()
    codec.addBytes(bls.publicKeyToBytes(this.signer))
    codec.addBytes(this.signature)
    return codec.toBytes()
  }

  static fromBytes(bytes: Uint8Array): BLS {
    const codec = new Codec(bytes)
    const signer = bls.publicKeyFromBytes(codec.getBytes())
    const signature = codec.getBytes()
    return new BLS(signer, signature)
  }

  static sign(message: Uint8Array, privateKey: bls.SecretKey): Uint8Array {
    return bls.sign(message, privateKey)
  }
}

export interface AuthFactory {
  sign(msg: Uint8Array): Auth
}

export class BLSFactory implements AuthFactory {
  privateKey: bls.SecretKey

  constructor(privateKey: bls.SecretKey) {
    this.privateKey = privateKey
  }

  sign(message: Uint8Array): Auth {
    const signer = GetPublicKeyFromPrivateKey(this.privateKey)
    const signature = bls.sign(message, this.privateKey)
    return new BLS(signer, signature)
  }
}

export function NewBLSAddress(publicKey: bls.PublicKey): Uint8Array {
  const address = new Uint8Array(ADDRESS_LEN)
  address[0] = BLS_ID
  address.set(bls.publicKeyToBytes(publicKey).slice(1, ADDRESS_LEN), 1)
  return address
}

export async function GenerateRandomPrivateKey(): Promise<bls.SecretKey> {
  return bls.secretKeyFromBytes(randomBytes(32)) // 32 bytes for a private key
}

export function GetPublicKeyFromPrivateKey(
  secretKey: bls.SecretKey
): bls.PublicKey {
  const publicKeyBytes = bls12_381.getPublicKey(secretKey)
  return bls.publicKeyFromBytes(publicKeyBytes)
}

export async function GenerateKeyPair(): Promise<{
  privateKey: bls.SecretKey
  publicKey: bls.PublicKey
}> {
  const privateKey = await GenerateRandomPrivateKey()
  const publicKey = GetPublicKeyFromPrivateKey(privateKey)
  return { privateKey, publicKey }
}

export function secretKeyToHex(secretKey: bls.SecretKey): string {
  return Buffer.from(bls.secretKeyToBytes(secretKey)).toString('hex')
}

export function hexToSecretKey(hex: string): bls.SecretKey {
  return bls.secretKeyFromBytes(Buffer.from(hex, 'hex'))
}

export function publicKeyToHex(publicKey: bls.PublicKey): string {
  return Buffer.from(bls.publicKeyToBytes(publicKey)).toString('hex')
}

export function hexToPublicKey(hex: string): bls.PublicKey {
  return bls.publicKeyFromBytes(Buffer.from(hex, 'hex'))
}

export function formatAddress(address: Uint8Array): string {
  return utils.formatBech32(HRP, address)
}

export function parseAddress(address: string): Uint8Array {
  return utils.parseBech32(address)[1]
}
