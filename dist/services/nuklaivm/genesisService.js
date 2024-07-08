"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenesisService = void 0;
const nuklaivm_1 = require("../../constants/nuklaivm");
const utils_1 = require("../../utils/utils");
const nuklaiApiService_1 = require("../nuklaiApiService");
class GenesisService extends nuklaiApiService_1.NuklaiApiService {
    async getGenesisInfo() {
        const result = await this.callRpc('genesis');
        // Format the balance of each CustomAllocation
        result.genesis.customAllocation = result.genesis.customAllocation.map((allocation) => ({
            ...allocation,
            balance: (0, utils_1.formatBalance)(allocation.balance, nuklaivm_1.DECIMALS)
        }));
        result.genesis.emissionBalancer.maxSupply = (0, utils_1.formatBalance)(result.genesis.emissionBalancer.maxSupply, nuklaivm_1.DECIMALS);
        return result;
    }
}
exports.GenesisService = GenesisService;
//# sourceMappingURL=genesisService.js.map