import { defaultSDKConfig } from './config'
import { HyperApiService } from './services/HyperApiService'
import { AssetService } from './services/nuklaivm/AssetService'
import { EmissionService } from './services/nuklaivm/EmissionService'
import { GenesisService } from './services/nuklaivm/GenesisService'
import { LoanService } from './services/nuklaivm/LoanService'
import { TransactionService as NuklaiTransactionService } from './services/nuklaivm/TransactionService'
import { SDKConfig } from './types/SDKConfig'

export class NuklaiSDK {
  config: SDKConfig

  // Hypervm services
  hyperApiService: HyperApiService

  // Nuklaivm services
  genesisService: GenesisService
  assetService: AssetService
  nuklaiTransactionService: NuklaiTransactionService
  loanService: LoanService
  emissionService: EmissionService

  constructor(configOverrides?: Partial<SDKConfig>) {
    this.config = { ...defaultSDKConfig, ...configOverrides }

    // Hypervm services
    this.hyperApiService = new HyperApiService(this.config)

    // Nuklaivm services
    this.genesisService = new GenesisService(this.config)
    this.nuklaiTransactionService = new NuklaiTransactionService(this.config)
    this.assetService = new AssetService(this.config)
    this.loanService = new LoanService(this.config)
    this.emissionService = new EmissionService(this.config)
  }
}
