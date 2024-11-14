// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { NuklaiVMClient, TransactionResult } from './client'
// import { config } from "@nuklai/hyperchain-sdk";
import { TxResult } from 'hypersdk-client/dist/apiTransformers'
import { ActionData, ActionOutput } from 'hypersdk-client/dist/types'
import { VM_NAME, VM_RPC_PREFIX } from './endpoints'

const DEFAULT_TIMEOUT = 30000

export class RpcService {
  private client: NuklaiVMClient

  constructor(baseApiUrl: string, private privateKey?: string) {
    this.client = new NuklaiVMClient(baseApiUrl, VM_NAME, VM_RPC_PREFIX)

    // If privateKey is provided, set it
    if (privateKey) {
      this.client.setSigner(privateKey)
    }
  }

  async executeAction(actionData: ActionData): Promise<ActionOutput[]> {
    return this.executeWithTimeout(
      () => this.client.executeAction(actionData),
      'Failed to execute action'
    )
  }

  // async getTransactionInfo(txID: string): Promise<TxResult> {
  //     return this.client.getTransactionStatus(txID);
  // }
  async getTransactionInfo(txID: string): Promise<TxResult> {
    return this.executeWithTimeout(
      () => this.client.getTransactionStatus(txID),
      'Failed to get transaction info'
    )
  }

  // Method to set signer after construction
  setSigner(privateKey: string) {
    this.client.setSigner(privateKey)
  }

  // async getAllValidators(): Promise<ActionOutput> {
  //     return this.client.getAllValidators();
  // }
  async getAllValidators(): Promise<ActionOutput> {
    return this.executeWithTimeout(
      () => this.client.getAllValidators(),
      'Failed to get validators'
    )
  }

  async getStakedValidators(): Promise<ActionOutput> {
    return this.client.getStakedValidators()
  }

  async getValidatorStake(nodeID: string): Promise<ActionOutput> {
    return this.client.getValidatorStake(nodeID)
  }

  async getUserStake(params: {
    owner: string
    nodeID: string
  }): Promise<ActionOutput> {
    return this.client.getUserStake(params)
  }

  async getEmissionInfo(): Promise<ActionOutput> {
    return this.client.getEmissionInfo()
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
  ): Promise<TransactionResult> {
    return this.client.createFungibleToken({
      name,
      symbol,
      decimals,
      metadata,
      maxSupply,
      mintAdmin,
      pauseUnpauseAdmin,
      freezeUnfreezeAdmin,
      enableDisableKYCAccountAdmin
    })
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
  ): Promise<TransactionResult> {
    return this.client.createNFTAsset({
      name,
      symbol,
      metadata,
      maxSupply,
      mintAdmin,
      pauseUnpauseAdmin,
      freezeUnfreezeAdmin,
      enableDisableKYCAccountAdmin
    })
  }

  async createFractionalAsset(
    name: string,
    symbol: string,
    metadata: string,
    maxSupply: bigint,
    mintAdmin: string,
    pauseUnpauseAdmin: string,
    freezeUnfreezeAdmin: string,
    enableDisableKYCAccountAdmin: string
  ): Promise<TransactionResult> {
    return this.client.createFractionalAsset({
      name,
      symbol,
      metadata,
      maxSupply,
      mintAdmin,
      pauseUnpauseAdmin,
      freezeUnfreezeAdmin,
      enableDisableKYCAccountAdmin
    })
  }

  async transfer(
    to: string,
    assetAddress: string,
    value: bigint,
    memo: string
  ): Promise<TransactionResult> {
    return this.client.transfer({
      to,
      assetAddress,
      value,
      memo
    })
  }

  async mintFTAsset(
    to: string,
    assetAddress: string,
    amount: bigint
  ): Promise<TransactionResult> {
    return this.client.mintFTAsset({
      to,
      assetAddress,
      amount
    })
  }

  async mintNFTAsset(
    assetAddress: string,
    metadata: string,
    to: string
  ): Promise<TransactionResult> {
    return this.client.mintNFTAsset({
      assetAddress,
      metadata,
      to
    })
  }

  async burnFTAsset(assetAddress: string, amount: bigint): Promise<TransactionResult> {
    return this.client.burnFTAsset({
      assetAddress,
      amount
    })
  }

