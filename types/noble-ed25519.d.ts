declare module '@noble/ed25519' {
  export function getPublicKey(privateKey: Uint8Array): Promise<Uint8Array>
  export function sign(
    message: Uint8Array,
    privateKey: Uint8Array
  ): Promise<Uint8Array>
  export function verify(
    signature: Uint8Array,
    message: Uint8Array,
    publicKey: Uint8Array
  ): Promise<boolean>
}
