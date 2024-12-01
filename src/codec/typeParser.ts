// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { MaxUint8 } from '../constants/consts'
import { Codec } from './codec'

// Errors
const errTooManyItems = new Error('Too many items')
const errDuplicateItem = new Error('Duplicate item')

// Decoder type
type Decoder<T, Y> = {
  f: (codec: Codec) => [T, Codec]
  y: Y
}

// TypeParser class
export class TypeParser<T, Y> {
  private typeToIndex: Map<string, number>
  private indexToDecoder: Map<number, Decoder<T, Y>>

  constructor() {
    this.typeToIndex = new Map<string, number>()
    this.indexToDecoder = new Map<number, Decoder<T, Y>>()
  }

  // Register a new type into TypeParser
  register(id: number, f: (codec: Codec) => [T, Codec], y: Y): void {
    if (this.indexToDecoder.size === MaxUint8 + 1) {
      throw errTooManyItems
    }
    if (this.indexToDecoder.has(id)) {
      throw errDuplicateItem
    }
    this.indexToDecoder.set(id, { f, y })
  }

  // LookupIndex returns the decoder function and success of lookup of [index]
  lookupIndex(index: number): [(codec: Codec) => [T, Codec], boolean] {
    const decoder = this.indexToDecoder.get(index)
    if (decoder) {
      return [decoder.f, true]
    }
    // Return a no-op function to match the expected type signature
    const noop = (codec: Codec): [T, Codec] => {
      return [undefined as unknown as T, codec]
    }
    return [noop, false]
  }
}