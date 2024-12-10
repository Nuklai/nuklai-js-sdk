// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { RpcService } from "./rpcService";
import { MAINNET_PUBLIC_API_BASE_URL, VM_NAME, VM_RPC_PREFIX } from "./endpoints";
import { Block } from "hypersdk-client/dist/apiTransformers";
import { NuklaiVMClient } from "./client";
import { NuklaiWallet } from "./wallet";
import { SignerIface } from "hypersdk-client/dist/types";

export class NuklaiSDK {
  public rpcService: RpcService;
  private client: NuklaiVMClient;
  private wallet?: NuklaiWallet;

  constructor(baseApiUrl = MAINNET_PUBLIC_API_BASE_URL) {
    this.rpcService = new RpcService(baseApiUrl);
    this.client = new NuklaiVMClient(baseApiUrl, VM_NAME, VM_RPC_PREFIX);
  }

  /**
   * Connect a wallet to the SDK
   * @param wallet NuklaiWallet instance
   */
  public connectWallet(wallet: NuklaiWallet): void {
    this.wallet = wallet;
    this.rpcService.setSigner(wallet.getSigner());
  }

  /**
   * Create and connect a new random wallet
   * @returns The created wallet instance
   */
  public createWallet(): NuklaiWallet {
    const wallet = NuklaiWallet.createRandom();
    this.connectWallet(wallet);
    return wallet;
  }

  /**
   * Import and connect a wallet from a private key
   * @param privateKey Private key in hex format
   * @returns The imported wallet instance
   */
  public importWalletFromPrivateKey(privateKey: string): NuklaiWallet {
    const wallet = NuklaiWallet.fromPrivateKey(privateKey);
    this.connectWallet(wallet);
    return wallet;
  }

  /**
   * Get the connected wallet instance
   * @returns The connected NuklaiWallet instance or undefined if no wallet is connected
   */
  public getWallet(): NuklaiWallet | undefined {
    return this.wallet;
  }

  /**
   * Check if a wallet is connected
   * @returns boolean indicating if a wallet is connected
   */
  public isWalletConnected(): boolean {
    return !!this.wallet;
  }

  /**
   * Get the address of the connected wallet
   * @returns The wallet's address or undefined if no wallet is connected
   */
  public getAddress(): string | undefined {
    return this.wallet?.getAddress();
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
export { NuklaiWallet } from "./wallet";