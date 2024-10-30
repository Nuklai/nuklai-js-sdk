import { NuklaiVMClient } from "./client";
import { config } from "@nuklai/hyperchain-sdk";
import { SignerIface } from "hypersdk-client/dist/types";
import { PrivateKeySigner } from "hypersdk-client/dist/PrivateKeySigner";
import { TxResult } from "hypersdk-client/dist/apiTransformers";

export class RpcService {
  private client: NuklaiVMClient;

  constructor(
    protected configNuklai: config.NodeConfig,
    private signer?: SignerIface
  ) {
    this.client = new NuklaiVMClient(
      configNuklai.baseApiUrl,
      "nuklaivm",
      "rpc"
    );

    if (signer) {
      this.client.setSigner(signer);
    }
  }

  setSigner(signer: SignerIface) {
    this.client.setSigner(signer);
  }

  async createFTAsset(
    name: string,
    symbol: string,
    decimals: number,
    metadata: string,
    maxSupply: bigint,
    mintAdmin: string,
    pauseUnpauseAdmin: string,
    freezeUnfreezeAdmin: string,
    enableDisableKYCAccountAdmin: string
  ): Promise<TxResult> {
    return this.client.createFungibleToken({
      name,
      symbol,
      decimals,
      metadata,
      maxSupply,
      mintAdmin,
      pauseUnpauseAdmin,
      freezeUnfreezeAdmin,
      enableDisableKYCAccountAdmin,
    });
  }

  async createNFTAsset(
    name: string,
    symbol: string,
    metadata: string,
    maxSupply: bigint,
    mintAdmin: string,
    pauseUnpauseAdmin: string,
    freezeUnfreezeAdmin: string,
    enableDisableKYCAccountAdmin: string
  ): Promise<TxResult> {
    return this.client.createNFTAsset({
      name,
      symbol,
      metadata,
      maxSupply,
      mintAdmin,
      pauseUnpauseAdmin,
      freezeUnfreezeAdmin,
      enableDisableKYCAccountAdmin,
    });
  }

  async getBalance(address: string): Promise<string> {
    return this.client.getBalance(address);
  }
}
