import { CoreApiService } from './CoreApiService'

export class HealthService extends CoreApiService {
  ping(): Promise<any> {
    return this.makeRequest('ping')
  }
}
