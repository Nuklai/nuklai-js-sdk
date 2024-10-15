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
export const MINTASSET_FT_ID = 2
export const MINTASSET_NFT_ID = 3
export const BURNASSET_FT_ID = 4
export const BURNASSET_NFT_ID = 5
export const MINTDATASET_ID = 6
export const UPDATEDATASET_ID = 7
export const UPDATEASSET_ID = 8

// Asset Types
export const ASSET_FUNGIBLE_TOKEN_ID = 0
export const ASSET_NON_FUNGIBLE_TOKEN_ID = 1
export const ASSET_DATASET_TOKEN_ID = 2

// Action Units
export const TRANSFER_COMPUTE_UNITS = 1
export const CREATEASSET_COMPUTE_UNITS = 5
export const MINTASSET_COMPUTE_UNITS = 5
export const BURNASSET_COMPUTE_UNITS = 5
export const MINTDATASET_COMPUTE_UNITS = 10
export const UPDATEDATASET_COMPUTE_UNITS = 5
export const UPDATEASSET_COMPUTE_UNITS = 5

// Storage Chunks
export const STORAGE_BALANCE_CHUNKS = 1
export const STORAGE_ASSET_CHUNKS = 5
export const STORAGE_DATASET_CHUNKS = 5
export const REGISTER_VALIDATOR_STAKE_CHUNKS = 5
export const DELEGATE_USER_STAKE_CHUNKS = 3
export const STORAGE_ASSET_NFT_CHUNKS = 5

export const MAX_SYMBOL_SIZE = 8
export const MAX_MEMO_SIZE = 256
export const MAX_METADATA_SIZE = 256
export const MAX_TEXT_SIZE = 256
export const MAX_DATASET_METADATA_SIZE = 1024
export const MAX_DECIMALS = 9

export const INITIATE_CONTRIBUTE_DATASET_ID = 9
export const COMPLETE_CONTRIBUTE_DATASET_ID = 10
export const INITIATE_CONTRIBUTE_DATASET_COMPUTE_UNITS = 15
export const COMPLETE_CONTRIBUTE_DATASET_COMPUTE_UNITS = 5

export const PUBLISH_DATASET_MARKETPLACE_ID = 11
export const PUBLISH_DATASET_MARKETPLACE_COMPUTE_UNITS = 5

export const SUBSCRIBE_DATASET_MARKETPLACE_ID = 12
export const CLAIM_MARKETPLACE_PAYMENT_ID = 13
export const SUBSCRIBE_DATASET_MARKETPLACE_COMPUTE_UNITS = 10
export const CLAIM_MARKETPLACE_PAYMENT_COMPUTE_UNITS = 5