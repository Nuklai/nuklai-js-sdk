import { NuklaiVMClient } from "../client";
import { config } from "@nuklai/hyperchain-sdk";
import { SignerIface } from "hypersdk-client/dist/types";
import { PrivateKeySigner } from "hypersdk-client/dist/PrivateKeySigner";

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
    ): Promise<any> {
        try {
            return await this.client.createFungibleToken({
                name,
                symbol,
                decimals,
                metadata,
                maxSupply,
                mintAdmin,
                pauseUnpauseAdmin,
                freezeUnfreezeAdmin,
                enableDisableKYCAccountAdmin
            });
        } catch (error) {
            console.error('Failed to create FT asset:', error);
            throw error;
        }
    }
}

// const privateKey = new Uint8Array(32); // user's private key
// const signer = new PrivateKeySigner(privateKey);
// const rpcService = new RpcService(config, signer);