// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Id } from '@avalabs/avalanchejs'
import { EMPTY_ID, MillisecondsPerSecond } from '../constants/consts'
import { SYMBOL } from '../constants/hypervm'

export function parseBalance(
  amount: string | number,
  decimals: number
): bigint {
  const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return BigInt(Math.floor(parsedAmount * Math.pow(10, decimals)))
}

export function formatBalance(
  parsedAmount: number | bigint,
  decimals: number
): number {
  const factor = Math.pow(10, decimals)
  const parsedBigInt =
    typeof parsedAmount === 'bigint' ? parsedAmount : BigInt(parsedAmount)
  const wholePart = Number(parsedBigInt / BigInt(factor))
  const fractionalPart = Number(parsedBigInt % BigInt(factor)) / factor

  return wholePart + fractionalPart
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

export function fromAssetID(asset: Id): string {
  return bufferEquals(asset.toBytes(), EMPTY_ID.toBytes())
    ? SYMBOL
    : asset.toString()
}

export function isNodeEnvironment(): boolean {
  return typeof process !== 'undefined' && 
         process.versions != null && 
         process.versions.node != null &&
         typeof window === 'undefined';
}

export function isBrowserEnvironment(): boolean {
  return (
    typeof window !== "undefined" && typeof window.document !== "undefined"
  );
}