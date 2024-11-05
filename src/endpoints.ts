// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

export const MAINNET_PUBLIC_API_BASE_URL = 'http://127.0.0.1:9650'
export const VM_NAME = 'nuklaivm'
export const VM_RPC_PREFIX = 'nuklaiapi'
export const CHAIN_ID = '2LD7R6qACGZu33upudgAN13EfbDHgYw1bHShqGpbyS6Pt52uEx'

export const getBlockchainEndpoint = (
  baseUrl: string = MAINNET_PUBLIC_API_BASE_URL
) => baseUrl
