// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { INT_LEN } from '../constants/consts'

interface SizeType {
  size(): number
}

export function cummSize<T extends SizeType>(arr: T[]): number {
  let size = 0
  for (const item of arr) {
    size += item.size()
  }
  return size
}

export function bytesLen(bytes: Uint8Array): number {
  return INT_LEN + bytes.length
}

export function bytesLenSize(bytesSize: number): number {
  return INT_LEN + bytesSize
}

export function stringLen(str: string): number {
  return INT_LEN + str.length
}