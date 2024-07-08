import { auth, config } from '@nuklai/hyperchain-sdk';
import { GetTransactionInfoParams, GetTransactionInfoResponse } from '../../common/models';
import { NuklaiApiService } from '../nuklaiApiService';
export declare class TransactionService extends NuklaiApiService {
    private hyperApiService;
    private genesisApiService;
    private assetService;
    constructor(configNuklai: config.NodeConfig);
    getTransactionInfo(getTransactionInfoParams: GetTransactionInfoParams): Promise<GetTransactionInfoResponse>;
    sendTransferTransaction(to: string, asset: string, amount: number, memo: string, authFactory: auth.AuthFactory): Promise<string>;
    sendCreateAssetTransaction(symbol: string, decimals: number, metadata: string, authFactory: auth.AuthFactory): Promise<{
        txID: string;
        assetID: string;
    }>;
    sendMintAssetTransaction(to: string, asset: string, amount: number, authFactory: auth.AuthFactory): Promise<string>;
}
