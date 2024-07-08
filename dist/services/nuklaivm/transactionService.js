"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const createAsset_1 = require("../../actions/createAsset");
const mintAsset_1 = require("../../actions/mintAsset");
const transfer_1 = require("../../actions/transfer");
const nuklaivm_1 = require("../../constants/nuklaivm");
const hashing_1 = require("../../utils/hashing");
const utils_1 = require("../../utils/utils");
const hyperApiService_1 = require("../hyperApiService");
const nuklaiApiService_1 = require("../nuklaiApiService");
const assetService_1 = require("./assetService");
class TransactionService extends nuklaiApiService_1.NuklaiApiService {
    constructor(config) {
        super(config);
        this.assetService = new assetService_1.AssetService(config);
        this.hyperApiService = new hyperApiService_1.HyperApiService(config);
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
            const amountInUnits = (0, utils_1.parseBalance)(amount, decimals);
            // Fetch the balance to ensure sufficient funds
            const balanceResponse = await this.assetService.getBalance({
                address: fromAddress.toString(),
                asset
            });
            if ((0, utils_1.parseBalance)(balanceResponse.amount, decimals) < amountInUnits) {
                throw new Error('Insufficient balance');
            }
            const transfer = new transfer_1.Transfer(to, asset, amountInUnits, memo);
            const { submit, txSigned, err } = await this.hyperApiService.generateTransaction([transfer], authFactory);
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
            const { submit, txSigned, err } = await this.hyperApiService.generateTransaction([createAsset], authFactory);
            if (err) {
                throw err;
            }
            await submit();
            const txID = txSigned.id().toString();
            return { txID, assetID: (0, hashing_1.createActionID)(txSigned.id(), 0).toString() };
        }
        catch (error) {
            console.error('Failed to create and submit transaction for "CreateAsset" type', error);
            throw error;
        }
    }
    async sendMintAssetTransaction(to, asset, amount, authFactory) {
        try {
            const decimals = nuklaivm_1.DECIMALS;
            const amountInUnits = (0, utils_1.parseBalance)(amount, decimals);
            const mintAsset = new mintAsset_1.MintAsset(to, asset, amountInUnits);
            const { submit, txSigned, err } = await this.hyperApiService.generateTransaction([mintAsset], authFactory);
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