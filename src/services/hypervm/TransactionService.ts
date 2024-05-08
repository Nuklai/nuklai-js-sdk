import { CoreApiService } from '.'

export class TransactionService extends CoreApiService {
  // Submit a transaction to the network
  submitTransaction(txData: Uint8Array): Promise<any> {
    const params = { tx: txData }
    return this.makeRequest('submitTx', params)
  }
}
