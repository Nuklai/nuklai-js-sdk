import { NuklaiVMClient } from "../client";
import { config } from "@nuklai/hyperchain-sdk";

export class RpcService {
    private client: NuklaiVMClient

    constructor(protected configNuklai: config.NodeConfig) {
        this.client = new NuklaiVMClient(configNuklai.baseApiUrl)
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
            })
        } catch (error) {
            console.error('Failed to create FT asset:', error)
            throw error
        }
    }
}