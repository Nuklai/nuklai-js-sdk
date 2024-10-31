import { config } from "@nuklai/hyperchain-sdk";
import { RpcService } from "./rpcService";
import { MAINNET_PUBLIC_API_BASE_URL, NUKLAI_CHAIN_ID } from "./endpoints";
import { HyperSDKClient } from "hypersdk-client";

export class NuklaiSDK {
  public rpcService: RpcService;
  private client: HyperSDKClient;

  constructor(nodeConfig?: Partial<config.NodeConfig>) {
    const defaultSDKConfig: config.NodeConfig = {
      baseApiUrl: MAINNET_PUBLIC_API_BASE_URL,
      blockchainId: NUKLAI_CHAIN_ID,
    };

    const finalConfig = { ...defaultSDKConfig, ...nodeConfig };

    this.rpcService = new RpcService(finalConfig);
    this.client = new HyperSDKClient(finalConfig.baseApiUrl, "nuklaivm", "rpc");
  }

  listenToBlocks(
    callback: (block: any) => void,
    includeEmpty: boolean = false
  ) {
    return this.client.listenToBlocks(callback, includeEmpty);
  }
}

export { MAINNET_PUBLIC_API_BASE_URL, NUKLAI_CHAIN_ID } from "./endpoints";

