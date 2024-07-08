"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenesisService = void 0;
const hyperchain_sdk_1 = require("@nuklai/hyperchain-sdk");
const nuklaivm_1 = require("../../constants/nuklaivm");
const nuklaiApiService_1 = require("../nuklaiApiService");
class GenesisService extends nuklaiApiService_1.NuklaiApiService {
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
}
exports.GenesisService = GenesisService;
//# sourceMappingURL=genesisService.js.map