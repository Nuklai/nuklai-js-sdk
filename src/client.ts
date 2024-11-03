// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { HyperSDKClient } from 'hypersdk-client';
import { HyperSDKHTTPClient } from 'hypersdk-client/dist/HyperSDKHTTPClient';
import { NuklaiABI } from "./abi";
import { Marshaler, VMABI } from "hypersdk-client/dist/Marshaler";
import { ActionData, ActionOutput, SignerIface, TransactionPayload } from "hypersdk-client/dist/types";
import { TxResult } from "hypersdk-client/dist/apiTransformers";
import { VM_NAME, VM_RPC_PREFIX } from './endpoints';

const DEFAULT_TIMEOUT = 30000;
const CHAIN_ID = 'DPqCib879gKLxtL7Wao6WTh5hNUYFFBZSL9otsLAZ6wKPJuXb';

export class NuklaiVMClient {
    private client: HyperSDKClient;
    private httpClient: HyperSDKHTTPClient;
    private marshaler: Marshaler;
    private signer?: SignerIface;
    private readonly baseEndpoint: string;

    constructor(
        rpcEndpoint: string = "http://localhost:9650",
        private vmName: string = VM_NAME,
        private rpcPrefix: string = VM_RPC_PREFIX,
    ) {
        this.baseEndpoint = rpcEndpoint.replace(/\/$/, '');

        // Initialize both clients
        this.client = new HyperSDKClient(
            this.baseEndpoint,
            vmName,
            rpcPrefix
        );

        this.httpClient = new HyperSDKHTTPClient(
            this.baseEndpoint,
            vmName,
            rpcPrefix
        );

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
        name: string;
        symbol: string;
        decimals: number;
        metadata: string;
        maxSupply: bigint;
        mintAdmin: string;
        pauseUnpauseAdmin: string;
        freezeUnfreezeAdmin: string;
        enableDisableKYCAccountAdmin: string;
    }): Promise<TxResult> {
        return this.sendAction("CreateAssetFT", {
            assetType: 1,
            ...params,
            maxSupply: params.maxSupply.toString()
        });
    }

    async createNFTAsset(params: {
        name: string;
        symbol: string;
        metadata: string;
        maxSupply: bigint;
        mintAdmin: string;
        pauseUnpauseAdmin: string;
        freezeUnfreezeAdmin: string;
        enableDisableKYCAccountAdmin: string;
    }): Promise<TxResult> {
        return this.sendAction("CreateAssetNFT", {
            assetType: 2,
            ...params,
            maxSupply: params.maxSupply.toString()
        });
    }

    async updateAsset(params: {
        assetAddress: string;
        name: string;
        symbol: string;
        metadata: string;
        maxSupply: bigint;
        owner: string;
        mintAdmin: string;
        pauseUnpauseAdmin: string;
        freezeUnfreezeAdmin: string;
        enableDisableKYCAccountAdmin: string;
    }): Promise<TxResult> {
        return this.sendAction("UpdateAsset", {
            ...params,
            maxSupply: params.maxSupply.toString()
        });
    }

    // Tokens
    async mintFTAsset(params: {
        to: string;
        assetAddress: string;
        amount: bigint;
    }): Promise<TxResult> {
        return this.sendAction("MintAssetFT", {
            ...params,
            amount: params.amount.toString()
        });
    }

    async mintNFTAsset(params: {
        assetAddress: string;
        metadata: string;
        to: string;
    }): Promise<TxResult> {
        return this.sendAction("MintAssetNFT", params);
    }

    async burnFTAsset(params: {
        assetAddress: string;
        amount: bigint;
    }): Promise<TxResult> {
        return this.sendAction("BurnAssetFT", {
            ...params,
            amount: params.amount.toString()
        });
    }

    async burnNFTAsset(params: {
        assetAddress: string;
        assetNftAddress: string;
    }): Promise<TxResult> {
        return this.sendAction("BurnAssetNFT", params);
    }

    async transfer(params: {
        to: string;
        assetAddress: string;
        value: bigint;
        memo: string;
    }): Promise<TxResult> {
        return this.sendAction("Transfer", {
            ...params,
            value: params.value.toString()
        });
    }

    // Dataset Management
    async createDataset(params: {
        assetAddress: string;
        name: string;
        description: string;
        categories: string;
        licenseName: string;
        licenseSymbol: string;
        licenseURL: string;
        metadata: string;
        isCommunityDataset: boolean;
    }): Promise<TxResult> {
        return this.sendAction("CreateDataset", params);
    }

    async updateDataset(params: {
        datasetAddress: string;
        name: string;
        description: string;
        categories: string;
        licenseName: string;
        licenseSymbol: string;
        licenseURL: string;
        isCommunityDataset: boolean;
    }): Promise<TxResult> {
        return this.sendAction("UpdateDataset", params);
    }

    // Dataset Contribution
    async initiateContributeDataset(params: {
        datasetAddress: string;
        dataLocation: string;
        dataIdentifier: string;
    }): Promise<TxResult> {
        return this.sendAction("InitiateContributeDataset", params);
    }

    async completeContributeDataset(params: {
        datasetContributionID: string;
        datasetAddress: string;
        datasetContributor: string;
    }): Promise<TxResult> {
        return this.sendAction("CompleteContributeDataset", params);
    }

    // Marketplace
    async publishDatasetToMarketplace(params: {
        datasetAddress: string;
        paymentAssetAddress: string;
        datasetPricePerBlock: bigint;
    }): Promise<TxResult> {
        return this.sendAction("PublishDatasetMarketplace", {
            ...params,
            datasetPricePerBlock: params.datasetPricePerBlock.toString()
        });
    }

    async subscribeDatasetMarketplace(params: {
        marketplaceAssetAddress: string;
        paymentAssetAddress: string;
        numBlocksToSubscribe: bigint;
    }): Promise<TxResult> {
        return this.sendAction("SubscribeDatasetMarketplace", {
            ...params,
            numBlocksToSubscribe: params.numBlocksToSubscribe.toString()
        });
    }

    async claimMarketplacePayment(params: {
        marketplaceAssetAddress: string;
        paymentAssetAddress: string;
    }): Promise<TxResult> {
        return this.sendAction("ClaimMarketplacePayment", params);
    }

    // Query Methods
    // Update the getBalance method to use httpClient
    public async getBalance(address: string): Promise<string> {
        try {
            const result = await this.httpClient.makeVmAPIRequest<{ amount: number }>(
                'balance',
                { address, asset: 'NAI' }
            );
            return this.client.formatNativeTokens(BigInt(result.amount));
        } catch (error) {
            console.error('Balance query failed:', error);
            throw error;
        }
    }

    // Validator Methods
    async getAllValidators(): Promise<ActionOutput> {
        try {
            return await this.httpClient.makeVmAPIRequest(
                'allValidators',
                {}
            );
        } catch (error) {
            console.error('Failed to get validators:', error);
            throw error;
        }
    }

    async getStakedValidators(): Promise<ActionOutput> {
        try {
            return await this.httpClient.makeVmAPIRequest(
                'stakedValidators',
                {}
            );
        } catch (error) {
            console.error('Failed to get staked validators:', error);
            throw error;
        }
    }

    async getValidatorStake(nodeID: string): Promise<ActionOutput> {
        try {
            return await this.httpClient.makeVmAPIRequest(
                'validatorStake',
                { nodeID }
            );
        } catch (error) {
            console.error('Failed to get validator stake:', error);
            throw error;
        }
    }

    async getUserStake(params: { owner: string; nodeID: string }): Promise<ActionOutput> {
        try {
            return await this.httpClient.makeVmAPIRequest(
                'userStake',
                params
            );
        } catch (error) {
            console.error('Failed to get user stake:', error);
            throw error;
        }
    }

    async getEmissionInfo(): Promise<ActionOutput> {
        try {
            return await this.httpClient.makeVmAPIRequest(
                'emissionInfo',
                {}
            );
        } catch (error) {
            console.error('Failed to get emission info:', error);
            throw error;
        }
    }

    async getAssetInfo(asset: string): Promise<ActionOutput> {
        try {
            return await this.httpClient.makeVmAPIRequest(
                'asset',
                { asset }
            );
        } catch (error) {
            console.error('Failed to get asset info:', error);
            throw error;
        }
    }

    async getTransactionStatus(txID: string): Promise<TxResult> {
        try {
            return await this.httpClient.makeIndexerRequest(
                'tx',
                { txID }
            );
        } catch (error) {
            console.error('Failed to get transaction status:', error);
            throw error;
        }
    }

    public async fetchAbiFromServer(): Promise<VMABI> {
        try {
            // Return dynamically fetched ABI from the VM server.
            const response = await this.httpClient.makeVmAPIRequest('abi', {});

            if (typeof response === 'object' && response !== null && 'actions' in response && 'outputs' in response) {
                const vmAbi = response as VMABI;

                this.marshaler = new Marshaler(vmAbi);

                return vmAbi;
            } else {
                throw new Error('Invalid ABI response from server');
            }
        } catch (error) {
            console.error('Failed to fetch ABI from server:', error);
            throw error;
        }
    }

    public async getAbi() {
        try {
            return NuklaiABI;
        } catch (error) {
            console.error('ABI retrieval failed:', error);
            throw error;
        }
    }

    async executeAction(actionData: ActionData): Promise<string[]> {
        if (!this.signer) {
            throw new Error("Signer not set");
        }

        try {
            const serializedAction = this.marshaler.encodeTyped(
                actionData.actionName,
                JSON.stringify(actionData.data)
            );

            const publicKeyString = Buffer.from(this.signer.getPublicKey()).toString('hex');

            return await this.httpClient.executeActions(
                [serializedAction],
                publicKeyString
            );
        } catch (error) {
            console.error('Failed to execute action:', error);
            throw error;
        }
    }

    private async sendAction(actionName: string, data: Record<string, unknown>): Promise<TxResult> {
        if (!this.signer) {
            throw new Error("Signer not set");
        }

        const actionTypes: Record<string, string> = {
            "createAssetFT": "CreateAssetFt",
            "createAssetNFT": "CreateAssetNFT",
            "mintAssetFT": "MintAssetFT",
            "mintAssetNFT": "MintAssetNFT",
            "burnAssetFT": "BurnAssetFT",
            "burnAssetNFT": "BurnAssetNFT",
            "transfer": "Transfer",
            "createDataset": "CreateDataset",
            "updateDataset": "UpdateDataset",
            "publishDatasetToMarketplace": "PublishDatasetToMarketplace",
            "subscribeDatasetMarketplace": "SubscribeDatasetMarketplace",
            "claimMarketplacePayment": "ClaimMarketplacePayment",
        };

        const mappedActionName = actionTypes[actionName] || actionName;
        return await this.client.sendTransaction([{ actionName: mappedActionName, data }]);
    }

    convertToNativeTokens(formattedBalance: string): bigint {
        return this.client.convertToNativeTokens(formattedBalance);
    }

    /**
     * Listen to new blocks from the chain
     * @param callback Function to be called when a new block is received
     * @param includeEmpty Optional parameter to include empty blocks (default: false)
     * @returns A function to unsubscribe from block updates
     */

    listenToBlocks(callback: (block: any) => void, includeEmpty: boolean = false) {
        try {

            return this.client.listenToBlocks((block) => {
               if (includeEmpty || (block?.block?.txs?.length > 0)) {
                    callback(block);
                }
            });
        } catch (error) {
            console.error('Failed to initialize block listener:', error);
            throw error;
        }
    }

    public async validateConnection(): Promise<boolean> {
        try {
            const abi = await this.getAbi();
            return !!abi;
        } catch (error) {
            console.error('Connection validation failed:', error);
            return false;
        }
    }

    protected async makeVmRequest<T>(method: string, params: Record<string, unknown> = {}): Promise<T> {
        try {
            return await this.httpClient.makeVmAPIRequest<T>(method, params);
        } catch (error) {
            console.error(`VM request failed for method ${method}:`, error);
            throw error;
        }
    }
}
