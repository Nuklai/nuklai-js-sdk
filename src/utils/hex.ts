// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

// ToHex converts a byte to a hex string.
export function toHex(b: Uint8Array): string {
  return Buffer.from(b).toString('hex')
}

// LoadHex Converts hex encoded string into bytes. Returns
// an error if key is invalid.
export function loadHex(s: string, expectedSize: number): Uint8Array {
  const bytes = Buffer.from(s, 'hex')
  if (expectedSize !== -1 && bytes.length !== expectedSize) {
    throw new Error('Invalid size')
  }
  return new Uint8Array(bytes)
}
