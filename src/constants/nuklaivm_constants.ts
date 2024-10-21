// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

// Chain-specific constants
export const HRP = 'nuklai'
export const SYMBOL = 'NAI'
export const DECIMALS = 9

// Action TypeIDs
export const TRANSFER_ID = 0
export const CREATE_ASSET_ID = 1
export const MINT_ASSET_FT_ID = 2
export const MINT_ASSET_NFT_ID = 3
export const CREATE_DATASET_ID = 4
export const BURNASSET_FT_ID = 5
export const BURNASSET_NFT_ID = 6
export const UPDATE_DATASET_ID = 7
export const UPDATE_ASSET_ID = 8
export const INITIATE_CONTRIBUTE_DATASET_ID = 9
export const COMPLETE_CONTRIBUTE_DATASET_ID = 10
export const PUBLISH_DATASET_MARKETPLACE_ID = 11
export const SUBSCRIBE_DATASET_MARKETPLACE_ID = 12
export const CLAIM_MARKETPLACE_PAYMENT_ID = 13

// Asset Types
export const ASSET_FUNGIBLE_TOKEN_ID = 0
export const ASSET_NON_FUNGIBLE_TOKEN_ID = 1
export const ASSET_FRACTIONAL_TOKEN_ID = 2

// Action Compute Units
export const CREATE_ASSET_COMPUTE_UNITS = 15
export const MINT_ASSET_COMPUTE_UNITS = 5
export const BURNASSET_COMPUTE_UNITS = 5
export const CREATE_DATASET_COMPUTE_UNITS = 100
export const UPDATE_ASSET_COMPUTE_UNITS = 15
export const UPDATE_DATASET_COMPUTE_UNITS = 5
export const PUBLISH_DATASET_MARKETPLACE_COMPUTE_UNITS = 5
export const INITIATE_CONTRIBUTE_DATASET_COMPUTE_UNITS = 15
export const COMPLETE_CONTRIBUTE_DATASET_COMPUTE_UNITS = 5
export const SUBSCRIBE_DATASET_MARKETPLACE_COMPUTE_UNITS = 10
export const CLAIM_MARKETPLACE_PAYMENT_COMPUTE_UNITS = 5
export const TRANSFER_COMPUTE_UNITS = 1

// Storage Chunks
export const STORAGE_ASSET_CHUNKS = 5
export const STORAGE_ASSET_NFT_CHUNKS = 5
export const STORAGE_BALANCE_CHUNKS = 1
export const STORAGE_DATASET_CHUNKS = 5

// Asset properties limits
export const MAX_NAME_SIZE = 32
export const MAX_SYMBOL_SIZE = 8
export const MAX_ASSET_METADATA_SIZE = 256
export const MAX_ASSET_DECIMALS = 9
export const MAX_TEXT_SIZE = 256
export const MAX_DATASET_METADATA_SIZE = 1024
export const MAX_DATASET_DATA_LOCATION_SIZE = 256

// Other constants
export const ADDRESS_LEN = 33
export const STRING_LEN = 2
export const UINT64_LEN = 8