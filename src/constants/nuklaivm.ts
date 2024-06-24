// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

export const HRP = 'nuklai'
export const SYMBOL = 'NAI'
export const DECIMALS = 9

// Auth TypeIDs
export const ED25519_ID = 0
export const SECP256R1_ID = 1
export const BLS_ID = 2
// Auth Units
export const ED25519_COMPUTE_UNITS = 5
export const SECP256R1_COMPUTE_UNITS = 10
export const BLS_COMPUTE_UNITS = 10

// Action TypeIDs
export const TRANSFER_ID = 0
export const CREATEASSET_ID = 1
export const MINTASSET_ID = 2
// Action Units
export const TRANSFER_COMPUTE_UNITS = 1
export const CREATEASSET_COMPUTE_UNITS = 5
export const MINTASSET_COMPUTE_UNITS = 5

// Storage Chunks
export const STORAGE_BALANCE_CHUNKS = 1

export const MAX_SYMBOL_SIZE = 8
export const MAX_MEMO_SIZE = 256
export const MAX_METADATA_SIZE = 256
export const MAX_DECIMALS = 9
