// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { HyperSDKClient } from 'hypersdk-client'
import { Block, TxResult } from 'hypersdk-client/dist/apiTransformers'
import { HyperSDKHTTPClient } from 'hypersdk-client/dist/HyperSDKHTTPClient'
import { addressHexFromPubKey, Marshaler, VMABI } from 'hypersdk-client/dist/Marshaler'
import { PrivateKeySigner } from 'hypersdk-client/dist/PrivateKeySigner'
import {
  ActionData,
  ActionOutput,
  SignerIface
} from 'hypersdk-client/dist/types'
import { NuklaiABI } from './abi'
import { generateTxID, formatAddressFields, formatAddressForBalance } from "./utils/utils";
import {
  MAINNET_PUBLIC_API_BASE_URL,
  VM_NAME,
  VM_RPC_PREFIX
} from './endpoints'

export class NuklaiCoreApiClient {
  private httpClient: HyperSDKHTTPClient

  constructor(
    rpcEndpoint: string = MAINNET_PUBLIC_API_BASE_URL,
    private vmName: string = VM_NAME
  ) {
    this.httpClient = new HyperSDKHTTPClient(rpcEndpoint, vmName, 'coreapi')
  }

  public async getABI(): Promise<VMABI> {
    try {
      // Remove 'hypersdk.' since makeCoreAPIRequest adds it automatically
      const response = await this.httpClient.makeCoreAPIRequest('getABI', {})

      if (!response || typeof response !== 'object') {
        throw new Error('Invalid ABI response from server')
      }

      // Extract the ABI - the response should have an 'abi' property
      const abi = (response as any).abi
      if (!abi) {
        throw new Error('ABI not found in server response')
      }

      return abi
    } catch (error) {
      console.error('Failed to fetch ABI from coreapi:', error)
      throw error
    }
  }
}

export interface ActionInput {
  actionName: string
  data: Record<string, any>
}

export interface ActionResult extends Record<string, any> {}

export interface TransactionResult {
  txId: string;
  result: {
    timestamp: number;
    success: boolean;
    sponsor: string;
    units: {
      bandwidth: number;
      compute: number;
      storageRead: number;
      storageAllocate: number;
      storageWrite: number;
    };
    fee: number;
    input: ActionInput;
    results: ActionResult[];
  };
}

// Construct ActionInput
export function createActionInput(
  actionName: string,
  data: ActionInput['data']
): ActionInput {
  return {
    actionName,
    data
  }
}

export class NuklaiVMClient {
  private client: HyperSDKClient
  private httpClient: HyperSDKHTTPClient
  private coreApiClient: NuklaiCoreApiClient
  private marshaler: Marshaler
  private signer?: SignerIface
  private readonly baseEndpoint: string

  constructor(
    rpcEndpoint: string = MAINNET_PUBLIC_API_BASE_URL,
    private vmName: string = VM_NAME,
    private rpcPrefix: string = VM_RPC_PREFIX
  ) {
    this.baseEndpoint = rpcEndpoint.replace(/\/$/, '')
    this.coreApiClient = new NuklaiCoreApiClient(this.baseEndpoint, vmName)

    // Use direct endpoint without chain ID
    this.client = new HyperSDKClient(this.baseEndpoint, vmName, rpcPrefix)

    this.httpClient = new HyperSDKHTTPClient(
      this.baseEndpoint,
      vmName,
      rpcPrefix
    )

    this.marshaler = new Marshaler(NuklaiABI)
  }

  public async setSigner(input: string | SignerIface) {
    if (typeof input === 'string') {
      // Handle private key string
      const privateKeyOnly = input.slice(0, 64);
      const privateKeyArray = new Uint8Array(
        privateKeyOnly
          .match(/.{1,2}/g)!
          .map((byte: string) => parseInt(byte, 16))
      );
      this.signer = new PrivateKeySigner(privateKeyArray);
      await this.client.connectWallet({
        type: "private-key",
        privateKey: privateKeyArray,
      });
    } else {
      // For any SignerIface, we use ephemeral type but keep the actual signer
      this.signer = input;
      await this.client.connectWallet({
        type: 'ephemeral'
      });

      // Override the client's internal signer methods with our signer
      if ('signTx' in this.client) {
        (this.client as any).signer = this.signer;
      }
    }
  }


  async createFungibleToken(params: {
    name: string
    symbol: string
    decimals: number
    metadata: string
    maxSupply: bigint
    mintAdmin: string
    pauseUnpauseAdmin: string
    freezeUnfreezeAdmin: string
    enableDisableKYCAccountAdmin: string
  }): Promise<TransactionResult> {
    return this.sendAction('CreateAsset', {
      asset_type: 0, // FT
      name: params.name,
      symbol: params.symbol,
      decimals: params.decimals,
      metadata: params.metadata,
      max_supply: params.maxSupply.toString(),
      mint_admin: params.mintAdmin,
      pause_unpause_admin: params.pauseUnpauseAdmin,
      freeze_unfreeze_admin: params.freezeUnfreezeAdmin,
      enable_disable_kyc_account_admin: params.enableDisableKYCAccountAdmin
    })
  }

