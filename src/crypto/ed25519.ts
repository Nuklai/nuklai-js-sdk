import { utils } from '@avalabs/avalanchejs'
import { sign as ed25519Sign, verify as ed25519Verify } from '@noble/ed25519'

export type PublicKey = Uint8Array
export type SecretKey = Uint8Array
export type Signature = Uint8Array
export type Message = Uint8Array

export const PUBLIC_KEY_LENGTH = 32
export const SIGNATURE_LENGTH = 64

export function secretKeyFromBytes(skBytes: Uint8Array | string): SecretKey {
  return typeof skBytes === 'string' ? utils.hexToBuffer(skBytes) : skBytes
}

export function secretKeyToBytes(sk: SecretKey): Uint8Array {
  return sk
}

export function publicKeyFromBytes(pkBytes: Uint8Array | string): PublicKey {
  return typeof pkBytes === 'string' ? utils.hexToBuffer(pkBytes) : pkBytes
}

export function publicKeyToBytes(pk: PublicKey): Uint8Array {
  return pk
}

export function signatureFromBytes(sigBytes: Uint8Array): Signature {
  return sigBytes
}

export function signatureToBytes(sig: Signature): Uint8Array {
  return sig
}

export function verify(
  pk: PublicKey,
  sig: Signature,
  msg: Uint8Array | string
): boolean {
  const message = typeof msg === 'string' ? utils.hexToBuffer(msg) : msg
  return ed25519Verify(sig, message, pk)
}

export function verifyProofOfPossession(
  pk: PublicKey,
  sig: Signature,
  msg: Uint8Array | string
): boolean {
  // Ed25519 does not have a separate proof of possession verification, so use regular verify
  return ed25519Verify(pk, sig, msg)
}

export function sign(msg: Uint8Array | string, sk: SecretKey): Uint8Array {
  const message = typeof msg === 'string' ? utils.hexToBuffer(msg) : msg
  return ed25519Sign(message, sk)
}

export function signProofOfPossession(
  msg: Uint8Array | string,
  sk: SecretKey
): Uint8Array {
  // Ed25519 does not have a separate proof of possession signing, so use regular sign
  return ed25519Sign(msg, sk)
}
