import { AuthFactory } from '../../auth/auth';
import { GetTransactionInfoParams, GetTransactionInfoResponse } from '../../common/nuklaiApiModels';
import { NodeConfig } from '../../config';
import { NuklaiApiService } from '../nuklaiApiService';
export declare class TransactionService extends NuklaiApiService {
    private assetService;
    private hyperApiService;
    constructor(config: NodeConfig);
    getTransactionInfo(getTransactionInfoParams: GetTransactionInfoParams): Promise<GetTransactionInfoResponse>;
    sendTransferTransaction(to: string, asset: string, amount: number, memo: string, authFactory: AuthFactory): Promise<string>;
    sendCreateAssetTransaction(symbol: string, decimals: number, metadata: string, authFactory: AuthFactory): Promise<{
        txID: string;
        assetID: string;
    }>;
    sendMintAssetTransaction(to: string, asset: string, amount: number, authFactory: AuthFactory): Promise<string>;
}
