// src/index.ts
import {
  DEFAULT_AVALANCHE_NODE_API_URL,
  DEFAULT_NUKLAIVM_BLOCKCHAINID
} from './config'

export class NuklaiSDK {
  private baseApiUrl: string
  private nuklaiVMApiUrl: string
  private maxRetries: number
  private initialRetryDelay: number

  constructor(config?: {
    baseApiUrl?: string
    blockchainId?: string
    maxRetries?: number
    initialRetryDelay?: number
  }) {
    const defaultConfig = {
      baseApiUrl: DEFAULT_AVALANCHE_NODE_API_URL,
      blockchainId: DEFAULT_NUKLAIVM_BLOCKCHAINID,
      maxRetries: 3, // Default number of retries
      initialRetryDelay: 500 // Default initial delay in milliseconds
    }

    // Override default configuration with any provided settings
    const finalConfig = { ...defaultConfig, ...config }
    this.baseApiUrl = `${finalConfig.baseApiUrl}/ext`
    this.nuklaiVMApiUrl = `${finalConfig.baseApiUrl}/ext/bc/${finalConfig.blockchainId}/nuklaiapi`
    this.maxRetries = finalConfig.maxRetries
    this.initialRetryDelay = finalConfig.initialRetryDelay
  }

  async makeRequest(
    apiUrl: string,
    method: string,
    params?: any,
    retries = this.maxRetries,
    retryDelay = this.initialRetryDelay
  ): Promise<any> {
    const requestBody = {
      jsonrpc: '2.0',
      id: 1,
      method,
      params
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok && response.status === 429 && retries > 0) {
        // Handle 429 with retry after delay
        console.log(
          `Rate limit hit, retrying request... Retries left: ${retries}`
        )
        await new Promise((resolve) => setTimeout(resolve, retryDelay))
        return this.makeRequest(
          apiUrl,
          method,
          params,
          retries - 1,
          retryDelay * 2
        )
      } else if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      if (retries > 0) {
        console.log(`Request failed, retrying... Retries left: ${retries}`)
        await new Promise((resolve) => setTimeout(resolve, retryDelay))
        return this.makeRequest(
          apiUrl,
          method,
          params,
          retries - 1,
          retryDelay * 2
        )
      }
      console.error(`Error fetching ${method}:`, error)
      throw error
    }
  }

  getHealthStatus() {
    return this.makeRequest(`${this.baseApiUrl}/health`, 'health.liveness')
  }

  getGenesis() {
    return this.makeRequest(this.nuklaiVMApiUrl, 'nuklaivm.genesis')
  }

  getTransaction(txId: string) {
    return this.makeRequest(this.nuklaiVMApiUrl, 'nuklaivm.tx', { txId })
  }

  getAsset(assetId: string) {
    return this.makeRequest(this.nuklaiVMApiUrl, 'nuklaivm.asset', {
      asset: assetId
    })
  }

  getBalance(address: string, assetId: string) {
    return this.makeRequest(this.nuklaiVMApiUrl, 'nuklaivm.balance', {
      address,
      asset: assetId
    })
  }

  createLoan(assetId: string, destinationId: string) {
    return this.makeRequest(this.nuklaiVMApiUrl, 'nuklaivm.loan', {
      asset: assetId,
      destination: destinationId
    })
  }

  getEmissionInfo() {
    return this.makeRequest(this.nuklaiVMApiUrl, 'nuklaivm.emissionInfo')
  }

  getAllValidators() {
    return this.makeRequest(this.nuklaiVMApiUrl, 'nuklaivm.allValidators')
  }

  getStakedValidators() {
    return this.makeRequest(this.nuklaiVMApiUrl, 'nuklaivm.stakedValidators')
  }

  getValidatorStake(nodeId: string) {
    return this.makeRequest(this.nuklaiVMApiUrl, 'nuklaivm.validatorStake', {
      nodeId
    })
  }

  getUserStake(ownerAddress: string, nodeId: string) {
    return this.makeRequest(this.nuklaiVMApiUrl, 'nuklaivm.userStake', {
      owner: ownerAddress,
      nodeId
    })
  }
}
