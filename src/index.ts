import { defaultSDKConfig } from './config'
import { AssetService } from './services/AssetService'
import { EmissionService } from './services/EmissionService'
import { GenesisService } from './services/GenesisService'
import { HealthService } from './services/HealthService'
import { LoanService } from './services/LoanService'
import { TransactionService } from './services/TransactionService'
import { SDKConfig } from './types/SDKConfig'

export class NuklaiSDK {
  config: SDKConfig
  healthService: HealthService
  genesisService: GenesisService
  transactionService: TransactionService
  assetService: AssetService
  loanService: LoanService
  emissionService: EmissionService

  constructor(configOverrides?: Partial<SDKConfig>) {
    this.config = { ...defaultSDKConfig, ...configOverrides }
    this.healthService = new HealthService(this.config)
    this.genesisService = new GenesisService(this.config)
    this.transactionService = new TransactionService(this.config)
    this.assetService = new AssetService(this.config)
    this.loanService = new LoanService(this.config)
    this.emissionService = new EmissionService(this.config)
  }
}
