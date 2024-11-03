import { RpcService } from "./rpcService";
import {
  MAINNET_PUBLIC_API_BASE_URL,
  VM_NAME,
  VM_RPC_PREFIX,
} from "./endpoints";
import { NuklaiVMClient } from "./client";

export class NuklaiSDK {
  public rpcService: RpcService;
  private client: NuklaiVMClient;

  constructor(baseApiUrl = MAINNET_PUBLIC_API_BASE_URL) {
    this.rpcService = new RpcService(baseApiUrl);

    this.client = new NuklaiVMClient(baseApiUrl, VM_NAME, VM_RPC_PREFIX);
  }

  listenToBlocks(callback: (block: any) => void) {
    return this.client.listenToBlocks((block: any) => callback(block));
  }
}

export {
  MAINNET_PUBLIC_API_BASE_URL,
  VM_NAME,
  VM_RPC_PREFIX,
} from "./endpoints";
