// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { bls } from '@avalabs/avalanchejs'
import { Transfer } from '../../actions/transfer'
import { BLSFactory } from '../../auth/bls'
import {
  GetBalanceParams,
  GetBalanceResponse,
  GetTransactionInfoParams,
  GetTransactionInfoResponse
} from '../../common/nuklaiApiModels'
import { BLS_ID, DECIMALS } from '../../constants/nuklaivm'
import { Address } from '../../utils/address'
import { HyperApiService } from '../hyperApiService'
import { NuklaiApiService } from '../nuklaiApiService'

export class TransactionService extends NuklaiApiService {
  private hyperApiService: HyperApiService

  constructor(config: any) {
    super(config)
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

  async createAndSubmitTransferTransaction(
    to: string,
    asset: string,
    amount: string,
    memo: string,
    privateKeyHex: string
  ): Promise<string> {
    try {
      // Convert the private key from hex string to bls.SecretKey
      const privateKey = BLSFactory.hexToPrivateKey(privateKeyHex)
      const blsFactory = new BLSFactory(privateKey)

      // Generate the from address using the private key
      const publicKey = BLSFactory.publicKeyFromPrivateKey(privateKey)
      const fromAddress = Address.newAddress(
        BLS_ID,
        bls.publicKeyToBytes(publicKey)
      ).toString()

      const decimals = DECIMALS
      const amountInUnits = this.parseBalance(amount, decimals)

      // Fetch the balance to ensure sufficient funds
      const balanceResponse = await this.getBalance(fromAddress, asset)
      if (BigInt(balanceResponse.amount) < amountInUnits) {
        throw new Error('Insufficient balance')
      }

      const transfer: Transfer = new Transfer(to, asset, amountInUnits, memo)

      const { submit, txSigned, err } =
        await this.hyperApiService.generateTransaction(transfer, blsFactory)
      if (err) {
        throw err
      }

      await submit()

      return txSigned.id().toString()
    } catch (error) {
      console.error('Failed to create and submit transfer transaction', error)
      throw error
    }
  }

  private async getBalance(
    address: string,
    asset: string
  ): Promise<GetBalanceResponse> {
    const params: GetBalanceParams = { address, asset }
    return this.callRpc<GetBalanceResponse>('balance', params)
  }

  private parseBalance(amount: string, decimals: number): bigint {
    return BigInt(Math.floor(parseFloat(amount) * Math.pow(10, decimals)))
  }
}
