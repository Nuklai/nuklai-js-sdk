import { HyperApiService } from '../HyperApiService'

export class NetworkService extends HyperApiService {
  // Retrieve network IDs
  getNetworkInfo(): Promise<any> {
    return this.makeRequest('network')
  }

  // Get information about the last accepted block
  getLastAccepted(): Promise<any> {
    return this.makeRequest('lastAccepted')
  }

  // Fetch current unit prices for transactions
  getUnitPrices(): Promise<any> {
    return this.makeRequest('unitPrices')
  }
}
