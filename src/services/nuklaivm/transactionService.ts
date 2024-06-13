import { BLS } from '../../auth/bls'
import {
  GetBalanceParams,
  GetBalanceResponse,
  GetTransactionInfoParams,
  GetTransactionInfoResponse
} from '../../common/nuklaiApiModels'
import { DECIMALS } from '../../constants/nuklaivm'
import { Transfer } from '../../transactions/transfer'
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
    // Convert the private key from hex string to bls.SecretKey
    const privateKey = BLS.hexToSecretKey(privateKeyHex)
    const bls = new BLS(privateKey)

    // Generate the from address using the private key
    const publicKey = BLS.getPublicKey(privateKey)
    const fromAddress = BLS.generateAddress(publicKey)

    // Default asset to NAI if asset is "NAI"
    const assetID =
      asset === 'NAI' ? '11111111111111111111111111111111LpoYY' : asset

    const decimals = DECIMALS
    const amountInUnits = this.parseBalance(amount, decimals)
    const toAddress = this.parseAddress(to)

    // Fetch the balance to ensure sufficient funds
    const balanceResponse = await this.getBalance(fromAddress, assetID)
    if (BigInt(balanceResponse.amount) < amountInUnits) {
      throw new Error('Insufficient balance')
    }

    const transfer: Transfer = new Transfer(
      toAddress,
      assetID,
      amountInUnits,
      new TextEncoder().encode(memo)
    )
    const { submit, tx } = await this.hyperApiService.generateTransaction(
      transfer,
      bls
    )
    await submit({})
    return tx.base.chainId // Return transaction ID or some identifier
  }

  private async getBalance(
    address: string,
    asset: string
  ): Promise<GetBalanceResponse> {
    const params: GetBalanceParams = { address, asset }
    return this.callRpc<GetBalanceResponse>('balance', params)
  }

  private parseBalance(amount: string, decimals: number): bigint {
    return BigInt(parseFloat(amount) * Math.pow(10, decimals))
  }

  private parseAddress(address: string): Uint8Array {
    return BLS.parseAddress(address)
  }
}
