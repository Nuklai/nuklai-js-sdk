"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
const endpoints_1 = require("../constants/endpoints");
const rpc_1 = require("./rpc");
class Api {
    constructor(baseURL = endpoints_1.MAINNET_PUBLIC_API_BASE_URL, path = `${endpoints_1.NUKLAI_CHAIN_ENDPOINT}/${endpoints_1.NUKLAI_COREAPI_PATH}`, base, fetchOptions) {
        this.path = path;
        this.base = base;
        this.fetchOptions = fetchOptions;
        this.getMethodName = (methodName) => {
            if (!this.base) {
                return methodName;
            }
            return `${this.base}.${methodName}`;
        };
        this.callRpc = (methodName, params) => this.rpcProvider.callMethod(this.getMethodName(methodName), params, this.fetchOptions);
        this.rpcProvider = new rpc_1.JrpcProvider(baseURL + path);
    }
    setFetchOptions(options) {
        this.fetchOptions = options;
    }
}
exports.Api = Api;
//# sourceMappingURL=baseApi.js.map