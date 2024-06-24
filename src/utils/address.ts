// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { TypeSymbols, utils } from '@avalabs/avalanchejs'
import { ADDRESS_LEN } from '../constants/consts'
import { HRP } from '../constants/nuklaivm'

export class Address {
  _type = TypeSymbols.Address
  constructor(private readonly address: Uint8Array) {
    this.address = address
  }

  static fromBytes(buf: Uint8Array): [Address, Uint8Array] {
    return [new Address(buf.slice(0, ADDRESS_LEN)), buf.slice(ADDRESS_LEN)]
  }

  toJSON(hrp = HRP) {
    return this.toString(hrp)
  }

  //decodes from bech32 Addresses
  static fromString(addr: string): Address {
    return new Address(utils.parseBech32(addr)[1])
  }

  static fromHex(hex: string): Address {
    return new Address(utils.hexToBuffer(hex))
  }

  toHex(): string {
    return utils.bufferToHex(this.address)
  }

  toBytes() {
    return utils.padLeft(this.address, ADDRESS_LEN)
  }

  toString(hrp = HRP) {
    return utils.formatBech32(hrp, this.address)
  }

  value() {
    return this.toString()
  }
}
