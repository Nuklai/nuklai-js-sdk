// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { VMABI } from "hypersdk-client/dist/Marshaler";

export const NuklaiABI: VMABI = {
  actions: [
    { id: 0, name: "Transfer" },
    { id: 1, name: "ContractCall" },
    { id: 2, name: "ContractDeploy" },
    { id: 3, name: "ContractPublish" },
    { id: 4, name: "CreateAsset" },
    { id: 5, name: "UpdateAsset" },
    { id: 6, name: "MintAssetFT" },
    { id: 7, name: "MintAssetNFT" },
    { id: 8, name: "BurnAssetFT" },
    { id: 9, name: "BurnAssetNFT" },
    { id: 10, name: "RegisterValidatorStake" },
    { id: 11, name: "WithdrawValidatorStake" },
    { id: 12, name: "ClaimValidatorStakeRewards" },
    { id: 13, name: "DelegateUserStake" },
    { id: 14, name: "UndelegateUserStake" },
    { id: 15, name: "ClaimDelegationStakeRewards" },
    { id: 16, name: "CreateDataset" },
    { id: 17, name: "UpdateDataset" },
    { id: 18, name: "InitiateContributeDataset" },
    { id: 19, name: "CompleteContributeDataset" },
    { id: 20, name: "PublishDatasetMarketplace" },
    { id: 21, name: "SubscribeDatasetMarketplace" },
    { id: 22, name: "ClaimMarketplacePayment" },
  ],
  types: [
    {
      name: "Address",
      fields: [{ name: "value", type: "[]uint8" }],
    },
    {
      name: "ID",
      fields: [{ name: "value", type: "[]uint8" }],
    },
    {
      name: "Transfer",
      fields: [
        { name: "to", type: "Address" },
        { name: "asset_address", type: "Address" },
        { name: "value", type: "uint64" },
        { name: "memo", type: "string" },
      ],
    },
    {
      name: "CreateAsset",
      fields: [
        { name: "asset_type", type: "uint8" },
        { name: "name", type: "string" },
        { name: "symbol", type: "string" },
        { name: "decimals", type: "uint8" },
        { name: "metadata", type: "string" },
        { name: "max_supply", type: "uint64" },
        { name: "mint_admin", type: "Address" },
        { name: "pause_unpause_admin", type: "Address" },
        { name: "freeze_unfreeze_admin", type: "Address" },
        { name: "enable_disable_kyc_account_admin", type: "Address" },
      ],
    },
    {
      name: "MintAssetFT",
      fields: [
        { name: "to", type: "Address" },
        { name: "asset_address", type: "Address" },
        { name: "value", type: "uint64" },
      ],
    },
    {
      name: "MintAssetNFT",
      fields: [
        { name: "asset_address", type: "Address" },
        { name: "metadata", type: "string" },
        { name: "to", type: "Address" },
      ],
    },
    {
      name: "BurnAssetFT",
      fields: [
        { name: "asset_address", type: "Address" },
        { name: "value", type: "uint64" },
      ],
    },
    {
      name: "BurnAssetNFT",
      fields: [
        { name: "asset_address", type: "Address" },
        { name: "asset_nft_address", type: "Address" },
      ],
    },
    {
      name: "UpdateAsset",
      fields: [
        { name: "asset_address", type: "Address" },
        { name: "name", type: "string" },
        { name: "symbol", type: "string" },
        { name: "metadata", type: "string" },
        { name: "max_supply", type: "uint64" },
        { name: "owner", type: "string" },
        { name: "mint_admin", type: "string" },
        { name: "pause_unpause_admin", type: "string" },
        { name: "freeze_unfreeze_admin", type: "string" },
        { name: "enable_disable_kyc_account_admin", type: "string" },
      ],
    },
    {
      name: "CreateDataset",
      fields: [
        { name: "asset_address", type: "Address" },
        { name: "name", type: "string" },
        { name: "description", type: "string" },
        { name: "categories", type: "string" },
        { name: "license_name", type: "string" },
        { name: "license_symbol", type: "string" },
        { name: "license_url", type: "string" },
        { name: "metadata", type: "string" },
        { name: "is_community_dataset", type: "bool" },
      ],
    },
    {
      name: "UpdateDataset",
      fields: [
        { name: "dataset_address", type: "Address" },
        { name: "name", type: "string" },
        { name: "description", type: "string" },
        { name: "categories", type: "string" },
        { name: "license_name", type: "string" },
        { name: "license_symbol", type: "string" },
        { name: "license_url", type: "string" },
        { name: "is_community_dataset", type: "bool" },
      ],
    },
    {
      name: "InitiateContributeDataset",
      fields: [
        { name: "dataset_address", type: "Address" },
        { name: "data_location", type: "string" },
        { name: "data_identifier", type: "string" },
      ],
    },
    {
      name: "CompleteContributeDataset",
      fields: [
        { name: "dataset_contribution_id", type: "ID" },
        { name: "dataset_address", type: "Address" },
        { name: "dataset_contributor", type: "Address" },
      ],
    },
    {
      name: "PublishDatasetMarketplace",
      fields: [
        { name: "dataset_address", type: "Address" },
        { name: "payment_asset_address", type: "Address" },
        { name: "dataset_price_per_block", type: "uint64" },
      ],
    },
    {
      name: "SubscribeDatasetMarketplace",
      fields: [
        { name: "marketplace_asset_address", type: "Address" },
        { name: "payment_asset_address", type: "Address" },
        { name: "num_blocks_to_subscribe", type: "uint64" },
      ],
    },
    {
      name: "ClaimMarketplacePayment",
      fields: [
        { name: "marketplace_asset_address", type: "Address" },
        { name: "payment_asset_address", type: "Address" },
      ],
    },
  ],
  outputs: [
    { id: 0, name: "TransferResult" },
    { id: 1, name: "ContractCallResult" },
    { id: 2, name: "ContractDeployResult" },
    { id: 3, name: "ContractPublishResult" },
    { id: 4, name: "CreateAssetResult" },
    { id: 5, name: "UpdateAssetResult" },
    { id: 6, name: "MintAssetFTResult" },
    { id: 7, name: "MintAssetNFTResult" },
    { id: 8, name: "BurnAssetFTResult" },
    { id: 9, name: "BurnAssetNFTResult" },
    { id: 10, name: "RegisterValidatorStakeResult" },
    { id: 11, name: "WithdrawValidatorStakeResult" },
    { id: 12, name: "ClaimValidatorStakeRewardsResult" },
    { id: 13, name: "DelegateUserStakeResult" },
    { id: 14, name: "UndelegateUserStakeResult" },
    { id: 15, name: "ClaimDelegationStakeRewardsResult" },
    { id: 16, name: "CreateDatasetResult" },
    { id: 17, name: "UpdateDatasetResult" },
    { id: 18, name: "InitiateContributeDatasetResult" },
    { id: 19, name: "CompleteContributeDatasetResult" },
    { id: 20, name: "PublishDatasetMarketplaceResult" },
    { id: 21, name: "SubscribeDatasetMarketplaceResult" },
    { id: 22, name: "ClaimMarketplacePaymentResult" },
  ],
};
