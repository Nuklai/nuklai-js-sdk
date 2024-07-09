import { HyperchainSDK, config } from '@nuklai/hyperchain-sdk';
import { RpcService } from './services/rpc';
import { WebSocketService } from './services/websocket';
export declare class NuklaiSDK extends HyperchainSDK {
    rpcServiceNuklai: RpcService;
    wsServiceNuklai: WebSocketService;
    constructor(nodeConfig?: Partial<config.NodeConfig>);
}
