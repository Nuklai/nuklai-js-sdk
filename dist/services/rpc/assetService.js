"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetService = void 0;
const hyperchain_sdk_1 = require("@nuklai/hyperchain-sdk");
const nuklaivm_1 = require("../../constants/nuklaivm");
const nuklaiApiService_1 = require("../nuklaiApiService");
class AssetService extends nuklaiApiService_1.NuklaiApiService {
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
}
exports.AssetService = AssetService;
//# sourceMappingURL=assetService.js.map