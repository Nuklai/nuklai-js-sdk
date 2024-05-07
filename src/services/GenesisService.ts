// src/services/GenesisService.ts
import { ApiService } from './ApiService'

export class GenesisService extends ApiService {
  getGenesis(): Promise<any> {
    return this.makeRequest(
      `${this.config.baseApiUrl}/ext/bc/${this.config.blockchainId}/nuklaiapi`,
      'nuklaivm.genesis'
    )
  }
}
