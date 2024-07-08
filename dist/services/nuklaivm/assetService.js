"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetService = void 0;
const nuklaivm_1 = require("../../constants/nuklaivm");
const utils_1 = require("../../utils/utils");
const nuklaiApiService_1 = require("../nuklaiApiService");
class AssetService extends nuklaiApiService_1.NuklaiApiService {
    async getBalance(getBalanceParams) {
        const params = getBalanceParams;
        params.asset = (0, utils_1.toAssetID)(params.asset).toString();
        const result = await this.callRpc('balance', params);
        result.amount = (0, utils_1.formatBalance)(result.amount, nuklaivm_1.DECIMALS);
        return result;
    }
    async getAssetInfo(getAssetInfoParams) {
        const params = getAssetInfoParams;
        params.asset = (0, utils_1.toAssetID)(params.asset).toString();
        const result = await this.callRpc('asset', params);
        result.supply = (0, utils_1.formatBalance)(result.supply, nuklaivm_1.DECIMALS);
        return result;
    }
}
exports.AssetService = AssetService;
//# sourceMappingURL=assetService.js.map