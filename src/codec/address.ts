// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import * as crypto from 'crypto'

// Constants
const ADDRESS_LEN = 33 // Address length (type ID + 32-byte hash)
const ED25519_ID = 0 // ED25519 Type ID

// Utility function to compute SHA-256 hash
function computeHash256Array(input: Uint8Array): Uint8Array {
  return new Uint8Array(crypto.createHash('sha256').update(input).digest())
}

// Function to create an address
function createAddress(typeID: number, id: Uint8Array): Uint8Array {
  if (id.length !== 32) {
    throw new Error('Invalid ID length. Expected 32 bytes.')
  }

  const address = new Uint8Array(ADDRESS_LEN)
  address[0] = typeID // First byte is the type ID
  address.set(id, 1) // Copy the 32-byte ID starting at index 1
  return address
}

// Convert public key to ID
function toID(publicKey: Uint8Array): Uint8Array {
  if (publicKey.length !== 32) {
    throw new Error('Invalid public key length. Expected 32 bytes.')
  }
  return computeHash256Array(publicKey)
}

// Convert ED25519 public key to address
export function newED25519Address(publicKey: Uint8Array): string {
  const id = toID(publicKey)
  const address = createAddress(ED25519_ID, id)
  return `0x${Buffer.from(address).toString('hex')}`
}
