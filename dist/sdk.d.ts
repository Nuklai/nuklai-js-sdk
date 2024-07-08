import { HyperchainSDK, config } from "@nuklai/hyperchain-sdk";
import { RpcService } from "./services/rpc";
export declare class NuklaiSDK extends HyperchainSDK {
    rpcServiceNuklai: RpcService;
    constructor(nodeConfig?: Partial<config.NodeConfig>);
}
