// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { HyperSDKClient } from 'hypersdk-client';
import { HyperSDKHTTPClient } from 'hypersdk-client/dist/HyperSDKHTTPClient';
import { NuklaiABI } from "./abi";
import { Marshaler, VMABI } from "hypersdk-client/dist/Marshaler";
import { ActionData, ActionOutput, SignerIface } from "hypersdk-client/dist/types";
import { TxResult } from "hypersdk-client/dist/apiTransformers";
import { VM_NAME, VM_RPC_PREFIX, MAINNET_PUBLIC_API_BASE_URL, getBlockchainEndpoint } from './endpoints';

export class NuklaiCoreApiClient {
    private httpClient: HyperSDKHTTPClient;

    constructor(
        rpcEndpoint: string = MAINNET_PUBLIC_API_BASE_URL,
        private vmName: string = VM_NAME,
    ) {
        this.httpClient = new HyperSDKHTTPClient(
            rpcEndpoint,
            vmName,
            'coreapi'
        );
    }

    public async getABI(): Promise<VMABI> {
        try {
            // Remove 'hypersdk.' since makeCoreAPIRequest adds it automatically
            const response = await this.httpClient.makeCoreAPIRequest('getABI', {});

            if (!response || typeof response !== 'object') {
                throw new Error('Invalid ABI response from server');
            }

            // Extract the ABI - the response should have an 'abi' property
            const abi = (response as any).abi;
            if (!abi) {
                throw new Error('ABI not found in server response');
            }

            return abi;
        } catch (error) {
            console.error('Failed to fetch ABI from coreapi:', error);
            throw error;
        }
    }
}

export class NuklaiVMClient {
    private client: HyperSDKClient;
    private httpClient: HyperSDKHTTPClient;
    private coreApiClient: NuklaiCoreApiClient;
    private marshaler: Marshaler;
    private signer?: SignerIface;
    private readonly baseEndpoint: string;

    constructor(
        rpcEndpoint: string = MAINNET_PUBLIC_API_BASE_URL,
        private vmName: string = VM_NAME,
        private rpcPrefix: string = VM_RPC_PREFIX,
    ) {
        this.baseEndpoint = rpcEndpoint.replace(/\/$/, '');
        this.coreApiClient = new NuklaiCoreApiClient(this.baseEndpoint, vmName);

        // Use direct endpoint without chain ID
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
        return this.sendAction("CreateAsset", {
            asset_type: 1, // FT
            name: params.name,
            symbol: params.symbol,
            decimals: params.decimals,
            metadata: params.metadata,
            max_supply: params.maxSupply.toString(),
            mint_admin: params.mintAdmin,
            pause_unpause_admin: params.pauseUnpauseAdmin,
            freeze_unfreeze_admin: params.freezeUnfreezeAdmin,
            enable_disable_kyc_account_admin: params.enableDisableKYCAccountAdmin
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
        return this.sendAction("CreateAsset", {
            asset_type: 2, // NFT
            name: params.name,
            symbol: params.symbol,
            decimals: 0, // NFTs has 0 decimals
            metadata: params.metadata,
            max_supply: params.maxSupply.toString(),
            mint_admin: params.mintAdmin,
            pause_unpause_admin: params.pauseUnpauseAdmin,
            freeze_unfreeze_admin: params.freezeUnfreezeAdmin,
            enable_disable_kyc_account_admin: params.enableDisableKYCAccountAdmin
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
            to: params.to,
            asset_address: params.assetAddress,
            value: params.amount.toString()
        });
    }

    async mintNFTAsset(params: {
        assetAddress: string;
        metadata: string;
        to: string;
    }): Promise<TxResult> {
        return this.sendAction("MintAssetNFT", {
            asset_address: params.assetAddress,
            metadata: params.metadata,
            to: params.to
        });
    }

    async burnFTAsset(params: {
        assetAddress: string;
        amount: bigint;
    }): Promise<TxResult> {
        return this.sendAction("BurnAssetFT", {
            asset_address: params.assetAddress,
            value: params.amount.toString()
        });
    }

    async burnNFTAsset(params: {
        assetAddress: string;
        assetNftAddress: string;
    }): Promise<TxResult> {
        return this.sendAction("BurnAssetNFT", {
            asset_address: params.assetAddress,
            asset_nft_address: params.assetNftAddress
        });
    }

    async transfer(params: {
        to: string;
        assetAddress: string;
        value: bigint;
        memo: string;
    }): Promise<TxResult> {
        return this.sendAction("Transfer", {
            to: params.to,
            asset_address: params.assetAddress,
            value: params.value.toString(),
            memo: params.memo
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
            const vmAbi = await this.coreApiClient.getABI();
            if (this.isValidABI(vmAbi)) {
                console.log('Successfully fetched ABI from server');
                this.marshaler = new Marshaler(vmAbi);
                return vmAbi;
            } else {
                console.log('Invalid ABI from server, falling back to static ABI');
                this.marshaler = new Marshaler(NuklaiABI);
                return NuklaiABI;
            }
        } catch (error) {
            console.log('Server ABI fetch failed, using static ABI');
            this.marshaler = new Marshaler(NuklaiABI);
            return NuklaiABI;
        }
    }

    private isValidABI(abi: any): boolean {
        return (
            abi &&
            typeof abi === 'object' &&
            Array.isArray(abi.actions) &&
            Array.isArray(abi.types) &&
            abi.actions.length > 0 &&
            abi.types.length > 0
        );
    }

    public async getAbi(): Promise<VMABI> {
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

        return await this.client.sendTransaction([{ actionName, data }]);
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

    async makeVmRequest<T>(method: string, params: Record<string, unknown> = {}): Promise<T> {
        try {
            return await this.httpClient.makeVmAPIRequest<T>(method, params);
        } catch (error) {
            console.error(`VM request failed for method ${method}:`, error);
            throw error;
        }
    }

    async requestTestTokens(address: string): Promise<TxResult> {
        try {
            return await this.httpClient.makeVmAPIRequest(
                'faucet',
                { address }
            );
        } catch (error) {
            console.error('Failed to request test tokens:', error);
            throw error;
        }
    }
}
