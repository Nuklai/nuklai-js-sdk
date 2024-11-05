// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

export const MAINNET_PUBLIC_API_BASE_URL = 'http://34.245.158.53:9650'
export const VM_NAME = 'nuklaivm'
export const VM_RPC_PREFIX = 'nuklaiapi'
export const CHAIN_ID = 'DPqCib879gKLxtL7Wao6WTh5hNUYFFBZSL9otsLAZ6wKPJuXb'

export const getBlockchainEndpoint = (baseUrl: string = MAINNET_PUBLIC_API_BASE_URL) => baseUrl