// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { TypeSymbols, utils } from '@avalabs/avalanchejs'
import { ADDRESS_LEN } from '../constants/consts'
import { BLS_ID, ED25519_ID, HRP, SECP256R1_ID } from '../constants/hypervm'
import { ToID } from './hashing'

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

  static newAddress(authTypeID: number, publicKeyBytes: Uint8Array): Address {
    if (![ED25519_ID, SECP256R1_ID, BLS_ID].includes(authTypeID)) {
      throw new Error('invalid auth type')
    }
    const address = new Uint8Array(ADDRESS_LEN)
    address[0] = authTypeID
    address.set(ToID(publicKeyBytes), 1)
    return Address.fromBytes(address)[0]
  }

  static formatAddress(address: Uint8Array): string {
    return utils.formatBech32(HRP, address)
  }

  static parseAddress(address: string): Uint8Array {
    return utils.parseBech32(address)[1]
  }
}