// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
import { common, utils } from '@nuklai/hyperchain-sdk';
import { CreateAsset } from '../actions/createAsset';
import { MintAsset } from '../actions/mintAsset';
import { Transfer } from '../actions/transfer';
import { NUKLAI_VMAPI_METHOD_PREFIX, NUKLAI_VMAPI_PATH } from '../constants/endpoints';
import { DECIMALS } from '../constants/nuklaivm';
export class RpcService extends common.Api {
    configNuklai;
    constructor(configNuklai) {
        super(configNuklai.baseApiUrl, `/ext/bc/${configNuklai.blockchainId}/${NUKLAI_VMAPI_PATH}`, NUKLAI_VMAPI_METHOD_PREFIX);
        this.configNuklai = configNuklai;
    }
    async getGenesisInfo() {
        const result = await this.callRpc('genesis');
        // Format the balance of each CustomAllocation
        result.genesis.customAllocation = result.genesis.customAllocation.map((allocation) => ({
            ...allocation,
            balance: utils.formatBalance(allocation.balance, DECIMALS)
        }));
        result.genesis.emissionBalancer.maxSupply = utils.formatBalance(result.genesis.emissionBalancer.maxSupply, DECIMALS);
        return result;
    }
    getTransactionInfo(getTransactionInfoParams) {
        return this.callRpc('tx', getTransactionInfoParams);
    }
    async getBalance(getBalanceParams) {
        const params = getBalanceParams;
        params.asset = utils.toAssetID(params.asset).toString();
        const result = await this.callRpc('balance', params);
        result.amount = utils.formatBalance(result.amount, DECIMALS);
        return result;
    }
    async getAssetInfo(getAssetInfoParams) {
        const params = getAssetInfoParams;
        params.asset = utils.toAssetID(params.asset).toString();
        const result = await this.callRpc('asset', params);
        result.supply = utils.formatBalance(result.supply, DECIMALS);
        return result;
    }
    async getEmissionInfo() {
        const result = await this.callRpc('emissionInfo');
        result.totalSupply = utils.formatBalance(result.totalSupply, DECIMALS);
        result.maxSupply = utils.formatBalance(result.maxSupply, DECIMALS);
        result.totalStaked = utils.formatBalance(result.totalStaked, DECIMALS);
        result.rewardsPerEpoch = utils.formatBalance(result.rewardsPerEpoch, DECIMALS);
        result.emissionAccount.accumulatedReward = utils.formatBalance(result.emissionAccount.accumulatedReward, DECIMALS);
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
            const decimals = DECIMALS;
            const amountInUnits = utils.parseBalance(amount, decimals);
            // Fetch the balance to ensure sufficient funds
            const balanceResponse = await this.getBalance({
                address: fromAddress.toString(),
                asset
            });
            if (utils.parseBalance(balanceResponse.amount, decimals) < amountInUnits) {
                throw new Error('Insufficient balance');
            }
            const transfer = new Transfer(to, asset, amountInUnits, memo);
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
            const createAsset = new CreateAsset(symbol, decimals, metadata);
            const genesisInfo = await this.getGenesisInfo();
            const { submit, txSigned, err } = await hyperApiService.generateTransaction(genesisInfo.genesis, actionRegistry, authRegistry, [createAsset], authFactory);
            if (err) {
                throw err;
            }
            await submit();
            const txID = txSigned.id().toString();
            return {
                txID,
                assetID: utils.createActionID(txSigned.id(), 0).toString()
            };
        }
        catch (error) {
            console.error('Failed to create and submit transaction for "CreateAsset" type', error);
            throw error;
        }
    }
    async sendMintAssetTransaction(to, asset, amount, authFactory, hyperApiService, actionRegistry, authRegistry) {
        try {
            const decimals = DECIMALS;
            const amountInUnits = utils.parseBalance(amount, decimals);
            const mintAsset = new MintAsset(to, asset, amountInUnits);
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
//# sourceMappingURL=rpc.js.map