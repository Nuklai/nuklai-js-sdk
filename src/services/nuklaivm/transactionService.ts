// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { Transfer } from '../../actions/transfer'
import { AuthFactory } from '../../auth/auth'
import { BLSFactory } from '../../auth/bls'
import { ED25519Factory } from '../../auth/ed25519'
import {
  GetBalanceParams,
  GetTransactionInfoParams,
  GetTransactionInfoResponse
} from '../../common/nuklaiApiModels'
import { DECIMALS } from '../../constants/nuklaivm'
import { parseBalance } from '../../utils/utils'
import { HyperApiService } from '../hyperApiService'
import { NuklaiApiService } from '../nuklaiApiService'
import { AssetService } from './assetService'

export class TransactionService extends NuklaiApiService {
  private assetService: AssetService
  private hyperApiService: HyperApiService

  constructor(config: any) {
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

  async createAndSubmitTransferTransaction(
    to: string,
    asset: string,
    amount: string,
    memo: string,
    privateKeyHex: string,
    keyType: 'bls' | 'ed25519'
  ): Promise<string> {
    try {
      // Select the appropriate factory based on the key type
      let authFactory: AuthFactory
      if (keyType === 'bls') {
        authFactory = new BLSFactory(BLSFactory.hexToPrivateKey(privateKeyHex))
      } else if (keyType === 'ed25519') {
        authFactory = new ED25519Factory(
          ED25519Factory.hexToPrivateKey(privateKeyHex)
        )
      } else {
        throw new Error('Unsupported key type')
      }

      // Generate the from address using the private key
      const auth = authFactory.sign(new Uint8Array(0))
      const fromAddress = auth.address()
      console.log('fromAddress: ', fromAddress.toString())

      const decimals = DECIMALS
      const amountInUnits = parseBalance(amount, decimals)

      // Fetch the balance to ensure sufficient funds
      const balanceResponse = await this.assetService.getBalance({
        address: fromAddress.toString(),
        asset
      } as GetBalanceParams)
      if (BigInt(balanceResponse.amount) < amountInUnits) {
        throw new Error('Insufficient balance')
      }

      const transfer: Transfer = new Transfer(to, asset, amountInUnits, memo)

      const { submit, txSigned, err } =
        await this.hyperApiService.generateTransaction(transfer, authFactory)
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
}
