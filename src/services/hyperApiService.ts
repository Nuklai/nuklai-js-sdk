// src/services/hyperApiService.ts
import { Api } from '../common/baseApi'
import {
  GetLastAcceptedResponse,
  GetNetworkInfoResponse,
  GetUnitPricesResponse,
  GetWarpSignaturesResponse,
  PingResponse,
  SubmitTransactionResponse
} from '../common/hyperApiModels'
import { SDKConfig } from '../config/sdkConfig'
import {
  NUKLAI_COREAPI_METHOD_PREFIX,
  NUKLAI_COREAPI_PATH
} from '../constants/endpoints'
import { Auth } from '../types/auth' // Import the necessary types

export class HyperApiService extends Api {
  constructor(protected config: SDKConfig) {
    super(
      config.baseApiUrl,
      `/ext/bc/${config.blockchainId}/${NUKLAI_COREAPI_PATH}`,
      NUKLAI_COREAPI_METHOD_PREFIX
    )
  }

  ping(): Promise<PingResponse> {
    return this.callRpc<PingResponse>('ping')
  }

  // Retrieve network IDs
  getNetworkInfo(): Promise<GetNetworkInfoResponse> {
    return this.callRpc<GetNetworkInfoResponse>('network')
  }

  // Get information about the last accepted block
  getLastAccepted(): Promise<GetLastAcceptedResponse> {
    return this.callRpc<GetLastAcceptedResponse>('lastAccepted')
  }

  // Fetch current unit prices for transactions
  getUnitPrices(): Promise<GetUnitPricesResponse> {
    return this.callRpc<GetUnitPricesResponse>('unitPrices')
  }

  // Fetch warp signatures associated with a transaction
  getWarpSignatures(txID: string): Promise<GetWarpSignaturesResponse> {
    return this.callRpc<GetWarpSignaturesResponse>('getWarpSignatures', {
      txID
    })
  }

  // Submit a transaction to the network
  submitTransaction(tx: Uint8Array): Promise<SubmitTransactionResponse> {
    return this.callRpc<SubmitTransactionResponse>('submitTx', { tx })
  }

  // Generate a transaction
  async generateTransaction(
    actions: any[], // Define the specific type for your actions
    authFactory: Auth // Define the specific type for your authFactory
  ): Promise<{ submit: (ctx: any) => Promise<void>; tx: any; maxFee: number }> {
    const unitPrices = await this.getUnitPrices()
    const now = Date.now()
    const maxFee = this.calculateMaxFee(unitPrices, actions, authFactory)

    // Construct the transaction
    const tx = {
      actions,
      authFactory,
      maxFee,
      timestamp: now
    }

    // Sign the transaction
    const signedTx = await this.signTransaction(tx, authFactory)

    return {
      submit: async (ctx: any) => {
        await this.submitTransaction(signedTx)
      },
      tx: signedTx,
      maxFee
    }
  }

  private calculateMaxFee(
    unitPrices: any,
    actions: any[],
    authFactory: Auth
  ): number {
    // Implement the logic to calculate the maximum fee based on unit prices, actions, and authFactory
    return 0 // Placeholder
  }

  private async signTransaction(
    tx: any,
    authFactory: Auth
  ): Promise<Uint8Array> {
    const msg = new TextEncoder().encode(
      JSON.stringify(tx, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    ) // Example encoding
    const auth = await authFactory.sign(msg)
    tx.auth = auth
    return new TextEncoder().encode(
      JSON.stringify(tx, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    ) // Example encoding
  }
}
