// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { utils } from '@nuklai/hyperchain-sdk'
import { GetGenesisInfoResponse } from '../../common/models'
import { DECIMALS } from '../../constants/nuklaivm'
import { NuklaiApiService } from '../nuklaiApiService'

export class GenesisService extends NuklaiApiService {
  async getGenesisInfo(): Promise<GetGenesisInfoResponse> {
    const result = await this.callRpc<GetGenesisInfoResponse>('genesis')
    // Format the balance of each CustomAllocation
    result.genesis.customAllocation = result.genesis.customAllocation.map(
      (allocation) => ({
        ...allocation,
        balance: utils.formatBalance(allocation.balance, DECIMALS)
      })
    )
    result.genesis.emissionBalancer.maxSupply = utils.formatBalance(
      result.genesis.emissionBalancer.maxSupply,
      DECIMALS
    )
    return result
  }
}
