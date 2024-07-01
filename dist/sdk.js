"use strict";
// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.
Object.defineProperty(exports, "__esModule", { value: true });
exports.NuklaiSDK = void 0;
const hyperchain_sdk_1 = require("@nuklai/hyperchain-sdk");
const endpoints_1 = require("./constants/endpoints");
const rpc_1 = require("./services/rpc");
const nuklaivm_1 = require("./constants/nuklaivm");
const createAsset_1 = require("./actions/createAsset");
const mintAsset_1 = require("./actions/mintAsset");
class NuklaiSDK extends hyperchain_sdk_1.HyperchainSDK {
    // Nuklaivm service
    rpcServiceNuklai;
    constructor(nodeConfig) {
        const defaultSDKConfig = {
            baseApiUrl: endpoints_1.MAINNET_PUBLIC_API_BASE_URL,
            blockchainId: endpoints_1.NUKLAI_CHAIN_ID
        };
        super({ ...defaultSDKConfig, ...nodeConfig });
        // Nuklaivm services
        this.rpcServiceNuklai = new rpc_1.RpcService(this.nodeConfig);
        // Custom Registry
        this.actionRegistry.register(nuklaivm_1.CREATEASSET_ID, createAsset_1.CreateAsset.fromBytesCodec, false);
        this.actionRegistry.register(nuklaivm_1.MINTASSET_ID, mintAsset_1.MintAsset.fromBytesCodec, false);
    }
}
exports.NuklaiSDK = NuklaiSDK;
//# sourceMappingURL=sdk.js.map