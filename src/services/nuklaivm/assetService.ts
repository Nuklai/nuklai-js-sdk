// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import {
  GetAssetInfoParams,
  GetAssetInfoResponse,
  GetBalanceParams,
  GetBalanceResponse
} from '../../common/nuklaiApiModels'
import { toAssetID } from '../../utils/utils'
import { NuklaiApiService } from '../nuklaiApiService'

export class AssetService extends NuklaiApiService {
  getBalance(getBalanceParams: GetBalanceParams): Promise<GetBalanceResponse> {
    const params = getBalanceParams
    params.asset = toAssetID(params.asset).toString()
    return this.callRpc<GetBalanceResponse>('balance', params)
  }

  getAssetInfo(
    getAssetInfoParams: GetAssetInfoParams
  ): Promise<GetAssetInfoResponse> {
    const params = getAssetInfoParams
    params.asset = toAssetID(params.asset).toString()
    return this.callRpc<GetAssetInfoResponse>('asset', params)
  }
}
