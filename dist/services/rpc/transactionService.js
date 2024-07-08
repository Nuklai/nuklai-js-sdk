"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const hyperchain_sdk_1 = require("@nuklai/hyperchain-sdk");
const createAsset_1 = require("../../actions/createAsset");
const mintAsset_1 = require("../../actions/mintAsset");
const transfer_1 = require("../../actions/transfer");
const nuklaivm_1 = require("../../constants/nuklaivm");
const nuklaiApiService_1 = require("../nuklaiApiService");
const assetService_1 = require("./assetService");
const genesisService_1 = require("./genesisService");
class TransactionService extends nuklaiApiService_1.NuklaiApiService {
    hyperApiService;
    genesisApiService;
    assetService;
    constructor(configNuklai) {
        super(configNuklai);
        this.hyperApiService = new hyperchain_sdk_1.services.RpcService(configNuklai);
        this.genesisApiService = new genesisService_1.GenesisService(configNuklai);
        this.assetService = new assetService_1.AssetService(configNuklai);
    }
    getTransactionInfo(getTransactionInfoParams) {
        return this.callRpc('tx', getTransactionInfoParams);
    }
    async sendTransferTransaction(to, asset, amount, memo, authFactory) {
        try {
            // Generate the from address using the private key
            const auth = authFactory.sign(new Uint8Array(0));
            const fromAddress = auth.address();
            const decimals = nuklaivm_1.DECIMALS;
            const amountInUnits = hyperchain_sdk_1.utils.parseBalance(amount, decimals);
            // Fetch the balance to ensure sufficient funds
            const balanceResponse = await this.assetService.getBalance({
                address: fromAddress.toString(),
                asset
            });
            if (hyperchain_sdk_1.utils.parseBalance(balanceResponse.amount, decimals) < amountInUnits) {
                throw new Error('Insufficient balance');
            }
            const transfer = new transfer_1.Transfer(to, asset, amountInUnits, memo);
            const genesisInfo = await this.genesisApiService.getGenesisInfo();
            const { submit, txSigned, err } = await this.hyperApiService.generateTransaction(genesisInfo.genesis, [transfer], authFactory);
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
    async sendCreateAssetTransaction(symbol, decimals, metadata, authFactory) {
        try {
            const createAsset = new createAsset_1.CreateAsset(symbol, decimals, metadata);
            const genesisInfo = await this.genesisApiService.getGenesisInfo();
            const { submit, txSigned, err } = await this.hyperApiService.generateTransaction(genesisInfo.genesis, [createAsset], authFactory);
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
    async sendMintAssetTransaction(to, asset, amount, authFactory) {
        try {
            const decimals = nuklaivm_1.DECIMALS;
            const amountInUnits = hyperchain_sdk_1.utils.parseBalance(amount, decimals);
            const mintAsset = new mintAsset_1.MintAsset(to, asset, amountInUnits);
            const genesisInfo = await this.genesisApiService.getGenesisInfo();
            const { submit, txSigned, err } = await this.hyperApiService.generateTransaction(genesisInfo.genesis, [mintAsset], authFactory);
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
exports.TransactionService = TransactionService;
//# sourceMappingURL=transactionService.js.map