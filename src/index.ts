// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { BLS, BLSFactory } from './auth/bls'
import { ED25519, ED25519Factory } from './auth/ed25519'
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

export class NuklaiSDK {
  config: SDKConfig

  // Hypervm services
  hyperApiService: HyperApiService

  // Nuklaivm services
  genesisService: GenesisService
  assetService: AssetService
  transactionService: TransactionService
  emissionService: EmissionService

  // Auth
  blsAuth: typeof BLS
  blsAuthFactory: typeof BLSFactory
  ed25519Auth: typeof ED25519
  ed25519AuthFactory: typeof ED25519Factory

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

    // Auth
    this.blsAuth = BLS
    this.blsAuthFactory = BLSFactory
    this.ed25519Auth = ED25519
    this.ed25519AuthFactory = ED25519Factory
  }
}
