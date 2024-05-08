import { CoreApiService } from './CoreApiService'

export class NetworkService extends CoreApiService {
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
