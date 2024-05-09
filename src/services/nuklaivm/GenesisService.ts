import { GetGenesisInfoResponse } from '../../common/nuklaiApiModels'
import { NuklaiApiService } from '../NuklaiApiService'

export class GenesisService extends NuklaiApiService {
  getGenesisInfo(): Promise<GetGenesisInfoResponse> {
    return this.callRpc<GetGenesisInfoResponse>('genesis')
  }
}
