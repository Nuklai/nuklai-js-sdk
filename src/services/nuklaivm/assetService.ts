// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import {
  GetAssetInfoParams,
  GetAssetInfoResponse,
  GetBalanceParams,
  GetBalanceResponse
} from '../../common/nuklaiApiModels'
import { NuklaiApiService } from '../nuklaiApiService'

export class AssetService extends NuklaiApiService {
  getBalance(getBalanceParams: GetBalanceParams): Promise<GetBalanceResponse> {
    return this.callRpc<GetBalanceResponse>('balance', getBalanceParams)
  }

  getAssetInfo(
    getAssetInfoParams: GetAssetInfoParams
  ): Promise<GetAssetInfoResponse> {
    return this.callRpc<GetAssetInfoResponse>('asset', getAssetInfoParams)
  }
}
