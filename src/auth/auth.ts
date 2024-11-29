import { Address } from '../utils/address'

export interface Auth {
  address(): Address
  getTypeId(): number
  verify(message: Uint8Array): Promise<boolean>
  actor(): Address
  sponsor(): Address
  size(): number
  toBytes(): Uint8Array
  toJSON(): object
  toString(): string
}

export interface AuthFactory {
  sign(msg: Uint8Array): Auth
  computeUnits(): number
  bandwidth(): number
}