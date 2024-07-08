"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperApiService = void 0;
const avalanchejs_1 = require("@avalabs/avalanchejs");
const baseApi_1 = require("../common/baseApi");
const endpoints_1 = require("../constants/endpoints");
const baseTx_1 = require("../transactions/baseTx");
const fees_1 = require("../transactions/fees");
const transaction_1 = require("../transactions/transaction");
const utils_1 = require("../utils/utils");
const genesisService_1 = require("./nuklaivm/genesisService");
class HyperApiService extends baseApi_1.Api {
    constructor(config) {
        super(config.baseApiUrl, `/ext/bc/${config.blockchainId}/${endpoints_1.NUKLAI_COREAPI_PATH}`, endpoints_1.NUKLAI_COREAPI_METHOD_PREFIX);
        this.config = config;
        this.genesisApiService = new genesisService_1.GenesisService(config);
    }
    ping() {
        return this.callRpc('ping');
    }
    // Retrieve network IDs
    getNetworkInfo() {
        return this.callRpc('network');
    }
    // Get information about the last accepted block
    getLastAccepted() {
        return this.callRpc('lastAccepted');
    }
    // Fetch current unit prices for transactions
    getUnitPrices() {
        return this.callRpc('unitPrices');
    }
    // Fetch warp signatures associated with a transaction
    getWarpSignatures(txID) {
        return this.callRpc('getWarpSignatures', {
            txID
        });
    }
    // Submit a transaction to the network
    async submitTransaction(tx) {
        // Convert Uint8Array to base64 string
        const txBase64 = Array.from(tx);
        return this.callRpc('submitTx', { tx: txBase64 });
    }
    async generateTransaction(actions, authFactory) {
        try {
            // Construct the base transaction
            // Set timestamp
            const genesisInfo = await this.genesisApiService.getGenesisInfo();
            const timestamp = (0, utils_1.getUnixRMilli)(Date.now(), genesisInfo.genesis.validityWindow);
            // Set chain ID
            const chainId = avalanchejs_1.Id.fromString(this.config.blockchainId);
            // Set maxFee
            const unitPrices = await this.getUnitPrices();
            const units = (0, fees_1.estimateUnits)(genesisInfo.genesis, actions, authFactory);
            const [maxFee, error] = (0, fees_1.mulSum)(unitPrices.unitPrices, units);
            if (error) {
                return {
                    submit: async () => {
                        throw new Error('Transaction failed, cannot submit.');
                    },
                    txSigned: {},
                    err: error
                };
            }
            const base = new baseTx_1.BaseTx(timestamp, chainId, maxFee);
            const tx = new transaction_1.Transaction(base, actions);
            // Sign the transaction
            const [txSigned, err] = tx.sign(authFactory);
            if (err) {
                return {
                    submit: async () => {
                        throw new Error('Transaction failed, cannot submit.');
                    },
                    txSigned: {},
                    err: err
                };
            }
            const submit = async () => {
                const [txBytes, err] = txSigned.toBytes();
                if (err) {
                    throw new Error(`Transaction failed, cannot submit. Err: ${err}`);
                }
                return await this.submitTransaction(txBytes);
            };
            return { submit, txSigned, err: undefined };
        }
        catch (error) {
            return {
                submit: async () => {
                    throw new Error('Transaction failed, cannot submit.');
                },
                txSigned: {},
                err: error
            };
        }
    }
}
exports.HyperApiService = HyperApiService;
//# sourceMappingURL=hyperApiService.js.map