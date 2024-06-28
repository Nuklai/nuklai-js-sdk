// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { HyperchainSDK, config } from '@nuklai/hyperchain-sdk'
import {
  MAINNET_PUBLIC_API_BASE_URL,
  NUKLAI_CHAIN_ID
} from './constants/endpoints'
import { RpcService } from './services/rpc'

export * as actions from './actions'
export * as common from './common'
export * as consts from './constants'
export * as services from './services'

export class NuklaiSDK extends HyperchainSDK {
  // Nuklaivm service
  rpcServiceNuklai: RpcService

  constructor(nodeConfig?: Partial<config.NodeConfig>) {
    const defaultSDKConfig: config.NodeConfig = {
      baseApiUrl: MAINNET_PUBLIC_API_BASE_URL,
      blockchainId: NUKLAI_CHAIN_ID
    }
    super({ ...defaultSDKConfig, ...nodeConfig } as config.NodeConfig)

    // Nuklaivm services
    this.rpcServiceNuklai = new RpcService(this.nodeConfig)
  }
}
