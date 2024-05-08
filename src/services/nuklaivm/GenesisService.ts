import { NuklaiApiService } from '../NuklaiApiService'

export class GenesisService extends NuklaiApiService {
  getGenesisInfo(): Promise<any> {
    return this.makeRequest('genesis')
  }
}
