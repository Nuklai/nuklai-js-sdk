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
import { MintAsset } from '../actions/mintAsset'
import { Transfer } from '../actions/transfer'
import {
  GetAssetInfoParams,
  GetAssetInfoResponse,
  GetBalanceParams,
  GetBalanceResponse,
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
import {
  NUKLAI_VMAPI_METHOD_PREFIX,
  NUKLAI_VMAPI_PATH
} from '../constants/endpoints'
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

  async sendMintAssetTransaction(
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

      const mintAsset: MintAsset = new MintAsset(to, asset, amountInUnits)

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo()
      const { submit, txSigned, err } =
        await hyperApiService.generateTransaction(
          genesisInfo.genesis,
          actionRegistry,
          authRegistry,
          [mintAsset],
          authFactory
        )
      if (err) {
        throw err
      }

      await submit()

      return txSigned.id().toString()
    } catch (error) {
      console.error(
        'Failed to create and submit transaction for "MintAsset" type',
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

  async getNFTInfo(
      getNFTInfoParams: GetNFTInfoParams
  ): Promise<GetNFTInfoResponse> {
    const params = getNFTInfoParams
    params.nftID = utils.toAssetID(params.nftID).toString()
    return this.callRpc<GetNFTInfoResponse>('nftInfo', params)
  }
}