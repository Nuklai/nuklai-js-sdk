// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Id } from '@avalabs/avalanchejs'
import { EMPTY_ID, MillisecondsPerSecond } from '../constants/consts'
import { SYMBOL } from '../constants/nuklaivm'

export function parseBalance(amount: string, decimals: number): bigint {
  return BigInt(Math.floor(parseFloat(amount) * Math.pow(10, decimals)))
}

export function getUnixRMilli(now: number, add: number): bigint {
  let currentTime = now
  if (currentTime < 0) {
    currentTime = Date.now()
  }
  const t = BigInt(currentTime) + BigInt(add)
  return t - (t % MillisecondsPerSecond)
}

export function bufferEquals(buf1: Uint8Array, buf2: Uint8Array): boolean {
  if (buf1.length !== buf2.length) return false
  for (let i = 0; i < buf1.length; i++) {
    if (buf1[i] !== buf2[i]) return false
  }
  return true
}

export function toAssetID(asset: string): Id {
  return asset.toUpperCase() === SYMBOL ? EMPTY_ID : Id.fromString(asset)
}
