import { GetEmissionInfoResponse, GetUserStakeParams, GetUserStakeResponse, GetValidatorStakeParams, GetValidatorStakeResponse, GetValidatorsResponse } from '../../common/nuklaiApiModels';
import { NuklaiApiService } from '../nuklaiApiService';
export declare class EmissionService extends NuklaiApiService {
    getEmissionInfo(): Promise<GetEmissionInfoResponse>;
    getAllValidators(): Promise<GetValidatorsResponse>;
    getStakedValidators(): Promise<GetValidatorsResponse>;
    getValidatorStake(getValidatorStakeParams: GetValidatorStakeParams): Promise<GetValidatorStakeResponse>;
    getUserStake(getUserStakeParams: GetUserStakeParams): Promise<GetUserStakeResponse>;
}
