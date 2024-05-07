import { ApiService } from './ApiService'

export class AssetService extends ApiService {
  getBalance(address: string, assetId: string): Promise<any> {
    return this.makeRequest(
      `${this.config.baseApiUrl}/ext/bc/${this.config.blockchainId}/nuklaiapi`,
      'nuklaivm.balance',
      { address, asset: assetId }
    )
  }

  getAsset(assetId: string): Promise<any> {
    return this.makeRequest(
      `${this.config.baseApiUrl}/ext/bc/${this.config.blockchainId}/nuklaiapi`,
      'nuklaivm.asset',
      { asset: assetId }
    )
  }
}
