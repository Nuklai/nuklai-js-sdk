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
import { DECIMALS } from '../../constants/nuklaivm'
import { formatBalance } from '../../utils/utils'
import { NuklaiApiService } from '../nuklaiApiService'

export class EmissionService extends NuklaiApiService {
  async getEmissionInfo(): Promise<GetEmissionInfoResponse> {
    const result = await this.callRpc<GetEmissionInfoResponse>('emissionInfo')
    result.totalSupply = formatBalance(result.totalSupply, DECIMALS)
    result.maxSupply = formatBalance(result.maxSupply, DECIMALS)
    result.totalStaked = formatBalance(result.totalStaked, DECIMALS)
    result.rewardsPerEpoch = formatBalance(result.rewardsPerEpoch, DECIMALS)
    result.emissionAccount.accumulatedReward = formatBalance(
      result.emissionAccount.accumulatedReward,
      DECIMALS
    )
    return result
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
