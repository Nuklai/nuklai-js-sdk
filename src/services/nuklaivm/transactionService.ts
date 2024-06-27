// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { createActionID } from 'utils/hashing'
import { CreateAsset } from '../../actions/createAsset'
import { Transfer } from '../../actions/transfer'
import { AuthFactory } from '../../auth/auth'
import {
  GetBalanceParams,
  GetTransactionInfoParams,
  GetTransactionInfoResponse
} from '../../common/nuklaiApiModels'
import { NodeConfig } from '../../config'
import { DECIMALS } from '../../constants/nuklaivm'
import { parseBalance } from '../../utils/utils'
import { HyperApiService } from '../hyperApiService'
import { NuklaiApiService } from '../nuklaiApiService'
import { AssetService } from './assetService'

export class TransactionService extends NuklaiApiService {
  private assetService: AssetService
  private hyperApiService: HyperApiService

  constructor(config: NodeConfig) {
    super(config)
    this.assetService = new AssetService(config)
    this.hyperApiService = new HyperApiService(config)
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
    amount: string,
    memo: string,
    authFactory: AuthFactory
  ): Promise<string> {
    try {
      // Generate the from address using the private key
      const auth = authFactory.sign(new Uint8Array(0))
      const fromAddress = auth.address()

      const decimals = DECIMALS
      const amountInUnits = parseBalance(amount, decimals)

      // Fetch the balance to ensure sufficient funds
      const balanceResponse = await this.assetService.getBalance({
        address: fromAddress.toString(),
        asset
      } as GetBalanceParams)
      if (parseBalance(balanceResponse.amount, decimals) < amountInUnits) {
        throw new Error('Insufficient balance')
      }

      const transfer: Transfer = new Transfer(to, asset, amountInUnits, memo)

      const { submit, txSigned, err } =
        await this.hyperApiService.generateTransaction([transfer], authFactory)
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
    authFactory: AuthFactory
  ): Promise<{ txID: string; assetID: string }> {
    try {
      const createAsset: CreateAsset = new CreateAsset(
        symbol,
        decimals,
        metadata
      )

      const { submit, txSigned, err } =
        await this.hyperApiService.generateTransaction(
          [createAsset],
          authFactory
        )
      if (err) {
        throw err
      }

      await submit()

      const txID = txSigned.id().toString()

      return { txID, assetID: createActionID(txSigned.id(), 0).toString() }
    } catch (error) {
      console.error(
        'Failed to create and submit transaction for "CreateAsset" type',
        error
      )
      throw error
    }
  }
}
