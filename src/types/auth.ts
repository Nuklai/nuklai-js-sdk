export interface Auth {
  sign(msg: Uint8Array): Promise<Uint8Array>
  verify(msg: Uint8Array, signature: Uint8Array): Promise<boolean>
}
