import { ApiService } from './ApiService'

export class LoanService extends ApiService {
  createLoan(assetId: string, destinationId: string): Promise<any> {
    return this.makeRequest(
      `${this.config.baseApiUrl}/ext/bc/${this.config.blockchainId}/nuklaiapi`,
      'nuklaivm.loan',
      { asset: assetId, destination: destinationId }
    )
  }
}
