// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { HyperSDKClient } from 'hypersdk-client';
import { NuklaiABI} from "./abi";
import { Marshaler } from "hypersdk-client/dist/Marshaler";
import { ActionData, ActionOutput, SignerIface, TransactionPayload } from "hypersdk-client/dist/types";
import { TxResult } from "hypersdk-client/dist/apiTransformers";

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
    async getBalance(address: string): Promise<string> {
        const balance = await this.client.getBalance(address);
        return this.client.formatNativeTokens(balance);
    }

    public async getTransactionStatus(txID: string): Promise<TxResult> {
        return this.client.getTransactionStatus(txID);
    }

    async executeAction(actionData: ActionData): Promise<ActionOutput[]> {
        if (!this.signer) {
            throw new Error("Signer not set");
        }
        return await this.client.executeActions([actionData]);
    }

    // Validator Methods
    async getAllValidators(): Promise<ActionOutput> {
        return (await this.client.executeActions([{
            actionName: "GetAllValidators",
            data: {}
        }]))[0];
    }

    async getStakedValidators(): Promise<ActionOutput> {
        return (await this.client.executeActions([{
            actionName: "GetStakedValidators",
            data: {}
        }]))[0];
    }

    async getValidatorStake(nodeID: string): Promise<ActionOutput> {
        return (await this.client.executeActions([{
            actionName: "GetValidatorStake",
            data: { nodeID }
        }]))[0];
    }

    async getUserStake(params: { owner: string; nodeID: string }): Promise<ActionOutput> {
        return (await this.client.executeActions([{
            actionName: "GetUserStake",
            data: params
        }]))[0];
    }

    async getEmissionInfo(): Promise<ActionOutput> {
        return (await this.client.executeActions([{
            actionName: "GetEmissionInfo",
            data: {}
        }]))[0];
    }

    async getAssetInfo(asset: string): Promise<ActionOutput> {
        return (await this.client.executeActions([{
            actionName: "GetAssetInfo",
            data: { asset }
        }]))[0];
    }

    // Helper Methods
    private async sendAction(actionName: string, data: Record<string, unknown>): Promise<TxResult> {
        if (!this.signer) {
            throw new Error("Signer not set");
        }
        return await this.client.sendTransaction([{ actionName, data }]);
    }

    convertToNativeTokens(formattedBalance: string): bigint {
        return this.client.convertToNativeTokens(formattedBalance);
    }

    async getAbi() {
        return await this.client.getAbi();
    }

    listenToBlocks(callback: Function) {
        return this.client.listenToBlocks((block) => callback(block));
    }
}