// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import {
  GetAssetInfoParams,
  GetAssetInfoResponse,
  GetBalanceParams,
  GetBalanceResponse
} from '../../common/nuklaiApiModels'
import { DECIMALS } from '../../constants/nuklaivm'
import { formatBalance, toAssetID } from '../../utils/utils'
import { NuklaiApiService } from '../nuklaiApiService'

export class AssetService extends NuklaiApiService {
  async getBalance(
    getBalanceParams: GetBalanceParams
  ): Promise<GetBalanceResponse> {
    const params = getBalanceParams
    params.asset = toAssetID(params.asset).toString()
    const result = await this.callRpc<GetBalanceResponse>('balance', params)
    result.amount = formatBalance(result.amount, DECIMALS)
    return result
  }

  async getAssetInfo(
    getAssetInfoParams: GetAssetInfoParams
  ): Promise<GetAssetInfoResponse> {
    const params = getAssetInfoParams
    params.asset = toAssetID(params.asset).toString()
    const result = await this.callRpc<GetAssetInfoResponse>('asset', params)
    result.supply = formatBalance(result.supply, DECIMALS)
    return result
  }
}
