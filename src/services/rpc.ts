// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import {
  auth,
  chain,
  common,
  config,
  services,
  utils
} from '@nuklai/hyperchain-sdk'
import { CreateAsset } from '../actions/createAsset'
import { MintDataset } from '../actions/MintDataset'
import { MintAssetFT } from '../actions/MintAssetFT';
import { MintAssetNFT } from '../actions/MintAssetNFT';
import { Transfer } from '../actions/transfer'
import { BurnAssetFT } from '../actions/BurnAssetFT';
import { BurnAssetNFT } from '../actions/BurnAssetNFT';
import {
  GetAssetInfoParams,
  GetAssetInfoResponse,
  GetBalanceParams,
  GetBalanceResponse,
  GetDatasetAssetInfoResponse,
  GetDatasetBalanceParams,
  GetDatasetBalanceResponse,
  GetDatasetInfoParams,
  GetDatasetInfoResponse,
  GetDatasetNFTInfoParams,
  GetDatasetNFTInfoResponse,
  GetEmissionInfoResponse,
  GetGenesisInfoResponse,
  GetNFTInfoParams,
  GetNFTInfoResponse,
  GetTransactionInfoParams,
  GetTransactionInfoResponse,
  GetUserStakeParams,
  GetUserStakeResponse,
  GetValidatorsResponse,
  GetValidatorStakeParams,
  GetValidatorStakeResponse,
} from '../common/models'
import { NUKLAI_VMAPI_METHOD_PREFIX, NUKLAI_VMAPI_PATH } from '../constants/endpoints'
import { DECIMALS } from '../constants/nuklaivm'

export class RpcService extends common.Api {
  constructor(protected configNuklai: config.NodeConfig) {
    super(
      configNuklai.baseApiUrl,
      `/ext/bc/${configNuklai.blockchainId}/${NUKLAI_VMAPI_PATH}`,
      NUKLAI_VMAPI_METHOD_PREFIX
    )
  }

  async getGenesisInfo(): Promise<GetGenesisInfoResponse> {
    const result = await this.callRpc<GetGenesisInfoResponse>('genesis')
    // Format the balance of each CustomAllocation
    result.genesis.customAllocation = result.genesis.customAllocation.map(
      (allocation) => ({
        ...allocation,
        balance: utils.formatBalance(allocation.balance, DECIMALS)
      })
    )
    result.genesis.emissionBalancer.maxSupply = utils.formatBalance(
      result.genesis.emissionBalancer.maxSupply,
      DECIMALS
    )
    return result
  }

  getTransactionInfo(
    getTransactionInfoParams: GetTransactionInfoParams
  ): Promise<GetTransactionInfoResponse> {
    return this.callRpc<GetTransactionInfoResponse>(
      'tx',
      getTransactionInfoParams
    )
  }

  async getBalance(
    getBalanceParams: GetBalanceParams
  ): Promise<GetBalanceResponse> {
    const params = getBalanceParams
    params.asset = utils.toAssetID(params.asset).toString()
    const result = await this.callRpc<GetBalanceResponse>('balance', params)
    result.amount = utils.formatBalance(result.amount, DECIMALS)
    return result
  }

  async getAssetInfo(
    getAssetInfoParams: GetAssetInfoParams
  ): Promise<GetAssetInfoResponse> {
    const params = getAssetInfoParams
    params.asset = utils.toAssetID(params.asset).toString()
    const result = await this.callRpc<GetAssetInfoResponse>('asset', params)
    result.supply = utils.formatBalance(result.supply, DECIMALS)
    return result
  }

  async getEmissionInfo(): Promise<GetEmissionInfoResponse> {
    const result = await this.callRpc<GetEmissionInfoResponse>('emissionInfo')
    result.totalSupply = utils.formatBalance(result.totalSupply, DECIMALS)
    result.maxSupply = utils.formatBalance(result.maxSupply, DECIMALS)
    result.totalStaked = utils.formatBalance(result.totalStaked, DECIMALS)
    result.rewardsPerEpoch = utils.formatBalance(
      result.rewardsPerEpoch,
      DECIMALS
    )
    result.emissionAccount.accumulatedReward = utils.formatBalance(
      result.emissionAccount.accumulatedReward,
      DECIMALS
    )
    return result
  }