  async createNFTAsset(params: {
    name: string
    symbol: string
    metadata: string
    maxSupply: bigint
    mintAdmin: string
    pauseUnpauseAdmin: string
    freezeUnfreezeAdmin: string
    enableDisableKYCAccountAdmin: string
  }): Promise<TransactionResult> {
    return this.sendAction('CreateAsset', {
      asset_type: 1, // NFT
      name: params.name,
      symbol: params.symbol,
      decimals: 0, // NFTs has 0 decimals
      metadata: params.metadata,
      max_supply: params.maxSupply.toString(),
      mint_admin: params.mintAdmin,
      pause_unpause_admin: params.pauseUnpauseAdmin,
      freeze_unfreeze_admin: params.freezeUnfreezeAdmin,
      enable_disable_kyc_account_admin: params.enableDisableKYCAccountAdmin
    })
  }

  async createFractionalAsset(params: {
    name: string
    symbol: string
    metadata: string
    maxSupply: bigint
    mintAdmin: string
    pauseUnpauseAdmin: string
    freezeUnfreezeAdmin: string
    enableDisableKYCAccountAdmin: string
  }): Promise<TransactionResult> {
    return this.sendAction('CreateAsset', {
      asset_type: 2, // Fractional
      name: params.name,
      symbol: params.symbol,
      decimals: 0,
      metadata: params.metadata,
      max_supply: params.maxSupply.toString(),
      mint_admin: params.mintAdmin,
      pause_unpause_admin: params.pauseUnpauseAdmin,
      freeze_unfreeze_admin: params.freezeUnfreezeAdmin,
      enable_disable_kyc_account_admin: params.enableDisableKYCAccountAdmin
    })
  }

  async updateAsset(params: {
    assetAddress: string
    name: string
    symbol: string
    metadata: string
    maxSupply: bigint
    owner: string
    mintAdmin: string
    pauseUnpauseAdmin: string
    freezeUnfreezeAdmin: string
    enableDisableKYCAccountAdmin: string
  }): Promise<TransactionResult> {
    return this.sendAction('UpdateAsset', {
      ...params,
      maxSupply: params.maxSupply.toString()
    })
  }

  // Tokens
  async mintFTAsset(params: {
    to: string
    assetAddress: string
    amount: bigint
  }): Promise<TransactionResult> {
    return this.sendAction('MintAssetFT', {
      to: params.to,
      asset_address: params.assetAddress,
      value: params.amount.toString()
    })
  }

  async mintNFTAsset(params: {
    assetAddress: string
    metadata: string
    to: string
  }): Promise<TransactionResult> {
    return this.sendAction('MintAssetNFT', {
      asset_address: params.assetAddress,
      metadata: params.metadata,
      to: params.to
    })
  }

  async burnFTAsset(params: {
    assetAddress: string
    amount: bigint
  }): Promise<TransactionResult> {
    return this.sendAction('BurnAssetFT', {
      asset_address: params.assetAddress,
      value: params.amount.toString()
    })
  }

  async burnNFTAsset(params: {
    assetAddress: string
    assetNftAddress: string
  }): Promise<TransactionResult> {
    return this.sendAction('BurnAssetNFT', {
      asset_address: params.assetAddress,
      asset_nft_address: params.assetNftAddress
    })
  }

  async transfer(params: {
    to: string
    assetAddress: string
    value: bigint
    memo: string
  }): Promise<TransactionResult> {
    return this.sendAction('Transfer', {
      to: params.to,
      asset_address: params.assetAddress,
      value: params.value.toString(),
      memo: params.memo
    })
  }

  // Dataset Management
  async createDataset(params: {
    assetAddress: string
    name: string
    description: string
    categories: string
    licenseName: string
    licenseSymbol: string
    licenseURL: string
    metadata: string
    isCommunityDataset: boolean
  }): Promise<TransactionResult> {
    return this.sendAction('CreateDataset', {
      asset_address: params.assetAddress,
      name: params.name,
      description: params.description,
      categories: params.categories,
      license_name: params.licenseName,
      license_symbol: params.licenseSymbol,
      license_url: params.licenseURL,
      metadata: params.metadata,
      is_community_dataset: params.isCommunityDataset
    })
  }

