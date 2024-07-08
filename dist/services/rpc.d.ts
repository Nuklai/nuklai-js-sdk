import { auth, chain, common, config, services } from '@nuklai/hyperchain-sdk';
import { GetAssetInfoParams, GetAssetInfoResponse, GetBalanceParams, GetBalanceResponse, GetEmissionInfoResponse, GetGenesisInfoResponse, GetTransactionInfoParams, GetTransactionInfoResponse, GetUserStakeParams, GetUserStakeResponse, GetValidatorStakeParams, GetValidatorStakeResponse, GetValidatorsResponse } from '../common/models';
export declare class RpcService extends common.Api {
    protected configNuklai: config.NodeConfig;
    constructor(configNuklai: config.NodeConfig);
    getGenesisInfo(): Promise<GetGenesisInfoResponse>;
    getTransactionInfo(getTransactionInfoParams: GetTransactionInfoParams): Promise<GetTransactionInfoResponse>;
    getBalance(getBalanceParams: GetBalanceParams): Promise<GetBalanceResponse>;
    getAssetInfo(getAssetInfoParams: GetAssetInfoParams): Promise<GetAssetInfoResponse>;
    getEmissionInfo(): Promise<GetEmissionInfoResponse>;
    getAllValidators(): Promise<GetValidatorsResponse>;
    getStakedValidators(): Promise<GetValidatorsResponse>;
    getValidatorStake(getValidatorStakeParams: GetValidatorStakeParams): Promise<GetValidatorStakeResponse>;
    getUserStake(getUserStakeParams: GetUserStakeParams): Promise<GetUserStakeResponse>;
    sendTransferTransaction(to: string, asset: string, amount: number, memo: string, authFactory: auth.AuthFactory, hyperApiService: services.RpcService, actionRegistry: chain.ActionRegistry, authRegistry: chain.AuthRegistry): Promise<string>;
    sendCreateAssetTransaction(symbol: string, decimals: number, metadata: string, authFactory: auth.AuthFactory, hyperApiService: services.RpcService, actionRegistry: chain.ActionRegistry, authRegistry: chain.AuthRegistry): Promise<{
        txID: string;
        assetID: string;
    }>;
    sendMintAssetTransaction(to: string, asset: string, amount: number, authFactory: auth.AuthFactory, hyperApiService: services.RpcService, actionRegistry: chain.ActionRegistry, authRegistry: chain.AuthRegistry): Promise<string>;
}
