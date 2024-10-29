import { HyperSDKClient } from 'hypersdk-client';
import { NuklaiABI } from "./abi";
import { Marshaler } from "hypersdk-client/dist/Marshaler";
import {ActionData, ActionOutput, SignerIface, TransactionPayload} from "hypersdk-client/dist/types";
import {TxResult} from "hypersdk-client/dist/apiTransformers";

// Default max fee - can be made configurable.
const DEFAULT_MAX_FEE = 1000000n;

export class NuklaiVMClient {
    private client: HyperSDKClient;
    private marshaler: Marshaler;
    private signer?: SignerIface;

    constructor(rpcEndpoint: string, private vmName: string = "nuklaivm", private rpcPrefix: string = "rpc") {
        this.client = new HyperSDKClient(rpcEndpoint, vmName, rpcPrefix);
        this.marshaler = new Marshaler(NuklaiABI);
    }

    public async setSigner(signer: SignerIface) {
        this.signer = signer;
        await this.client.connectWallet({
            type: "private-key",
            privateKey: signer.getPublicKey()
        });
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
    }): Promise<TxResult> {
        if (!this.signer) {
            throw new Error("Signer not set");
        }

        const actionData: ActionData = {
            actionName: "CreateAssetFT",
            data: {
                assetType: 1, // ASSET_FUNGIBLE_TOKEN_ID
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
        };

        // Send transaction using HyperSDKClient's method
        return await this.client.sendTransaction([actionData]);
    }

    // Helper method to execute read-only actions
    async executeAction(actionData: ActionData): Promise<ActionOutput[]> {
        if (!this.signer) {
            throw new Error("Signer not set");
        }

        return await this.client.executeActions([actionData]);
    }

    // Helper method to get formatted balance
    async getBalance(address: string): Promise<string> {
        const balance = await this.client.getBalance(address);
        return this.client.formatNativeTokens(balance);
    }

    // Helper method to convert tokens
    convertToNativeTokens(formattedBalance: string): bigint {
        return this.client.convertToNativeTokens(formattedBalance);
    }

    // Method to get ABI
    async getAbi() {
        return await this.client.getAbi();
    }

    // Method to add block listener
    listenToBlocks(callback: Function) {
        return this.client.listenToBlocks((block) => callback(block));
    }
}