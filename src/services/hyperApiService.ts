// src/services/hyperApiService.ts
import { Transfer } from 'transactions/transfer'
import { BLS } from '../auth/bls'
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
import { Auth } from '../types/auth'

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

  async generateTransaction(
    action: Transfer,
    auth: Auth
  ): Promise<{
    submit: (ctx: any) => Promise<void>
    tx: any
    signature: Uint8Array
  }> {
    // Construct the transaction
    const tx = {
      base: {
        timestamp: Date.now(),
        chainId: this.config.blockchainId
      },
      action,
      auth
    }

    // Sign the transaction
    const signature = await this.signTransaction(tx)

    return {
      submit: async () => {
        const txBytes = tx.action.toBytes()
        await this.submitTransaction(txBytes)
      },
      tx,
      signature
    }
  }

  async signTransaction(tx: any): Promise<Uint8Array> {
    const msg = (tx.action as Transfer).toBytes()
    const signature = await tx.auth.sign(msg)
    return signature
  }
}
