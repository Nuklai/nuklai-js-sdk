import { NuklaiApiService } from '../NuklaiApiService'

export class TransactionService extends NuklaiApiService {
  getTransactionInfo(txId: string): Promise<any> {
    return this.makeRequest('tx', { txId })
  }
}
