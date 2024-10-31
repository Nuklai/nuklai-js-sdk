// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { NuklaiVMClient } from "./client";
import { config } from "@nuklai/hyperchain-sdk";
import { ActionOutput, SignerIface } from "hypersdk-client/dist/types";
import { TxResult } from "hypersdk-client/dist/apiTransformers";

export class RpcService {
  private client: NuklaiVMClient;

  constructor(
    protected configNuklai: config.NodeConfig,
    private signer?: SignerIface
  ) {
    this.client = new NuklaiVMClient(
      configNuklai.baseApiUrl,
      "nuklaivm",
      "rpc"
    );

    if (signer) {
      this.client.setSigner(signer);
    }
  }

  async getTransactionInfo(txID: string): Promise<TxResult> {
    return this.client.getTransactionStatus(txID);
  }

  setSigner(signer: SignerIface) {
    this.client.setSigner(signer);
  }

  async getAllValidators(): Promise<ActionOutput> {
    return this.client.getAllValidators();
  }

  async getStakedValidators(): Promise<ActionOutput> {
    return this.client.getStakedValidators();
  }

  async getValidatorStake(nodeID: string): Promise<ActionOutput> {
    return this.client.getValidatorStake(nodeID);
  }

  async getUserStake(params: {
    owner: string;
    nodeID: string;
  }): Promise<ActionOutput> {
    return this.client.getUserStake(params);
  }

  async getEmissionInfo(): Promise<ActionOutput> {
    return this.client.getEmissionInfo();
  }

  async createFTAsset(
    name: string,
    symbol: string,
    decimals: number,
    metadata: string,
    maxSupply: bigint,
    mintAdmin: string,
    pauseUnpauseAdmin: string,
    freezeUnfreezeAdmin: string,
    enableDisableKYCAccountAdmin: string
  ): Promise<TxResult> {
    return this.client.createFungibleToken({
      name,
      symbol,
      decimals,
      metadata,
      maxSupply,
      mintAdmin,
      pauseUnpauseAdmin,
      freezeUnfreezeAdmin,
      enableDisableKYCAccountAdmin,
    });
  }

  async createNFTAsset(
    name: string,
    symbol: string,
    metadata: string,
    maxSupply: bigint,
    mintAdmin: string,
    pauseUnpauseAdmin: string,
    freezeUnfreezeAdmin: string,
    enableDisableKYCAccountAdmin: string
  ): Promise<TxResult> {
    return this.client.createNFTAsset({
      name,
      symbol,
      metadata,
      maxSupply,
      mintAdmin,
      pauseUnpauseAdmin,
      freezeUnfreezeAdmin,
      enableDisableKYCAccountAdmin,
    });
  }

  async transfer(
    to: string,
    assetAddress: string,
    value: bigint,
    memo: string
  ): Promise<TxResult> {
    return this.client.transfer({
      to,
      assetAddress,
      value,
      memo,
    });
  }

  async mintFTAsset(
    to: string,
    assetAddress: string,
    amount: bigint
  ): Promise<TxResult> {
    return this.client.mintFTAsset({
      to,
      assetAddress,
      amount,
    });
  }

  async mintNFTAsset(
    assetAddress: string,
    metadata: string,
    to: string
  ): Promise<TxResult> {
    return this.client.mintNFTAsset({
      assetAddress,
      metadata,
      to,
    });
  }

  async burnFTAsset(assetAddress: string, amount: bigint): Promise<TxResult> {
    return this.client.burnFTAsset({
      assetAddress,
      amount,
    });
  }

  async burnNFTAsset(
    assetAddress: string,
    assetNftAddress: string
  ): Promise<TxResult> {
    return this.client.burnNFTAsset({
      assetAddress,
      assetNftAddress,
    });
  }

  async createDataset(
    assetAddress: string,
    name: string,
    description: string,
    categories: string,
    licenseName: string,
    licenseSymbol: string,
    licenseURL: string,
    metadata: string,
    isCommunityDataset: boolean
  ): Promise<TxResult> {
    return this.client.createDataset({
      assetAddress,
      name,
      description,
      categories,
      licenseName,
      licenseSymbol,
      licenseURL,
      metadata,
      isCommunityDataset,
    });
  }

  async updateDataset(
    datasetAddress: string,
    name: string,
    description: string,
    categories: string,
    licenseName: string,
    licenseSymbol: string,
    licenseURL: string,
    isCommunityDataset: boolean
  ): Promise<TxResult> {
    return this.client.updateDataset({
      datasetAddress,
      name,
      description,
      categories,
      licenseName,
      licenseSymbol,
      licenseURL,
      isCommunityDataset,
    });
  }

  async initiateContributeDataset(
    datasetAddress: string,
    dataLocation: string,
    dataIdentifier: string
  ): Promise<TxResult> {
    return this.client.initiateContributeDataset({
      datasetAddress,
      dataLocation,
      dataIdentifier,
    });
  }

  async completeContributeDataset(
    datasetContributionID: string,
    datasetAddress: string,
    datasetContributor: string
  ): Promise<TxResult> {
    return this.client.completeContributeDataset({
      datasetContributionID,
      datasetAddress,
      datasetContributor,
    });
  }

  async publishDatasetToMarketplace(
    datasetAddress: string,
    paymentAssetAddress: string,
    datasetPricePerBlock: bigint
  ): Promise<TxResult> {
    return this.client.publishDatasetToMarketplace({
      datasetAddress,
      paymentAssetAddress,
      datasetPricePerBlock,
    });
  }

  async subscribeDatasetMarketplace(
    marketplaceAssetAddress: string,
    paymentAssetAddress: string,
    numBlocksToSubscribe: bigint
  ): Promise<TxResult> {
    return this.client.subscribeDatasetMarketplace({
      marketplaceAssetAddress,
      paymentAssetAddress,
      numBlocksToSubscribe,
    });
  }

  async claimMarketplacePayment(
    marketplaceAssetAddress: string,
    paymentAssetAddress: string
  ): Promise<TxResult> {
    return this.client.claimMarketplacePayment({
      marketplaceAssetAddress,
      paymentAssetAddress,
    });
  }

  async getBalance(address: string): Promise<string> {
    return this.client.getBalance(address);
  }

  async getAssetInfo(assetAddress: string): Promise<ActionOutput> {
    return this.client.executeAction({
      actionName: "GetAssetInfo",
      data: { asset: assetAddress },
    });
  }

  async getDatasetInfo(datasetID: string): Promise<ActionOutput> {
    return this.client.executeAction({
      actionName: "GetDatasetInfo",
      data: { datasetID },
    });
  }

  async getDatasetBalance(
    address: string,
    assetID: string
  ): Promise<ActionOutput> {
    return this.client.executeAction({
      actionName: "GetDatasetBalance",
      data: { address, assetID },
    });
  }

  async getDatasetNFTInfo(nftID: string): Promise<ActionOutput> {
    return this.client.executeAction({
      actionName: "GetDatasetNFTInfo",
      data: { nftID },
    });
  }

  async getPendingContributions(datasetID: string): Promise<ActionOutput> {
    return this.client.executeAction({
      actionName: "GetPendingContributions",
      data: { datasetID },
    });
  }
}
