"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.NuklaiApiService = void 0;
const hyperchain_sdk_1 = require("@nuklai/hyperchain-sdk");
const endpoints_1 = require("../constants/endpoints");
class NuklaiApiService extends hyperchain_sdk_1.common.Api {
    configNuklai;
    constructor(configNuklai) {
        super(configNuklai.baseApiUrl, `/ext/bc/${configNuklai.blockchainId}/${endpoints_1.NUKLAI_VMAPI_PATH}`, endpoints_1.NUKLAI_VMAPI_METHOD_PREFIX);
        this.configNuklai = configNuklai;
    }
}
exports.NuklaiApiService = NuklaiApiService;
//# sourceMappingURL=nuklaiApiService.js.map