  getAllValidators(): Promise<GetValidatorsResponse> {
    return this.callRpc<GetValidatorsResponse>('allValidators')
  }

  getStakedValidators(): Promise<GetValidatorsResponse> {
    return this.callRpc<GetValidatorsResponse>('stakedValidators')
  }

  getValidatorStake(
    getValidatorStakeParams: GetValidatorStakeParams
  ): Promise<GetValidatorStakeResponse> {
    return this.callRpc<GetValidatorStakeResponse>(
      'validatorStake',
      getValidatorStakeParams
    )
  }

  getUserStake(
    getUserStakeParams: GetUserStakeParams
  ): Promise<GetUserStakeResponse> {
    return this.callRpc<GetUserStakeResponse>('userStake', getUserStakeParams)
  }

  async sendTransferTransaction(
    to: string,
    asset: string,
    amount: number,
    memo: string,
    authFactory: auth.AuthFactory,
    hyperApiService: services.RpcService,
    actionRegistry: chain.ActionRegistry,
    authRegistry: chain.AuthRegistry
  ): Promise<string> {
    try {
      // Generate the from address using the private key
      const auth = authFactory.sign(new Uint8Array(0))
      const fromAddress = auth.address()

      const decimals = DECIMALS
      const amountInUnits = utils.parseBalance(amount, decimals)

      // Fetch the balance to ensure sufficient funds
      const balanceResponse = await this.getBalance({
        address: fromAddress.toString(),
        asset
      } as GetBalanceParams)
      if (
        utils.parseBalance(balanceResponse.amount, decimals) < amountInUnits
      ) {
        throw new Error('Insufficient balance')
      }

      const transfer: Transfer = new Transfer(to, asset, amountInUnits, memo)

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo()
      const { submit, txSigned, err } =
        await hyperApiService.generateTransaction(
          genesisInfo.genesis,
          actionRegistry,
          authRegistry,
          [transfer],
          authFactory
        )
      if (err) {
        throw err
      }

      await submit()

      return txSigned.id().toString()
    } catch (error) {
      console.error(
        'Failed to create and submit transaction for "Transfer" type',
        error
      )
      throw error
    }
  }

  async sendCreateAssetTransaction(
      assetType: number,
      name: string,
      symbol: string,
      decimals: number,
      metadata: string,
      uri: string,
      maxSupply: bigint,
      parentNFTMetadata: string | undefined,
      authFactory: auth.AuthFactory,
      hyperApiService: services.RpcService,
      actionRegistry: chain.ActionRegistry,
      authRegistry: chain.AuthRegistry
  ): Promise<{ txID: string; assetID: string }> {
    try {
      const createAsset: CreateAsset = new CreateAsset(
          assetType,
          name,
          symbol,
          decimals,
          metadata,
          uri,
          maxSupply,
          parentNFTMetadata
      )

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo()
      const { submit, txSigned, err } =
          await hyperApiService.generateTransaction(
              genesisInfo.genesis,
              actionRegistry,
              authRegistry,
              [createAsset],
              authFactory
          )
      if (err) {
        throw err
      }

      await submit()

      const txID = txSigned.id().toString()

      return {
        txID,
        assetID: utils.createActionID(txSigned.id(), 0).toString()
      }
    } catch (error) {
      console.error(
          'Failed to create and submit transaction for "CreateAsset" type',
          error
      )
      throw error
    }
  }

  async sendMintDatasetTransaction(
    to: string,
    assetID: string,
    name: string,
    description: string,
    metadata: string,
    isCommunityDataset: boolean,
    authFactory: auth.AuthFactory,
    hyperApiService: services.RpcService,
    actionRegistry: chain.ActionRegistry,
    authRegistry: chain.AuthRegistry
  ): Promise<string> {
    try {

      const mintDataset: MintDataset = new MintDataset(
          to,
          assetID,
          name,
          description,
          metadata,
          isCommunityDataset
      )

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo()
      const { submit, txSigned, err } =
        await hyperApiService.generateTransaction(
          genesisInfo.genesis,
          actionRegistry,
          authRegistry,
          [mintDataset],
          authFactory
        )
      if (err) {
        throw err
      }

      await submit()

      return txSigned.id().toString()
    } catch (error) {
      console.error(
        'Failed to create and submit transaction for "MintDataset" type',
        error
      )
      throw error
    }
  }

