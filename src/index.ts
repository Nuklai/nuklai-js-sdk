import { defaultSDKConfig } from './config'
import { HealthService } from './services/hypervm/HealthService'
import { NetworkService } from './services/hypervm/NetworkService'
import { TransactionService as HyperTransactionService } from './services/hypervm/TransactionService'
import { WarpService } from './services/hypervm/WarpService'
import { AssetService } from './services/nuklaivm/AssetService'
import { EmissionService } from './services/nuklaivm/EmissionService'
import { GenesisService } from './services/nuklaivm/GenesisService'
import { LoanService } from './services/nuklaivm/LoanService'
import { TransactionService as NuklaiTransactionService } from './services/nuklaivm/TransactionService'
import { SDKConfig } from './types/SDKConfig'

export class NuklaiSDK {
  config: SDKConfig

  // Hypervm services
  healthService: HealthService
  networkService: NetworkService
  hyperTransactionService: HyperTransactionService
  warpService: WarpService

  // Nuklaivm services
  genesisService: GenesisService
  assetService: AssetService
  nuklaiTransactionService: NuklaiTransactionService
  loanService: LoanService
  emissionService: EmissionService

  constructor(configOverrides?: Partial<SDKConfig>) {
    this.config = { ...defaultSDKConfig, ...configOverrides }

    // Hypervm services
    this.healthService = new HealthService(this.config)
    this.networkService = new NetworkService(this.config)
    this.hyperTransactionService = new HyperTransactionService(this.config)
    this.warpService = new WarpService(this.config)

    // Nuklaivm services
    this.genesisService = new GenesisService(this.config)
    this.nuklaiTransactionService = new NuklaiTransactionService(this.config)
    this.assetService = new AssetService(this.config)
    this.loanService = new LoanService(this.config)
    this.emissionService = new EmissionService(this.config)
  }
}
