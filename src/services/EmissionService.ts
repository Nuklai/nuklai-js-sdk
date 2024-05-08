import { NuklaiApiService } from './NuklaiApiService'

export class EmissionService extends NuklaiApiService {
  getEmissionInfo(): Promise<any> {
    return this.makeRequest('emissionInfo')
  }

  getAllValidators(): Promise<any> {
    return this.makeRequest('allValidators')
  }

  getStakedValidators(): Promise<any> {
    return this.makeRequest('stakedValidators')
  }

  getValidatorStake(nodeId: string): Promise<any> {
    return this.makeRequest('validatorStake', { nodeId })
  }

  getUserStake(ownerAddress: string, nodeId: string): Promise<any> {
    return this.makeRequest('userStake', { owner: ownerAddress, nodeId })
  }
}