  async sendMintFTAssetTransaction(
      to: string,
      asset: string,
      amount: number,
      authFactory: auth.AuthFactory,
      hyperApiService: services.RpcService,
      actionRegistry: chain.ActionRegistry,
      authRegistry: chain.AuthRegistry
  ): Promise<string> {
    try {
      const amountInUnits = utils.parseBalance(amount, DECIMALS)
      const mintAssetFT: MintAssetFT = new MintAssetFT(to, asset, amountInUnits)

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo()
      const { submit, txSigned, err } =
          await hyperApiService.generateTransaction(
              genesisInfo.genesis,
              actionRegistry,
              authRegistry,
              [mintAssetFT],
              authFactory
          )
      if (err) {
        throw err
      }

      await submit()

      return txSigned.id().toString()
    } catch (error) {
      console.error(
          'Failed to create and submit transaction for "MintAssetFT" type',
          error
      )
      throw error
    }
  }

  async sendMintNFTAssetTransaction(
      to: string,
      asset: string,
      uniqueID: number,
      uri: string,
      metadata: string,
      authFactory: auth.AuthFactory,
      hyperApiService: services.RpcService,
      actionRegistry: chain.ActionRegistry,
      authRegistry: chain.AuthRegistry
  ): Promise<string> {
    try {
      const mintAssetNFT: MintAssetNFT = new MintAssetNFT(
          to,
          asset,
          BigInt(uniqueID),
          uri,
          metadata
      )

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo()
      const { submit, txSigned, err } =
          await hyperApiService.generateTransaction(
              genesisInfo.genesis,
              actionRegistry,
              authRegistry,
              [mintAssetNFT],
              authFactory
          )
      if (err) {
        throw err
      }

      await submit()

      return txSigned.id().toString()
    } catch (error) {
      console.error(
          'Failed to create and submit transaction for "MintAssetNFT" type',
          error
      )
      throw error
    }
  }

  async sendMintDatasetWithParentNFTTransaction(
      to: string,
      parentNFTID: string,
      name: string,
      description: string,
      metadata: string,
      isCommunityDataset: boolean,
      authFactory: auth.AuthFactory,
      hyperApiService: services.RpcService,
      actionRegistry: chain.ActionRegistry,
      authRegistry: chain.AuthRegistry
  ): Promise<{ txID: string; datasetID: string; nftID: string }> {
    try {
      // Validate the parent NFT
      const parentNFTInfo = await this.getNFTInfo({ nftID: parentNFTID })
      if (!parentNFTInfo) {
        throw new Error('Invalid parent NFT ID')
      }

      const mintDataset: MintDataset = new MintDataset(
          to,
          parentNFTInfo.assetID,
          name,
          description,
          metadata,
          isCommunityDataset,
          parentNFTID
      )

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo()
      const { submit, txSigned, err } =
          await hyperApiService.generateTransaction(
              genesisInfo.genesis,
              actionRegistry,
              authRegistry,
              [mintDataset],
              authFactory
          )
      if (err) {
        throw err
      }

      await submit()

      const txID = txSigned.id().toString()
      const datasetID = utils.createActionID(txSigned.id(), 0).toString()

      return {
        txID,
        datasetID,
        nftID: parentNFTID
      }
    } catch (error) {
      console.error(
          'Failed to create and submit transaction for "MintDatasetWithParentNFT" type',
          error
      )
      throw error
    }
  }

  async getFungibleTokenBalance(
      getBalanceParams: GetBalanceParams
  ): Promise<GetBalanceResponse> {
    const params = getBalanceParams
    params.asset = utils.toAssetID(params.asset).toString()
    const result = await this.callRpc<GetBalanceResponse>('balance', params)
    result.amount = utils.formatBalance(result.amount, DECIMALS)

    return result
  }

