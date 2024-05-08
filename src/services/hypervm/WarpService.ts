import { CoreApiService } from '.'

export class WarpService extends CoreApiService {
  // Fetch warp signatures associated with a transaction
  getWarpSignatures(txId: string): Promise<any> {
    const params = { txID: txId }
    return this.makeRequest('getWarpSignatures', params)
  }
}
