import { GetGenesisInfoResponse } from '../../common/models';
import { NuklaiApiService } from '../nuklaiApiService';
export declare class GenesisService extends NuklaiApiService {
    getGenesisInfo(): Promise<GetGenesisInfoResponse>;
}
