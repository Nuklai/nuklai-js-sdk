import { CoreApiService } from '.'

export class HealthService extends CoreApiService {
  ping(): Promise<any> {
    return this.makeRequest('ping')
  }
}
