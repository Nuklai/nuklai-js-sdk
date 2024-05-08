import { HyperApiService } from '../HyperApiService'

export class WarpService extends HyperApiService {
  // Fetch warp signatures associated with a transaction
  getWarpSignatures(txId: string): Promise<any> {
    const params = { txID: txId }
    return this.makeRequest('getWarpSignatures', params)
  }
}
