import { ApiService } from './ApiService'

export class EmissionService extends ApiService {
  getEmissionInfo(): Promise<any> {
    return this.makeRequest(
      `${this.config.baseApiUrl}/ext/bc/${this.config.blockchainId}/nuklaiapi`,
      'nuklaivm.emissionInfo'
    )
  }

  getAllValidators(): Promise<any> {
    return this.makeRequest(
      `${this.config.baseApiUrl}/ext/bc/${this.config.blockchainId}/nuklaiapi`,
      'nuklaivm.allValidators'
    )
  }

  getStakedValidators(): Promise<any> {
    return this.makeRequest(
      `${this.config.baseApiUrl}/ext/bc/${this.config.blockchainId}/nuklaiapi`,
      'nuklaivm.stakedValidators'
    )
  }

  getValidatorStake(nodeId: string): Promise<any> {
    return this.makeRequest(
      `${this.config.baseApiUrl}/ext/bc/${this.config.blockchainId}/nuklaiapi`,
      'nuklaivm.validatorStake',
      { nodeId }
    )
  }

  getUserStake(ownerAddress: string, nodeId: string): Promise<any> {
    return this.makeRequest(
      `${this.config.baseApiUrl}/ext/bc/${this.config.blockchainId}/nuklaiapi`,
      'nuklaivm.userStake',
      { owner: ownerAddress, nodeId }
    )
  }
}
