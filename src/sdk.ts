import { RpcService } from "./rpcService";
import {
  MAINNET_PUBLIC_API_BASE_URL,
  VM_NAME,
  VM_RPC_PREFIX,
} from "./endpoints";
import { Block } from "hypersdk-client/dist/apiTransformers";
import { NuklaiVMClient } from "./client";

export class NuklaiSDK {
  public rpcService: RpcService;
  private client: NuklaiVMClient;

  constructor(baseApiUrl = MAINNET_PUBLIC_API_BASE_URL) {
    this.rpcService = new RpcService(baseApiUrl);

    this.client = new NuklaiVMClient(baseApiUrl, VM_NAME, VM_RPC_PREFIX);
  }

  public async listenToBlocks(
    callback: (block: Block) => void,
    includeEmpty?: boolean,
    pollingRateMs?: number
  ): Promise<() => void> {
    return this.client.listenToBlocks(callback, includeEmpty, pollingRateMs);
  }
}

export {
  MAINNET_PUBLIC_API_BASE_URL,
  VM_NAME,
  VM_RPC_PREFIX,
} from "./endpoints";
