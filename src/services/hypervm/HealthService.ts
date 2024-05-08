import { HyperApiService } from '../HyperApiService'

export class HealthService extends HyperApiService {
  ping(): Promise<any> {
    return this.makeRequest('ping')
  }
}
