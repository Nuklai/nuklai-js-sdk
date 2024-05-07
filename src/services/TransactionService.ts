import { ApiService } from './ApiService'

export class TransactionService extends ApiService {
  getTransaction(txId: string): Promise<any> {
    return this.makeRequest(
      `${this.config.baseApiUrl}/ext/bc/${this.config.blockchainId}/nuklaiapi`,
      'nuklaivm.tx',
      { txId }
    )
  }
}
