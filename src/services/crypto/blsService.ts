import { bls12_381 } from '@noble/curves/bls12-381'
import { bytesToHex, hexToBytes, randomBytes } from '@noble/hashes/utils'
import { bech32 } from 'bech32'

import { ADDRESS_LEN, BLS_ID, HRP } from '../../constants/nuklaivm'

export class BLSService {
  static async generatePrivateKey(): Promise<Uint8Array> {
    return randomBytes(32) // 32 bytes for a private key
  }

  static getPublicKey(secretKey: Uint8Array): Uint8Array {
    return bls12_381.getPublicKey(secretKey)
  }

  static async generateKeyPair(): Promise<{
    privateKey: Uint8Array
    publicKey: Uint8Array
  }> {
    const privateKey = await BLSService.generatePrivateKey()
    const publicKey = BLSService.getPublicKey(privateKey)
    return { privateKey, publicKey }
  }

  static secretKeyToHex(secretKey: Uint8Array): string {
    return bytesToHex(secretKey)
  }

  static hexToSecretKey(hex: string): Uint8Array {
    return hexToBytes(hex)
  }

  static publicKeyToHex(publicKey: Uint8Array): string {
    return bytesToHex(publicKey)
  }

  static hexToPublicKey(hex: string): Uint8Array {
    return hexToBytes(hex)
  }

  static sign(message: Uint8Array, privateKey: Uint8Array): Uint8Array {
    return bls12_381.sign(message, privateKey)
  }

  static verify(
    message: Uint8Array,
    publicKey: Uint8Array,
    signature: Uint8Array
  ): boolean {
    return bls12_381.verify(signature, message, publicKey)
  }

  static generateAddress(publicKey: Uint8Array): string {
    const address = new Uint8Array(ADDRESS_LEN)
    address[0] = BLS_ID
    address.set(publicKey.slice(1, ADDRESS_LEN), 1)

    const words = bech32.toWords(address)
    return bech32.encode(HRP, words)
  }
}
