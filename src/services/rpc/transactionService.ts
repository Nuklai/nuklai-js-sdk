// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { auth, config, services, utils } from '@nuklai/hyperchain-sdk'
import { CreateAsset } from '../../actions/createAsset'
import { MintAsset } from '../../actions/mintAsset'
import { Transfer } from '../../actions/transfer'
import {
  GetBalanceParams,
  GetGenesisInfoResponse,
  GetTransactionInfoParams,
  GetTransactionInfoResponse
} from '../../common/models'
import { DECIMALS } from '../../constants/nuklaivm'
import { NuklaiApiService } from '../nuklaiApiService'
import { AssetService } from './assetService'
import { GenesisService } from './genesisService'

export class TransactionService extends NuklaiApiService {
  private hyperApiService: services.RpcService
  private genesisApiService: GenesisService
  private assetService: AssetService

  constructor(configNuklai: config.NodeConfig) {
    super(configNuklai)
    this.hyperApiService = new services.RpcService(configNuklai)
    this.genesisApiService = new GenesisService(configNuklai)
    this.assetService = new AssetService(configNuklai)
  }

  getTransactionInfo(
    getTransactionInfoParams: GetTransactionInfoParams
  ): Promise<GetTransactionInfoResponse> {
    return this.callRpc<GetTransactionInfoResponse>(
      'tx',
      getTransactionInfoParams
    )
  }

  async sendTransferTransaction(
    to: string,
    asset: string,
    amount: number,
    memo: string,
    authFactory: auth.AuthFactory
  ): Promise<string> {
    try {
      // Generate the from address using the private key
      const auth = authFactory.sign(new Uint8Array(0))
      const fromAddress = auth.address()

      const decimals = DECIMALS
      const amountInUnits = utils.parseBalance(amount, decimals)

      // Fetch the balance to ensure sufficient funds
      const balanceResponse = await this.assetService.getBalance({
        address: fromAddress.toString(),
        asset
      } as GetBalanceParams)
      if (
        utils.parseBalance(balanceResponse.amount, decimals) < amountInUnits
      ) {
        throw new Error('Insufficient balance')
      }

      const transfer: Transfer = new Transfer(to, asset, amountInUnits, memo)

      const genesisInfo: GetGenesisInfoResponse =
        await this.genesisApiService.getGenesisInfo()
      const { submit, txSigned, err } =
        await this.hyperApiService.generateTransaction(
          genesisInfo.genesis,
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
    symbol: string,
    decimals: number,
    metadata: string,
    authFactory: auth.AuthFactory
  ): Promise<{ txID: string; assetID: string }> {
    try {
      const createAsset: CreateAsset = new CreateAsset(
        symbol,
        decimals,
        metadata
      )

      const genesisInfo: GetGenesisInfoResponse =
        await this.genesisApiService.getGenesisInfo()
      const { submit, txSigned, err } =
        await this.hyperApiService.generateTransaction(
          genesisInfo.genesis,
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
    authFactory: auth.AuthFactory
  ): Promise<string> {
    try {
      const decimals = DECIMALS
      const amountInUnits = utils.parseBalance(amount, decimals)

      const mintAsset: MintAsset = new MintAsset(to, asset, amountInUnits)

      const genesisInfo: GetGenesisInfoResponse =
        await this.genesisApiService.getGenesisInfo()
      const { submit, txSigned, err } =
        await this.hyperApiService.generateTransaction(
          genesisInfo.genesis,
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
}
