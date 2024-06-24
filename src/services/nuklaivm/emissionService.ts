// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import {
  GetEmissionInfoResponse,
  GetUserStakeParams,
  GetUserStakeResponse,
  GetValidatorStakeParams,
  GetValidatorStakeResponse,
  GetValidatorsResponse
} from '../../common/nuklaiApiModels'
import { NuklaiApiService } from '../nuklaiApiService'

export class EmissionService extends NuklaiApiService {
  getEmissionInfo(): Promise<GetEmissionInfoResponse> {
    return this.callRpc<GetEmissionInfoResponse>('emissionInfo')
  }

  getAllValidators(): Promise<GetValidatorsResponse> {
    return this.callRpc<GetValidatorsResponse>('allValidators')
  }

  getStakedValidators(): Promise<GetValidatorsResponse> {
    return this.callRpc<GetValidatorsResponse>('stakedValidators')
  }

  getValidatorStake(
    getValidatorStakeParams: GetValidatorStakeParams
  ): Promise<GetValidatorStakeResponse> {
    return this.callRpc<GetValidatorStakeResponse>(
      'validatorStake',
      getValidatorStakeParams
    )
  }

  getUserStake(
    getUserStakeParams: GetUserStakeParams
  ): Promise<GetUserStakeResponse> {
    return this.callRpc<GetUserStakeResponse>('userStake', getUserStakeParams)
  }
}
