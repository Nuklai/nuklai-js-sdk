// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Id } from '@avalabs/avalanchejs'
import { auth, chain, config, services, utils } from '@nuklai/hyperchain-sdk'
import { Transfer } from 'actions/transfer'
import { GetBalanceParams, GetGenesisInfoResponse } from 'common/models'
import { DECIMALS } from 'constants/nuklaivm'
import { RpcService } from './rpc'

export class WebSocketService extends services.WebSocketService {
  private rpcService: RpcService

  constructor(config: config.NodeConfig) {
    super(config)
    this.rpcService = new RpcService(config)
  }

  async sendTransferTransactionAndWait(
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
      const balanceResponse = await this.rpcService.getBalance({
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
        await this.rpcService.getGenesisInfo()
      let { txSigned, err } = await hyperApiService.generateTransaction(
        genesisInfo.genesis,
        actionRegistry,
        authRegistry,
        [transfer],
        authFactory
      )
      if (err) {
        throw err
      }

      err = await this.registerTx(txSigned)
      if (err) {
        throw err
      }

      let resultTxID: Id | null = null

      while (!resultTxID) {
        const { txId, dErr, err } = await this.listenTx()
        if (dErr) {
          throw dErr
        }
        if (err) {
          throw err
        }
        if (txId.toString() === txSigned.id().toString()) {
          resultTxID = txId
          break
        }
      }

      return txSigned.id().toString()
    } catch (error) {
      console.error(
        'Failed to create and submit transaction for "Transfer" type',
        error
      )
      throw error
    }
  }
}
