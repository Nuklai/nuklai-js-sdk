export type PingResponse = {
  success: boolean
}

export type GetNetworkInfoResponse = {
  networkId: number
  subnetId: string
  chainId: string
}

export type GetLastAcceptedResponse = {
  blockId: string
  height: number
  timestamp: number
}

export type GetUnitPricesResponse = {
  unitPrices: number[]
}

export type SubmitTransactionResponse = {
  txId: string
}

export type WarpValidator = {
  nodeId: string
  publicKey: Uint8Array
  weight: number
}

export type WarpSignature = {
  publicKey: Uint8Array
  signature: Uint8Array
}

export type UnsignedMessage = {
  networkId: number
  sourceChainId: string
  payload: Uint8Array
}

export type GetWarpSignaturesResponse = {
  validators: WarpValidator[]
  message: UnsignedMessage
  signatures: WarpSignature[]
}
