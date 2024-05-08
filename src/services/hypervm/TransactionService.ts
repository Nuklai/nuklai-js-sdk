import { HyperApiService } from '../HyperApiService'

export class TransactionService extends HyperApiService {
  // Submit a transaction to the network
  submitTransaction(txData: Uint8Array): Promise<any> {
    const params = { tx: txData }
    return this.makeRequest('submitTx', params)
  }
}
