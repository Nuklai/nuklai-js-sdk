import { NuklaiApiService } from '.'

export class GenesisService extends NuklaiApiService {
  getGenesisInfo(): Promise<any> {
    return this.makeRequest('genesis')
  }
}
