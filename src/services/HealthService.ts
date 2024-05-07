import { ApiService } from './ApiService'

export class HealthService extends ApiService {
  getHealthStatus(): Promise<any> {
    return this.makeRequest(
      `${this.config.baseApiUrl}/ext/health`,
      'health.liveness'
    )
  }
}
