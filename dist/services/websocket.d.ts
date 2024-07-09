import { auth, chain, config, services } from '@nuklai/hyperchain-sdk';
export declare class WebSocketService extends services.WebSocketService {
    private rpcService;
    constructor(config: config.NodeConfig);
    sendTransferTransactionAndWait(to: string, asset: string, amount: number, memo: string, authFactory: auth.AuthFactory, hyperApiService: services.RpcService, actionRegistry: chain.ActionRegistry, authRegistry: chain.AuthRegistry): Promise<string>;
}
