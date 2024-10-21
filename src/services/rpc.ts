// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { auth, chain, common, config, services, utils } from '@nuklai/hyperchain-sdk'
import { CreateAsset } from '../actions/createAsset'
import { CreateAssetFT } from "../actions/CreateAssetFT"
import { CreateDataset } from 'actions/CreateDataset'
import { MintDataset } from '../actions/MintDataset'
import { MintAssetFT } from "../actions/MintAssetFT"
import { MintAssetNFT } from "../actions/MintAssetNFT"
import { Transfer } from '../actions/transfer'
import { BurnAssetFT } from "../actions/BurnAssetFT"
import { BurnAssetNFT } from "../actions/BurnAssetNFT"
import { UpdateAsset } from "../actions/UpdateAsset"
import { UpdateDataset } from "../actions/UpdateDataset"
import { InitiateContributeDataset } from "../actions/InitiateContributeDataset";
import { CompleteContributeDataset } from "../actions/CompleteContributeDataset";
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
  PendingContributionsResponse,
  GetDatasetMarketplaceInfoResponse, CompleteContributeDatasetResult, InitiateContributeDatasetResult, PublishDatasetMarketplaceResult, GetPublishTransactionResponse, GetPublishTransactionParams,
} from '../common/models'
import { NUKLAI_VMAPI_METHOD_PREFIX, NUKLAI_VMAPI_PATH } from '../constants/endpoints'
import { DECIMALS } from '../constants'
import {PublishDatasetMarketplace} from "../actions/PublishDatasetMarketplace";
import {ClaimMarketplacePayment} from "../actions/ClaimMarketplacePayment";
import {SubscribeDatasetMarketplace} from "../actions/SubscribeDatasetMarketplace";

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

  async transfer(
      to: string,
      asset: string,
      amount: number,
      memo: string,
      nftID: string | undefined,
      authFactory: auth.AuthFactory,
      hyperApiService: services.RpcService,
      actionRegistry: chain.ActionRegistry,
      authRegistry: chain.AuthRegistry
  ): Promise<string> {
    try {
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

      const transfer: Transfer = new Transfer(to, asset, amountInUnits, memo, nftID)

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo()
      const { submit, txSigned, err } = await hyperApiService.generateTransaction(
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

  async transferNFT(
      to: string,
      asset: string,
      nftID: string,
      memo: string,
      authFactory: auth.AuthFactory,
      hyperApiService: services.RpcService,
      actionRegistry: chain.ActionRegistry,
      authRegistry: chain.AuthRegistry
  ): Promise<string> {
    return this.transfer(to, asset, 1, memo, nftID, authFactory, hyperApiService, actionRegistry, authRegistry)
  }

  async createAsset(
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
      console.log('Creating asset with parameters:', {
        assetType,
        name,
        symbol,
        decimals,
        metadata,
        uri,
        maxSupply: maxSupply.toString(),
        parentNFTMetadata
      });

      const createAsset: CreateAsset = new CreateAsset(
          assetType,
          name,
          symbol,
          decimals,
          metadata,
          uri,
          maxSupply,
          parentNFTMetadata
      );

      console.log('CreateAsset object created:', createAsset);
      console.log('CreateAsset size:', createAsset.size());

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo();
      console.log('Genesis info retrieved:', genesisInfo);

      console.log('Generating transaction...');
      const { submit, txSigned, err } =
          await hyperApiService.generateTransaction(
              genesisInfo.genesis,
              actionRegistry,
              authRegistry,
              [createAsset],
              authFactory
          )
      if (err) {
        console.error('Error generating transaction:', err);
        throw err
      }

      console.log('Transaction generated successfully. Submitting...');
      await submit()

      const txID = txSigned.id().toString()
      const assetID = utils.createActionID(txSigned.id(), 0).toString()

      console.log('Asset created successfully:', { txID, assetID });
      return { txID, assetID }
    } catch (error) {
      console.error(
          'Failed to create and submit transaction for "CreateAsset" type',
          error
      )
      console.error('Error stack:', (error as Error).stack);
      throw error
    }
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
      enableDisableKYCAccountAdmin: string,
      authFactory: auth.AuthFactory,
      hyperApiService: services.RpcService,
      actionRegistry: chain.ActionRegistry,
      authRegistry: chain.AuthRegistry
  ): Promise<string> {
    try {
      const createAssetFT = new CreateAssetFT(
          name,
          symbol,
          decimals,
          metadata,
          maxSupply,
          mintAdmin,
          pauseUnpauseAdmin,
          freezeUnfreezeAdmin,
          enableDisableKYCAccountAdmin
      );

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo();
      const { submit, txSigned, err } =
          await hyperApiService.generateTransaction(
              genesisInfo.genesis,
              actionRegistry,
              authRegistry,
              [createAssetFT],
              authFactory
          );
      if (err) {
        throw err;
      }

      await submit();

      return txSigned.id().toString();
    } catch (error) {
      console.error(
          'Failed to create and submit transaction for "CreateAssetFT" type',
          error
      );
      throw error;
    }
  }

  async createDataset(
    assetAddress: string,
      name: string,
      name: string,
      name: string,
      symbol: string,
    name: string,
      symbol: string,
    name: string,
      name: string,
      symbol: string,
    name: string,
      symbol: string,
    description: string,
    categories: string,
    licenseName: string,
    licenseSymbol: string,
    licenseURL: string,
    metadata: string,
    isCommunityDataset: boolean,
    authFactory: auth.AuthFactory,
    hyperApiService: services.RpcService,
    actionRegistry: chain.ActionRegistry,
    authRegistry: chain.AuthRegistry
  ): Promise<string> {
    try {
      const createDataset: CreateDataset = new CreateDataset(
        assetAddress,
        name,
        description,
        categories,
        licenseName,
        licenseSymbol,
        licenseURL,
        metadata,
        isCommunityDataset
      );

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo();
      const { submit, txSigned, err } = await hyperApiService.generateTransaction(
        genesisInfo.genesis,
        actionRegistry,
        authRegistry,
        [createDataset],
        authFactory
      );
      if (err) {
        throw err;
      }

      await submit();

      return txSigned.id().toString();
    } catch (error) {
      console.error('Failed to create and submit transaction for "CreateDataset" type', error);
      throw error;
    }
  }

  async mintDataset(
    assetAddress: string,
    to: string,
    value: bigint,
    authFactory: auth.AuthFactory,
    hyperApiService: services.RpcService,
    actionRegistry: chain.ActionRegistry,
    authRegistry: chain.AuthRegistry
  ): Promise<string> {
    try {
      const mintDataset: MintDataset = new MintDataset(assetAddress, to, value);

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo();
      const { submit, txSigned, err } = await hyperApiService.generateTransaction(
        genesisInfo.genesis,
        actionRegistry,
        authRegistry,
        [mintDataset],
        authFactory
      );
      if (err) {
        throw err;
      }

      await submit();

      return txSigned.id().toString();
    } catch (error) {
      console.error('Failed to create and submit transaction for "MintDataset" type', error);
      throw error;
    }
  }

  async mintFTAsset(
      to: string,
      assetAddress: string,
      amount: number,
      authFactory: auth.AuthFactory,
      hyperApiService: services.RpcService,
      actionRegistry: chain.ActionRegistry,
      authRegistry: chain.AuthRegistry
  ): Promise<string> {
    try {
      const amountInUnits = utils.parseBalance(amount, DECIMALS)
      const mintAssetFT: MintAssetFT = new MintAssetFT(to, assetAddress, amountInUnits)

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

  async mintNFTAsset(
      assetAddress: string,
      metadata: string,
      to: string,
      authFactory: auth.AuthFactory,
      hyperApiService: services.RpcService,
      actionRegistry: chain.ActionRegistry,
      authRegistry: chain.AuthRegistry
  ): Promise<string> {
    try {
      const mintAssetNFT: MintAssetNFT = new MintAssetNFT(assetAddress, metadata, to);

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo();
      const { submit, txSigned, err } = await hyperApiService.generateTransaction(
          genesisInfo.genesis,
          actionRegistry,
          authRegistry,
          [mintAssetNFT],
          authFactory
      );
      if (err) {
        throw err;
      }

      await submit();

      return txSigned.id().toString()
    } catch (error) {
      console.error('Failed to create and submit transaction for "MintAssetNFT" type', error)
      throw error
    }
  }

  async updateAsset(
      assetAddress: string,
      name: string,
      symbol: string,
      metadata: string,
      maxSupply: bigint,
      owner: string,
      mintAdmin: string,
      pauseUnpauseAdmin: string,
      freezeUnfreezeAdmin: string,
      enableDisableKYCAccountAdmin: string,
      authFactory: auth.AuthFactory,
      hyperApiService: services.RpcService,
      actionRegistry: chain.ActionRegistry,
      authRegistry: chain.AuthRegistry
  ): Promise<string> {
    try {
      const updateAsset: UpdateAsset = new UpdateAsset(
          assetAddress,
          name,
          symbol,
          metadata,
          maxSupply,
          owner,
          mintAdmin,
          pauseUnpauseAdmin,
          freezeUnfreezeAdmin,
          enableDisableKYCAccountAdmin
      )

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo()
      const { submit, txSigned, err } = await hyperApiService.generateTransaction(
          genesisInfo.genesis,
          actionRegistry,
          authRegistry,
          [updateAsset],
          authFactory
      )
      if (err) {
        throw err
      }

      await submit()

      return txSigned.id().toString()
    } catch (error) {
      console.error('Failed to create and submit transaction for "UpdateAsset" type', error)
      throw error
    }
  }

  async updateDataset(
      datasetID: string,
      name: string,
      description: string,
      categories: string,
      licenseName: string,
      licenseSymbol: string,
      licenseURL: string,
      isCommunityDataset: boolean,
      authFactory: auth.AuthFactory,
      hyperApiService: services.RpcService,
      actionRegistry: chain.ActionRegistry,
      authRegistry: chain.AuthRegistry
  ): Promise<string> {
    try {
      const updateDataset: UpdateDataset = new UpdateDataset(
          datasetID,
          name,
          description,
          categories,
          licenseName,
          licenseSymbol,
          licenseURL,
          isCommunityDataset
      )

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo()
      const { submit, txSigned, err } = await hyperApiService.generateTransaction(
          genesisInfo.genesis,
          actionRegistry,
          authRegistry,
          [updateDataset],
          authFactory
      )
      if (err) {
        throw err
      }

      await submit()

      return txSigned.id().toString()
    } catch (error) {
      console.error('Failed to create and submit transaction for "UpdateDataset" type', error)
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

  async getPendingContributions(datasetID: string): Promise<PendingContributionsResponse> {
    return this.callRpc<PendingContributionsResponse>('pendingContributions', { datasetID })
  }

  async getNFTInfo(
      getNFTInfoParams: GetNFTInfoParams
  ): Promise<GetNFTInfoResponse> {
    const params = getNFTInfoParams
    params.nftID = utils.toAssetID(params.nftID).toString()
    return this.callRpc<GetNFTInfoResponse>('nftInfo', params)
  }

  async checkNFTOwnership(nftID: string, address: string): Promise<boolean> {
    const nftInfo = await this.getNFTInfo({ nftID })
    return nftInfo.owner === address
  }

  async burnFTAsset(
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

  async burnNFTAsset(
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

  async initiateContributeDataset(
      datasetID: string,
      dataLocation: string,
      dataIdentifier: string,
      collateralAssetID: string,
      collateralAmount: bigint,
      authFactory: auth.AuthFactory,
      hyperApiService: services.RpcService,
      actionRegistry: chain.ActionRegistry,
      authRegistry: chain.AuthRegistry
    ): Promise<InitiateContributeDatasetResult> {
    try {

      const initiateAction = new InitiateContributeDataset(
          datasetID,
          dataLocation,
          dataIdentifier,
          collateralAssetID,
          collateralAmount
      );

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo()
      const { submit, txSigned, err } = await hyperApiService.generateTransaction(
          genesisInfo.genesis,
          actionRegistry,
          authRegistry,
          [initiateAction],
          authFactory
        );
      if (err) {
        throw err
      }

      await submit()

      const result: InitiateContributeDatasetResult = {
        txID: txSigned.id().toString(),
        collateralAssetID: collateralAssetID,
        collateralAmountRefunded: collateralAmount
      };

      return result;
    } catch (error) {
      console.error(
          'Failed to create and submit transaction for "InitiateContributeDataset" type',
          error
      )
      throw error
    }
  }

  async completeContributeDataset(
      datasetID: string,
      contributor: string,
      uniqueNFTIDForContributor: bigint,
      collateralAssetID: string,
      collateralAmount: bigint,
      dataLocation: string,
      dataIdentifier: string,
      authFactory: auth.AuthFactory,
      hyperApiService: services.RpcService,
      actionRegistry: chain.ActionRegistry,
      authRegistry: chain.AuthRegistry
  ): Promise<CompleteContributeDatasetResult> {
    try {
      const completeAction = new CompleteContributeDataset(
          datasetID,
          contributor,
          uniqueNFTIDForContributor,
          collateralAssetID,
          collateralAmount,
          dataLocation,
          dataIdentifier
      )

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo()
      const { submit, txSigned, err } = await hyperApiService.generateTransaction(
          genesisInfo.genesis,
          actionRegistry,
          authRegistry,
          [completeAction],
          authFactory
      )
      if (err) {
        throw err
      }

      await submit()

      const result: CompleteContributeDatasetResult = {
        txID: txSigned.id().toString(),
        collateralAssetID: collateralAssetID,
        collateralAmountRefunded: collateralAmount,
        datasetID: datasetID,
        datasetChildNftID: utils.createActionID(txSigned.id(), 1).toString(),
        to: contributor,
        dataLocation: dataLocation,
        dataIdentifier: dataIdentifier
      }

      return result
    } catch (error) {
      console.error('Failed to complete dataset contribution', error)
      throw error
    }
  }

  async subscribeDatasetMarketplace(
      datasetID: string,
      marketplaceAssetID: string,
      assetForPayment: string,
      numBlocksToSubscribe: bigint,
      authFactory: auth.AuthFactory,
      hyperApiService: services.RpcService,
      actionRegistry: chain.ActionRegistry,
      authRegistry: chain.AuthRegistry
  ): Promise<string> {
    try {
      const subscribeAction = new SubscribeDatasetMarketplace(
          datasetID,
          marketplaceAssetID,
          assetForPayment,
          numBlocksToSubscribe
      )

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo()
      const { submit, txSigned, err } = await hyperApiService.generateTransaction(
          genesisInfo.genesis,
          actionRegistry,
          authRegistry,
          [subscribeAction],
          authFactory
      )
      if (err) {
        throw err
      }

      await submit()

      return txSigned.id().toString()
    } catch (error) {
      console.error('Failed to subscribe to dataset in marketplace', error)
      throw error
    }
  }

  async claimMarketplacePayment(
      datasetID: string,
      marketplaceAssetID: string,
      assetForPayment: string,
      authFactory: auth.AuthFactory,
      hyperApiService: services.RpcService,
      actionRegistry: chain.ActionRegistry,
      authRegistry: chain.AuthRegistry
  ): Promise<string> {
    try {
      const claimAction = new ClaimMarketplacePayment(datasetID, marketplaceAssetID, assetForPayment)

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo()
      const { submit, txSigned, err } = await hyperApiService.generateTransaction(
          genesisInfo.genesis,
          actionRegistry,
          authRegistry,
          [claimAction],
          authFactory
      )
      if (err) {
        throw err
      }

      await submit()

      return txSigned.id().toString()
    } catch (error) {
      console.error('Failed to claim marketplace payment', error)
      throw error
    }
  }

  async getDatasetInfoFromMarketplace(datasetID: string): Promise<GetDatasetMarketplaceInfoResponse> {
    return this.callRpc<GetDatasetMarketplaceInfoResponse>('datasetMarketplaceInfo', { datasetID })
  }

  async getPublishTransactionResponse(params: GetPublishTransactionParams): Promise<GetPublishTransactionResponse> {
    return this.callRpc<GetPublishTransactionResponse>('publishTx', params);
  }

  async publishDatasetToMarketplace(
      datasetID: string,
      baseAssetID: string,
      basePrice: bigint,
      authFactory: auth.AuthFactory,
      hyperApiService: services.RpcService,
      actionRegistry: chain.ActionRegistry,
      authRegistry: chain.AuthRegistry
  ): Promise<PublishDatasetMarketplaceResult> {
    try {
      const publishAction = new PublishDatasetMarketplace(datasetID, baseAssetID, basePrice);

      const genesisInfo: GetGenesisInfoResponse = await this.getGenesisInfo()

      const { submit, txSigned, err } = await hyperApiService.generateTransaction(
          genesisInfo.genesis,
          actionRegistry,
          authRegistry,
          [publishAction],
          authFactory
      )

      if (err) {
            throw err
      }

      await submit()

      // Fetch the published transaction response
      const txResult = await this.getPublishTransactionResponse({ txID: txSigned.id().toString() })

      return txResult;
    } catch (error) {
      console.error(
          'Failed to create and submit transaction for "PublishDatasetToMarketplace" type',
          error
      )
        throw error
    }
  }
}