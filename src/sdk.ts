// Copyright (C) 2024, Nuklai. All rights reserved.
// See the file LICENSE for licensing terms.

import { HyperchainSDK, config, utils } from '@nuklai/hyperchain-sdk'
import {
  CreateAssetFT, CreateAssetNFT, Transfer, MintAssetNFT, MintAssetFT,
    BurnAssetFT,
    BurnAssetNFT,
    CreateDataset,
    UpdateAsset,
    UpdateDataset,
    InitiateContributeDataset,
    CompleteContributeDataset,
    PublishDatasetMarketplace,
    SubscribeDatasetMarketplace,
    ClaimMarketplacePayment,

} from "./actions";
import {
  MAINNET_PUBLIC_API_BASE_URL,
  NUKLAI_CHAIN_ID
} from './constants'
import {
  CREATE_ASSET_FT_ID,
  CREATE_ASSET_NFT_ID,
  MINT_ASSET_FT_ID,
  MINT_ASSET_NFT_ID,
  CREATE_DATASET_ID,
  BURNASSET_FT_ID,
  BURNASSET_NFT_ID,
  TRANSFER_ID,
  UPDATE_ASSET_ID,
  UPDATE_DATASET_ID,
  DECIMALS,
  HRP,
  SYMBOL,
  INITIATE_CONTRIBUTE_DATASET_ID,
  COMPLETE_CONTRIBUTE_DATASET_ID,
  PUBLISH_DATASET_MARKETPLACE_ID,
  SUBSCRIBE_DATASET_MARKETPLACE_ID,
  CLAIM_MARKETPLACE_PAYMENT_ID
} from './constants/'
import { RpcService } from './services/rpc'
import { WebSocketService } from './services/websocket'

export {
  CreateAssetFT,
  CreateAssetNFT,
  Transfer,
  MintAssetFT,
  MintAssetNFT,
  BurnAssetFT,
  BurnAssetNFT,
  CreateDataset,
  UpdateAsset,
  UpdateDataset,
  InitiateContributeDataset,
  CompleteContributeDataset,
  PublishDatasetMarketplace,
  SubscribeDatasetMarketplace,
  ClaimMarketplacePayment,
  CREATE_ASSET_FT_ID,
  CREATE_ASSET_NFT_ID,
  MINT_ASSET_FT_ID,
  MINT_ASSET_NFT_ID,
  CREATE_DATASET_ID,
  BURNASSET_FT_ID,
  BURNASSET_NFT_ID,
  TRANSFER_ID,
  UPDATE_ASSET_ID,
  UPDATE_DATASET_ID,
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
      { id: CREATE_ASSET_FT_ID, action: CreateAssetFT },
      { id: CREATE_ASSET_NFT_ID, action: CreateAssetNFT},
      { id: MINT_ASSET_FT_ID, action: MintAssetFT },
      { id: MINT_ASSET_NFT_ID, action: MintAssetNFT },
      { id: CREATE_DATASET_ID, action: CreateDataset },
      { id: BURNASSET_FT_ID, action: BurnAssetFT },
      { id: BURNASSET_NFT_ID, action: BurnAssetNFT },
      { id: UPDATE_ASSET_ID, action: UpdateAsset },
      { id: UPDATE_DATASET_ID, action: UpdateDataset },
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
          const deserializeMethod = this.getDeserializeMethod(action);
          this.actionRegistry.register(id, deserializeMethod, false);
        } catch (error) {
          console.error(`Error registering action ${action.name}:`, error);
        }
      } else {
        console.log(`Action with ID ${id} already registered, skipping.`);
      }
    });
  }

  private getDeserializeMethod(action: any): (codec: utils.Codec) => [any, utils.Codec] {
    if (typeof action.fromBytesCodec === 'function') {
      return action.fromBytesCodec;
    } else if (typeof action.fromBytes === 'function') {
      return (codec: utils.Codec): [any, utils.Codec] => {
        const [result, error] = action.fromBytes(codec.toBytes());
        if (error) {
          throw error;
        }
        return [result, codec];
      };
    } else {
      throw new Error(`Action ${action.name} does not have a valid deserialization method`);
    }
  }
}
