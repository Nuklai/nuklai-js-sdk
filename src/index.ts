// src/index.ts
import { BLS } from './auth/bls'
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
  }
}
