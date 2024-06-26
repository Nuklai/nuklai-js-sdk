// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { SDKConfig } from './config/sdkConfig'
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
export * as consts from './constants'
export * as crypto from './crypto'
export * as services from './services'
export * as transactions from './transactions'
export * as utils from './utils'

export class NuklaiSDK {
  config: SDKConfig

  // Hypervm services
  hyperApiService: HyperApiService

  // Nuklaivm services
  genesisService: GenesisService
  assetService: AssetService
  transactionService: TransactionService
  emissionService: EmissionService

  constructor(configOverrides?: Partial<SDKConfig>) {
    const defaultSDKConfig: SDKConfig = {
      baseApiUrl: MAINNET_PUBLIC_API_BASE_URL,
      blockchainId: NUKLAI_CHAIN_ID
    }
    this.config = { ...defaultSDKConfig, ...configOverrides }

    // Hypervm services
    this.hyperApiService = new HyperApiService(this.config)

    // Nuklaivm services
    this.genesisService = new GenesisService(this.config)
    this.transactionService = new TransactionService(this.config)
    this.assetService = new AssetService(this.config)
    this.emissionService = new EmissionService(this.config)
  }
}
