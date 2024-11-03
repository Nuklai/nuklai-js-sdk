// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { VMABI } from "hypersdk-client/dist/Marshaler";

export const NuklaiABI: VMABI = {
  actions: [
    { id: 1, name: "CreateAssetFT" },
    { id: 2, name: "CreateAssetNFT" },
    { id: 3, name: "BurnAssetFT" },
    { id: 4, name: "BurnAssetNFT" },
    { id: 5, name: "MintAssetFT" },
    { id: 6, name: "MintAssetNFT" },
    { id: 7, name: "Transfer" },
    { id: 8, name: "CreateDataset" },
    { id: 9, name: "UpdateAsset" },
    { id: 10, name: "UpdateDataset" },
    { id: 11, name: "InitiateContributeDataset" },
    { id: 12, name: "CompleteContributeDataset" },
    { id: 13, name: "PublishDatasetMarketplace" },
    { id: 14, name: "SubscribeDatasetMarketplace" },
    { id: 15, name: "ClaimMarketplacePayment" },
  ],
  types: [
    {
      name: "Address",
      fields: [
        { name: "bytes", type: "[]uint8" },
      ],
    },
    {
      name: "CreateAssetFT",
      fields: [
        { name: "assetType", type: "uint8" },
        { name: "name", type: "string" },
        { name: "symbol", type: "string" },
        { name: "decimals", type: "uint8" },
        { name: "metadata", type: "string" },
        { name: "maxSupply", type: "uint64" },
        { name: "mintAdmin", type: "Address" },
        { name: "pauseUnpauseAdmin", type: "Address" },
        { name: "freezeUnfreezeAdmin", type: "Address" },
        { name: "enableDisableKYCAccountAdmin", type: "Address" },
      ],
    },
    {
      name: "CreateAssetNFT",
      fields: [
        { name: "assetType", type: "uint8" },
        { name: "name", type: "string" },
        { name: "symbol", type: "string" },
        { name: "metadata", type: "string" },
        { name: "maxSupply", type: "uint64" },
        { name: "mintAdmin", type: "Address" },
        { name: "pauseUnpauseAdmin", type: "Address" },
        { name: "freezeUnfreezeAdmin", type: "Address" },
        { name: "enableDisableKYCAccountAdmin", type: "Address" },
      ],
    },
    {
      name: "BurnAssetFT",
      fields: [
        { name: "assetAddress", type: "Address" },
        { name: "value", type: "uint64" },
      ],
    },
    {
      name: "BurnAssetNFT",
      fields: [
        { name: "assetAddress", type: "Address" },
        { name: "assetNftAddress", type: "Address" },
      ],
    },
    {
      name: "MintAssetFT",
      fields: [
        { name: "to", type: "Address" },
        { name: "assetAddress", type: "Address" },
        { name: "value", type: "uint64" },
      ],
    },
    {
      name: "MintAssetNFT",
      fields: [
        { name: "assetAddress", type: "Address" },
        { name: "metadata", type: "string" },
        { name: "to", type: "Address" },
      ],
    },
    {
      name: "Transfer",
      fields: [
        { name: "to", type: "Address" },
        { name: "assetAddress", type: "Address" },
        { name: "value", type: "uint64" },
        { name: "memo", type: "string" },
      ],
    },
    {
      name: "CreateDataset",
      fields: [
        { name: "assetAddress", type: "Address" },
        { name: "name", type: "string" },
        { name: "description", type: "string" },
        { name: "categories", type: "string" },
        { name: "licenseName", type: "string" },
        { name: "licenseSymbol", type: "string" },
        { name: "licenseURL", type: "string" },
        { name: "metadata", type: "string" },
        { name: "isCommunityDataset", type: "bool" },
      ],
    },
    {
      name: "UpdateAsset",
      fields: [
        { name: "assetAddress", type: "Address" },
        { name: "name", type: "string" },
        { name: "symbol", type: "string" },
        { name: "metadata", type: "string" },
        { name: "maxSupply", type: "uint64" },
        { name: "owner", type: "Address" },
        { name: "mintAdmin", type: "Address" },
        { name: "pauseUnpauseAdmin", type: "Address" },
        { name: "freezeUnfreezeAdmin", type: "Address" },
        { name: "enableDisableKYCAccountAdmin", type: "Address" },
      ],
    },
    {
      name: "UpdateDataset",
      fields: [
        { name: "datasetAddress", type: "Address" },
        { name: "name", type: "string" },
        { name: "description", type: "string" },
        { name: "categories", type: "string" },
        { name: "licenseName", type: "string" },
        { name: "licenseSymbol", type: "string" },
        { name: "licenseURL", type: "string" },
        { name: "isCommunityDataset", type: "bool" },
      ],
    },
    {
      name: "InitiateContributeDataset",
      fields: [
        { name: "datasetAddress", type: "Address" },
        { name: "dataLocation", type: "string" },
        { name: "dataIdentifier", type: "string" },
      ],
    },
    {
      name: "CompleteContributeDataset",
      fields: [
        { name: "datasetContributionID", type: "string" },
        { name: "datasetAddress", type: "Address" },
        { name: "datasetContributor", type: "Address" },
      ],
    },
    {
      name: "PublishDatasetMarketplace",
      fields: [
        { name: "datasetAddress", type: "Address" },
        { name: "paymentAssetAddress", type: "Address" },
        { name: "datasetPricePerBlock", type: "uint64" },
      ],
    },
    {
      name: "SubscribeDatasetMarketplace",
      fields: [
        { name: "marketplaceAssetAddress", type: "Address" },
        { name: "paymentAssetAddress", type: "Address" },
        { name: "numBlocksToSubscribe", type: "uint64" },
      ],
    },
    {
      name: "ClaimMarketplacePayment",
      fields: [
        { name: "marketplaceAssetAddress", type: "Address" },
        { name: "paymentAssetAddress", type: "Address" },
      ],
    },
  ],
  outputs: [
    { id: 1, name: "CreateAssetFTOutput" },
    { id: 2, name: "CreateAssetNFTOutput" },
    { id: 3, name: "BurnAssetFTOutput" },
    { id: 4, name: "BurnAssetNFTOutput" },
    { id: 5, name: "MintAssetFTOutput" },
    { id: 6, name: "MintAssetNFTOutput" },
    { id: 7, name: "TransferOutput" },
    { id: 8, name: "CreateDatasetOutput" },
    { id: 9, name: "UpdateAssetOutput" },
    { id: 10, name: "UpdateDatasetOutput" },
    { id: 11, name: "InitiateContributeDatasetOutput" },
    { id: 12, name: "CompleteContributeDatasetOutput" },
    { id: 13, name: "PublishDatasetMarketplaceOutput" },
    { id: 14, name: "SubscribeDatasetMarketplaceOutput" },
    { id: 15, name: "ClaimMarketplacePaymentOutput" },
  ],
};
