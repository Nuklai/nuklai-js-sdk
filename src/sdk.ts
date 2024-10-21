// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { HyperchainSDK, config } from '@nuklai/hyperchain-sdk'
import { CreateAsset } from './actions/createAsset'
import { Transfer } from './actions/transfer'
import { MintAssetFT } from './actions/MintAssetFT'
import { MintAssetNFT } from './actions/MintAssetNFT'
import { BurnAssetFT } from './actions/BurnAssetFT'
import { BurnAssetNFT } from './actions/BurnAssetNFT'
import { MintDataset } from './actions/MintDataset'
import { UpdateAsset } from './actions/UpdateAsset'
import { UpdateDataset } from './actions/UpdateDataset'
import { InitiateContributeDataset } from "./actions/InitiateContributeDataset";
import { CompleteContributeDataset } from "./actions/CompleteContributeDataset";
import { PublishDatasetMarketplace } from "./actions/PublishDatasetMarketplace";
import { SubscribeDatasetMarketplace } from "./actions/SubscribeDatasetMarketplace";
import { ClaimMarketplacePayment } from "./actions/ClaimMarketplacePayment";
import {
  MAINNET_PUBLIC_API_BASE_URL,
  NUKLAI_CHAIN_ID
} from './constants/endpoints'
import {
  CREATEASSET_ID,
  MINTASSET_FT_ID,
  MINTASSET_NFT_ID,
  MINTDATASET_ID,
  BURNASSET_FT_ID,
  BURNASSET_NFT_ID,
  TRANSFER_ID,
  UPDATEASSET_ID,
  UPDATEDATASET_ID,
  DECIMALS,
  HRP,
  SYMBOL,
  INITIATE_CONTRIBUTE_DATASET_ID,
  COMPLETE_CONTRIBUTE_DATASET_ID,
  PUBLISH_DATASET_MARKETPLACE_ID,
  SUBSCRIBE_DATASET_MARKETPLACE_ID,
  CLAIM_MARKETPLACE_PAYMENT_ID
} from './constants'
import { RpcService } from './services/rpc'
import { WebSocketService } from './services/websocket'

export {
  CreateAsset,
  Transfer,
  MintAssetFT,
  MintAssetNFT,
  BurnAssetFT,
  BurnAssetNFT,
  MintDataset,
  UpdateAsset,
  UpdateDataset,
  InitiateContributeDataset,
  CompleteContributeDataset,
  PublishDatasetMarketplace,
  SubscribeDatasetMarketplace,
  ClaimMarketplacePayment,
  CREATEASSET_ID,
  MINTASSET_FT_ID,
  MINTASSET_NFT_ID,
  MINTDATASET_ID,
  BURNASSET_FT_ID,
  BURNASSET_NFT_ID,
  TRANSFER_ID,
  UPDATEASSET_ID,
  UPDATEDATASET_ID,
  DECIMALS,
  HRP,
  SYMBOL,
  INITIATE_CONTRIBUTE_DATASET_ID,
  COMPLETE_CONTRIBUTE_DATASET_ID,
  PUBLISH_DATASET_MARKETPLACE_ID,
  SUBSCRIBE_DATASET_MARKETPLACE_ID,
  CLAIM_MARKETPLACE_PAYMENT_ID,
}

export class NuklaiSDK extends HyperchainSDK {
  // Nuklaivm services
  rpcServiceNuklai: RpcService
  wsServiceNuklai: WebSocketService

  constructor(nodeConfig?: Partial<config.NodeConfig>) {
    const defaultSDKConfig: config.NodeConfig = {
      baseApiUrl: MAINNET_PUBLIC_API_BASE_URL,
      blockchainId: NUKLAI_CHAIN_ID
    }
    super({...defaultSDKConfig, ...nodeConfig} as config.NodeConfig)

    // Nuklaivm services
    this.rpcServiceNuklai = new RpcService(this.nodeConfig)
    this.wsServiceNuklai = new WebSocketService(this.nodeConfig)

    // Custom Registry
    this.registerCustomActions()
  }

  private registerCustomActions() {
    const actionsToRegister = [
      { id: CREATEASSET_ID, action: CreateAsset },
      { id: MINTASSET_FT_ID, action: MintAssetFT },
      { id: MINTASSET_NFT_ID, action: MintAssetNFT },
      { id: MINTDATASET_ID, action: MintDataset },
      { id: BURNASSET_FT_ID, action: BurnAssetFT },
      { id: BURNASSET_NFT_ID, action: BurnAssetNFT },
      { id: UPDATEASSET_ID, action: UpdateAsset },
      { id: UPDATEDATASET_ID, action: UpdateDataset },
      { id: TRANSFER_ID, action: Transfer },
      { id: INITIATE_CONTRIBUTE_DATASET_ID, action: InitiateContributeDataset },
      { id: COMPLETE_CONTRIBUTE_DATASET_ID, action: CompleteContributeDataset },
      { id: PUBLISH_DATASET_MARKETPLACE_ID, action: PublishDatasetMarketplace},
      { id: SUBSCRIBE_DATASET_MARKETPLACE_ID, action: SubscribeDatasetMarketplace },
      { id: CLAIM_MARKETPLACE_PAYMENT_ID, action: ClaimMarketplacePayment },
    ];

    actionsToRegister.forEach(({ id, action }) => {
      const [, isRegistered] = this.actionRegistry.lookupIndex(id);
      if (!isRegistered) {
        console.log(`Registering action: ${action.name} with ID: ${id}`);
        try {
          this.actionRegistry.register(id, action.fromBytesCodec, false);
        } catch (error) {
          console.error(`Error registering action ${action.name}:`, error);
        }
      } else {
        console.log(`Action with ID ${id} already registered, skipping.`);
      }
    });
  }
}
