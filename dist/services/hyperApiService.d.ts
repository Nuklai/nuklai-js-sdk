import { Action } from '../actions/action';
import { AuthFactory } from '../auth/auth';
import { Api } from '../common/baseApi';
import { GetLastAcceptedResponse, GetNetworkInfoResponse, GetUnitPricesResponse, GetWarpSignaturesResponse, PingResponse, SubmitTransactionResponse } from '../common/hyperApiModels';
import { NodeConfig } from '../config';
import { Transaction } from '../transactions/transaction';
export declare class HyperApiService extends Api {
    protected config: NodeConfig;
    private genesisApiService;
    constructor(config: NodeConfig);
    ping(): Promise<PingResponse>;
    getNetworkInfo(): Promise<GetNetworkInfoResponse>;
    getLastAccepted(): Promise<GetLastAcceptedResponse>;
    getUnitPrices(): Promise<GetUnitPricesResponse>;
    getWarpSignatures(txID: string): Promise<GetWarpSignaturesResponse>;
    submitTransaction(tx: Uint8Array): Promise<SubmitTransactionResponse>;
    generateTransaction(actions: Action[], authFactory: AuthFactory): Promise<{
        submit: () => Promise<SubmitTransactionResponse>;
        txSigned: Transaction;
        err: Error | undefined;
    }>;
}
