import { NuklaiApiService } from './NuklaiApiService'

export class AssetService extends NuklaiApiService {
  getBalance(address: string, assetId: string): Promise<any> {
    return this.makeRequest('balance', { address, asset: assetId })
  }

  getAssetInfo(assetId: string): Promise<any> {
    return this.makeRequest('asset', { asset: assetId })
  }
}
