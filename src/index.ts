// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { config, services } from '@nuklai/hyperchain-sdk'
import {
  MAINNET_PUBLIC_API_BASE_URL,
  NUKLAI_CHAIN_ID
} from './constants/endpoints'
import { AssetService } from './services/rpc/assetService'
import { EmissionService } from './services/rpc/emissionService'
import { GenesisService } from './services/rpc/genesisService'
import { TransactionService } from './services/rpc/transactionService'

export * as actions from './actions'
export * as common from './common'
export * as consts from './constants'
export * as services from './services'

export class NuklaiSDK {
  nodeConfig: config.NodeConfig

  // Hypervm services
  hyperApiService: services.RpcService

  // Nuklaivm services
  genesisService: GenesisService
  assetService: AssetService
  transactionService: TransactionService
  emissionService: EmissionService

  constructor(nodeConfig?: Partial<config.NodeConfig>) {
    const defaultSDKConfig: config.NodeConfig = {
      baseApiUrl: MAINNET_PUBLIC_API_BASE_URL,
      blockchainId: NUKLAI_CHAIN_ID
    }
    this.nodeConfig = { ...defaultSDKConfig, ...nodeConfig }

    // Hypervm services
    this.hyperApiService = new services.RpcService(this.nodeConfig)

    // Nuklaivm services
    this.genesisService = new GenesisService(this.nodeConfig)
    this.transactionService = new TransactionService(this.nodeConfig)
    this.assetService = new AssetService(this.nodeConfig)
    this.emissionService = new EmissionService(this.nodeConfig)
  }
}
