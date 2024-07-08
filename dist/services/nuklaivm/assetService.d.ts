import { GetAssetInfoParams, GetAssetInfoResponse, GetBalanceParams, GetBalanceResponse } from '../../common/nuklaiApiModels';
import { NuklaiApiService } from '../nuklaiApiService';
export declare class AssetService extends NuklaiApiService {
    getBalance(getBalanceParams: GetBalanceParams): Promise<GetBalanceResponse>;
    getAssetInfo(getAssetInfoParams: GetAssetInfoParams): Promise<GetAssetInfoResponse>;
}
