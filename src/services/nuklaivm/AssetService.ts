import {
  GetAssetInfoParams,
  GetAssetInfoResponse,
  GetBalanceParams,
  GetBalanceResponse
} from '../../common/nuklaiApiModels'
import { NuklaiApiService } from '../NuklaiApiService'

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
