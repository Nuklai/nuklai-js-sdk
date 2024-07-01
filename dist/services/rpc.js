"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.RpcService = void 0;
const hyperchain_sdk_1 = require("@nuklai/hyperchain-sdk");
const createAsset_1 = require("../actions/createAsset");
const mintAsset_1 = require("../actions/mintAsset");
const transfer_1 = require("../actions/transfer");
const endpoints_1 = require("../constants/endpoints");
const nuklaivm_1 = require("../constants/nuklaivm");
class RpcService extends hyperchain_sdk_1.common.Api {
    configNuklai;
    constructor(configNuklai) {
        super(configNuklai.baseApiUrl, `/ext/bc/${configNuklai.blockchainId}/${endpoints_1.NUKLAI_VMAPI_PATH}`, endpoints_1.NUKLAI_VMAPI_METHOD_PREFIX);
        this.configNuklai = configNuklai;
    }
    async getGenesisInfo() {
        const result = await this.callRpc('genesis');
        // Format the balance of each CustomAllocation
        result.genesis.customAllocation = result.genesis.customAllocation.map((allocation) => ({
            ...allocation,
            balance: hyperchain_sdk_1.utils.formatBalance(allocation.balance, nuklaivm_1.DECIMALS)
        }));
        result.genesis.emissionBalancer.maxSupply = hyperchain_sdk_1.utils.formatBalance(result.genesis.emissionBalancer.maxSupply, nuklaivm_1.DECIMALS);
        return result;
    }
    getTransactionInfo(getTransactionInfoParams) {
        return this.callRpc('tx', getTransactionInfoParams);
    }
    async getBalance(getBalanceParams) {
        const params = getBalanceParams;
        params.asset = hyperchain_sdk_1.utils.toAssetID(params.asset).toString();
        const result = await this.callRpc('balance', params);
        result.amount = hyperchain_sdk_1.utils.formatBalance(result.amount, nuklaivm_1.DECIMALS);
        return result;
    }
    async getAssetInfo(getAssetInfoParams) {
        const params = getAssetInfoParams;
        params.asset = hyperchain_sdk_1.utils.toAssetID(params.asset).toString();
        const result = await this.callRpc('asset', params);
        result.supply = hyperchain_sdk_1.utils.formatBalance(result.supply, nuklaivm_1.DECIMALS);
        return result;
    }
    async getEmissionInfo() {
        const result = await this.callRpc('emissionInfo');
        result.totalSupply = hyperchain_sdk_1.utils.formatBalance(result.totalSupply, nuklaivm_1.DECIMALS);
        result.maxSupply = hyperchain_sdk_1.utils.formatBalance(result.maxSupply, nuklaivm_1.DECIMALS);
        result.totalStaked = hyperchain_sdk_1.utils.formatBalance(result.totalStaked, nuklaivm_1.DECIMALS);
        result.rewardsPerEpoch = hyperchain_sdk_1.utils.formatBalance(result.rewardsPerEpoch, nuklaivm_1.DECIMALS);
        result.emissionAccount.accumulatedReward = hyperchain_sdk_1.utils.formatBalance(result.emissionAccount.accumulatedReward, nuklaivm_1.DECIMALS);
        return result;
    }
    getAllValidators() {
        return this.callRpc('allValidators');
    }
    getStakedValidators() {
        return this.callRpc('stakedValidators');
    }
    getValidatorStake(getValidatorStakeParams) {
        return this.callRpc('validatorStake', getValidatorStakeParams);
    }
    getUserStake(getUserStakeParams) {
        return this.callRpc('userStake', getUserStakeParams);
    }
    async sendTransferTransaction(to, asset, amount, memo, authFactory, hyperApiService, actionRegistry, authRegistry) {
        try {
            // Generate the from address using the private key
            const auth = authFactory.sign(new Uint8Array(0));
            const fromAddress = auth.address();
            const decimals = nuklaivm_1.DECIMALS;
            const amountInUnits = hyperchain_sdk_1.utils.parseBalance(amount, decimals);
            // Fetch the balance to ensure sufficient funds
            const balanceResponse = await this.getBalance({
                address: fromAddress.toString(),
                asset
            });
            if (hyperchain_sdk_1.utils.parseBalance(balanceResponse.amount, decimals) < amountInUnits) {
                throw new Error('Insufficient balance');
            }
            const transfer = new transfer_1.Transfer(to, asset, amountInUnits, memo);
            const genesisInfo = await this.getGenesisInfo();
            const { submit, txSigned, err } = await hyperApiService.generateTransaction(genesisInfo.genesis, actionRegistry, authRegistry, [transfer], authFactory);
            if (err) {
                throw err;
            }
            await submit();
            return txSigned.id().toString();
        }
        catch (error) {
            console.error('Failed to create and submit transaction for "Transfer" type', error);
            throw error;
        }
    }
    async sendCreateAssetTransaction(symbol, decimals, metadata, authFactory, hyperApiService, actionRegistry, authRegistry) {
        try {
            const createAsset = new createAsset_1.CreateAsset(symbol, decimals, metadata);
            const genesisInfo = await this.getGenesisInfo();
            const { submit, txSigned, err } = await hyperApiService.generateTransaction(genesisInfo.genesis, actionRegistry, authRegistry, [createAsset], authFactory);
            if (err) {
                throw err;
            }
            await submit();
            const txID = txSigned.id().toString();
            return {
                txID,
                assetID: hyperchain_sdk_1.utils.createActionID(txSigned.id(), 0).toString()
            };
        }
        catch (error) {
            console.error('Failed to create and submit transaction for "CreateAsset" type', error);
            throw error;
        }
    }
    async sendMintAssetTransaction(to, asset, amount, authFactory, hyperApiService, actionRegistry, authRegistry) {
        try {
            const decimals = nuklaivm_1.DECIMALS;
            const amountInUnits = hyperchain_sdk_1.utils.parseBalance(amount, decimals);
            const mintAsset = new mintAsset_1.MintAsset(to, asset, amountInUnits);
            const genesisInfo = await this.getGenesisInfo();
            const { submit, txSigned, err } = await hyperApiService.generateTransaction(genesisInfo.genesis, actionRegistry, authRegistry, [mintAsset], authFactory);
            if (err) {
                throw err;
            }
            await submit();
            return txSigned.id().toString();
        }
        catch (error) {
            console.error('Failed to create and submit transaction for "MintAsset" type', error);
            throw error;
        }
    }
}
exports.RpcService = RpcService;
//# sourceMappingURL=rpc.js.map