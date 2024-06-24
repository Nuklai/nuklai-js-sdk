// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Address } from '../utils/address'

export interface Auth {
  address(): Address
  getTypeId(): number
  verify(message: Uint8Array): Promise<boolean>
  actor(): Address
  sponsor(): Address
  size(): number
  toBytes(): Uint8Array
}

export interface AuthFactory {
  sign(msg: Uint8Array): Auth
  computeUnits(): number
  bandwidth(): number
}
