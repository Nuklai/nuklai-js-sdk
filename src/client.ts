import { VMClient } from 'hypersdk-client';
import {NuklaiABI} from "./abi";
import { Marshaler } from "hypersdk-client/dist/Marshaler";
import { ActionData, TransactionPayload} from "hypersdk-client/dist/types";

export class NuklaiVMClient {
    private client: VMClient
    private marshaler: Marshaler

    constructor(rpcEndpoint: string) {
        this.client = new VMClient(rpcEndpoint)
        this.marshaler = new Marshaler(NuklaiABI)
    }

    async createFungibleToken(params: {
        name: string
        symbol: string
        decimals: number
        metadata: string
        maxSupply: bigint
        mintAdmin: string
        pauseUnpauseAdmin: string
        freezeUnfreezeAdmin: string
        enableDisableKYCAccountAdmin: string
    }): Promise<any> {
        const actionData: ActionData = {
            actionName: "CreateAssetFT",
            data: {
                assetType: 1,
                name: params.name,
                symbol: params.symbol,
                decimals: params.decimals,
                metadata: params.metadata,
                maxSupply: params.maxSupply.toString(),
                mintAdmin: params.mintAdmin,
                pauseUnpauseAdmin: params.pauseUnpauseAdmin,
                freezeUnfreezeAdmin: params.freezeUnfreezeAdmin,
                enableDisableKYCAccountAdmin: params.enableDisableKYCAccountAdmin
            }
        }

        return await this.client.sendTransaction([actionData])
    }
}