  async burnNFTAsset(
    assetAddress: string,
    assetNftAddress: string
  ): Promise<TransactionResult> {
    return this.client.burnNFTAsset({
      assetAddress,
      assetNftAddress
    })
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
  ): Promise<TransactionResult> {
    return this.client.createDataset({
      assetAddress,
      name,
      description,
      categories,
      licenseName,
      licenseSymbol,
      licenseURL,
      metadata,
      isCommunityDataset
    })
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
  ): Promise<TransactionResult> {
    return this.client.updateDataset({
      datasetAddress,
      name,
      description,
      categories,
      licenseName,
      licenseSymbol,
      licenseURL,
      isCommunityDataset
    })
  }

  async initiateContributeDataset(
    datasetAddress: string,
    dataLocation: string,
    dataIdentifier: string
  ): Promise<TransactionResult> {
    return this.client.initiateContributeDataset({
      datasetAddress,
      dataLocation,
      dataIdentifier
    })
  }

  async completeContributeDataset(
    datasetContributionID: string,
    datasetAddress: string,
    datasetContributor: string
  ): Promise<TransactionResult> {
    return this.client.completeContributeDataset({
      datasetContributionID,
      datasetAddress,
      datasetContributor
    })
  }

  async publishDatasetToMarketplace(
    datasetAddress: string,
    paymentAssetAddress: string,
    datasetPricePerBlock: number
  ): Promise<TransactionResult> {
    return this.client.publishDatasetToMarketplace({
      datasetAddress,
      paymentAssetAddress,
      datasetPricePerBlock
    })
  }

  async subscribeDatasetMarketplace(
    marketplaceAssetAddress: string,
    paymentAssetAddress: string,
    numBlocksToSubscribe: number
  ): Promise<TransactionResult> {
    return this.client.subscribeDatasetMarketplace({
      marketplaceAssetAddress,
      paymentAssetAddress,
      numBlocksToSubscribe
    })
  }

  async claimMarketplacePayment(
    marketplaceAssetAddress: string,
    paymentAssetAddress: string
  ): Promise<TransactionResult> {
    return this.client.claimMarketplacePayment({
      marketplaceAssetAddress,
      paymentAssetAddress
    })
  }

  // Query Methods
  async getBalance(address: string): Promise<string> {
    try {
      return await this.client.getBalance(address)
    } catch (error) {
      console.error('Failed to get balance:', error)
      throw error
    }
  }

  async getAssetInfo(assetAddress: string): Promise<ActionOutput> {
    return this.executeWithTimeout(
      () => this.client.makeVmRequest('asset', { asset: assetAddress }),
      'Failed to get asset info'
    )
  }

  async getDatasetInfo(datasetID: string): Promise<ActionOutput> {
    return this.executeWithTimeout(
        () => this.client.makeVmRequest('dataset', { dataset: datasetID }),
        'Failed to get dataset info'
    )
}

  async getDatasetBalance(
    address: string,
    assetID: string
  ): Promise<ActionOutput> {
    return this.executeWithTimeout(
      () => this.client.makeVmRequest('datasetBalance', { address, assetID }),
      'Failed to get dataset balance'
    )
  }

  async getDatasetNFTInfo(nftID: string): Promise<ActionOutput> {
    return this.executeWithTimeout(
      () => this.client.makeVmRequest('datasetNFT', { nftID }),
      'Failed to get dataset NFT info'
    )
  }

  async getPendingContributions(datasetID: string): Promise<ActionOutput> {
    return this.executeWithTimeout(
      () => this.client.makeVmRequest('pendingContributions', { datasetID }),
      'Failed to get pending contributions'
    )
  }

  async fetchAbiFromServer() {
    return this.client.fetchAbiFromServer()
  }

  async getAbi() {
    return this.client.getAbi()
  }

  // async validateConnection() {
  //     return this.client.validateConnection();
  // }
  async validateConnection(): Promise<boolean> {
    try {
      return await this.client.validateConnection()
    } catch (error) {
      console.error('Connection validation failed:', error)
      return false
    }
  }

  async requestTestTokens(address: string): Promise<TxResult> {
    return this.client.requestTestTokens(address)
  }

  protected async executeWithTimeout<T>(
    operation: () => Promise<T>,
    errorMessage: string
  ): Promise<T> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)

      try {
        const result = await operation()
        clearTimeout(timeoutId)
        return result
      } finally {
        clearTimeout(timeoutId)
      }
    } catch (error) {
      console.error(`${errorMessage}:`, error)
      throw error
    }
  }
}
