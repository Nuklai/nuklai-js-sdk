import { createHash } from 'crypto'

const HashLen = 32 // sha256 hash length in bytes

type Hash256 = Uint8Array

function ComputeHash256Array(buf: Uint8Array): Hash256 {
  const hash = createHash('sha256')
  hash.update(buf)
  return new Uint8Array(hash.digest())
}

function ComputeHash256(buf: Uint8Array): Uint8Array {
  return ComputeHash256Array(buf)
}

export function ToID(bytes: Uint8Array): Uint8Array {
  return ComputeHash256(bytes)
}
