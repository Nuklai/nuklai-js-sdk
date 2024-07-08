import { GetGenesisInfoResponse } from '../../common/nuklaiApiModels';
import { NuklaiApiService } from '../nuklaiApiService';
export declare class GenesisService extends NuklaiApiService {
    getGenesisInfo(): Promise<GetGenesisInfoResponse>;
}