  async getNonFungibleTokenBalance(
      getBalanceParams: GetBalanceParams
  ): Promise<GetBalanceResponse> {
    const params = getBalanceParams
    params.asset = utils.toAssetID(params.asset).toString()
    // NFT balance should be in a count format, so we don't need to format it.
    return await this.callRpc<GetBalanceResponse>('nftBalance', params)
  }

  async getDatasetBalance(params: GetDatasetBalanceParams): Promise<GetDatasetBalanceResponse> {
    return await this.callRpc<GetDatasetBalanceResponse>('balance', params)
  }

  async getDatasetInfo(params: GetDatasetInfoParams): Promise<GetDatasetInfoResponse> {
    return await this.callRpc<GetDatasetInfoResponse>('datasetInfo', params)
  }

  async getDatasetAssetInfo(assetID: string): Promise<GetDatasetAssetInfoResponse> {
    return await this.callRpc<GetDatasetAssetInfoResponse>('assetInfo', {assetID})
  }

  async getDatasetNFTInfo(params: GetDatasetNFTInfoParams): Promise<GetDatasetNFTInfoResponse> {
    return await this.callRpc<GetDatasetNFTInfoResponse>('nftInfo', params)
  }

  async getFullDatasetInfo(datasetID: string): Promise<{
    datasetInfo: GetDatasetInfoResponse,
    assetInfo: GetDatasetAssetInfoResponse,
    balance: GetDatasetBalanceResponse,
  }> {
    const datasetInfo = await this.getDatasetInfo({ datasetID })
    const assetInfo = await this.getDatasetAssetInfo( datasetID )
    const balance = await this.getDatasetBalance( { address: datasetInfo.owner, assetID: datasetID })

    return {
      datasetInfo,
      assetInfo,
      balance,
    }
  }

  async getNFTInfo(
      getNFTInfoParams: GetNFTInfoParams
  ): Promise<GetNFTInfoResponse> {
    const params = getNFTInfoParams
    params.nftID = utils.toAssetID(params.nftID).toString()
    return this.callRpc<GetNFTInfoResponse>('nftInfo', params)
  }

  async sendBurnAssetFTTransaction(
      asset: string,
      amount: number,
      authFactory: auth.AuthFactory,
      hyperApiService: services.RpcService,
      actionRegistry: chain.ActionRegistry,
      authRegistry: chain.AuthRegistry
  ): Promise<string> {
    try {
      const amountInUnits = utils.parseBalance(amount, DECIMALS)
      const burnAssetFT: BurnAssetFT = new BurnAssetFT(asset, amountInUnits)

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo()
      const { submit, txSigned, err } =
          await hyperApiService.generateTransaction(
              genesisInfo.genesis,
              actionRegistry,
              authRegistry,
              [burnAssetFT],
              authFactory
          )
      if (err) {
        throw err
      }

      await submit()

      return txSigned.id().toString()
    } catch (error) {
      console.error(
          'Failed to create and submit transaction for "BurnAssetFT" type',
          error
      )
      throw error
    }
  }

  async sendBurnAssetNFTTransaction(
      asset: string,
      nftID: string,
      authFactory: auth.AuthFactory,
      hyperApiService: services.RpcService,
      actionRegistry: chain.ActionRegistry,
      authRegistry: chain.AuthRegistry
  ): Promise<string> {
    try {
      const burnAssetNFT: BurnAssetNFT = new BurnAssetNFT(asset, nftID)

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo()
      const { submit, txSigned, err } =
          await hyperApiService.generateTransaction(
              genesisInfo.genesis,
              actionRegistry,
              authRegistry,
              [burnAssetNFT],
              authFactory
          )
      if (err) {
        throw err
      }

      await submit()

      return txSigned.id().toString()
    } catch (error) {
      console.error(
          'Failed to create and submit transaction for "BurnAssetNFT" type',
          error
      )
      throw error
    }
  }
}