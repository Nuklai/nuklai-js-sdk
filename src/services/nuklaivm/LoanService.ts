import { NuklaiApiService } from '.'

export class LoanService extends NuklaiApiService {
  getLoanInfo(assetId: string, destinationId: string): Promise<any> {
    return this.makeRequest('loan', {
      asset: assetId,
      destination: destinationId
    })
  }
}
