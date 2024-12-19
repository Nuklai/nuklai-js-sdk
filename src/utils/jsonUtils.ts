// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

export function stringifyWithBigInt(value: any): string {
  return JSON.stringify(value, (_, v) => {
    if (typeof v === 'bigint') {
      return v.toString()
    }
    return v
  })
}