  async updateDataset(params: {
    datasetAddress: string
    name: string
    description: string
    categories: string
    licenseName: string
    licenseSymbol: string
    licenseURL: string
    isCommunityDataset: boolean
  }): Promise<TransactionResult> {
    return this.sendAction('UpdateDataset', {
      dataset_address: params.datasetAddress,
      name: params.name,
      description: params.description,
      categories: params.categories,
      license_name: params.licenseName,
      license_symbol: params.licenseSymbol,
      license_url: params.licenseURL,
      is_community_dataset: params.isCommunityDataset
    })
  }

  // Dataset Contribution
  async initiateContributeDataset(params: {
    datasetAddress: string
    dataLocation: string
    dataIdentifier: string
  }): Promise<TransactionResult> {
    return this.sendAction('InitiateContributeDataset', {
      dataset_address: params.datasetAddress,
      data_location: params.dataLocation,
      data_identifier: params.dataIdentifier
    })
  }

  async completeContributeDataset(
      datasetContributionID: string,
      datasetAddress: string,
      datasetContributor: string
  ): Promise<TransactionResult> {
    return this.sendAction('CompleteContributeDataset', {
      dataset_contribution_id: datasetContributionID,
      dataset_address: datasetAddress,
      dataset_contributor: datasetContributor
    });
  }

  // Marketplace
  async publishDatasetToMarketplace(params: {
    datasetAddress: string
    paymentAssetAddress: string
    datasetPricePerBlock: number
  }): Promise<TransactionResult> {
    return this.sendAction('PublishDatasetMarketplace', {
      dataset_address: params.datasetAddress,
      payment_asset_address: params.paymentAssetAddress,
      dataset_price_per_block: params.datasetPricePerBlock
    })
  }

  async subscribeDatasetMarketplace(params: {
    marketplaceAssetAddress: string
    paymentAssetAddress: string
    numBlocksToSubscribe: number
  }): Promise<TransactionResult> {
    return this.sendAction('SubscribeDatasetMarketplace', {
      marketplace_asset_address: params.marketplaceAssetAddress,
      payment_asset_address: params.paymentAssetAddress,
      num_blocks_to_subscribe: params.numBlocksToSubscribe
    })
  }

  async claimMarketplacePayment(params: {
    marketplaceAssetAddress: string
    paymentAssetAddress: string
  }): Promise<TransactionResult> {
    return this.sendAction('ClaimMarketplacePayment', {
      marketplace_asset_address: params.marketplaceAssetAddress,
      payment_asset_address: params.paymentAssetAddress
    })
  }

  // Query Methods
  public async getBalance(address: string, assetAddress?: string): Promise<string> {
    try {
      const formattedAddress = formatAddressForBalance(address);
      const assetId = assetAddress
        ? formatAddressForBalance(assetAddress)
        : 'NAI';

      const result = await this.httpClient.makeVmAPIRequest<{ amount: number }>(
        'balance',
        { address: formattedAddress, asset: assetId }
      );
      // Return raw amount, let frontend handle decimal formatting
      return result.amount.toString();
    } catch (error) {
      console.error('Balance query failed:', error);
      throw error;
    }
  }

  // Validator Methods
  async getAllValidators(): Promise<ActionOutput> {
    try {
      return await this.httpClient.makeVmAPIRequest('allValidators', {})
    } catch (error) {
      console.error('Failed to get validators:', error)
      throw error
    }
  }

  async getStakedValidators(): Promise<ActionOutput> {
    try {
      return await this.httpClient.makeVmAPIRequest('stakedValidators', {})
    } catch (error) {
      console.error('Failed to get staked validators:', error)
      throw error
    }
  }

  async getValidatorStake(nodeID: string): Promise<ActionOutput> {
    try {
      return await this.httpClient.makeVmAPIRequest('validatorStake', {
        nodeID
      })
    } catch (error) {
      console.error('Failed to get validator stake:', error)
      throw error
    }
  }

  async getUserStake(params: {
    owner: string
    nodeID: string
  }): Promise<ActionOutput> {
    try {
      return await this.httpClient.makeVmAPIRequest('userStake', params)
    } catch (error) {
      console.error('Failed to get user stake:', error)
      throw error
    }
  }

  async getEmissionInfo(): Promise<ActionOutput> {
    try {
      return await this.httpClient.makeVmAPIRequest('emissionInfo', {})
    } catch (error) {
      console.error('Failed to get emission info:', error)
      throw error
    }
  }

  async getAssetInfo(asset: string): Promise<ActionOutput> {
    try {
      return await this.httpClient.makeVmAPIRequest('asset', { asset })
    } catch (error) {
      console.error('Failed to get asset info:', error)
      throw error
    }
  }

  async getTransactionStatus(txID: string): Promise<TxResult> {
    try {
      return await this.httpClient.makeIndexerRequest('tx', { txID })
    } catch (error) {
      console.error('Failed to get transaction status:', error)
      throw error
    }
  }

