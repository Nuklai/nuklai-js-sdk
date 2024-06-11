import { SDKConfig } from './config/sdkConfig'
import {
  MAINNET_PUBLIC_API_BASE_URL,
  NUKLAI_CHAIN_ID
} from './constants/endpoints'
import { BLSService } from './services/crypto/blsService'
import { HyperApiService } from './services/hyperApiService'
import { AssetService } from './services/nuklaivm/assetService'
import { EmissionService } from './services/nuklaivm/emissionService'
import { GenesisService } from './services/nuklaivm/genesisService'
import { TransactionService as NuklaiTransactionService } from './services/nuklaivm/transactionService'

export class NuklaiSDK {
  config: SDKConfig

  // Hypervm services
  hyperApiService: HyperApiService

  // Nuklaivm services
  genesisService: GenesisService
  assetService: AssetService
  nuklaiTransactionService: NuklaiTransactionService
  emissionService: EmissionService

  // Crypto services
  blsService: typeof BLSService

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
    this.nuklaiTransactionService = new NuklaiTransactionService(this.config)
    this.assetService = new AssetService(this.config)
    this.emissionService = new EmissionService(this.config)

    // Crypto services
    this.blsService = BLSService
  }
}
