export type Transfer = {
  to: Uint8Array // codec.Address
  asset: string // ids.ID
  value: bigint
  memo: Uint8Array
}

export type CreateAsset = {
  symbol: Uint8Array
  decimals: number
  metadata: Uint8Array
}

export type MintAsset = {
  to: Uint8Array // codec.Address
  asset: string // ids.ID
  value: number
}