  public async fetchAbiFromServer(): Promise<VMABI> {
    try {
      const vmAbi = await this.coreApiClient.getABI()
      if (this.isValidABI(vmAbi)) {
        console.log('Successfully fetched ABI from server')
        this.marshaler = new Marshaler(vmAbi)
        return vmAbi
      } else {
        console.log('Invalid ABI from server, falling back to static ABI')
        this.marshaler = new Marshaler(NuklaiABI)
        return NuklaiABI
      }
    } catch (error) {
      console.log('Server ABI fetch failed, using static ABI')
      this.marshaler = new Marshaler(NuklaiABI)
      return NuklaiABI
    }
  }

  private isValidABI(abi: any): boolean {
    return (
      abi &&
      typeof abi === 'object' &&
      Array.isArray(abi.actions) &&
      Array.isArray(abi.types) &&
      abi.actions.length > 0 &&
      abi.types.length > 0
    )
  }

  public async getAbi(): Promise<VMABI> {
    try {
      return NuklaiABI
    } catch (error) {
      console.error('ABI retrieval failed:', error)
      throw error
    }
  }

  async executeAction(actionData: ActionData): Promise<string[]> {
    if (!this.signer) {
      throw new Error('Signer not set')
    }

    try {
      // Format addresses in the action data
      const formattedData = await formatAddressFields(actionData.data);

      // Check for Address type support through the encode method.
      try {
        this.marshaler.encode('Address', JSON.stringify({ value: [] }));
      } catch (error) {
        if (error instanceof Error && !error.message.includes('Type Address not found')) {
          // If the error is not about missing type, then Address type exists
          const serializedAction = this.marshaler.encodeTyped(
            actionData.actionName,
            JSON.stringify(formattedData)
          );

          // Get the properly formatted address for the public key
          const publicKeyAddress = addressHexFromPubKey(this.signer.getPublicKey());

          return await this.httpClient.executeActions(
            [serializedAction],
            publicKeyAddress
          );
        }
      }
      throw new Error('Address type not properly configured in ABI');
    } catch (error) {
      console.error('Failed to execute action:', error);
      throw error;
    }
  }

  private async sendAction(
    actionName: string,
    data: Record<string, unknown>
  ): Promise<TransactionResult> {
    if (!this.signer) {
      throw new Error('Signer not set');
    }

    try {
      // Format addresses in the action data
      const formattedData = await formatAddressFields(data);

      // Generate txID with formatted data
      const txId = generateTxID(actionName, formattedData);

      // Send transaction
      const rawResult = await this.client.sendTransaction([
        { actionName, data: formattedData }
      ]);

      return {
        txId,
        result: {
          timestamp: rawResult.timestamp,
          success: rawResult.success,
          sponsor: addressHexFromPubKey(this.signer.getPublicKey()),
          units: rawResult.units,
          fee: rawResult.fee,
          input: createActionInput(actionName, formattedData),
          results: rawResult.result.map((item) => ({
            ...item,
          }))
        }
      };
    } catch (error) {
      console.error('Transaction failed:', {
        error,
        actionName,
      });
      throw error;
    }
  }

  convertToNativeTokens(formattedBalance: string): bigint {
    return this.client.convertToNativeTokens(formattedBalance)
  }

  /**
   * Listen to new blocks from the chain
   * @param callback Function to be called when a new block is received
   * @param includeEmpty Optional parameter to include empty blocks (default: false)
   * @returns A function to unsubscribe from block updates
   */
  public async listenToBlocks(
    callback: (block: Block) => void,
    includeEmpty: boolean = false,
    pollingRateMs: number = 300
  ): Promise<() => void> {
    try {
      const unsubscribe = await this.client.listenToBlocks(
        callback,
        includeEmpty,
        pollingRateMs
      )
      return () => {
        if (unsubscribe) unsubscribe()
      }
    } catch (error) {
      console.error('Failed to initialize block listener:', error)
      throw error
    }
  }

  public async validateConnection(): Promise<boolean> {
    try {
      const abi = await this.getAbi()
      return !!abi
    } catch (error) {
      console.error('Connection validation failed:', error)
      return false
    }
  }

  async makeVmRequest<T>(
    method: string,
    params: Record<string, unknown> = {}
  ): Promise<T> {
    try {
      return await this.httpClient.makeVmAPIRequest<T>(method, params)
    } catch (error) {
      console.error(`VM request failed for method ${method}:`, error)
      throw error
    }
  }

  async requestTestTokens(address: string): Promise<TxResult> {
    try {
      return await this.httpClient.makeVmAPIRequest('faucet', { address })
    } catch (error) {
      console.error('Failed to request test tokens:', error)
      throw error
    }
  }
}
