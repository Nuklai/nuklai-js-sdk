// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { HyperchainSDK, config } from '@nuklai/hyperchain-sdk'
import { CreateAsset } from './actions/createAsset'
import { MintAsset } from './actions/mintAsset'
import {
  MAINNET_PUBLIC_API_BASE_URL,
  NUKLAI_CHAIN_ID
} from './constants/endpoints'
import { CREATEASSET_ID, MINTASSET_ID } from './constants/nuklaivm'
import { RpcService } from './services/rpc'
import { WebSocketService } from './services/websocket'

export class NuklaiSDK extends HyperchainSDK {
  // Nuklaivm services
  rpcServiceNuklai: RpcService
  wsServiceNuklai: WebSocketService

  constructor(nodeConfig?: Partial<config.NodeConfig>) {
    const defaultSDKConfig: config.NodeConfig = {
      baseApiUrl: MAINNET_PUBLIC_API_BASE_URL,
      blockchainId: NUKLAI_CHAIN_ID
    }
    super({ ...defaultSDKConfig, ...nodeConfig } as config.NodeConfig)

    // Nuklaivm services
    this.rpcServiceNuklai = new RpcService(this.nodeConfig)
    this.wsServiceNuklai = new WebSocketService(this.nodeConfig)

    // Custom Registry
    this.actionRegistry.register(
      CREATEASSET_ID,
      CreateAsset.fromBytesCodec,
      false
    )
    this.actionRegistry.register(MINTASSET_ID, MintAsset.fromBytesCodec, false)
  }
}
