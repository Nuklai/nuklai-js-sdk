// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Id } from '@avalabs/avalanchejs'
import { Action } from '../actions/action'
import { AuthFactory } from '../auth/auth'
import { Api } from '../common/baseApi'
import {
  GetLastAcceptedResponse,
  GetNetworkInfoResponse,
  GetUnitPricesResponse,
  GetWarpSignaturesResponse,
  PingResponse,
  SubmitTransactionResponse
} from '../common/hyperApiModels'
import { GetGenesisInfoResponse } from '../common/nuklaiApiModels'
import { NodeConfig } from '../config'
import {
  NUKLAI_COREAPI_METHOD_PREFIX,
  NUKLAI_COREAPI_PATH
} from '../constants/endpoints'
import { BaseTx } from '../transactions/baseTx'
import { estimateUnits, mulSum } from '../transactions/fees'
import { Transaction } from '../transactions/transaction'
import { getUnixRMilli } from '../utils/utils'
import { GenesisService } from './nuklaivm/genesisService'

export class HyperApiService extends Api {
  private genesisApiService: GenesisService

  constructor(protected config: NodeConfig) {
    super(
      config.baseApiUrl,
      `/ext/bc/${config.blockchainId}/${NUKLAI_COREAPI_PATH}`,
      NUKLAI_COREAPI_METHOD_PREFIX
    )
    this.genesisApiService = new GenesisService(config)
  }

  ping(): Promise<PingResponse> {
    return this.callRpc<PingResponse>('ping')
  }

  // Retrieve network IDs
  getNetworkInfo(): Promise<GetNetworkInfoResponse> {
    return this.callRpc<GetNetworkInfoResponse>('network')
  }

  // Get information about the last accepted block
  getLastAccepted(): Promise<GetLastAcceptedResponse> {
    return this.callRpc<GetLastAcceptedResponse>('lastAccepted')
  }

  // Fetch current unit prices for transactions
  getUnitPrices(): Promise<GetUnitPricesResponse> {
    return this.callRpc<GetUnitPricesResponse>('unitPrices')
  }

  // Fetch warp signatures associated with a transaction
  getWarpSignatures(txID: string): Promise<GetWarpSignaturesResponse> {
    return this.callRpc<GetWarpSignaturesResponse>('getWarpSignatures', {
      txID
    })
  }

  // Submit a transaction to the network
  async submitTransaction(tx: Uint8Array): Promise<SubmitTransactionResponse> {
    // Convert Uint8Array to base64 string
    const txBase64 = Array.from(tx)
    return this.callRpc<SubmitTransactionResponse>('submitTx', { tx: txBase64 })
  }

  async generateTransaction(
    actions: Action[],
    authFactory: AuthFactory
  ): Promise<{
    submit: () => Promise<SubmitTransactionResponse>
    txSigned: Transaction
    err: Error | undefined
  }> {
    try {
      // Construct the base transaction
      // Set timestamp
      const genesisInfo: GetGenesisInfoResponse =
        await this.genesisApiService.getGenesisInfo()
      const timestamp: bigint = getUnixRMilli(
        Date.now(),
        genesisInfo.genesis.validityWindow
      )
      // Set chain ID
      const chainId = Id.fromString(this.config.blockchainId)
      // Set maxFee
      const unitPrices: GetUnitPricesResponse = await this.getUnitPrices()
      const units = estimateUnits(genesisInfo.genesis, actions, authFactory)
      const [maxFee, error] = mulSum(unitPrices.unitPrices, units)
      if (error) {
        return {
          submit: async () => {
            throw new Error('Transaction failed, cannot submit.')
          },
          txSigned: {} as Transaction,
          err: error as Error
        }
      }

      const base = new BaseTx(timestamp, chainId, maxFee)

      const tx: Transaction = new Transaction(base, actions)

      // Sign the transaction
      const [txSigned, err] = tx.sign(authFactory)
      if (err) {
        return {
          submit: async () => {
            throw new Error('Transaction failed, cannot submit.')
          },
          txSigned: {} as Transaction,
          err: err as Error
        }
      }

      const submit = async (): Promise<SubmitTransactionResponse> => {
        const [txBytes, err] = txSigned.toBytes()
        if (err) {
          throw new Error(`Transaction failed, cannot submit. Err: ${err}`)
        }
        return await this.submitTransaction(txBytes)
      }

      return { submit, txSigned, err: undefined }
    } catch (error) {
      return {
        submit: async () => {
          throw new Error('Transaction failed, cannot submit.')
        },
        txSigned: {} as Transaction,
        err: error as Error
      }
    }
  }
}
