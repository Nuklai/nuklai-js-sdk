"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmissionService = void 0;
const nuklaivm_1 = require("../../constants/nuklaivm");
const utils_1 = require("../../utils/utils");
const nuklaiApiService_1 = require("../nuklaiApiService");
class EmissionService extends nuklaiApiService_1.NuklaiApiService {
    async getEmissionInfo() {
        const result = await this.callRpc('emissionInfo');
        result.totalSupply = (0, utils_1.formatBalance)(result.totalSupply, nuklaivm_1.DECIMALS);
        result.maxSupply = (0, utils_1.formatBalance)(result.maxSupply, nuklaivm_1.DECIMALS);
        result.totalStaked = (0, utils_1.formatBalance)(result.totalStaked, nuklaivm_1.DECIMALS);
        result.rewardsPerEpoch = (0, utils_1.formatBalance)(result.rewardsPerEpoch, nuklaivm_1.DECIMALS);
        result.emissionAccount.accumulatedReward = (0, utils_1.formatBalance)(result.emissionAccount.accumulatedReward, nuklaivm_1.DECIMALS);
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
}
exports.EmissionService = EmissionService;
//# sourceMappingURL=emissionService.js.map