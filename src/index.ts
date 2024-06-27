// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { NodeConfig } from './config'
import {
  MAINNET_PUBLIC_API_BASE_URL,
  NUKLAI_CHAIN_ID
} from './constants/endpoints'
import { HyperApiService } from './services/hyperApiService'
import { AssetService } from './services/nuklaivm/assetService'
import { EmissionService } from './services/nuklaivm/emissionService'
import { GenesisService } from './services/nuklaivm/genesisService'
import { TransactionService } from './services/nuklaivm/transactionService'

export * as actions from './actions'
export * as auth from './auth'
export * as common from './common'
export * as config from './config'
export * as consts from './constants'
export * as crypto from './crypto'
export * as services from './services'
export * as transactions from './transactions'
export * as utils from './utils'

export class NuklaiSDK {
  nodeConfig: NodeConfig

  // Hypervm services
  hyperApiService: HyperApiService

  // Nuklaivm services
  genesisService: GenesisService
  assetService: AssetService
  transactionService: TransactionService
  emissionService: EmissionService

  constructor(nodeConfig?: Partial<NodeConfig>) {
    const defaultSDKConfig: NodeConfig = {
      baseApiUrl: MAINNET_PUBLIC_API_BASE_URL,
      blockchainId: NUKLAI_CHAIN_ID
    }
    this.nodeConfig = { ...defaultSDKConfig, ...nodeConfig }

    // Hypervm services
    this.hyperApiService = new HyperApiService(this.nodeConfig)

    // Nuklaivm services
    this.genesisService = new GenesisService(this.nodeConfig)
    this.transactionService = new TransactionService(this.nodeConfig)
    this.assetService = new AssetService(this.nodeConfig)
    this.emissionService = new EmissionService(this.nodeConfig)
  }
}
