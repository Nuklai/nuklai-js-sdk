// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

export interface Action {
  getTypeId(): number
  toBytes(): Uint8Array
  size(): number
  computeUnits(): number
  stateKeysMaxChunks(): number[]
}
